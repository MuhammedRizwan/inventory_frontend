import { JSX } from "react";

export interface Column<T> {
    header: string;
    accessor: keyof T;
    render?: (item: T) => JSX.Element;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
}

export default function Table<T>({ columns, data }: TableProps<T>) {
    return (
        <div className="overflow-x-auto scrollbar-hidden">
            <table className="w-full rounded-lg overflow-hidden min-w-max">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        {columns.map((col, index) => (
                            <th key={index} className="p-4 text-left text-sm font-semibold whitespace-nowrap">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-200 border-b">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="p-4 w-36 text-gray-800 text-sm break-words">
                                    {col.render ? col.render(item) : (item[col.accessor] as string | number)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
