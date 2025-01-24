import React, { useMemo, useState, RefObject, useRef, useCallback, useEffect } from 'react';
import ChartBar from './chart-bar';
import ChartPie from './chart-pie';
import { HamburgerMenuIcon, CalendarIcon, CheckIcon } from "@radix-ui/react-icons";
import s from './document-csv.module.css';
import CustomDropdown from './dropdown';
import { getCsvData, getMoreData } from "./api";
import ScrollableTable from './scrollable-table';

// 定义 dataTableHead 的类型
interface DataTableHeadItem {
    name: string;
    description: string;
    type: 'number' | 'enum' | 'bool' | 'date';
    group?: number[];
    enums?: { key: string; value: number }[];
    dataColumn?: { totalCount: number };
    min?: number;
    max?: number;
}

// 定义 dataTable 的类型
interface DataTable {
    rows: { text: string[] }[];
}

// 定义 result 的类型
interface Result {
    dataTableHead: DataTableHeadItem[];
    dataTable: DataTable;
}

interface DetailProps {
    result: any;
    setResult: (result: Result) => void;
}

const Detail: React.FC<DetailProps> = ({ result,setResult  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sortData, setSortData] = useState<any | null>(null);
    const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);
    const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const { dataTableHead, dataTable } = useMemo(() => {
        return result || { dataTableHead: [], dataTable: { rows: [] } };
    }, [result]);

    // 处理触发元素的点击事件
    const handleTriggerClick = useCallback((event: React.MouseEvent<HTMLButtonElement>, item: DataTableHeadItem) => {
        setActiveTrigger(event.currentTarget);
        setSortData(item);
        setIsOpen(true);
    }, []);

    // 关闭弹框的函数
    const handleClose = useCallback(() => {
        setIsOpen(false);
        setActiveTrigger(null);
    }, []);

    const handeSubmit = useCallback((params: any) => {
        setIsOpen(false);
        setActiveTrigger(null);
        getCsvData(params);
    }, []);

    // 计算弹框的位置
    const positionDropdown = useCallback(() => {
        if (isOpen && dropdownRef.current && activeTrigger) {
            const triggerRect = activeTrigger.getBoundingClientRect();
            if (triggerRect.top !== undefined && triggerRect.left !== undefined) {
                dropdownRef.current.style.top = `${triggerRect.top - 20}px`;
                dropdownRef.current.style.left = `${triggerRect.left}px`;
            } else {
                console.warn('Invalid getBoundingClientRect values:', triggerRect);
            }
        }
    }, [isOpen, activeTrigger]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                positionDropdown();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [positionDropdown, isOpen]);

    // 加载更多数据的函数

    const loadData = useCallback(async (page: number, pageSize: number) => {
        const moreData = await getMoreData({ page, pageSize });
        setResult({
            ...result,
            dataTable: {
                rows:[
                    ...result.dataTable.rows,
                    ...moreData.rows,
                ]
            }
        })
        return moreData
    
      }, []);

    const formatDate = (timestamp)=>{
        const date = new Date(timestamp * 1000); // 将时间戳转换为毫秒

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并补零
        const day = String(date.getDate()).padStart(2, '0'); // 补零

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    return (
        <div className="relative">
            <h2>Detail View</h2>
            <div className={`w-full overflow-x-auto ${s.c_container}`}>
                <div className="flex flex-nowrap">
                    <tr className={s.c_tr}>
                        {dataTableHead?.map((item, index) => {
                            return (
                                <td className={s.c_td} key={index}>
                                    <div className="w-full">
                                        <button className={s.c_t_button} onClick={(event) => handleTriggerClick(event, item)}>
                                            <div className="flex items-center overflow-hidden">
                                            {item?.type === 'number' && <span className='mr-2'>#</span>}
                                                {item?.type === 'date' && <CalendarIcon className='mr-2' />}
                                                {item?.type === 'bool' && <CheckIcon className='mr-2' />}
                                                {item?.type === 'enum' && <span className='mr-2 underline'>A</span>}
                                                <span className={s.c_h_name}>{item?.name}</span>
                                            </div>
                                            <div>
                                                <HamburgerMenuIcon />
                                            </div>
                                        </button>
                                        <p className={s.c_h_des}>{item?.description}</p>
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                </div>
                <div className="flex flex-nowrap">
                    <tr className={s.c_tr}>
                        {dataTableHead?.map((item, index) => {
                            const { type, group, enums, dataColumn, min, max } = item || {};
                            if (type === 'number') {
                                return (
                                    <td className={s.c_td} key={index}>
                                        <div className={s.c_chat_bar_s}>
                                            <ChartBar data={group || []} />
                                        </div>
                                        <div className={s.c_chat_b}>
                                            <span>{Math.round(min)}</span>
                                            <span>{Math.round(max)}</span>
                                        </div>
                                    </td>
                                );
                            }
                            if (type === 'date') {
                                return (
                                    <td className={`${s.c_td}`} key={index}>
                                        <div className={`${s.c_chat_b} w-full flex justify-between`}>
                                            <span>{formatDate(min)}</span>
                                            <span>{formatDate(max)}</span>
                                        </div>
                                    </td>
                                );
                            }
                            if (type === 'enum') {
                                const sortedEnums = enums?.slice().sort((a, b) => b.value - a.value) || [];
                                const topTwoEnums = sortedEnums.slice(0, 2);
                                const otherValue = sortedEnums.slice(2).reduce((acc, enmuItem) => acc + enmuItem.value, 0);

                                return (
                                    <td className={`${s.c_td} flex-col flex justify-evenly`} key={index}>
                                        {topTwoEnums.map(enmuItem => (
                                            <div key={enmuItem?.key} className="flex justify-between">
                                                <span>{enmuItem.key}</span>
                                                <span>{enmuItem.value}</span>
                                            </div>
                                        ))}
                                        {sortedEnums.length > 2 && (
                                            <div className="flex justify-between">
                                                <span>Other</span>
                                                <span>{otherValue}</span>
                                            </div>
                                        )}
                                    </td>
                                );
                            }
                            if (type === 'bool') {
                                return (
                                    <td className={`${s.c_td} flex items-center`} key={index}>
                                        <div className={s.c_chat_pie_s}>
                                            <ChartPie data={enums || []} />
                                        </div>
                                        <div className="flex-1 ml-1">
                                            {enums?.map(enmuItem => {
                                                return (
                                                    <div key={enmuItem?.key}>
                                                        <p>{enmuItem.key}</p>
                                                        <div className="flex justify-between">
                                                            <span>{enmuItem.value}</span>
                                                            <span>{Math.round(enmuItem.value / (dataColumn?.totalCount || 1) * 100)} %</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                );
                            }
                            return null; // 确保每个 case 都有返回值
                        })}
                    </tr>
                </div>
                {dataTable && dataTable?.rows?.length &&
                    <ScrollableTable
                        initialData={dataTable?.rows}
                        loadData={loadData}
                        pageSize={30}
                    />
                }
            </div>
            {isOpen && sortData !== null && (
                <CustomDropdown
                    data={sortData}
                    onClose={handleClose}
                    onSubmit={handeSubmit}
                    ref={dropdownRef}
                />
            )}
        </div>
    );
};

export default Detail;