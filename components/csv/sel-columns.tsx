import React, { useState, useRef, useEffect, useCallback, RefObject, useMemo } from 'react';
import s from './document-csv.module.css';

// 定义 dataTableHead 的类型
interface DataTableHeadItem {
  name: string;
  description: string;
  type: 'number' | 'enum' | 'bool' | 'date';
  group?: number[];
  enums?: { key: string; value: number }[];
  dataColumn?: { totalCount: number };
  min?: number | string;
  max?: number | string;
  field?: string;
}

// 定义 totalField 的类型
interface TotalField {
  fields: { name: string,field: string }[];
  totalFieldAmount: number;
}

// 定义 data 对象的类型
interface Data {
  dataTableHead: DataTableHeadItem[];
  totalField: TotalField;
}

// 定义 SelColumnsProps 组件的 props 类型
interface SelColumnsProps {
  data: Data;
  onClose: () => void;
  onSubmit: (params: { field_name: string[] }) => void;
  ref: RefObject<HTMLDivElement>;
}

// 自定义的 SelColumns 组件
const SelColumns: React.FC<SelColumnsProps> = ({ data, onClose, onSubmit, ref }) => {
  const [selColumns, setSelColumns] = useState<any[]>([]);
  const [allColumns, setAllColumns] = useState<any[]>([]);

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

  useEffect(() => {
    const { dataTableHead, totalField } = data || {};
    setSelColumns(
      dataTableHead?.map((i) => ({
        name: i?.name,
        field: i?.field
    })) || []);

    setAllColumns(
      totalField?.fields?.map((i) => ({
        name: i?.name,
        field: i?.field
    })) || []);
  }, [data]);

  const handleSubmit = useCallback(() => {
    onSubmit({
      field_name:selColumns.map(i=> i?.field),
    });
  }, [onSubmit, selColumns]);

  return (
    <div ref={ref} className={`${s.selColumns} ${s.fs12}`}>
      <div className='flex-1 flex px-4 justify-between'>
        <div className='flex items-center font-bold cursor-pointer'>
          <input
            type="checkbox"
            className={s.custom_checkbox}
            checked={selColumns.length === allColumns.length}
            onChange={() => {
              if (selColumns.length === allColumns.length) {
                setSelColumns([]);
              } else {
                setSelColumns(allColumns);
              }
            }}
          />
          <div>Select All</div>
        </div>
        <div className="font-bold">{selColumns?.length} of {allColumns?.length} columns</div>
      </div>
      <div className='max-h-40 overflow-y-auto px-8 mt-3'>
        {allColumns?.map((item, index) => {
          return (
            <div key={index} className={`${s.dropdown_item} ${s.fs12}`}>
              <div className={`flex items-center mb-2`}>
                <input
                  type="checkbox"
                  className={s.custom_checkbox}
                  checked={selColumns.some(col => col.name === item.name && col.field === item.field)}
                  onChange={() => {
                    if (selColumns.some(col => col.name === item.name && col.field === item.field)) {
                      setSelColumns(selColumns.filter(col => !(col.name === item.name && col.field === item.field)));
                    } else {
                      setSelColumns([...selColumns, item]);
                    }
                  }}
                />
                <div>{item?.name}</div>
              </div>
            </div>
          );
        })}
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

export default SelColumns;