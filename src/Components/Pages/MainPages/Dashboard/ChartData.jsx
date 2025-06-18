

export const columnChart = {
    series: [

        {
            name: 'Revenue',
            type: 'column',
            data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16, 23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16, 23, 42, 35, 27, 43, 22, 17, 31, 22,],
        },
    ],
    options: {
        chart: {
            height: 250,
            type: 'line',

            toolbar: {
                show: false,
            },
            zoom: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: true,
        },
        stroke: {
            width: 0,
        },
        title: {
            text: 'December 2023',
            align: 'center',
            floating: true,
            offsetY: 365,
            style: {
                fontSize: '12px',
            },
        },
        subtitle: {
            text: 'Total Revenue: 19,00,000',
            floating: false,
            align: 'right',
            offsetY: 0,
            style: {
                fontSize: '16px',
                fontWeight: 600,
            },
        },
        fill: {
            colors: ['#d3178a'],
        },
        xaxis: {
            type: 'day',
            range: 2700000,
            position: 'bottom',

            categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        },
        yaxis: {
            decimalsInFloat: 1,
        },
        legend: {
            show: true,
        },
        responsive: [
            {
                breakpoint: 1366,
                options: {
                    subtitle: {
                        style: {
                            fontSize: '18px',
                        },
                    },
                },
            },
            {
                breakpoint: 992,
                options: {
                    subtitle: {
                        style: {
                            fontSize: '16px',
                        },
                    },
                },
            },

        ],
    },
};