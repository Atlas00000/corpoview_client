/**
 * Data export utilities for CSV and JSON
 */

/**
 * Export data as CSV
 */
export function exportToCSV(
  data: any[],
  filename: string = 'data.csv',
  headers?: string[]
): void {
  if (data.length === 0) {
    console.warn('No data to export')
    return
  }

  const keys = headers || Object.keys(data[0])
  
  // Create CSV header
  const csvRows = [keys.map((key) => escapeCSVValue(key)).join(',')]

  // Add data rows
  data.forEach((row) => {
    const values = keys.map((key) => {
      const value = row[key]
      return escapeCSVValue(value)
    })
    csvRows.push(values.join(','))
  })

  const csvContent = csvRows.join('\n')
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')
}

/**
 * Export data as JSON
 */
export function exportToJSON(
  data: any,
  filename: string = 'data.json'
): void {
  const jsonContent = JSON.stringify(data, null, 2)
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;')
}

/**
 * Escape CSV value (handles commas, quotes, newlines)
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Download file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export table data as CSV
 */
export function exportTableToCSV(
  tableElement: HTMLTableElement,
  filename: string = 'table.csv'
): void {
  const rows: string[] = []
  const headerCells = tableElement.querySelectorAll('thead th, thead td, tbody tr:first-child td')
  const headerRow: string[] = []

  headerCells.forEach((cell) => {
    headerRow.push(escapeCSVValue(cell.textContent?.trim() || ''))
  })

  rows.push(headerRow.join(','))

  const dataRows = tableElement.querySelectorAll('tbody tr')
  dataRows.forEach((row) => {
    const cells = row.querySelectorAll('td')
    const rowData: string[] = []
    cells.forEach((cell) => {
      rowData.push(escapeCSVValue(cell.textContent?.trim() || ''))
    })
    rows.push(rowData.join(','))
  })

  const csvContent = rows.join('\n')
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')
}

