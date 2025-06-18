import configDB from '../../Config/ThemeConfig'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement,
    ArcElement,
    RadialLinearScale
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ChartDataLabels);


const primary = localStorage.getItem('default_color') || configDB.data.color.primary_color;
const secondary = localStorage.getItem('secondary_color') || configDB.data.color.secondary_color;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement,
    ArcElement,
    RadialLinearScale
);

export const barChartData = {
    labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    datasets: [
        {
           
            data: [355, 509, 880, 810, 506, 559, 400,500,200,300,400,0,880,100,300,400,445,900,120,230,450,100,25,30,150,300,225,125,220,240,250,230,223,200],
            backgroundColor: "rgb(211, 23, 138)",
            highlightFill: "rgba(36, 105, 92, 0.6)",
            borderRadius: 5,
            
            borderWidth: 2,
            
            datalabels:{
                color:'black',
                anchor:'end',
                align:'top'
            }
        },
        
       
    ],

    // plugins: {
    //     datalabels: {
    //         display: false,
    //         color: 'white'
    //     }
    // }
}
export const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
        display: false,
    },

    // plugins: {
    //     datalabels: {
    //         display: false,
    //     }
    // }
}

export const lineChartData = {
    labels: ['Mon', 'Tue', 'Wen', 'Thus', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            data: [10, 59, 80, 81, 56, 55, 40],
            borderColor: primary,
            backgroundColor: "rgba(36, 105, 92, 0.4)",
            borderWidth: 2,
        },
        {
            data: [28, 48, 40, 19, 86, 27, 90],
            borderColor: secondary,
            backgroundColor: "rgba(186, 137, 93, 0.4)",
            borderWidth: 2,
        }
    ],
    plugins: {
        datalabels: {
            display: false,
            color: 'white'
        }
    }
}
export const lineChartOptions = {
    maintainAspectRatio: true,
    legend: {
        display: false,
    },
    scales: {
        xAxes: {
            stacked: false,
        },
        yAxes: {
            stacked: false,
        }
    },
    plugins: {
        datalabels: {
            display: false,
        }
    }
}

export const RadarChartData = {
    labels: ["Ford", "Chevy", "Toyota", "Honda", "Mazda"],
    datasets: [
        {
            label: 'My Second dataset',
            backgroundColor: 'rgba(36, 105, 92, 0.4)',
            borderColor: primary,
            fill: true,
            pointBackgroundColor: 'rgba(36, 105, 92, 0.4)',
            pointBorderColor: 'rgba(36, 105, 92, 0.4)',
            pointHoverBackgroundColor: primary,
            pointHoverBorderColor: 'rgba(36, 105, 92, 0.4)',
            data: [12, 3, 5, 18, 7]
        }
    ]
};

export const lineChart2Data = {
    labels: ["", "10", "20", "30", "40", "50", "60", "70", "80"],
    datasets: [{
        backgroundColor: 'rgba(113, 113, 113, 0.2)',
        strokeColor: "#717171",
        pointColor: "#717171",
        // borderColor: secondary,
        // pointColor: secondary,
        data: [10, 20, 40, 30, 0, 20, 10, 30, 10],
        // lineTension: 0,
    },
    {
        backgroundColor: 'rgba(186, 137, 93, 0.2)',
        strokeColor: secondary,
        pointColor: secondary,
        // borderColor: "#51bb25",
        // pointColor: "#51bb25",
        data: [20, 40, 10, 20, 40, 30, 40, 10, 20],
        // lineTension: 0,
    },
    {
        backgroundColor: 'rgb(36, 105, 92, 0.2)',
        borderColor: primary,
        pointColor: primary,
        data: [60, 10, 40, 30, 80, 30, 20, 90, 0],
        // lineTension: 0,
    }
    ]
}
export const lineChart2option = {
    maintainAspectRatio: false,
    animation: {
        duration: 0
    },
    legend: {
        display: false,
    },
    scaleShowVerticalLines: false,
    plugins: {
        datalabels: {
            display: false,
            color: 'white'
        }
    }
}

export const doughnutData = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'],
    datasets: [{
        data: [350, 450, 100],
        backgroundColor: [primary, secondary, "#51bb25"]
    }]
}
export const doughnutOption = {
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    plugins: {
        datalabels: {
            display: false,
            color: 'white'
        }
    }
}

export const polarData = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'],
    datasets: [
        {
            data: [300, 500, 100, 40, 120],
            backgroundColor: [primary, secondary, "#f8d62b", "#51bb25", "#a927f9"]
        },

    ],
}

export const polarOption = {
    legend: {
        display: false,
    },
}