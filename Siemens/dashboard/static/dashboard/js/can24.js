let loadingDoneCounter = 0
let current_filters = {clickedLabel : "", DatasetLabel : ""}


function createBarChart(url, connectedCountsKey, xConnectableCountsKey, chartElementId) {

    const isFiltered = (current_filters.clickedLabel !== "" || current_filters.DatasetLabel !== "");
    const filter_date = isFiltered ? current_filters.clickedLabel : undefined;
    const filter_state = isFiltered ? current_filters.DatasetLabel : undefined;

    var csrfTokenInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    var csrfTokenValue = csrfTokenInput ? csrfTokenInput.value : null;
    const data = {
        //csrfToken: csrfTokenValue,
        isFiltered: isFiltered,
        filter_date: filter_date,
        filter_state: filter_state,
    };

    fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
            'X-CSRFToken': csrfTokenValue
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            const chartData = {
                labels: data['labels'],
                datasets: [
                    {
                        label: connectedCountsKey.replace("_counts",""),
                        backgroundColor: '#FF5733',
                        data: data[connectedCountsKey],
                    },
                    {
                        label: xConnectableCountsKey.replace("_counts",""),
                        backgroundColor: '#008B8B',
                        data: data[xConnectableCountsKey],
                    },
                ],
            };
            Chart.register(ChartDataLabels);
            const chartOptions = {
                scales: {
                    x: {
                        // title: {
                        //     display: true,
                        //     text: '2023',
                        // },
                        stacked: true,
                        maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
                        maxRotation: 0, // Rotate the x-axis labels to prevent overlap
                    },
                    y: {
                        type: 'linear', // Use a linear scale for the y-axis
                        title: {
                            display: true,
                            text: 'Nombre de Equipments',
                        },
                        stacked: true,
                        beginAtZero: true,
                        //max: Math.max(...data.connected_counts, ...data.x_connectable_counts),
                    },
                },
                plugins: {
                    datalabels: {
                        anchor: 'center', // Position of the label within the bar
                        align: 'center', // Text alignment within the label
                        color: 'white', // Label color
                        font: {
                            weight: 'bold', // Font weight
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                onClick: (event, activeElements) => {
                    if (activeElements.length > 0) {
                        const firstPoint = activeElements[0];
                        const datasetIndex = firstPoint.datasetIndex;
                        const label = chart.data.labels[firstPoint.index];
                        const datasetLabel = chart.data.datasets[datasetIndex].label;

                        // Display an alert with the clicked label and dataset label
                        applyingFilters(label, datasetLabel)
                    }
                },
            };

            let chartStatus = Chart.getChart(chartElementId);
            if (chartStatus !== undefined) {
              chartStatus.destroy();
            }

            const chart = new Chart( document.getElementById(chartElementId), {
                type: 'bar',
                data: chartData,
                options: chartOptions,
            });

            loadingDoneCounter ++;
            hideLoading()
        })
        .catch(error => {
            console.error(`Error fetching data from ${url}:`, error);
        });
}

loading.addEventListener('cancel', (event) => {
    event.preventDefault();
});

function updateCharts(){
    loading.showModal()
    createBarChart(srs_connectivity_chart_url, 'Connected_counts', 'X_Connectable_counts', 'histogram1');
    createBarChart(ruh_readiness_chart_url, 'RUH Ready_counts', 'X_not RUH ready_counts', 'histogram2');
    createBarChart(data_sent_chart_url, 'Data Sent_counts', 'X_Data not sent_counts', 'histogram3');
    createBarChart(connection_score_chart_url, 'Connection active_counts', 'Connection not active_counts', 'histogram4');
    createBarChart(can24_connectable_systems_chart_url, 'CAN24 connectable_counts', 'x_Not CAN24 connectable_counts', 'histogram5');
    createBarChart(can24_data_sent_chart_url, 'Data Sent_counts2', 'X_Data not sent_counts2', 'histogram6');
    createBarChart(connected_can24_modul_chart_url, 'Connected CAN24 Modul_counts', 'x_Not Connectable_counts', 'histogram7');
}

function hideLoading(){
    if (loadingDoneCounter === 7){
        loading.close()
        loadingDoneCounter = 0
    }
}

let filterDisplayer = document.getElementById("filter-id")
let filterDisplayerInfo = document.getElementById("appliedFilter")

function applyingFilters(clickedLabel, DatasetLabel){
    current_filters.clickedLabel = clickedLabel
    current_filters.DatasetLabel = DatasetLabel
    console.log(`Clicked Label: ${clickedLabel}\nDataset Label: ${DatasetLabel}`);
    filterDisplayer.classList.add("visible-f")
    filterDisplayerInfo.textContent = clickedLabel + "," + DatasetLabel
    updateCharts()
}

function removeFilters(){
    current_filters.clickedLabel = ""
    current_filters.DatasetLabel = ""
    filterDisplayer.classList.remove("visible-f")
    updateCharts()
}

updateCharts()