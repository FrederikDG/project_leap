import React from "react";
import ReactApexChart from "react-apexcharts";

export default function TimelineChart({ flights, color }) {
  const series = [{
    data: flights.map(f => ({
      x: f.name,
      y: [
        new Date(f.start).getTime(),
        new Date(f.end).getTime(),
      ],
      fillColor: f.status === "active" ? color : "#F0F0F0",
    }))
  }];
  const dates   = flights.flatMap(f => [
    new Date(f.start).getTime(),
    new Date(f.end).getTime(),
  ]);
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);

  const options = {
    chart: {
      type: "rangeBar",
      toolbar: { show: false },
      zoom:    { enabled: false },
      selection:{ enabled: false },
      events: {
        mounted: (ctx, opts) => {
          drawTodayLine(ctx, opts);
          drawTodayLabelBg(ctx, opts);
        },
        updated: (ctx, opts) => {
          drawTodayLine(ctx, opts);
          drawTodayLabelBg(ctx, opts);
        }
      }
    },states: {
        hover: {
          filter: { type: 'none' }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: { type: 'none' }
        }
      },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight:  "50%",
        borderRadius: 4
      }
    },
    xaxis: {
      type:  "datetime",
      min:   minDate,
      max:   maxDate,
      labels: {
        datetimeUTC: false,
        offsetY:     5,
        style: {
          fontSize:   "14px",
          fontFamily: "'Universal Sans 460', sans-serif"
        }
      },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: {
        align:   "left",
        offsetX: -20,
        style: {
          fontSize:   "14px",
          fontFamily: "'Universal Sans 460', sans-serif"
        }
      }
    },
    grid: {
      borderColor:    "#000",
      strokeDashArray: 4
    },
    tooltip: { enabled: false },

    annotations: {
      xaxis: [{
        x: Date.now(),
        borderWidth: 0, 
        label: {
          text:        "Today",
          position:    "top",
          orientation: "horizontal",
          offsetY:    -10,
          offsetX:     20,
          borderColor:  color,
          style: {
            color:      color,
            background: `${color}50` ,
            fontSize:   "14px",
            fontFamily: "'Universal Sans 460', sans-serif"
          }
        }
      }]
    }
  };

  const chartHeight = flights.length * 50 + 100;

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="rangeBar"
      height={chartHeight}
    />
  );
}
