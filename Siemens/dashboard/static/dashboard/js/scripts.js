let loadingDoneCounter = 0
let current_filters = {clickedLabel : "", DatasetLabel : ""}



function theCharter(histogram , chart_url,label1, label2) {

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


    fetch(chart_url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
            'X-CSRFToken': csrfTokenValue
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            const ConnectionscoreData = {
                labels: data.labels,
                datasets: [{
                        label: label1.replace("_counts",""),
                        backgroundColor: '#FF5733',
                        data: data[label1],
                    },
                    {
                        label: label2.replace("_counts",""),
                        backgroundColor: '#008B8B',
                        data: data[label2],
                    },
                ],
            };
            Chart.register(ChartDataLabels);
            const ConnectionscoreOptions = {
                scales: {
                    x: {
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

            let chartStatus = Chart.getChart(histogram);
            if (chartStatus !== undefined) {
              chartStatus.destroy();
            }


            // Create the chart
            const chart = new Chart(document.getElementById(histogram), {
                type: 'bar',
                data: ConnectionscoreData,
                options: ConnectionscoreOptions,
            });

            loadingDoneCounter ++;
            hideLoading()
        })
        .catch(error => {
            console.error('Error fetching Connection score data:', error);
        });
}


function hideLoading(){
    if (loadingDoneCounter === 4){
        loading.close()
        loadingDoneCounter = 0
    }
}

loading.addEventListener('cancel', (event) => {
    event.preventDefault();
});

function updateCharts(){
    loading.showModal()
    theCharter('histogram1', script_url, 'Connected_counts','X_Connectable_counts')
    theCharter('histogram2', script_url1,'RUH Ready_counts', 'X_not RUH ready_counts')
    theCharter('histogram3', script_url2, 'Data Sent_counts', 'X_Data not sent_counts')
    theCharter('histogram4', script_url3,'Connection active_counts', 'Connection not active_counts')
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






// fetch(script_url)
//             .then(response => response.json())
//             .then(data => {
//                 const srsConnectivityData = {
//                     labels: data.labels,
//                     datasets: [
//                         {
//                             label: 'Connected',
//                             backgroundColor: '#FF5733',
//                             data: data.connected_counts,
//                         },
//                         {
//                             label: 'X_Connectable',
//                             backgroundColor: '#008B8B',
//                             data: data.x_connectable_counts,
//                         },
//                     ],
//                 };
//
//                 const srsConnectivityOptions = {
//     scales: {
//         x: {
//             title: {
//                 display: true,
//                 text: '2023',
//             },
//             stacked: true,
//             maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
//             maxRotation: 0,  // Rotate the x-axis labels to prevent overlap
//         },
//         y: {
//             type: 'linear', // Use a linear scale for the y-axis
//             title: {
//                 display: true,
//                 text: 'Nombre de Equipments',
//             },
//             ticks: {
//               stepSize: 100
//             },
//             stacked: false,
//             beginAtZero: true,
//         },
//     },
//     plugins: {
//         datalabels: {
//             anchor: 'center', // Position of the label within the bar
//             align: 'center',  // Text alignment within the label
//             color: 'black',   // Label color
//             font: {
//                 weight: 'bold', // Font weight
//             },
//             formatter: (value, context) => {
//                 // Display the count of equipment for each part of the column
//                 if (context.dataset.label === 'Connected') {
//                     return value; // Display connected count
//                 } else if (context.dataset.label === 'X_Connectable') {
//                     return value; // Display X_Connectable count
//                 } else {
//                     return ''; // Hide label for other parts
//                 }
//             },
//         },
//     },
//     responsive: true,
//     maintainAspectRatio: false,
// };
//
//                 // Create the chart
//                 new Chart(document.getElementById('histogram1'), {
//                     type: 'bar',
//                     data: srsConnectivityData,
//                     options: srsConnectivityOptions,
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching SRS Connectivity data:', error);
//             });
//
// /////////////
// fetch(script_url1)
//             .then(response => response.json())
//             .then(data => {
//                 const ruhReadinessData = {
//                     labels: data.labels,
//                     datasets: [
//                         {
//                             label: 'RUH Ready',
//                             backgroundColor: '#FF5733',
//                             data: data.RUH_Ready_counts,
//                         },
//                         {
//                             label: 'X_not RUH ready',
//                             backgroundColor: '#008B8B',
//                             data: data.X_not_RUH_ready_counts,
//                         },
//                     ],
//                 };
//
//                 const ruhReadinessDataOptions = {
//     scales: {
//         x: {
//             title: {
//                 display: true,
//                 text: '2023',
//             },
//             stacked: true,
//             maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
//             maxRotation: 0,  // Rotate the x-axis labels to prevent overlap
//         },
//         y: {
//             type: 'linear', // Use a linear scale for the y-axis
//             title: {
//                 display: true,
//                 text: 'Nombre de Equipments',
//             },
//             ticks: {
//               stepSize: 100
//             },
//             stacked: false,
//             beginAtZero: true,
//             //max: Math.max(...data.RUH_Ready_counts, ...data.X_not_RUH_ready_counts),
//         },
//     },
//     plugins: {
//         datalabels: {
//             anchor: 'center', // Position of the label within the bar
//             align: 'center',  // Text alignment within the label
//             color: 'black',   // Label color
//             font: {
//                 weight: 'bold', // Font weight
//             },
//             formatter: (value, context) => {
//                 // Display the count of equipment for each part of the column
//                 if (context.dataset.label === 'RUH Ready') {
//                     return value; // Display connected count
//                 } else if (context.dataset.label === 'X_not RUH ready') {
//                     return value; // Display X_Connectable count
//                 } else {
//                     return ''; // Hide label for other parts
//                 }
//             },
//         },
//     },
//     responsive: true,
//     maintainAspectRatio: false,
// };
//
//
//                 // Create the chart
//                 new Chart(document.getElementById('histogram2'), {
//                     type: 'bar',
//                     data: ruhReadinessData,
//                     options: ruhReadinessDataOptions,
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching RUH Readiness data:', error);
//             });
// ///////
// fetch(script_url2)
//             .then(response => response.json())
//             .then(data => {
//                 const dataSentData = {
//                     labels: data.labels,
//                     datasets: [
//                         {
//                             label: 'Data Sent',
//                             backgroundColor: '#FF5733',
//                             data: data.Data_Sent_counts,
//                         },
//                         {
//                             label: 'X_Data not sent',
//                             backgroundColor: '#008B8B',
//                             data: data.X_Data_not_sent_counts,
//                         },
//                     ],
//                 };
//
//                 const dataSentDataOptions = {
//     scales: {
//         x: {
//             title: {
//                 display: true,
//                 text: '2023',
//             },
//             stacked: true,
//             maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
//             maxRotation: 0,  // Rotate the x-axis labels to prevent overlap
//         },
//         y: {
//             type: 'linear', // Use a linear scale for the y-axis
//             title: {
//                 display: true,
//                 text: 'Nombre de Equipments',
//             },
//             ticks: {
//               stepSize: 100
//             },
//             stacked: false,
//             beginAtZero: true,
//             //max: Math.max(...data.Data_Sent_counts, ...data.X_Data_not_sent_counts),
//         },
//     },
//     plugins: {
//         datalabels: {
//             anchor: 'center', // Position of the label within the bar
//             align: 'center',  // Text alignment within the label
//             color: 'black',   // Label color
//             font: {
//                 weight: 'bold', // Font weight
//             },
//             formatter: (value, context) => {
//                 // Display the count of equipment for each part of the column
//                 if (context.dataset.label === 'Data Sent') {
//                     return value; // Display connected count
//                 } else if (context.dataset.label === 'X_Data not sent') {
//                     return value; // Display X_Connectable count
//                 } else {
//                     return ''; // Hide label for other parts
//                 }
//             },
//         },
//     },
//     responsive: true,
//     maintainAspectRatio: false,
// };
//
//                 // Create the chart
//                 new Chart(document.getElementById('histogram3'), {
//                     type: 'bar',
//                     data: dataSentData,
//                     options: dataSentDataOptions,
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching Data Sent data:', error);
//             });
// /////////::::::::::
// fetch(script_url3)
//             .then(response => response.json())
//             .then(data => {
//                 const ConnectionscoreData = {
//                     labels: data.labels,
//                     datasets: [
//                         {
//                             label: 'Connection active',
//                             backgroundColor: '#FF5733',
//                             data: data.Connection_active_counts,
//                         },
//                         {
//                             label: 'Connection not active',
//                             backgroundColor: '#008B8B',
//                             data: data.Connection_not_active_counts,
//                         },
//                     ],
//                 };
//
//                 const ConnectionscoreOptions = {
//     scales: {
//         x: {
//             title: {
//                 display: true,
//                 text: '2023',
//             },
//             stacked: true,
//             maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
//             maxRotation: 0,  // Rotate the x-axis labels to prevent overlap
//         },
//         y: {
//             type: 'linear', // Use a linear scale for the y-axis
//             title: {
//                 display: true,
//                 text: 'Nombre de Equipments',
//             },
//             ticks: {
//               stepSize: 10
//             },
//             stacked: false,
//             beginAtZero: true,
//             //max: Math.max(...data.Connection_active_counts, ...data.Connection_not_active_counts),
//         },
//     },
//     plugins: {
//         datalabels: {
//             anchor: 'center', // Position of the label within the bar
//             align: 'center',  // Text alignment within the label
//             color: 'black',   // Label color
//             font: {
//                 weight: 'bold', // Font weight
//             },
//             formatter: (value, context) => {
//                 // Display the count of equipment for each part of the column
//                 if (context.dataset.label === 'Connection active') {
//                     return value; // Display connected count
//                 } else if (context.dataset.label === 'Connection not active') {
//                     return value; // Display X_Connectable count
//                 } else {
//                     return ''; // Hide label for other parts
//                 }
//             },
//         },
//     },
//     responsive: true,
//     maintainAspectRatio: false,
// };
//
//                 // Create the chart
//                 new Chart(document.getElementById('histogram4'), {
//                     type: 'bar',
//                     data: ConnectionscoreData,
//                     options: ConnectionscoreOptions,
//                 });
//             })
//             .catch(error => {
//                 console.error('Error fetching Connection score data:', error);
//             });
//
