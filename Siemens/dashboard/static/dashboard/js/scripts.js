$(document).ready(function() {

        let flCstData = [];
        const $tableBodyCst = $('.ms-names-table-body');
        let rowsPerPageCst = 500;
        let pageCst = 1;
        const $counttab = $("#count-systems-active-tab");

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
                        <td class="ms-names-td">${flCstData[i].material_division_text}</td>
                        <td class="ms-names-td">${flCstData[i].material_ivk_name}</td>
                        <td class="ms-names-td">${flCstData[i].srs_connectivity}</td>
                        <td class="ms-names-td">${flCstData[i].ruh_readiness}</td>
                        <td class="ms-names-td">${flCstData[i].data_sent}</td>
                    </tr>`;
            }
 
            if (flCstData.length === 0){
                $tableBodyCst.parent().parent().css("background-color","#D3D3D3FF")
                 rowsHTML = `
                    <tr class="" style="background-color:transparent;">
                        <td class="ms-names-td" style="border: none" colspan="4">No data available</td>
                    </tr>`
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

        let current_filters = {clickedLabel : "", DatasetLabel : ""}

        function getMissingFlCstAjax() {
            loading.showModal()
            const isFiltered = (current_filters.clickedLabel !== "" || current_filters.DatasetLabel !== "");
            const filter_date = isFiltered ? current_filters.clickedLabel : undefined;
            const filter_state = isFiltered ? current_filters.DatasetLabel : undefined;

            var csrfTokenInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
            var csrfTokenValue = csrfTokenInput ? csrfTokenInput.value : null;

            const data = {
                isFiltered: isFiltered,
                filter_dated: filter_date,
                filter_state: filter_state,
            };

            $.ajax({
                type: "POST",
                url: missing_customerName_URL,
                dataType: 'json',
                data: {
                    'data':JSON.stringify(data),
                    csrfmiddlewaretoken: csrfTokenValue
                },
                success: function(fetchedData) {
                    flCstData = fetchedData.data;
                    $counttab.html(fetchedData.count_sys_active)
                    updatePaginationInfoCst();
                    updatePageContentCst();
                    loading.close()
                },
                error: function(error) {
                    console.error('Error fetching data:', error);
                }
            });
        }

        window.to_excel = async function (){
            data = flCstData
            const headers = [
              'equipment_service_partner_id',
              'equipment_service_partner_text',
              'country_region',
              'func_location_name',
              'equipment_material_number',
              'equipment_serial_number',
              'material_division_text',
              'material_ivk_name',
              'srs_connectivity',
              'ruh_readiness',
              'data_sent',
            ];
            try {
                const fileHandle = await window.showSaveFilePicker({
                  suggestedName: 'exported_data.csv',
                  types: [
                    {
                      description: 'CSV Files',
                      accept: {
                        'text/csv': ['.csv'],
                      },
                    },
                  ],
                });

                const writableStream = await fileHandle.createWritable();
                const csvData = [headers].concat(
                  data.map((item) =>
                    `${item.equipment_service_partner_id},${item.equipment_service_partner_text},${item.country_region},${item.func_location_name},${item.equipment_material_number},${item.equipment_serial_number},${item.material_division_text},${item.material_ivk_name},${item.srs_connectivity},${item.ruh_readiness},${item.data_sent}`
                  )
                );

                await writableStream.write(csvData.join('\n'));
                await writableStream.close();

                console.log('File saved successfully');
              } catch (error) {
                console.error('Error saving file:', error);
              }
        }



        let loadingDoneCounter = 0


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
    getMissingFlCstAjax()
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

window.removeFilters = function (){
    current_filters.clickedLabel = ""
    current_filters.DatasetLabel = ""
    filterDisplayer.classList.remove("visible-f")
    updateCharts()
}

getMissingFlCstAjax();
updateCharts();

 });

