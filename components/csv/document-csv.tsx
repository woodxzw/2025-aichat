"use client";

import React, { useMemo, SetStateAction, useState, RefObject, useRef, useCallback, useEffect } from 'react';
import { UIBlock } from '../block';
import { FileIcon, LoaderIcon, MessageIcon, PencilEditIcon } from '../icons';
import { ChevronDownIcon } from "@radix-ui/react-icons"
import Detail from './detail';
import Compact from './compact';
import s from './document-csv.module.css';
import Column from './column';
import { getCsvData, updateData } from "./api";
import SelColumns from './sel-columns';
const getActionText = (type: 'create' | 'update' | 'request-suggestions') => {
  switch (type) {
    case 'create':
      return 'Creating';
    case 'update':
      return 'Updating';
    case 'request-suggestions':
      return 'Adding suggestions';
    default:
      return null;
  }
};

// Tab组件
interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}


function Tabs({ tabs, activeTab, setActiveTab }: TabsProps) {
  return (
    <div className={s.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${s.tab} ${activeTab === tab ? s.tab_active : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// 表格数据接口
interface Data {
  personId: number;
  age: number;
  gender: string;
  undergradMajor: string;
  undergradGrade: number;
  yearsOfWork: number;
}

interface DocumentToolCsvResultProps {
  type: 'create' | 'update' | 'request-suggestions';
  result: any;
  block: UIBlock;
  setBlock: (value: SetStateAction<UIBlock>) => void;
}

// 主要组件
export function DocumentToolCsvResult({
  type,
  result,
  block,
  setBlock,
}: DocumentToolCsvResultProps) {
  const [activeTab, setActiveTab] = useState<string>('Detail');
  const tabs = ['Detail', 'Compact', 'Column'];

  const [isOpen, setIsOpen] = useState(false);
  const [columnsData, setColumnsData] = useState({});
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);
  const dropdownRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [tableData,setTableData] = useState<any>(result)
  const [isLastData,setIsLastData] = useState(true);
  // 接收到的数据
  useEffect(() => {
    setTableData(result || {})
  }, [result])

  const { totolField, dataTableHead } = useMemo(() => {
    return tableData || {}
  }, [tableData])

  useEffect(()=>{
    let timer = null;
    if(!isLastData && !timer){
      timer = setInterval(()=>{
        updateData()
      },2000)
    }
    if(isLastData && timer){
      clearInterval(timer)
    }
    return ()=>{
      timer && clearInterval(timer)
    }
  },[isLastData])

  // 处理触发元素的点击事件
  const handleTriggerClick = useCallback((event: React.MouseEvent, item: any) => {
    setActiveTrigger(event.currentTarget as HTMLElement);
    setColumnsData(item);
    setIsOpen(!isOpen);
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
        dropdownRef.current.style.top = `${triggerRect.bottom-10}px`;
        dropdownRef.current.style.right = `0px`;
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
    <div className="container relative m-auto">
      {/* Tab导航 */}
      <div className={`flex justify-between ${s.border_bottom_1} pl-3`}>
        <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className='flex items-center cursor-pointer relative' onClick={(event) => { handleTriggerClick(event, tableData) }}>
          <div className="mr-3">{dataTableHead?.length} of {totolField?.totolFieldAmount} colums</div>
          <ChevronDownIcon />
          
        </div>
      </div>

     
      {/* 表格数据展示 */}
      <div className="tab-content">
        {activeTab === 'Detail' && (
          <Detail result={tableData} setResult={setTableData} />
        )}

        {activeTab === 'Compact' && (
          <Compact result={tableData} setResult={setTableData} />
        )}

        {activeTab === 'Column' && (
          <Column result={tableData} />
        )}
      </div>
      {isOpen && (
            <SelColumns
              data={columnsData}
              onClose={handleClose}
              onSubmit={handeSubmit}
              ref={dropdownRef}
            />
          )}
    </div>
  );
}

interface DocumentToolCsvCallProps {
  type: 'create' | 'update' | 'request-suggestions';
  args: any;
}

export function DocumentToolCsvCall({ type, args }: DocumentToolCsvCallProps) {
  return (
    <div className="w-fit border py-2 px-3 rounded-xl flex flex-row items-start justify-between gap-3">
      <div className="flex flex-row gap-3 items-start">
        <div className="text-zinc-500 mt-1">
          {type === 'create' ? (
            <FileIcon />
          ) : type === 'update' ? (
            <PencilEditIcon />
          ) : type === 'request-suggestions' ? (
            <MessageIcon />
          ) : null}
        </div>

        <div className="">
          {getActionText(type)} {args.title}
        </div>
      </div>

      <div className="animate-spin mt-1">{<LoaderIcon />}</div>
    </div>
  );
}
