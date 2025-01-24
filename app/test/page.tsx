"use client";
import {DocumentToolCsvResult} from "@/components/csv/document-csv";
import React, { useMemo, SetStateAction, useState, RefObject, useRef, useCallback, useEffect } from 'react';
// import csvData from "@/components/csv/http___113_31_114_7_3080_Furniture.csv.json"
import {getCsvData} from "@/components/csv/api"
export default function Test() {
    const [csvData, setCsvData] = useState({});
    useEffect(() => {
        getCsvData({}).then((data) => {
            setCsvData(data);
        });
    }, []);
    return <DocumentToolCsvResult type="create" result={csvData} args={{ title: 'test' }} />;
}
  