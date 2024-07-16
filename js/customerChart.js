class CustomerChart {
    constructor() {
        this.chartInstances = {}; // Store chart instances by their canvas ID
    }

    destroyChartInstance(chartId) {
        if (this.chartInstances[chartId]) {
            this.chartInstances[chartId].destroy();
            delete this.chartInstances[chartId];
        }
    }

    showPerDate(customerData, theName) {
        const chartId = 'ChartForCustomer';
        this.destroyChartInstance(chartId);
        const canvas = document.getElementById(chartId);
        canvas.style.width = '100%';
        canvas.style.height = 400;
        const ctx = document.getElementById(chartId).getContext('2d');

        const data = {
            labels: customerData.dates,
            datasets: [{
                label: 'Transactions',
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: '#14A800',
                data: customerData.amounts,
                fill: 'origin',
                barThickness: 'flex',
                maxBarThickness: 50,
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true
                        },
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: theName }
                },
                onHover: function (event, elements) {
                    event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
                }
            }
        };

        this.chartInstances[chartId] = new Chart(ctx, config);
    }
}
