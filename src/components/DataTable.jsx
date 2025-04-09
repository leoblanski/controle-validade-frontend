import React from 'react';
import { ClipLoader } from 'react-spinners';

function DataTable({ columns, data, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow mb-6">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-center">{col.header}</th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-4 py-2 text-center w-20">Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1} className="py-4 text-center">
                <ClipLoader color="#3498db" loading={loading} size={50} />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-t w-20">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-center w-48">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-2 flex flex-row sm:flex-row gap-2 items-center justify-center">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} id="button-b">Editar</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row.id)} id="button-m">Excluir</button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
