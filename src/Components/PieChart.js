// PieChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Container, Row } from 'react-bootstrap';

function PieChart({ data, showLegend }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (chartInstanceRef.current) {
        // Destroy the previous chart instance if it exists
        chartInstanceRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.labels,
          datasets: [
            {
              data: data.values
            },
          ],
        },
        options: {
          responsive: true, // Make the chart responsive
          maintainAspectRatio: false, // Maintain the aspect ratio
          plugins: {
            legend: {
              display: showLegend || false, // Optionally show the legend
            }
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        // Clean up the chart instance when the component unmounts
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, showLegend]);

  return (
    <Container>
      <Row>
        <div className="chart-container">
          <canvas ref={canvasRef}/>
        </div>
      </Row>
    </Container>
  );
}

export default PieChart;
