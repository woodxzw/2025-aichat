import React, { useMemo } from 'react';
import { FileIcon, LoaderIcon, MessageIcon, PencilEditIcon } from '../icons';
import s from './document-csv.module.css';
import ChartBar from './chart-bar';
import ChartPie from './chart-pie';

// 定义 dataTableHead 的类型
interface DataTableHeadItem {
  name: string;
  description: string;
  type: 'number' | 'enum' | 'bool';
  group?: number[];
  enums?: { key: string; value: number }[];
  dataColumn?: DataColumn;
  min?: number;
  max?: number;
}

// 定义 dataColumn 的类型
interface DataColumn {
  totalCount: number;
  validCount: number;
  missingCount: number;
  mismatchedCount: number;
  maximumFinite?: number;
  mostCommonValue?: string;
  mostCommonValueCount?: number;
  uniqueValueCount?: number;
  mean?: number;
  minimumFinite?: number;
  staDeviation?: number;
  quantiles?: { value: number; point: number }[];
}

// 定义 result 的类型
interface Result {
  dataTableHead: DataTableHeadItem[];
}

interface ColumnProps {
  result: Result;
}

const renderNumberType = (index: number, group: number[] | undefined, min: number | undefined, max: number | undefined) => (
  <td className="size-full flex flex-col" key={index}>
    <div className={s.c_chat_bar_l}>
      <ChartBar data={group || []} />
    </div>
    <div className={`${s.c_chat_b} mt-1`}>
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </td>
);

const renderEnumType = (index: number, enums: { key: string; value: number }[] | undefined) => (
  <td className={`size-full flex-col flex justify-evenly`} key={index}>
    {enums?.map(enmuItem => (
      <div key={enmuItem?.key} className="flex justify-between">
        <span>{enmuItem.key}</span>
        <span>{enmuItem.value}</span>
      </div>
    ))}
  </td>
);

const renderBoolType = (index: number, enums: { key: string; value: number }[] | undefined, dataColumn: DataColumn | undefined) => (
  <td className={`size-full flex items-center`} key={index}>
    <div className={s.c_chat_pie_l}>
      <ChartPie data={enums || []} />
    </div>
    <div className="flex-none ml-1" style={{ width: "90px" }}>
      {enums?.map(enmuItem => (
        <div key={enmuItem?.key}>
          <p>{enmuItem.key}</p>
          <div className="flex justify-between">
            <span>{enmuItem.value}</span>
            <span>{Math.round((enmuItem.value / (dataColumn?.totalCount || 1)) * 100)} %</span>
          </div>
        </div>
      ))}
    </div>
  </td>
);

const renderNumberCa = (mean: number | undefined, staDeviation: number | undefined, minimumFinite: number | undefined, quantiles: { value: number; point: number }[] | undefined, maximumFinite: number | undefined) => (
  <>
    <div className='flex justify-between mb-1 text-xs'>
      <div className='flex-auto'>
        <span>Mean</span>
      </div>
      <div className='w-20 text-right'>{mean}</div>
      <div className={`w-12 text-right ${s.c_color_gray}`}></div>
    </div>

    <div className='flex justify-between mb-3 text-xs'>
      <div className='flex-auto'>
        <span>Std. Deviation</span>
      </div>
      <div className='w-20 text-right whitespace-break-spaces overflow-hidden text-ellipsis'>{staDeviation}</div>
      <div className={`w-12 text-right ${s.c_color_gray}`}></div>
    </div>

    <div className='flex justify-between mb-1 text-xs'>
      <div className='flex-auto'>
        <span>Quantiles</span>
      </div>
      <div className='w-20 text-right'>{minimumFinite}</div>
      <div className={`w-12 text-right ${s.c_color_gray}`}>Min</div>
    </div>
    {
      quantiles?.map((quantil, quantilInd) => (
        <div className='flex justify-between mb-1 text-xs' key={quantilInd}>
          <div className='flex-auto'>
            <span></span>
          </div>
          <div className='w-20 text-right'>{quantil?.value}</div>
          <div className={`w-12 text-right ${s.c_color_gray}`}>{quantil?.point * 100}%</div>
        </div>
      ))
    }
    <div className='flex justify-between mb-1 text-xs'>
      <div className='flex-auto'>
        <span></span>
      </div>
      <div className='w-20 text-right'>{maximumFinite}</div>
      <div className={`w-12 text-right ${s.c_color_gray}`}>Max</div>
    </div>
  </>
);

const renderEnumCa = (uniqueValueCount: number | undefined, mostCommonValue: string | undefined, totalCount: number | undefined, mostCommonValueCount: number | undefined) => (
  <>
    <div className='flex justify-between mb-1 text-xs'>
      <div className='flex-auto'>
        <span>Unique</span>
      </div>
      <div className='w-20 text-right'>{uniqueValueCount}</div>
      <div className={`w-12 text-right ${s.c_color_gray}`}></div>
    </div>

    <div className='flex justify-between mb-1 text-xs'>
      <div className='flex-auto'>
        <span>Most Common</span>
      </div>
      <div className='w-20 text-right'>{mostCommonValue}</div>
      <div className={`w-12 text-right ${s.c_color_gray}`}>{Math.round(((mostCommonValueCount || 0) / (totalCount || 1)) * 100)}%</div>
    </div>
  </>
);

const renderBoolCa = (enums: { key: string; value: number }[] | undefined, totalCount: number | undefined) => (
  <>
    {
      enums?.map((item, ind) => (
        <div className='flex justify-between mb-1 text-xs' key={ind}>
          <div className='flex-auto'>
            <span>{item?.key}</span>
          </div>
          <div className='w-20 text-right'>{item?.value}</div>
          <div className={`w-12 text-right ${s.c_color_gray}`}>{Math.round((item?.value / (totalCount || 1)) * 100)}%</div>
        </div>
      ))
    }
  </>
);

const Column: React.FC<ColumnProps> = ({ result }) => {
  // 接收到的数据
  const { dataTableHead } = useMemo(() => {
    return result || { dataTableHead: [] };
  }, [result]);

  return (
    <div className="flex flex-col w-full p-5" style={{ border: `1px solid rgb(218, 220, 224)`,borderTop: `none` }}>
      {
        dataTableHead?.map((item, index) => {
          const { type, group, enums, dataColumn, min, max } = item || {};
          const {
            totalCount,
            validCount,
            missingCount,
            mismatchedCount,
            maximumFinite,
            mostCommonValue,
            mostCommonValueCount,
            uniqueValueCount,
            mean,
            minimumFinite,
            staDeviation,
            quantiles
          } = dataColumn || {};
          const safeQuantiles = Array.isArray(quantiles) ? quantiles : [];
          return (
            <div className={`flex flex-col w-full pb-3 mb-3 ${s.c_colunm_item_wrap}`} key={index}>
              <div className="font-bold text-lg flex items-center">
                <div className='mr-2'>#</div>
                <div>{item?.name}</div>
              </div>
              <div className="mt-1">
                {item?.description}
              </div>
              <div className={`w-full grid ${s.c_colunm_item}`}>
                <div className="size-full">
                  {type === 'number' && renderNumberType(index, group, min, max)}
                  {type === 'enum' && renderEnumType(index, enums)}
                  {type === 'bool' && renderBoolType(index, enums, dataColumn)}

                </div>
                <div className='size-full'>
                  <div className="w-full flex mb-2">
                    <div className={`${s.progress} ${s.valid}`} style={{ width: `${Math.round(((validCount || 0) / (totalCount || 1)) * 100)}%` }}></div>
                    <div className={`${s.progress} ${s.mismatched}`} style={{ width: `${Math.round(((mismatchedCount || 0) / (totalCount || 1)) * 100)}%` }}></div>
                    <div className={`${s.progress} ${s.missing}`} style={{ width: `${Math.round(((missingCount || 0) / (totalCount || 1)) * 100)}%` }}></div>
                  </div>
                  <div className='flex justify-between mb-1 text-xs'>
                    <div className='flex-auto'>
                      <span>Valid</span>
                      <span className={`size-2 ml-1 ${s.valid} inline-block`}></span>
                    </div>
                    <div className='w-20 text-right'>{validCount}</div>
                    <div className={`w-12 text-right ${s.c_color_gray}`}>{Math.round(((validCount || 0) / (totalCount || 1)) * 100)}%</div>
                  </div>
                  <div className='flex justify-between mb-1 text-xs'>
                    <div className='flex-auto'>
                      <span>Mismatched</span>
                      <span className={`size-2 ml-1 ${s.mismatched} inline-block`}></span>
                    </div>
                    <div className='w-20 text-right'>{mismatchedCount}</div>
                    <div className={`w-12 text-right ${s.c_color_gray}`}>{Math.round(((mismatchedCount || 0) / (totalCount || 1)) * 100)}%</div>
                  </div>
                  <div className='flex justify-between mb-3 text-xs'>
                    <div className='flex-auto'>
                      <span>Missing</span>
                      <span className={`size-2 ml-1 ${s.missing} inline-block`}></span>
                    </div>
                    <div className='w-20 text-right'>{missingCount}</div>
                    <div className={`w-12 text-right ${s.c_color_gray}`}>{Math.round(((missingCount || 0) / (totalCount || 1)) * 100)}%</div>
                  </div>

                  {type === 'number' && renderNumberCa(mean, staDeviation, minimumFinite, quantiles, maximumFinite)}
                  {type === 'enum' && renderEnumCa(uniqueValueCount, mostCommonValue, totalCount, mostCommonValueCount)}
                  {type === 'bool' && renderBoolCa(enums, totalCount)}

                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default Column;