import React from 'react';
import {ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';

export const StackedAreaChart = ({title, series, options}) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart width={500} data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={options.xaxis.field} />
                <YAxis interval="preserveStart" />
                <Tooltip />
                <Legend align="left" verticalAlign="top"/>
                {options.fields.map((field, i) => {
                    return <Area animationEasing="linear" key={i} stroke={field.color} fill={field.color} stackId="1" type="monotone" dataKey={field.name} />
                })}
            </ComposedChart>
        </ResponsiveContainer>
    );
}
