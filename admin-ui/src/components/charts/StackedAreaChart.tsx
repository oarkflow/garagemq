import React from 'react';
import ReactApexChart from 'react-apexcharts';

export const StackedAreaChart = ({series, height, colors, dataOptions}) => {
    let options = {
        chart: {
            type: 'area',
            height: height,
            stacked: true,
            events: {
                selection: function (chart, e) {
                    console.log(new Date(e.xaxis.min));
                }
            },
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 500
                }
            },
        },
        colors: colors,
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.6,
                opacityTo: 0.8
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left'
        }
    };
    if (dataOptions.hasOwnProperty('title')) {
        options.title = {text: dataOptions.title}
    }
    if (dataOptions.hasOwnProperty('xaxis')) {
        options.xaxis = dataOptions.xaxis
    }
    if (dataOptions.hasOwnProperty('yaxis')) {
        options.yaxis = dataOptions.yaxis
    }
    return (
        <div>
            <ReactApexChart options={options} series={series} type="area" height={height}/>
        </div>
    );
};
