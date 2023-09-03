$(document).ready(function() {

          let flCstData = [];
          const $tableBodyCst = $('.ms-names-table-body');
          let rowsPerPageCst = 500;
          let pageCst = 1;

          function populateFlCst(start, end) {
              let rowsHTML = '';

              for (let i = start; i < end && i < flCstData.length; i++) {
                  let rowClass = i === end - 1 ? 'middle-row' : '';
                  rowsHTML += `
                      <tr class="ms-names-tr ${rowClass}">
                          <td class="ms-names-td">${flCstData[i].equipment_service_partner_id}</td>
                          <td class="ms-names-td">${flCstData[i].equipment_service_partner_text}</td>
                          <td class="ms-names-td">${flCstData[i].country_region}</td>
                          <td class="ms-names-td">${flCstData[i].func_location_name}</td>
                          <td class="ms-names-td">${flCstData[i].equipment_material_number}</td>
                          <td class="ms-names-td">${flCstData[i].equipment_serial_number}</td>
                          <td class="ms-names-td">${flCstData[i].material_ivk_name}</td>
                          <td class="ms-names-td">${flCstData[i].srs_connectivity}</td>
                          <td class="ms-names-td">${flCstData[i].ruh_readiness}</td>
                          <td class="ms-names-td">${flCstData[i].data_sent}</td>
                      </tr>`;
              }

              $tableBodyCst.html(rowsHTML);
          }

          function updatePaginationInfoCst() {
              let totalPages = Math.ceil(flCstData.length / rowsPerPageCst);
              $('.pagination-info-cst').text(`${pageCst}/${totalPages}`);
          }

          function updatePageContentCst() {
              let start = (pageCst - 1) * rowsPerPageCst;
              let end = start + rowsPerPageCst;

              if (end > flCstData.length) {
                  end = flCstData.length;
              }

              populateFlCst(start, end);
          }

          $('.pagination-btn-cst.left').on('click', function() {
              if (pageCst > 1) {
                  pageCst--;
                  updatePaginationInfoCst();
                  updatePageContentCst();
              }
          });

          $('.pagination-btn-cst.right').on('click', function() {
              let totalPages = Math.ceil(flCstData.length / rowsPerPageCst);
              if (pageCst < totalPages) {
                  pageCst++;
                  updatePaginationInfoCst();
                  updatePageContentCst();
              }
          });

          function getMissingFlCstAjax() {
              //loading.showModal()
              const csrfToken = $('[name=csrfmiddlewaretoken]').val();
              $.ajax({
                  type: "GET",
                  url: missing_customerName_URL,
                  dataType: 'json',
                  data: {
                      //filters: JSON.stringify(currentFilters),
                      //csrfmiddlewaretoken: csrfToken
                  },
                  success: function(fetchedData) {
                      flCstData = fetchedData;
                      updatePaginationInfoCst();
                      updatePageContentCst();
                      //loading.close()
                  },
                  error: function(error) {
                      console.error('Error fetching data:', error);
                  }
              });
          }

          getMissingFlCstAjax();

   });

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
////////////
fetch(script_url4)
            .then(response => response.json())
            .then(data => {
                const ConnectionscoreData = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'CAN24 connectable',
                            backgroundColor: '#FF5733',
                            data: data.CAN24_connectable_counts,
                        },
                        {
                            label: 'x_Not CAN24 connectable',
                            backgroundColor: '#008B8B',
                            data: data.x_Not_CAN24_connectable_counts,
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
            max: Math.max(...data.CAN24_connectable_counts, ...data.x_Not_CAN24_connectable_counts),
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
                if (context.dataset.label === 'CAN24 connectable') {
                    return value; // Display connected count
                } else if (context.dataset.label === 'x_Not CAN24 connectable') {
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
                new Chart(document.getElementById('histogram5'), {
                    type: 'bar',
                    data: ConnectionscoreData,
                    options: ConnectionscoreOptions,
                });
            })
            .catch(error => {
                console.error('Error fetching CAN24 Connectable Systems data:', error);
            });
//////////
fetch(script_url5)
            .then(response => response.json())
            .then(data => {
                const ConnectionscoreData = {
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
                new Chart(document.getElementById('histogram6'), {
                    type: 'bar',
                    data: ConnectionscoreData,
                    options: ConnectionscoreOptions,
                });
            })
            .catch(error => {
                console.error('Error fetching CAN24 Data sent data:', error);
            });
///////////////
fetch(script_url6)
            .then(response => response.json())
            .then(data => {
                const ConnectionscoreData = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Connected CAN24 Modul',
                            backgroundColor: '#FF5733',
                            data: data.Connected_CAN24_Modul_counts,
                        },
                        {
                            label: 'X_Not Connectable',
                            backgroundColor: '#008B8B',
                            data: data.x_Not_Connectable_counts,
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
            max: Math.max(...data.Connected_CAN24_Modul_counts, ...data.x_Not_Connectable_counts),
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
                if (context.dataset.label === 'Connected CAN24 Modul') {
                    return value; // Display connected count
                } else if (context.dataset.label === 'X_Not Connectable') {
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
                new Chart(document.getElementById('histogram7'), {
                    type: 'bar',
                    data: ConnectionscoreData,
                    options: ConnectionscoreOptions,
                });
            })
            .catch(error => {
                console.error('Error fetching Connected CAN24 Modul data:', error);
            });


