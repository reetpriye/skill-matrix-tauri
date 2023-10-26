import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import { Container, Row } from 'react-bootstrap'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ChartDataLabels)

const PieChart = ({ legendColor, data, showLegend }) => {
  const canvasRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current) {
      if (chartInstanceRef.current) {
        // Destroy the previous chart instance if it exists
        chartInstanceRef.current.destroy()
      }

      const ctx = canvasRef.current.getContext('2d')
      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.labels,
          datasets: [
            {
              data: data.values
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: showLegend || false,
              labels: {
                color: legendColor
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.parsed || 0
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(2) + '%'
                  return `Count: ${value} (${percentage})`
                }
              }
            },
            datalabels: {
              formatter: (value, context) => {
                const total = context.chart.data.datasets[0].data.reduce(
                  (a, b) => a + b,
                  0
                )
                if (context.chart.data.labels.length <= 10) {
                  const percentage = ((value / total) * 100).toFixed(0) + '%'
                  return `${percentage}`
                } else {
                  return ``
                }
              },
              color: '#fff',
              align: 'center',
              offset: 0
            }
          }
        }
      })
    }

    return () => {
      if (chartInstanceRef.current) {
        // Clean up the chart instance when the component unmounts
        chartInstanceRef.current.destroy()
      }
    }
  }, [data, showLegend])

  return (
    <Container>
      <Row>
        <div className='chart-container'>
          <canvas ref={canvasRef} />
        </div>
      </Row>
    </Container>
  )
}

export default PieChart
