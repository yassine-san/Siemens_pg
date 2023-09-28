$(document).ready(function () {

let loadingDoneCounter = 0
let current_filters = {clickedLabel : "", DatasetLabel : ""}


// copied from mrcan
let flCstData = [];
const $tableBodyCst = $(".ms-names-table-body");
const $counttab = $("#count-systems-active-tab");
let rowsPerPageCst = 500;
let pageCst = 1;

window.to_excel = async function () {
  data = flCstData;
  const headers = [
    "equipment_service_partner_id",
    "equipment_service_partner_text",
    "country_region",
    "func_location_name",
    "equipment_material_number",
    "equipment_serial_number",
    "material_ivk_name",
    "srs_connectivity",
    "ruh_readiness",
    "data_sent",
  ];
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: "exported_data.csv",
      types: [
        {
          description: "CSV Files",
          accept: {
            "text/csv": [".csv"],
          },
        },
      ],
    });

    const writableStream = await fileHandle.createWritable();
    const csvData = [headers].concat(
      data.map(
        (item) =>
          `${item.equipment_service_partner_id},${item.equipment_service_partner_text},${item.country_region},${item.func_location_name},${item.equipment_material_number},${item.equipment_serial_number},${item.material_ivk_name},${item.srs_connectivity},${item.ruh_readiness},${item.data_sent}`
      )
    );

    await writableStream.write(csvData.join("\n"));
    await writableStream.close();

    console.log("File saved successfully");
  } catch (error) {
    console.error("Error saving file:", error);
  }
};


function populateFlCst(start, end) {
  let rowsHTML = "";

  for (let i = start; i < end && i < flCstData.length; i++) {
    let rowClass = i === end - 1 ? "middle-row" : "";
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
  $(".pagination-info-cst").text(`${pageCst}/${totalPages}`);
}

function updatePageContentCst() {
  let start = (pageCst - 1) * rowsPerPageCst;
  let end = start + rowsPerPageCst;

  if (end > flCstData.length) {
    end = flCstData.length;
  }

  populateFlCst(start, end);
}

$(".pagination-btn-cst.left").on("click", function () {
  if (pageCst > 1) {
    pageCst--;
    updatePaginationInfoCst();
    updatePageContentCst();
  }
});

$(".pagination-btn-cst.right").on("click", function () {
  let totalPages = Math.ceil(flCstData.length / rowsPerPageCst);
  if (pageCst < totalPages) {
    pageCst++;
    updatePaginationInfoCst();
    updatePageContentCst();
  }
});


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
    dataType: "json",
    data: {
        'data':JSON.stringify(data),
        csrfmiddlewaretoken: csrfTokenValue
    },
    success: function (fetchedData) {
        flCstData = fetchedData.data;
        // $counttab.html(fetchedData.count_sys_active)
        updatePaginationInfoCst();
        updatePageContentCst();
        loading.close()
    },
    error: function (error) {
      console.error("Error fetching data:", error);
    }
  });
}


//----


function createBarChart(url, connectedCountsKey, xConnectableCountsKey,thirdKey, chartElementId,nasb,reverseColor) {

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
                labels: data.labels,
                datasets: [
                    {
                        label: connectedCountsKey.replace("_counts",""),
                        backgroundColor: '#008B8B',
                        data: data[connectedCountsKey],
                    },
                    {
                        label: xConnectableCountsKey.replace("_counts",""),
                        backgroundColor: '#f1755c',
                        data: data[xConnectableCountsKey],
                    },
                ],
            };
            if (thirdKey !== ''){
                chartData.datasets.push({
                    label: thirdKey.replace("_counts", ""),
                    backgroundColor: '#e70000',
                    data: data[thirdKey],
                });
            }

            if (nasb === -1 && data[connectedCountsKey] !== 0 ){
                let filterIndex = data.labels.indexOf(current_filters.clickedLabel)
                //alert(current_filters.clickedLabel)
                if (filterIndex === -1){
                    $counttab.html(data[connectedCountsKey][data[connectedCountsKey].length - 1])
                }
                $counttab.html(data[connectedCountsKey][filterIndex])
            }
            //$counttab.html(fetchedData.count_sys_active)
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
                            text: 'Number of Equipment',
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
    createBarChart(srs_connectivity_chart_url, 'Connected_counts', 'X_Connectable_counts','', 'histogram1',1,false);
    createBarChart(ruh_readiness_chart_url, 'RUH Ready_counts', 'X_not RUH ready_counts', '', 'histogram2',1,false);
    createBarChart(data_sent_chart_url, 'Data Sent_counts', 'X_Data not sent_counts', '', 'histogram3',1,false);
    createBarChart(connection_score_chart_url, 'Connection active_counts', 'Connection not active_counts', '', 'histogram4', -1,false);
    createBarChart(can24_connectable_systems_chart_url, 'CAN24 connectable_counts', 'x_Not CAN24 connectable_counts', '', 'histogram5',1,false);
    createBarChart(can24_data_sent_chart_url, 'Data sent_counts2', 'x_Data not sent_counts2', 'x_Not connectable_counts2', 'histogram6',1,false);
    createBarChart(connected_can24_modul_chart_url, 'Connected CAN24 Modul_counts', 'Not Connected CAN24 Modul_counts','x_Not Connectable_counts',  'histogram7',1,true);
    getMissingFlCstAjax();
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
    updateCharts();
}

window.removeFilters=function (){
    current_filters.clickedLabel = ""
    current_filters.DatasetLabel = ""
    filterDisplayer.classList.remove("visible-f")
    updateCharts()
}

getMissingFlCstAjax();
updateCharts();

});