import React, { useEffect, useRef, useState} from "react";
import Chart from "chart.js/auto";


const BarChart = (chartData) =>  {

  const canvasEl = useRef(null);
  const colors = {
    purple: {
      default: "rgba(149, 76, 233, 1)",
      half: "rgba(149, 76, 233, 0.5)",
      quarter: "rgba(149, 76, 233, 0.25)",
      zero: "rgba(149, 76, 233, 0)"
    },
    indigo: {
      default: "rgba(80, 102, 120, 1)",
      quarter: "rgba(80, 102, 120, 0.25)"
    }
  };

  useEffect(() => {
    const ctx = canvasEl.current.getContext("2d");
    ctx.canvas.parentNode.style.height = '50px';

    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);

    const new_weight = chartData.chartData.data;
    const new_labels = chartData.chartData.label;
    const data = {
      labels: new_labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: `${chartData.chartData.title} (${chartData.chartData.period})`,
          data: new_weight,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 3
        }
      ],
     options: {
         MaintainAspectRation: false,
     }
    };
    const config = {
      type: chartData.chartData.type,
      data: data
    };
    const myLineChart = new Chart(ctx, config);


    return function cleanup() {
      myLineChart.destroy();
    };
  });


  return (
    <div className="chart-container">
      <canvas id="myChart" ref={canvasEl} height="100"/>
    </div>
  );
}

export default BarChart