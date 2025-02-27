import React, { useMemo, useState, RefObject, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import ChartBar from './chart-bar';
import ChartPie from './chart-pie';
import { HamburgerMenuIcon, CalendarIcon, CheckIcon } from "@radix-ui/react-icons";
import s from './document-csv.module.css';
import CustomDropdown from './dropdown';
import { getCsvData, getFilterObj, getTabelData, pageSize } from "./api";
import ScrollableTable from './scrollable-table';

// 定义 dataTableHead 的类型
interface DataTableHeadItem {
    name: string;
    description: string;
    type: 'INT' | 'FLOAT' | 'BOOL' | 'DATE' | 'TEXT';
    group?: number[];
    enums?: { key: string; value: number }[];
    dataColumn?: { totalCount: number };
    min?: number;
    max?: number;
    index?: number;
    filter?: [number, number];
    selEnums?: string;
    sort?: string;
    field?: string;
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
    currentPage: number;
    setCurrentPage: (page: number) => void;
    setResult: (result: Result) => void;
    selectedColumns: {name: string,field: string}[]
}

const Detail: React.FC<DetailProps> = ({ result,setResult,currentPage,setCurrentPage,selectedColumns  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sortData, setSortData] = useState<any | null>(null);
    const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);
    const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const tableContainerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const { dataTableHead, dataTable } = useMemo(() => {
        console.log(result);
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


    const handleClear = useCallback(async (params: any) => {
        handeSubmit(params)
    }, [dataTableHead,selectedColumns]);
    

    const handeSubmit = useCallback(async (params: any) => {
        setIsOpen(false);
        setActiveTrigger(null);
        console.log(params,dataTableHead);
        const updatedDataTableHead = dataTableHead.map((item) => {
            if (item?.index === params.index) {
                return {
                    ...params
                };
            }
            // 处理 sort 字段
            if (params.sort && item.sort) {
                return {
                    ...item,
                    sort: ''
                };
            }
            return item;
        });

    
    // setResult({
    //     ...result,
    //     dataTableHead: updatedDataTableHead
    // });
    setCurrentPage(0);
    const tableData = await getTabelData(getFilterObj(updatedDataTableHead,selectedColumns,0));
    setResult({
        ...result,
        dataTableHead: updatedDataTableHead,
        dataTable: {
            rows: tableData.rows
        }
    });
    }, [dataTableHead,selectedColumns]);

    // 计算弹框的位置
    const positionDropdown = useCallback(() => {
        if (isOpen && dropdownRef.current && activeTrigger) {
            const triggerRect = activeTrigger.getBoundingClientRect();
            console.log(triggerRect);
            if (triggerRect.top !== undefined && triggerRect.left !== undefined) {
                dropdownRef.current.style.top = `${triggerRect.top + 20}px`;
                dropdownRef.current.style.left = `${triggerRect.left}px`;
            } else {
                console.warn('Invalid getBoundingClientRect values:', triggerRect);
            }
        }
    }, [isOpen, activeTrigger]);

    // useEffect(() => {
    //     if (activeTrigger) {
    //         const timer = setTimeout(() => {
    //             positionDropdown();
    //         }, 0);
    //         return () => clearTimeout(timer);
    //     }
    // }, [positionDropdown, activeTrigger]);

    // useEffect(() => {
    //     if (isOpen && !dropdownVisible) {
    //         positionDropdown();
    //         setDropdownVisible(true);
    //     }
    // }, [isOpen, dropdownVisible, positionDropdown]);

    useLayoutEffect(() => {
        if (activeTrigger) {
            positionDropdown();
        }
    }, [positionDropdown, activeTrigger]);

    // 加载更多数据的函数

    const loadData = useCallback(async (pageNo: number) => {
        const moreData = await getTabelData(getFilterObj(dataTableHead,selectedColumns,pageNo));
        setCurrentPage(pageNo);
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
    
      }, [result,selectedColumns]);

    const formatDate = (timestamp:any)=>{
        const date = new Date(timestamp * 1000); // 将时间戳转换为毫秒

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1，并补零
        const day = String(date.getDate()).padStart(2, '0'); // 补零

        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
    }

    return (
        <div className="relative" >
            {/* <h2>Detail View</h2> */}
            <div className={`w-full overflow-x-auto mt-3 ${s.c_container}`} ref={tableContainerRef}>
                <table className="flex flex-nowrap">
                    <thead>
                    <tr className={s.c_tr}>
                        {dataTableHead?.filter((i:DataTableHeadItem) => 
                                selectedColumns.some(selected => selected.name === i.name && selected.field === i.field)
                            )?.map((item:DataTableHeadItem) => {
                            return (
                                <td className={s.c_td} key={item?.index}>
                                    <div className="w-full">
                                        <button className={s.c_t_button} onClick={(event) => handleTriggerClick(event, item)}>
                                            <div className="flex items-center overflow-hidden">
                                            {(item?.type === 'FLOAT' || item?.type === 'INT')  && <span className='mr-2'>#</span>}
                                                {item?.type === 'DATE' && <CalendarIcon className='mr-2' />}
                                                {item?.type === 'BOOL' && <CheckIcon className='mr-2' />}
                                                {item?.type === 'TEXT' && <span className='mr-2 underline'>A</span>}
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
                    </thead>
                </table>
                <table className="flex flex-nowrap">
                    <thead>
                    <tr className={s.c_tr}>
                        {dataTableHead?.filter((i:DataTableHeadItem) => 
                                selectedColumns.some(selected => selected.name === i.name && selected.field === i.field)
                            )?.map((item:any) => {
                            const { type, group, enums, dataColumn, min, max,index } = item || {};
                            if ((item?.type === 'FLOAT' || item?.type === 'INT')) {
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
                            if (type === 'DATE') {
                                return (
                                    <td className={`${s.c_td}`} key={index}>
                                        <div className={s.c_chat_bar_s}>
                                            <ChartBar data={group || []} />
                                        </div>
                                        <div className={`${s.c_chat_b} w-full flex justify-between`}>
                                            <span>{min}</span>
                                            <span>{max}</span>
                                        </div>
                                    </td>
                                );
                            }
                            if (type === 'TEXT') {
                                const sortedEnums = enums?.slice().sort((a:any, b:any) => b.value - a.value) || [];
                                const topTwoEnums = sortedEnums.slice(0, 2);
                                const otherValue = sortedEnums.slice(2).reduce((acc:any, enmuItem:any) => acc + enmuItem.value, 0);

                                return (
                                    <td className={`${s.c_td} flex-col flex justify-evenly`} key={index}>
                                        {topTwoEnums.map((enmuItem:{ key: string; value: number }) => (
                                            <div key={enmuItem?.key} className="flex justify-between">
                                                <span className="whitespace-nowrap overflow-hidden text-ellipsis">{enmuItem.key}</span>
                                                <span className="whitespace-nowrap">{enmuItem.value}</span>
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
                            if (type === 'BOOL') {
                                return (
                                    <td className={`${s.c_td} flex items-center`} key={index}>
                                        <div className={s.c_chat_pie_s}>
                                            <ChartPie data={enums || []} />
                                        </div>
                                        <div className="flex-1 ml-1">
                                            {enums?.map((enmuItem:{key:string;value:number}) => {
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
                    </thead>
                </table>
                {dataTable && dataTable?.rows &&
                    <ScrollableTable
                        initialData={dataTable?.rows}
                        loadData={loadData}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        tableContainerRef={tableContainerRef}
                    />
                }
            </div>
            {isOpen && sortData !== null && (
                <CustomDropdown
                    data={sortData}
                    onClose={handleClose}
                    onSubmit={handeSubmit}
                    ref={dropdownRef}
                    onClear={handleClear}
                />
            )}
        </div>
    );
};

export default Detail;