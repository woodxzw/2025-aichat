import React, { useMemo, useState, RefObject, useRef, useCallback, useEffect } from 'react';
import ChartBar from './chart-bar';
import ChartPie from './chart-pie';
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import s from './document-csv.module.css';
import CustomDropdown from './dropdown';
import { getCsvData } from "./api";

// 定义 dataTableHead 的类型
interface DataTableHeadItem {
    name: string;
    description: string;
    type: 'number' | 'enum' | 'bool';
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
    result: Result;
}

const Detail: React.FC<DetailProps> = ({ result }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sortData, setSortData] = useState<DataTableHeadItem | null>(null);
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
                                                <span className='mr-2'>#</span>
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
                                            <span>{min}</span>
                                            <span>{max}</span>
                                        </div>
                                    </td>
                                );
                            }
                            if (type === 'enum') {
                                return (
                                    <td className={`${s.c_td} flex-col flex justify-evenly`} key={index}>
                                        {enums?.map(enmuItem => {
                                            return (
                                                <div key={enmuItem?.key} className="flex justify-between">
                                                    <span>{enmuItem.key}</span>
                                                    <span>{enmuItem.value}</span>
                                                </div>
                                            );
                                        })}
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
                <div className="flex flex-col">
                    {dataTable?.rows?.map((row, index) => {
                        return (
                            <tr className={s.c_tr} key={index}>
                                {row?.text?.map((cell, cellInd) => {
                                    return <td className={s.c_td} key={cellInd}>{cell}</td>;
                                })}
                            </tr>
                        );
                    })}
                </div>
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