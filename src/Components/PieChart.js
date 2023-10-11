import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function PieChart({ data, width, height }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const customColors = [
    '#FF5733', // Red
    '#36A2EB', // Blue
    '#4BC600', // Green
    '#FFD700', // Yellow
    // Add more colors as needed
  ];

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
              data: data.values,
              backgroundColor: customColors
            },
          ],
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        // Clean up the chart instance when the component unmounts
        chartInstanceRef.current.destroy();
      }
    };
  // eslint-disable-next-line
  }, [data]);

  // Set custom width and height for the div
  const divStyle = {
    width: width || '200px', // Default width if not provided
    height: height || '200px', // Default height if not provided
  };

  return (
    <div style={divStyle}>
      <canvas ref={canvasRef} width="100%" height="100%" />
    </div>
  );
}

export default PieChart;
