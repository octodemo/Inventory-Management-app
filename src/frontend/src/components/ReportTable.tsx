import React, { useState } from 'react'
import { ReportColumn } from '../services/api'

interface ReportTableProps {
  columns: ReportColumn[]
  rows: Array<Record<string, unknown>>
  orderBy?: string
  direction?: 'asc' | 'desc'
  onSortChange?: (orderBy: string, direction: 'asc' | 'desc') => void
  /** Field name holding the drill-down children array (e.g. `items` or `branches`), if any. */
  expandableField?: string
  renderExpandedRow?: (row: Record<string, unknown>) => React.ReactNode
}

/**
 * Generic tabular report renderer with dynamic columns (FR-014), sortable
 * column headers (story-05-02-03), and optional expandable rows for
 * vendor-wise (FR-015) and hierarchy-wise (FR-023) drill-down.
 *
 * data-testid values: `report-table` (design-doc), `sortable-header`
 * (story-05-02-03 technical notes) on each clickable column header.
 */
export function ReportTable({
  columns,
  rows,
  orderBy,
  direction,
  onSortChange,
  expandableField,
  renderExpandedRow,
}: ReportTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleExpanded = (index: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleHeaderClick = (field: string) => {
    if (!onSortChange) return
    const nextDirection: 'asc' | 'desc' = orderBy === field && direction === 'asc' ? 'desc' : 'asc'
    onSortChange(field, nextDirection)
  }

  if (rows.length === 0) {
    return (
      <div data-testid="report-table" className="report-table report-table-empty">
        No data available for the selected filters.
      </div>
    )
  }

  return (
    <table data-testid="report-table" className="report-table">
      <thead>
        <tr>
          {expandableField && <th aria-label="Expand" />}
          {columns.map((column) => (
            <th
              key={column.field}
              data-testid="sortable-header"
              onClick={() => handleHeaderClick(column.field)}
              className={column.type === 'number' ? 'align-right' : undefined}
            >
              {column.label}
              {orderBy === column.field ? (direction === 'asc' ? ' ▲' : ' ▼') : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const children = expandableField ? (row[expandableField] as unknown[] | undefined) : undefined
          const isExpanded = expandedRows.has(index)
          return (
            <React.Fragment key={index}>
              <tr data-testid="report-row">
                {expandableField && (
                  <td>
                    {children && children.length > 0 && (
                      <button
                        type="button"
                        data-testid={`report-row-expand-${index}`}
                        onClick={() => toggleExpanded(index)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? '▾' : '▸'}
                      </button>
                    )}
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.field} className={column.type === 'number' ? 'align-right' : undefined}>
                    {String(row[column.field] ?? '')}
                  </td>
                ))}
              </tr>
              {isExpanded && renderExpandedRow && (
                <tr data-testid={`report-row-detail-${index}`}>
                  <td colSpan={columns.length + 1}>{renderExpandedRow(row)}</td>
                </tr>
              )}
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}
