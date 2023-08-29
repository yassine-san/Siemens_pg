fetch(script_url)
            .then(response => response.json())
            .then(data => {
                const srsConnectivityData = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Connected',
                            backgroundColor: '#FF5733',
                            data: data.connected_counts,
                        },
                        {
                            label: 'X_Connectable',
                            backgroundColor: '#008B8B',
                            data: data.x_connectable_counts,
                        },
                    ],
                };
    
                const srsConnectivityOptions = {
    scales: {
        x: {
            title: {
                display: true,
                text: '2023',
            },
            stacked: true,
            maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
            maxRotation: 0,  // Rotate the x-axis labels to prevent overlap
        },
        y: {
            type: 'linear', // Use a linear scale for the y-axis
            title: {
                display: true,
                text: 'Nombre de Equipments',
            },
            stacked: true,
            beginAtZero: true,
            max: Math.max(...data.connected_counts, ...data.x_connectable_counts),
        },
    },
    plugins: {
        datalabels: {
            anchor: 'center', // Position of the label within the bar
            align: 'center',  // Text alignment within the label
            color: 'black',   // Label color
            font: {
                weight: 'bold', // Font weight
            },
            formatter: (value, context) => {
                // Display the count of equipment for each part of the column
                if (context.dataset.label === 'Connected') {
                    return value; // Display connected count
                } else if (context.dataset.label === 'X_Connectable') {
                    return value; // Display X_Connectable count
                } else {
                    return ''; // Hide label for other parts
                }
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
};
    
                // Create the chart
                new Chart(document.getElementById('histogram1'), {
                    type: 'bar',
                    data: srsConnectivityData,
                    options: srsConnectivityOptions,
                });
            })
            .catch(error => {
                console.error('Error fetching SRS Connectivity data:', error);
            });

/////////////
fetch(script_url1)
            .then(response => response.json())
            .then(data => {
                const ruhReadinessData = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'RUH Ready',
                            backgroundColor: '#FF5733',
                            data: data.RUH_Ready_counts,
                        },
                        {
                            label: 'X_not RUH ready',
                            backgroundColor: '#008B8B',
                            data: data.X_not_RUH_ready_counts,
                        },
                    ],
                };
    
                const ruhReadinessDataOptions = {
    scales: {
        x: {
            title: {
                display: true,
                text: '2023',
            },
            stacked: true,
            maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
            maxRotation: 0,  // Rotate the x-axis labels to prevent overlap
        },
        y: {
            type: 'linear', // Use a linear scale for the y-axis
            title: {
                display: true,
                text: 'Nombre de Equipments',
            },
            stacked: true,
            beginAtZero: true,
            max: Math.max(...data.RUH_Ready_counts, ...data.X_not_RUH_ready_counts),
        },
    },
    plugins: {
        datalabels: {
            anchor: 'center', // Position of the label within the bar
            align: 'center',  // Text alignment within the label
            color: 'black',   // Label color
            font: {
                weight: 'bold', // Font weight
            },
            formatter: (value, context) => {
                // Display the count of equipment for each part of the column
                if (context.dataset.label === 'RUH Ready') {
                    return value; // Display connected count
                } else if (context.dataset.label === 'X_not RUH ready') {
                    return value; // Display X_Connectable count
                } else {
                    return ''; // Hide label for other parts
                }
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
};
    
                // Create the chart
                new Chart(document.getElementById('histogram2'), {
                    type: 'bar',
                    data: ruhReadinessData,
                    options: ruhReadinessDataOptions,
                });
            })
            .catch(error => {
                console.error('Error fetching RUH Readiness data:', error);
            });
///////
fetch(script_url2)
            .then(response => response.json())
            .then(data => {
                const dataSentData = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Data Sent',
                            backgroundColor: '#FF5733',
                            data: data.Data_Sent_counts,
                        },
                        {
                            label: 'X_Data not sent',
                            backgroundColor: '#008B8B',
                            data: data.X_Data_not_sent_counts,
                        },
                    ],
                };
    
                const dataSentDataOptions = {
    scales: {
        x: {
            title: {
                display: true,
                text: '2023',
            },
            stacked: true,
            maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
            maxRotation: 0,  // Rotate the x-axis labels to prevent overlap
        },
        y: {
            type: 'linear', // Use a linear scale for the y-axis
            title: {
                display: true,
                text: 'Nombre de Equipments',
            },
            stacked: true,
            beginAtZero: true,
            max: Math.max(...data.Data_Sent_counts, ...data.X_Data_not_sent_counts),
        },
    },
    plugins: {
        datalabels: {
            anchor: 'center', // Position of the label within the bar
            align: 'center',  // Text alignment within the label
            color: 'black',   // Label color
            font: {
                weight: 'bold', // Font weight
            },
            formatter: (value, context) => {
                // Display the count of equipment for each part of the column
                if (context.dataset.label === 'Data Sent') {
                    return value; // Display connected count
                } else if (context.dataset.label === 'X_Data not sent') {
                    return value; // Display X_Connectable count
                } else {
                    return ''; // Hide label for other parts
                }
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
};
    
                // Create the chart
                new Chart(document.getElementById('histogram3'), {
                    type: 'bar',
                    data: dataSentData,
                    options: dataSentDataOptions,
                });
            })
            .catch(error => {
                console.error('Error fetching Data Sent data:', error);
            });
/////////::::::::::
fetch(script_url3)
            .then(response => response.json())
            .then(data => {
                const ConnectionscoreData = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Connection active',
                            backgroundColor: '#FF5733',
                            data: data.Connection_active_counts,
                        },
                        {
                            label: 'Connection not active',
                            backgroundColor: '#008B8B',
                            data: data.Connection_not_active_counts,
                        },
                    ],
                };
    
                const ConnectionscoreOptions = {
    scales: {
        x: {
            title: {
                display: true,
                text: '2023',
            },
            stacked: true,
            maxTicksLimit: 8, // Limit the number of x-axis ticks to prevent overlap
            maxRotation: 0,  // Rotate the x-axis labels to prevent overlap
        },
        y: {
            type: 'linear', // Use a linear scale for the y-axis
            title: {
                display: true,
                text: 'Nombre de Equipments',
            },
            stacked: true,
            beginAtZero: true,
            max: Math.max(...data.Connection_active_counts, ...data.Connection_not_active_counts),
        },
    },
    plugins: {
        datalabels: {
            anchor: 'center', // Position of the label within the bar
            align: 'center',  // Text alignment within the label
            color: 'black',   // Label color
            font: {
                weight: 'bold', // Font weight
            },
            formatter: (value, context) => {
                // Display the count of equipment for each part of the column
                if (context.dataset.label === 'Connection active') {
                    return value; // Display connected count
                } else if (context.dataset.label === 'Connection not active') {
                    return value; // Display X_Connectable count
                } else {
                    return ''; // Hide label for other parts
                }
            },
        },
    },
    responsive: true,
    maintainAspectRatio: false,
};
    
                // Create the chart
                new Chart(document.getElementById('histogram4'), {
                    type: 'bar',
                    data: ConnectionscoreData,
                    options: ConnectionscoreOptions,
                });
            })
            .catch(error => {
                console.error('Error fetching Connection score data:', error);
            });

