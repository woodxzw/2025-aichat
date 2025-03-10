import React, { useMemo, useState, RefObject, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { HamburgerMenuIcon, CalendarIcon, CheckIcon } from "@radix-ui/react-icons";
import s from './document-csv.module.css';
import CustomDropdown from './dropdown';
import { getCsvData, getFilterObj, getTabelData, pageSize } from './api';
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

interface CompactProps {
  result: Result;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setResult: (result: Result) => void;
  selectedColumns: {name: string,field: string}[]
}

const Compact: React.FC<CompactProps> = ({ result, setResult, currentPage, setCurrentPage,selectedColumns }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sortData, setSortData] = useState<any>(null);
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

   const tableContainerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

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
      dropdownRef.current.style.top = `${triggerRect.top + 15}px`;
      dropdownRef.current.style.left = `${triggerRect.left}px`;
    }
  }, [isOpen, activeTrigger]);

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
     
  }, [result]);

  return (
    <div className="relative">
      <div className={`w-full overflow-x-auto  ${s.c_container} ${s.border_top_none}`} ref={tableContainerRef}>
        <table className="flex flex-nowrap">
          <tbody>
            <tr className={s.c_tr}>
              {dataTableHead?.map((item, index) => (
                <td className={s.c_td} key={index}>
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
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
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

export default Compact;