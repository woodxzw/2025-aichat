import React, { useState, useRef, useEffect, useCallback, RefObject, useMemo } from 'react';
import s from './document-csv.module.css';
import { ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import RangeSlider from './range-slider';
import { deleteChatById } from '@/lib/db/queries';
import { del } from '@vercel/blob';

// 定义 data 对象的类型
interface Data {
  type: 'INT' | 'FLOAT' | 'BOOL' | 'DATE' | 'TEXT';
  sort?: string;
  filter?: [number, number];
  min?: any;
  max?: any;
  index?: number;
  enums?: { key: string; value: number }[];
  name?: string;
  selEnums?: string;
  field?: string;
}

// 定义 CustomDropdown 组件的 props 类型
interface CustomDropdownProps {
  data: Data;
  onClose: () => void;
  onClear: (params: any) => void;
  onSubmit: (params: any) => void;
  ref: RefObject<HTMLDivElement>;
}

// 自定义的 Dropdown 组件
const CustomDropdown: React.FC<CustomDropdownProps> = ({ data, onClose, onClear, onSubmit, ref }) => {
  const [selFilter, setSelFilter] = useState<[number, number]>([0, 0]);
  const [selEnum, setSelEnum] = useState<string | null>('');
  const [selSort, setSelSort] = useState<string | null>('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, ref]);

  const { type, sort, filter, min, max, enums, name, index, selEnums,field } = useMemo(() => {
    if (!data) return {};
    setSelEnum(data.selEnums || '')
    setSelSort(data.sort || '')
    console.log(data);
    setSelFilter(data.filter || [data.min, data.max])
    return {
        type: data.type,
        sort: data.sort,
        filter: data.filter,
        min: data.min !== undefined ? Math.round(data?.min) : undefined,
        max: data.max !== undefined ? Math.round(data?.max) : undefined,
        enums: data.enums,
        name: data.name,
        index: data.index,
        selEnums: data.selEnums || '',
        field: data.field,
    };
  }, [data]);

  const handleRangeChange = useCallback((value: [number, number]) => {
    setSelFilter(value);
  }, []);

  // 使用 useCallback 包装事件处理函数，避免每次都创建新函数
  const handleSortAscending = useCallback(() => {
    if (selSort !== 'ASC') {
      setSelSort('ASC');
    }
  }, [selSort]);

  const handleSortDescending = useCallback(() => {
    if (selSort !== 'DESC') {
      setSelSort('DESC');
    }
  }, [selSort]);

  const handleEnumSelect = useCallback(
    (key: string) => () => {
      if (selEnum !== key) {
        setSelEnum(key);
        setInputValue(key)
      }
    },
    [selEnum]
  );

  const handleSubmit = useCallback(() => {
    let obj: any = {
      ...data,
      sort: selSort,
    };

    if ((type === 'FLOAT' || type === 'INT') && selFilter) {
      obj['filter'] = selFilter;
    }

    if (type === 'BOOL' && selEnum) {
      obj['selEnums'] = selEnum;
    }

    if (type === 'TEXT' && selEnum) {
      obj['selEnums'] = selEnum;
    }


    onSubmit(obj);
  }, [name, type, selSort, selFilter, selEnum, onSubmit, filter]);


  const handleClear = useCallback(() => {
    let obj: any = {
      ...data,
    };

    delete obj['filter'];
    delete obj['sort'];
    delete obj['selEnums'];
    onClear(obj);
  }, [name, type, selSort, selFilter, selEnum, onClear, filter]);


  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setInputValue(selEnums || '');
  }, [selEnums]);

  const filteredEnums = useMemo(() => {
    if (!enums) return [];
    if (inputValue.trim() === '') return enums; 
    return enums.filter(item => item.key.toLowerCase().includes(inputValue.toLowerCase()));
  }, [enums, inputValue]);

  return (
    <div ref={ref} className={`${s.dropdown} ${s.fs12}`}>
      <div className='flex-1 flex flex-col px-4'>
        <div className={`flex items-center cursor-pointer mb-2 ${selSort==='ASC' && 'bg-slate-500'}`} onClick={handleSortAscending}>
          <ArrowUpIcon />
          <div className='ml-4'>Sort ascending</div>
        </div>
        <div className={`flex items-center cursor-pointer mb-2 ${selSort==='DESC' && 'bg-slate-500'}`} onClick={handleSortDescending}>
          <ArrowDownIcon />
          <div className='ml-4'>Sort descending</div>
        </div>
        {(type === 'FLOAT' || type === 'INT') && (
          <div className='w-full'>
            <RangeSlider min={min || 0} max={max || 100} value={filter || [min, max] || [0, 100]} onChange={handleRangeChange} />
          </div>
        )}
        {type === 'BOOL' && (
          <div className='w-full flex items-center'>
            <button className={`${s.sort_btn_bool} ${selEnums === 'true' || selEnum === 'true' && 'bg-slate-500'}`} onClick={handleEnumSelect('true')}>TRUE</button>
            <button className={`${s.sort_btn_bool} ${selEnums === 'false' || selEnum === 'false' && 'bg-slate-500'}`} onClick={handleEnumSelect('false')}>FALSE</button>
          </div>
        )}
        
        {type === 'TEXT' && (
          <>
          <div className='relative w-full'>
            <input 
              value={inputValue} 
              onChange={(e) => {
                setInputValue(e.target.value);
                setSelEnum(e.target.value); // 如果需要将输入框的值直接赋给 selEnums
              }} 
              className='w-full border-2 p-2 mt-2 mb-2 pr-8' // 增加 pr-8 以留出图标空间
              style={{borderRadius:'20px', borderColor:'#ccc'}}
            />
            <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
              <MagnifyingGlassIcon className='text-gray-500' />
            </div>
          </div>
          <div className='w-full flex items-start flex-col max-h-20 overflow-y-auto'>
            {
          //   selEnums ? (
          //   <div
          //     className='cursor-pointer mb-1 w-full'
          //   >
          //   {selEnums}
          // </div>):
          filteredEnums?.map((item) => {
            return (
              <div
                className={`cursor-pointer w-full mb-1 ${selEnum === item?.key && 'bg-slate-500'}`}
                onClick={handleEnumSelect(item?.key)}
                key={item?.key}
              >
                {item?.key}
              </div>
            );
          })}
            
          </div>
          </>
        )}
      </div>
      <div className='flex-1 flex px-4 justify-end mt-3'>
        <button onClick={handleClear} className={`${s.sort_btn} ${s.cancel}`}>
          Cancel
        </button>
        <button onClick={handleSubmit} className={`${s.sort_btn} ${s.apply}`}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default CustomDropdown;