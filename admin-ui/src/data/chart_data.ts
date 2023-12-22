const generateDayWiseTimeSeries = (baseval, count, yrange) => {
    let i = 0;
    const series = [];
    while (i < count) {
        const x = baseval;
        const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
        series.push([x, y]);
        baseval += 86400000;
        i++;
    }
    return series;
}

export const series = [
    {
        name: 'South',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60
        })
    },
    {
        name: 'North',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 20
        })
    },
    {
        name: 'Central',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 15
        })
    }
];
