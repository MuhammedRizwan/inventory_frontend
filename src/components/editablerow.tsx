import { useState } from "react";

type EditableRowProps<T> = {
    item: T;
    onSave: (updatedItem: T) => void;
    onCancel: () => void;
    fields: { key: keyof T; label: string; type: string }[];
};

export default function EditableRow<T extends Record<string, any>>({ item, onSave, onCancel, fields }: EditableRowProps<T>) {
    const [editData, setEditData] = useState<Partial<T>>(item);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave({ ...item, ...editData } as T);
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors duration-200">
            {fields.map(field => (
                <td key={field.key as string} className="p-4">
                    <input
                        type={field.type}
                        name={field.key as string}
                        value={editData[field.key] || ""}
                        onChange={handleChange}
                        className="w-full text-gray-800 p-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </td>
            ))}
            <td className="p-4 text-center">
                <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md"
                >
                    Save
                </button>
                <button
                    onClick={onCancel}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-md"
                >
                    Cancel
                </button>
            </td>
        </tr>
    );
}
