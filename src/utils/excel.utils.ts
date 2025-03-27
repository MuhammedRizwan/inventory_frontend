import { JSX } from "react";

interface ExportOptions {
    startDate?: string;
    endDate?: string;
}

interface Column<T> {
    header: string;
    accessor: keyof T | string;
    render?: (item: T) => JSX.Element | string;
}

interface SummaryItem {
    label: string;
    value: string;
}

interface CustomOptions {
    header?: string; 
    styles?: string; 
    prepend?: string[]; 
    prependFn?: (doc: any) => number; 
}
// Excel (CSV) function
export const exportToExcel = <T>(
    title: string,
    columns: Column<T>[],
    data: T[],
    summary?: SummaryItem[],
    options: ExportOptions = {},
    customOptions: CustomOptions = {}
) => {
    const { startDate, endDate } = options;
    const { prepend = [] } = customOptions;
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += `${title}\r\n`;
    if (startDate || endDate) {
        csvContent += `Period,${startDate || 'All time'} to ${endDate || 'Present'}\r\n`;
    }
    prepend.forEach(line => csvContent += `${line}\r\n`);

    csvContent += "\r\n";
    csvContent += columns.map(col => col.header).join(",") + "\r\n";
    data.forEach((item: any) => {
        const rowData = columns.map(col => {
            const value = col.render
                ? (col.render(item) as any).props?.children || col.render(item)
                : col.accessor in item
                ? item[col.accessor]
                : "";
            return typeof value === "string" ? value : value || "";
        });
        csvContent += rowData.join(",") + "\r\n";
    });

    if (summary) {
        csvContent += "\r\n";
        summary.forEach(item => {
            csvContent += `${item.label},${item.value}\r\n`;
        });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_${startDate || "all"}_to_${endDate || "present"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};