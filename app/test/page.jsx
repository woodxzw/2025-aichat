import {DocumentToolCsvResult} from "@/components/csv/document-csv";
import csvData from "@/components/csv/data.json"
export default function test() {
    return <DocumentToolCsvResult type="csv" result={csvData} args={{}} />;
}
  