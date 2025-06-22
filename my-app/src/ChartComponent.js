import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';

function ChartComponent() {
    const [chartData, setChartData] = useState(null);
    
    useEffect(() => {
        fetch('/api/chart')
            .then(response => response.json())
            .then(data => setChartData(data.chart));
    }, []);
    
    if (!chartData) return <div>Loading chart...</div>;
    
    return (
        <Plot
            data={chartData.data}
            layout={chartData.layout}
            config={{responsive: true}}
        />
    );
}