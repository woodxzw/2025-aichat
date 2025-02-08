import React, { useState, useRef, useEffect, useCallback, RefObject, useMemo } from 'react';
import s from './document-csv.module.css';
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import RangeSlider from './range-slider';

// 定义 data 对象的类型
interface Data {
  type: 'number' | 'bool' | 'enum';
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
  onSubmit: (params: any) => void;
  ref: RefObject<HTMLDivElement>;
}

// 自定义的 Dropdown 组件
const CustomDropdown: React.FC<CustomDropdownProps> = ({ data, onClose, onSubmit, ref }) => {
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
      }
    },
    [selEnum]
  );

  const handleSubmit = useCallback(() => {
    let obj: any = {
      ...data,
      sort: selSort,
    };

    if (type === 'number' && selFilter) {
      obj['filter'] = selFilter;
    }

    if (type === 'bool' && selEnum) {
      obj['selEnums'] = selEnum;
    }

    if (type === 'enum' && selEnum) {
      obj['selEnums'] = selEnum;
    }


    onSubmit(obj);
  }, [name, type, selSort, selFilter, selEnum, onSubmit, filter]);

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
        {type === 'number' && (
          <div className='w-full'>
            <RangeSlider min={min || 0} max={max || 100} value={filter || [min, max] || [0, 100]} onChange={handleRangeChange} />
          </div>
        )}
        {type === 'bool' && (
          <div className='w-full flex items-center'>
            <button className={`${s.sort_btn_bool} ${selEnums === 'true' && 'bg-slate-500'}`} onClick={handleEnumSelect('true')}>TRUE</button>
            <button className={`${s.sort_btn_bool} ${selEnums === 'false' && 'bg-slate-500'}`} onClick={handleEnumSelect('false')}>FALSE</button>
          </div>
        )}
        
        {type === 'enum' && (
          <div className='w-full flex items-start flex-col max-h-20 overflow-y-auto'>
            {selEnums ? (
            <div
              className='cursor-pointer mb-1'
            >
            {selEnums}
          </div>):
          enums?.map((item) => {
            return (
              <div
                className='cursor-pointer mb-1'
                onClick={handleEnumSelect(item?.key)}
                key={item?.key}
              >
                {item?.key}
              </div>
            );
          })}
            
          </div>
        )}
      </div>
      <div className='flex-1 flex px-4 justify-end mt-3'>
        <button onClick={onClose} className={`${s.sort_btn} ${s.cancel}`}>
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