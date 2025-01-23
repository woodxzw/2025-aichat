// scrollable-table.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getCsvData } from "./api";
import s from './document-csv.module.css';
interface ScrollableTableProps {
    initialData: { text: string[] }[];
    loadData: (page: number, pageSize: number) => Promise<{ rows: { text: string[] }[] }>;
    pageSize: number;
}

const ScrollableTable: React.FC<ScrollableTableProps> = ({ initialData, loadData, pageSize }) => {
    const [dataTableRows, setDataTableRows] = useState<{ text: string[] }[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    useMemo(() => {
        setDataTableRows(initialData);
    }, [initialData]);

    // 检测滚动条是否到达底部
    const handleScroll = useCallback(() => {
        if (!tableContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10 && !loading && hasMore) {
            loadMoreData();
        }
    }, [loading, hasMore]);

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
        setLoading(true);
        try {
            const moreData = await loadData(page + 1, pageSize);
            if (moreData.rows.length < pageSize) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more data:', error);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loadData, pageSize]);

    return (
        <div className="flex flex-col max-h-80 overflow-y-auto" ref={tableContainerRef}>
            {dataTableRows?.map((row, index) => {
                return (
                    <tr className={s.c_tr} key={index}>
                        {row?.text?.map((cell, cellInd) => {
                            return <td className={s.c_td} key={cellInd}>{cell}</td>;
                        })}
                    </tr>
                );
            })}
            {loading && <div className="text-center mt-2">Loading...</div>}
            {!hasMore && <div className="text-center mt-2">No more data</div>}
        </div>
    );
};

export default ScrollableTable;