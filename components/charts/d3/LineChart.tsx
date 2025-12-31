'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import {
  calculateChartDimensions,
  createScales,
  createLineGenerator,
  defaultMargins,
  D3Margins,
  formatDateTime,
  formatCurrency,
} from '@/lib/charts/d3Helpers'

export interface LineChartDataPoint {
  date: string | Date
  value: number
  [key: string]: any
}

export interface LineChartProps {
  data: LineChartDataPoint[]
  width?: number
  height?: number
  margin?: D3Margins
  xKey?: string
  yKey?: string
  color?: string
  strokeWidth?: number
  enableZoom?: boolean
  enableTooltip?: boolean
  enableBrush?: boolean
  onBrushSelection?: (selection: { start: Date; end: Date } | null) => void
  className?: string
}

export default function LineChart({
  data,
  width = 800,
  height = 400,
  margin = defaultMargins,
  xKey = 'date',
  yKey = 'value',
  color = '#3b82f6',
  strokeWidth = 2,
  enableZoom = true,
  enableTooltip = true,
  enableBrush = false,
  onBrushSelection,
  className = '',
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width, height })
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Handle responsive sizing
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth || width
        // On mobile, use smaller height
        const isMobile = containerWidth < 768
        const adjustedHeight = isMobile ? Math.min(height, 300) : height
        
        setDimensions({
          width: containerWidth,
          height: adjustedHeight,
        })
      }
    }

    updateDimensions()
    let timeoutId: NodeJS.Timeout | undefined
    const resizeHandler = () => {
      // Debounce resize for better performance
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDimensions, 150)
    }
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [width, height])

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove()

    const { width: chartWidth, height: chartHeight } = calculateChartDimensions(
      dimensions.width,
      dimensions.height,
      margin
    )

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

    // Create tooltip container
    const tooltip = d3
      .select(containerRef.current)
      .append('div')
      .attr('class', 'absolute pointer-events-none opacity-0 bg-gray-900 text-white text-xs rounded px-2 py-1 z-50')
      .style('transition', 'opacity 0.2s')

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales
    let { xScale, yScale } = createScales(data, xKey, yKey, chartWidth, chartHeight)
    const xScaleOriginal = xScale.copy()
    const yScaleOriginal = yScale.copy()

    // Create line generator
    let line = createLineGenerator(xScale, yScale, xKey, yKey)

    // Add clip path for zoom/pan
    svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', chartWidth)
      .attr('height', chartHeight)

    const clip = g.append('g').attr('clip-path', 'url(#clip)')

    // Add the line
    const path = clip
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('d', line)

    // Add X axis
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .attr('class', 'x-axis')

    // Add Y axis
    const yAxis = g.append('g').attr('class', 'y-axis')

    const updateAxes = () => {
      xAxis.call(
        d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat('%Y-%m-%d') as any)
      )
      yAxis.call(d3.axisLeft(yScale).tickFormat(d3.format('.2s') as any))
    }

    updateAxes()

    // Add zoom behavior
    if (enableZoom) {
      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 10])
        .extent([
          [0, 0],
          [chartWidth, chartHeight],
        ])
        .on('zoom', (event) => {
          const newXScale = event.transform.rescaleX(xScaleOriginal)
          const newYScale = event.transform.rescaleY(yScaleOriginal)

          xScale = newXScale
          yScale = newYScale

          line = createLineGenerator(xScale, yScale, xKey, yKey)
          path.attr('d', line)
          updateAxes()
        })

      g.append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .call(zoom as any)
    }

    // Add hover interactions and tooltip
    if (enableTooltip) {
      const focusLine = clip
        .append('line')
        .attr('stroke', '#666')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', chartHeight)
        .attr('opacity', 0)

      const focusCircle = clip
        .append('circle')
        .attr('r', 5)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('opacity', 0)

      const mouseG = g.append('g').attr('class', 'mouse-over-effects')

      mouseG
        .append('rect')
        .attr('width', chartWidth)
        .attr('height', chartHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseover', () => {
          focusLine.attr('opacity', 1)
          focusCircle.attr('opacity', 1)
          tooltip.style('opacity', 1)
        })
        .on('mouseout', () => {
          focusLine.attr('opacity', 0)
          focusCircle.attr('opacity', 0)
          tooltip.style('opacity', 0)
        })
        .on('mousemove', function (event) {
          const [mouseX] = d3.pointer(event, this)
          const x0 = xScale.invert(mouseX)
          const bisect = d3.bisector((d: any) => new Date(d[xKey])).left
          const i = bisect(data, x0, 1)
          const d0 = data[i - 1]
          const d1 = data[i]
          const d = x0.getTime() - new Date(d0[xKey]).getTime() > new Date(d1[xKey]).getTime() - x0.getTime() ? d1 : d0

          const xPos = xScale(new Date(d[xKey]))
          const yPos = yScale(d[yKey])

          focusLine.attr('x1', xPos).attr('x2', xPos)
          focusCircle.attr('cx', xPos).attr('cy', yPos)

          tooltip
            .html(
              `<div><strong>${formatDateTime(new Date(d[xKey]))}</strong></div><div>${formatCurrency(d[yKey])}</div>`
            )
            .style('left', `${event.offsetX + 10}px`)
            .style('top', `${event.offsetY - 10}px`)
        })
    }

    // Add brush selection
    if (enableBrush) {
      const brushHeight = 30
      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [chartWidth, brushHeight],
        ])
        .on('end', function (event) {
          if (!event.selection) {
            if (onBrushSelection) onBrushSelection(null)
            return
          }

          const [x0, x1] = event.selection
          const start = xScale.invert(x0)
          const end = xScale.invert(x1)

          if (onBrushSelection) {
            onBrushSelection({ start, end })
          }
        })

      const brushG = g
        .append('g')
        .attr('class', 'brush')
        .attr('transform', `translate(0,${chartHeight + 10})`)

      brushG.call(brush)

      // Add brush overlay
      brushG
        .selectAll('.overlay')
        .attr('cursor', 'crosshair')
    }

    // Cleanup function
    return () => {
      d3.select(containerRef.current).select('.absolute').remove()
    }
  }, [
    data,
    dimensions,
    margin,
    xKey,
    yKey,
    color,
    strokeWidth,
    enableZoom,
    enableTooltip,
    enableBrush,
    onBrushSelection,
  ])

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}

