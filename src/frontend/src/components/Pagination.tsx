
interface PaginationProps {
  page: number
  limit: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

/**
 * Pagination controls for tabular reports and list views (FR-014).
 *
 * data-testid values per docs/design/design-doc.md:
 * `pagination`, `pagination-prev`, `pagination-next`, `pagination-page-{number}`.
 */
export function Pagination({ page, limit, total, totalPages, onPageChange, onLimitChange }: PaginationProps) {
  if (total === 0) {
    return null
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div data-testid="pagination" className="pagination">
      <button
        type="button"
        data-testid="pagination-prev"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          type="button"
          data-testid={`pagination-page-${num}`}
          aria-current={num === page ? 'page' : undefined}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      <button
        type="button"
        data-testid="pagination-next"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>

      <label>
        Page size:
        <select
          data-testid="pagination-page-size"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
