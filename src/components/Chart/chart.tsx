import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartProps {
    height: number;
    options: any; // Adjust the type accordingly
    series: any[]; // Adjust the type accordingly
    type: string;
    width: string;
}

const Chart: React.FC<ChartProps> = (props) => {
    const { height, options, series, type, width } = props;

    return (
        <ReactApexChart
            height={height}
            options={options}
            series={series}
            type={'bar'}
            width={width}
        />
    );
};

export default Chart;
