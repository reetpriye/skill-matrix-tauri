import React, { useEffect, useRef, useState, memo } from 'react'
import { Card, Container, Row } from 'react-bootstrap'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import FixedChartFilter from './FixedChartFilter'

Chart.register(ChartDataLabels)

const FixedPieChart = memo(
  ({ legendColor, data, excelColumns, showLegend, column }) => {
    const [chartData, setChartData] = useState({ labels: [], values: [] })
    const [excelData, setExcelData] = useState([])
    const canvasRef = useRef(null)
    const chartInstanceRef = useRef(null)

    useEffect(() => {
      setExcelData(data)
    }, [data])

    useEffect(() => {
      if (excelData && excelColumns && excelColumns.length > 0) {
        try {
          const selectedColumnIndex = excelColumns.findIndex(
            header => header === column
          )
          if (selectedColumnIndex !== -1) {
            const columnData = excelData
              .map(row => row[selectedColumnIndex])
              .filter(value => !excelColumns.includes(value))
            const uniqueValues = [...new Set(columnData)]
            const labels = uniqueValues
            const values = labels.map(
              label => columnData.filter(value => value === label).length
            )
            setChartData({ labels, values })
          }
        } catch (error) {
          console.error('The column name differs:', error)
        }
      }
    }, [excelData, excelColumns, column, legendColor])

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
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.values
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
                    const total = context.dataset.data.reduce(
                      (a, b) => a + b,
                      0
                    )
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
                    const percentage = ((value / total) * 100).toFixed(0)
                    if (percentage > 1) {
                      return `${percentage}%`
                    } else return ``
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
    }, [chartData, showLegend])

    const onExcelDataChange = data => {
      setExcelData(data)
    }

    return (
      <Card className='chart-container rounded-0'>
        <Card.Header>{column}</Card.Header>
        <Card.Body>
          <Container>
            <FixedChartFilter
              excelColumns={excelColumns}
              data={data}
              onExcelDataChange={onExcelDataChange}
            />
            <Row>
              <div className='chart-container'>
                <canvas ref={canvasRef} />
              </div>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    )
  }
)

export default FixedPieChart
