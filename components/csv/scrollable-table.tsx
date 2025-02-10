// scrollable-table.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import s from './document-csv.module.css';
interface ScrollableTableProps {
    initialData: { text: string[] }[];
    loadData: (pageNo: number) => Promise<{ rows: { text: string[] }[] }>;
    pageSize: number;
    currentPage: number;
    tableContainerRef: React.RefObject<HTMLDivElement>;
}
function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function(...args: any[]) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}

const ScrollableTable: React.FC<ScrollableTableProps> = ({ initialData, loadData, currentPage ,pageSize,tableContainerRef }) => {
    const [dataTableRows, setDataTableRows] = useState<{ text: string[] }[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    

    useEffect(() => {
        currentPage === 0 && setHasMore(true);
    }, [currentPage]);

    useEffect(() => {
        console.log(initialData);
        setDataTableRows(initialData);
    }, [initialData]);

    // 检测滚动条是否到达底部
    const handleScroll = debounce(() => {
        
        if (!tableContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
            loadMoreData();
        }
    }, 200);

    useEffect(() => {
        const container = tableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    // 加载更多数据
    const loadMoreData = useCallback(async () => {
        if(loading) return
        console.log(`loadMore...`);
        
        setLoading(true);
        try {
            const moreData = await loadData(currentPage + 1);
            if (moreData.rows.length < pageSize) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more data:', error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, hasMore, loadData, pageSize]);

    return (
        <>
        {dataTableRows?.length > 0 ?
        <table className="flex flex-col flex-nowrap">
            <tbody>
            {dataTableRows?.map((row, index) => {
                return (
                    <tr className={s.c_tr} key={index}>
                        {row?.text?.map((cell, cellInd) => {
                            return <td className={s.c_td} key={cellInd}>{cell}</td>;
                        })}
                    </tr>
                );
            })}
            </tbody>
            
        </table> :
        <div className="text-center mt-2">No data</div>
        }
        {loading && <div className="text-center mt-2">Loading...</div>}
        {!hasMore && <div className="text-center mt-2">No more data</div>}
        </>
    );
};

export default ScrollableTable;