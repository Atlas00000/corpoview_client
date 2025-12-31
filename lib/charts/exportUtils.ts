/**
 * Export chart utilities for PNG and SVG export
 */

/**
 * Export SVG element as PNG
 */
export async function exportSVGAsPNG(
  svgElement: SVGSVGElement,
  filename: string = 'chart.png',
  scale: number = 2
): Promise<void> {
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)

  const img = new Image()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context not available')
  }

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'))
          return
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        URL.revokeObjectURL(svgUrl)
        resolve()
      }, 'image/png')
    }

    img.onerror = reject
    img.src = svgUrl
  })
}

/**
 * Export SVG element as SVG file
 */
export function exportSVGAsSVG(
  svgElement: SVGSVGElement,
  filename: string = 'chart.svg'
): void {
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)

  const link = document.createElement('a')
  link.href = svgUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(svgUrl)
}

/**
 * Export canvas element as PNG
 */
export function exportCanvasAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = 'chart.png'
): void {
  canvas.toBlob((blob) => {
    if (!blob) return

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 'image/png')
}

/**
 * Get SVG element from a React ref or container
 */
export function getSVGElement(
  containerRef: React.RefObject<HTMLElement>
): SVGSVGElement | null {
  if (!containerRef.current) return null

  const svg = containerRef.current.querySelector('svg') as SVGSVGElement
  return svg || null
}

/**
 * Export chart data as CSV
 */
export function exportDataAsCSV(
  data: any[],
  filename: string = 'chart-data.csv'
): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header]
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
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
 * Export chart data as JSON
 */
export function exportDataAsJSON(
  data: any[],
  filename: string = 'chart-data.json'
): void {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

