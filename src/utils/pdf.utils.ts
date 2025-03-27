import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Explicit import
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
    prependFn?: (doc: jsPDF) => number;
}

export const exportToPDF = <T>(
    title: string,
    columns: Column<T>[],
    data: T[],
    summary?: SummaryItem[],
    options: ExportOptions = {},
    customOptions: CustomOptions = {}
) => {
    try {
        const { startDate, endDate } = options;
        const { prependFn } = customOptions;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(18);
        doc.text(title, pageWidth / 2, 20, { align: "center" });
        if (startDate || endDate) {
            doc.setFontSize(12);
            doc.text(
                `Period: ${startDate || "All time"} to ${endDate || "Present"}`,
                pageWidth / 2,
                30,
                { align: "center" }
            );
        }

        let startY = 40;
        if (prependFn) {
            startY = prependFn(doc) || 40;
        }

        const tableData = data.map((item: any) =>
            columns.map(col => {
                const value = col.render
                    ? (col.render(item) as any).props?.children || col.render(item)
                    : col.accessor in item
                    ? item[col.accessor]
                    : "";
                return typeof value === "string" ? value : value || "";
            })
        );

        // Use autoTable directly instead of relying on doc.autoTable
        autoTable(doc, {
            startY,
            head: [columns.map(col => col.header)],
            body: tableData,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0] },
        });

        if (summary) {
            const finalY = (doc as any).lastAutoTable.finalY || startY;
            doc.setFontSize(12);
            summary.forEach((item, index) => {
                doc.text(
                    `${item.label}: ${item.value}`,
                    pageWidth - 20,
                    finalY + 10 + index * 10,
                    { align: "right" }
                );
            });
        }

        doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}_${startDate || "all"}_to_${endDate || "present"}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};