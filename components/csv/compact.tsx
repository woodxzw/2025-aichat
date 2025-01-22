import React, { useMemo, useState, RefObject, useRef, useCallback, useEffect } from 'react';
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import s from './document-csv.module.css';
import CustomDropdown from './dropdown';
import { getCsvData } from './api';

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

interface CompactProps {
  result: Result;
}

const Compact: React.FC<CompactProps> = ({ result }) => {
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
      dropdownRef.current.style.top = `${triggerRect.top - 20}px`;
      dropdownRef.current.style.left = `${triggerRect.left}px`;
    }
  }, [isOpen, activeTrigger]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        positionDropdown();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTrigger]);

  return (
    <div className="relative">
      <div className={`w-full overflow-x-auto ${s.c_container} ${s.border_top_none}`}>
        <div className="flex flex-nowrap">
          <tr className={s.c_tr}>
            {dataTableHead?.map((item, index) => (
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
                </div>
              </td>
            ))}
          </tr>
        </div>
        <div className="flex flex-col">
          {dataTable?.rows?.map((row, index) => (
            <tr className={s.c_tr} key={index}>
              {row?.text?.map((cell, cellInd) => (
                <td className={s.c_td} key={cellInd}>{cell}</td>
              ))}
            </tr>
          ))}
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

export default Compact;