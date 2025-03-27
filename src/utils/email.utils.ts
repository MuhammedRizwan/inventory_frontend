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

export const emailReport = <T>(
    title: string,
    columns: Column<T>[],
    data: T[],
    summary?: SummaryItem[],
    options: ExportOptions = {},
    customOptions: CustomOptions = {}
) => {
    const { startDate, endDate } = options;
    const { prepend = [] } = customOptions;

    // Helper to create a horizontal line
    const horizontalLine = (char: string, length: number) => char.repeat(length);

    // Calculate max width for each column
    const colWidths = columns.map((col, index) => {
        const headerWidth = col.header.length;
        const maxDataWidth = data.reduce((max, item: any) => {
            const value = col.render
                ? (col.render(item) as any)?.props?.children || col.render(item)
                : col.accessor in item
                ? item[col.accessor]
                : "";
            const strValue = String(value ?? ""); 
            return Math.max(max, strValue.length);
        }, 0);
        return Math.max(headerWidth, maxDataWidth) + 2; 
    });

    // Build email body
    let emailBody = "";

    // Title Section
    const titleLine = horizontalLine("=", Math.max(title.length + 4, 50));
    emailBody += `${titleLine}\n`;
    emailBody += `| ${title.padEnd(title.length + 2)} |\n`;
    emailBody += `${titleLine}\n\n`;

    // Period
    if (startDate || endDate) {
        const period = `Period: ${startDate || "All time"} to ${endDate || "Present"}`;
        emailBody += `${period}\n`;
        emailBody += `${horizontalLine("-", period.length)}\n\n`;
    }

    // Prepend Custom Content
    if (prepend.length > 0) {
        emailBody += "Customer Details:\n";
        prepend.forEach(line => {
            emailBody += `  ${line}\n`;
        });
        emailBody += `${horizontalLine("-", 20)}\n\n`;
    }

  // Table Header
emailBody += columns
.map((col, index) => col.header.padEnd(colWidths[index], " ")) 
.join(" | ") + "\n";

emailBody += colWidths.map(width => "-".repeat(width)).join("-+-") + "\n";

// Table Data
data.forEach((item: any) => {
const rowData = columns.map((col, index) => {
    const value = col.render
        ? (col.render(item) as any)?.props?.children || col.render(item)
        : col.accessor in item
        ? item[col.accessor]
        : "";
    const strValue = String(value ?? "").padEnd(colWidths[index], " ");
    return strValue;
});

emailBody += rowData.join(" | ") + "\n"; 
});



    if (summary) {
        emailBody += "\n";
        emailBody += `${horizontalLine("=", 30)}\n`;
        emailBody += "Summary\n";
        emailBody += `${horizontalLine("=", 30)}\n`;
        summary.forEach(item => {
            const label = item.label.padEnd(15);
            emailBody += `${label} | ${item.value}\n`;
        });
    }

    // Footer
    emailBody += "\n";
    emailBody += `${horizontalLine("-", 50)}\n`;
    emailBody += "Generated on: " + new Date().toLocaleDateString() + "\n";

    // Create mailto link
    const mailtoLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
};