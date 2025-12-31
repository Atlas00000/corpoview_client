'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import {
  calculateChartDimensions,
  defaultMargins,
  D3Margins,
  formatDateTime,
  formatCurrency,
} from '@/lib/charts/d3Helpers'

export interface OHLCDataPoint {
  date: string | Date
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface CandlestickChartProps {
  data: OHLCDataPoint[]
  width?: number
  height?: number
  margin?: D3Margins
  upColor?: string
  downColor?: string
  enableTooltip?: boolean
  className?: string
}

export default function CandlestickChart({
  data,
  width = 800,
  height = 400,
  margin = defaultMargins,
  upColor = '#10b981',
  downColor = '#ef4444',
  enableTooltip = true,
  className = '',
}: CandlestickChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width, height })

  // Handle responsive sizing
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth || width
        // On mobile, use smaller height and adjust margins
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

    // Adjust margins for mobile
    const isMobile = dimensions.width < 768
    const adjustedMargin = isMobile
      ? { ...margin, left: 40, right: 20, bottom: 30, top: 15 }
      : margin

    const { width: chartWidth, height: chartHeight } = calculateChartDimensions(
      dimensions.width,
      dimensions.height,
      adjustedMargin
    )

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)

    // Create tooltip
    const tooltip = d3
      .select(containerRef.current)
      .append('div')
      .attr('class', 'absolute pointer-events-none opacity-0 bg-gray-900 text-white text-xs rounded px-2 py-1 z-50')
      .style('transition', 'opacity 0.2s')

    const g = svg
      .append('g')
      .attr('transform', `translate(${adjustedMargin.left},${adjustedMargin.top})`)

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => new Date(d.date).toISOString()))
      .range([0, chartWidth])
      .padding(0.2)

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.low) as number,
        d3.max(data, (d) => d.high) as number,
      ])
      .nice()
      .range([chartHeight, 0])

    // Add X axis with mobile-friendly formatting
    const xAxis = g.append('g').attr('transform', `translate(0,${chartHeight})`)
    
    if (isMobile) {
      // Show fewer ticks on mobile
      xAxis
        .call(
          d3
            .axisBottom(xScale)
            .ticks(5)
            .tickFormat((d) => d3.timeFormat('%m/%d')(new Date(d as string)) as string)
        )
        .selectAll('text')
        .style('text-anchor', 'middle')
        .style('font-size', '10px')
    } else {
      xAxis
        .call(
          d3
            .axisBottom(xScale)
            .tickFormat((d) => d3.timeFormat('%m/%d')(new Date(d as string)) as string)
        )
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-45)')
    }

    // Add Y axis
    g.append('g').call(d3.axisLeft(yScale).tickFormat(d3.format('.2s') as any))

    // Calculate candlestick width
    const bandWidth = xScale.bandwidth()
    const candleWidth = bandWidth * 0.6

    // Draw candlesticks
    const candles = g
      .selectAll('.candlestick')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'candlestick')
      .attr('transform', (d) => `translate(${xScale(new Date(d.date).toISOString())},0)`)

    candles.each(function (d) {
      const isUp = d.close >= d.open
      const color = isUp ? upColor : downColor
      const bodyTop = yScale(Math.max(d.open, d.close))
      const bodyBottom = yScale(Math.min(d.open, d.close))
      const bodyHeight = bodyBottom - bodyTop

      const candle = d3.select(this)

      // Draw wick (high-low line)
      candle
        .append('line')
        .attr('x1', bandWidth / 2)
        .attr('x2', bandWidth / 2)
        .attr('y1', yScale(d.high))
        .attr('y2', yScale(d.low))
        .attr('stroke', color)
        .attr('stroke-width', 1)

      // Draw body (open-close rectangle)
      candle
        .append('rect')
        .attr('x', bandWidth / 2 - candleWidth / 2)
        .attr('y', bodyTop)
        .attr('width', candleWidth)
        .attr('height', Math.max(bodyHeight, 1))
        .attr('fill', color)
        .attr('stroke', color)
        .attr('stroke-width', 1)

      // Add hover interactions
      if (enableTooltip) {
        const candleGroup = candle
          .append('rect')
          .attr('x', 0)
          .attr('y', yScale(d.high))
          .attr('width', bandWidth)
          .attr('height', yScale(d.low) - yScale(d.high))
          .attr('fill', 'transparent')
          .attr('cursor', 'pointer')

        candleGroup.on('mouseover', function (event) {
          tooltip.style('opacity', 1).html(`
            <div><strong>${formatDateTime(new Date(d.date))}</strong></div>
            <div>Open: ${formatCurrency(d.open)}</div>
            <div>High: ${formatCurrency(d.high)}</div>
            <div>Low: ${formatCurrency(d.low)}</div>
            <div>Close: ${formatCurrency(d.close)}</div>
            ${d.volume ? `<div>Volume: ${d.volume.toLocaleString()}</div>` : ''}
          `)
            .style('left', `${event.offsetX + 10}px`)
            .style('top', `${event.offsetY - 10}px`)
        })

        candleGroup.on('mouseout', () => {
          tooltip.style('opacity', 0)
        })
      }
    })

    // Cleanup function
    return () => {
      d3.select(containerRef.current).select('.absolute').remove()
    }
  }, [data, dimensions, margin, upColor, downColor, enableTooltip])

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  )
}

