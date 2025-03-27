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
}

// Print function
export const printReport = <T>(
    title: string,
    columns: Column<T>[],
    data: T[],
    summary?: SummaryItem[],
    options: ExportOptions = {},
    customOptions: CustomOptions = {}
) => {
    const { startDate, endDate } = options;
    const { header = "", styles = "" } = customOptions;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>' + title + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .report-header { text-align: center; margin-bottom: 20px; }
        .summary { text-align: right; margin-top: 20px; }
        ${styles}
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<div class="report-header">');
    printWindow.document.write(`<h1>${title}</h1>`);
    if (startDate || endDate) {
        printWindow.document.write(`<p>Period: ${startDate || 'All time'} to ${endDate || 'Present'}</p>`);
    }
    printWindow.document.write('</div>');

    if (header) printWindow.document.write(header);

    printWindow.document.write('<table><thead><tr>');
    columns.forEach(col => printWindow.document.write(`<th>${col.header}</th>`));
    printWindow.document.write('</tr></thead><tbody>');

    data.forEach((item: any) => {
        printWindow.document.write('<tr>');
        columns.forEach(col => {
            const value = col.render
                ? (col.render(item) as any).props?.children || col.render(item)
                : col.accessor in item
                ? item[col.accessor]
                : "";
            printWindow.document.write(`<td>${value || ""}</td>`);
        });
        printWindow.document.write('</tr>');
    });

    printWindow.document.write('</tbody></table>');

    if (summary) {
        printWindow.document.write('<div class="summary">');
        summary.forEach(item => {
            printWindow.document.write(`<p><strong>${item.label}: ${item.value}</strong></p>`);
        });
        printWindow.document.write('</div>');
    }

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
};

