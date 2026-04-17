// ============================================================
// SGDI Web — Table Component
// Tabla responsive reutilizable
// ============================================================

import React from 'react';
import './Table.css';

export default function Table({ columns, data, onRowClick, emptyMessage = "No hay datos disponibles" }) {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className={col.align ? `text-${col.align}` : ''}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={row.id || rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? "clickable" : ""}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={col.align ? `text-${col.align}` : ''}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
