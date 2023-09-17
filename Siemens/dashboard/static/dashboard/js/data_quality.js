$(document).ready(function() {
    let currentFilters = {
        status: ['all'],
        substatus: ['all'],
        week: ['all'],
    };
 
    currentFilters.status = ['all']
    currentFilters.substatus = ['all']
    currentFilters.week = ['all']

    function updateFiltersOnApply() {
        const filterTypes = ['status', 'substatus', 'week'];
        let filtersChanged = false;

        filterTypes.forEach((filterType) => {
            const checkboxElements = document.getElementsByName(`${filterType}_filter`);
            const selectedValues = [];

            checkboxElements.forEach((checkbox) => {
                if (checkbox.checked) {
                    selectedValues.push(checkbox.value);
                }
            });

            if (selectedValues.length === 0) {
                selectedValues.push('all');
            }

            if (!arraysEqual(currentFilters[filterType], selectedValues)) {
                filtersChanged = true;
            }

            currentFilters[filterType] = selectedValues;
        });

        return filtersChanged;
    }

    function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }


    window.checkFilters = function() {
        areFiltersChanged = updateFiltersOnApply();
        if (!areFiltersChanged) {
            filters_dialog.close()
            return
        }

        getMissingFlCountryAjax()
        getMissingFlCstAjax()
        updateData()
    }


    function updateData() {
        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        $.ajax({
            type: "POST",
            url: getPercents,
            dataType: 'json',
            data: {
                filters: JSON.stringify(currentFilters),
                csrfmiddlewaretoken: csrfToken
            },
            success: function(data) {
                // Update the content of the elements with the received data
                $('#active-active-flcountry').text(data.active_active_flcountry_percentage.toFixed(2) + '%');
                $('#active-active-cstname').text(data.active_active_cstname_percentage.toFixed(2) + '%');
                $('#active-shipped-flcountry').text(data.active_shipped_flcountry_percentage.toFixed(2) + '%');
                $('#active-shipped-cstname').text(data.active_shipped_cstname_percentage.toFixed(2) + '%');
                $('#inactive-on-stock-flcountry').text(data.inactive_on_stock_flcountry_percentage.toFixed(2) + '%');
                $('#inactive-on-stock-cstname').text(data.inactive_on_stock_cstname_percentage.toFixed(2) + '%');
            },
            error: function(error) {
                console.error('Error fetching data:', error);
            }
        });
    }





    let flCountryData = [];
    const $tableBody = $('.ms-countries-table-body');
    let rowsPerPage = 500;
    let page = 1;

    function populateFlCountry(start, end) {
        let rowsHTML = '';

        for (let i = start; i < end && i < flCountryData.length; i++) {
            let rowClass = i === end - 1 ? 'middle-row' : '';
            let img = arrow_img_btn

            rowsHTML += `
                <tr class="ms-countries-tr ${rowClass}">
                    <td class="ms-countries-td rmpl-dt" style="display: none">${flCountryData[i].id}</td>
                    <td class="ms-countries-td">${flCountryData[i].servicepartner}</td>
                    <td class="ms-countries-td">${flCountryData[i].materialnumber}</td>
                    <td class="ms-countries-td">${flCountryData[i].serialnumber}</td>
                    <td class="ms-countries-td">${flCountryData[i].modality}</td>
                    <td class="ms-countries-td">${flCountryData[i].ivkname}</td>
                    <td class="ms-countries-td">${flCountryData[i].status}</td>
                    <td class="ms-countries-td">${flCountryData[i].substatus}</td>
                    <td class="ms-countries-td" style="width: 150px;" ondblclick="remplirCountry(this)">${flCountryData[i].flcountry}
                        <section style="display: none">
                            <input class="missing-input" type="text" style="width: 80px;">
                            <button class="SubmitMissing" onclick="fillMissCountry()"><img src=`+ img +` alt="" width="25px" alt=""></button>
                        </section>
                    </td>
                </tr>`;
        }

        if (flCountryData.length == 0){
            $tableBody.parent().parent().css("background-color","#D3D3D3FF")
             rowsHTML = `
                <tr class="" style="background-color:transparent;">
                    <td class="ms-countries-td" style="border: none" colspan="8">No data available</td>
                </tr>`
        }


        $tableBody.html(rowsHTML);
        filters_dialog.close()
    }

    let lastMissingCountryAttempt = null;
    let currentMissingCountryAttempt = null;
    let confirmBtn = document.getElementById("yesGoAheadBtn")

    window.remplirCountry = function(e){
        if(lastMissingCountryAttempt !== null){
            lastMissingCountryAttempt.style.display = "None"
        }
        lastMissingCountryAttempt = e.getElementsByTagName("section")[0]
        currentMissingCountryAttempt = e.closest('tr')
        e.getElementsByTagName("section")[0].style.display= "flex"
    }

    let idCountry,enteredValueCountry = null

    window.fillMissCountry = function (){
        idCountry = currentMissingCountryAttempt.getElementsByClassName('rmpl-dt')[0].innerHTML

        enteredValueCountry = currentMissingCountryAttempt.getElementsByTagName("input")[0].value

        if (enteredValueCountry === ''){
            alert("country not specified")
            return
        }

        confirmBtn.removeEventListener("click", isClicked);

        confirmBtn.addEventListener("click", isClicked);

        confirmation_dialog.showModal()
    }

    function isClicked() {
        confirmation_dialog.close()
        loading.showModal()
        $.ajax({
            type: "POST",
            url: fill_missing_countries,
            data: {
                id: idCountry,
                missingCountry: enteredValueCountry,
                csrfmiddlewaretoken: $('[name=csrfmiddlewaretoken]').val()
            },
            dataType: 'json',
            success: function() {
                getMissingFlCountryAjax()
            },
            error: function(error) {
                console.error('Error submiting country:', error);
            }
        });

    }

    function updatePaginationInfo() {
        let totalPages = Math.ceil(flCountryData.length / rowsPerPage);
        $('.pagination-info-country').text(`${page}/${totalPages}`);
    }

    function updatePageContent() {
        let start = (page - 1) * rowsPerPage;
        let end = start + rowsPerPage;

        if (end > flCountryData.length) {
            end = flCountryData.length; // Adjust the end index for the last page
        }

        populateFlCountry(start, end);
    }

    $('.pagination-btn-country.left').on('click', function() {
        if (page > 1) {
            page--;
            updatePaginationInfo();
            updatePageContent();
        }
    });

    $('.pagination-btn-country.right').on('click', function() {
        let totalPages = Math.ceil(flCountryData.length / rowsPerPage);
        if (page < totalPages) {
            page++;
            updatePaginationInfo();
            updatePageContent();
        }
    });

    window.countries_to_excel = async function (){
        data = flCountryData
        const headers = [
          'Service Partner',
          'Material Number',
          'Serials Number',
          'Modality',
          'IVK Name',
          'Status',
          'SubStatus',
          'FL - Country',
        ];
        try {
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: 'exported_missing_countries.csv',
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
                `${item.servicepartner},${item.materialnumber},${item.serialnumber},${item.modality},${item.ivkname},${item.status},${item.substatus},${item.flcountry}`
              )
            );


            await writableStream.write(csvData.join('\n'));
            await writableStream.close();

            console.log('File saved successfully');
          } catch (error) {
            console.error('Error saving file:', error);
          }
    }

    function getMissingFlCountryAjax() {
        loading.showModal()
        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        $.ajax({
            type: "POST",
            url: missing_flCountry_URL,
            data: {
                filters: JSON.stringify(currentFilters),
                csrfmiddlewaretoken: csrfToken
            },
            dataType: 'json',
            success: function(fetchedData) {
                flCountryData = fetchedData;
                updatePaginationInfo();
                updatePageContent();
                loading.close()
            },
            error: function(error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    getMissingFlCountryAjax();


    let flCstData = [];
    const $tableBodyCst = $('.ms-names-table-body');
    let rowsPerPageCst = 500;
    let pageCst = 1;

    function populateFlCst(start, end) {
        let rowsHTML = '';

        for (let i = start; i < end && i < flCstData.length; i++) {
            let rowClass = i === end - 1 ? 'middle-row' : '';
            let img = arrow_img_btn

            rowsHTML += `
                <tr class="ms-names-tr ${rowClass}">
                    <td class="ms-names-td rmpl-dt" style="display: none">${flCstData[i].id}</td>
                    <td class="ms-names-td">${flCstData[i].servicepartner}</td>
                    <td class="ms-names-td">${flCstData[i].materialnumber}</td>
                    <td class="ms-names-td">${flCstData[i].serialnumber}</td>
                    <td class="ms-names-td">${flCstData[i].modality}</td>
                    <td class="ms-names-td">${flCstData[i].ivkname}</td>
                    <td class="ms-names-td">${flCstData[i].status}</td>
                    <td class="ms-names-td">${flCstData[i].substatus}</td>
                    <td class="" style="width: 250px;" ondblclick="remplirCst(this)">${flCstData[i].customername}
                        <section style="display: none">
                            <input class="missing-input" type="text" style="width: 80px;">
                            <button class="SubmitMissing" onclick="fillMissCst()"><img src=`+ img +` alt="" width="25px" alt=""></button>
                        </section>
                    </td>
                </tr>`;
        }

        if (flCstData.length == 0){
            $tableBodyCst.parent().parent().css("background-color","#D3D3D3FF")
             rowsHTML = `
                <tr class="" style="background-color:transparent;">
                    <td class="ms-names-td" style="border: none" colspan="8">No data available</td>
                </tr>`
        }

        $tableBodyCst.html(rowsHTML);
    }

    let lastMissingCstAttempt = null;
    let currentMissingCstAttempt = null;

    window.remplirCst = function(e){
        if(lastMissingCstAttempt !== null){
            lastMissingCstAttempt.style.display = "None"
        }
        lastMissingCstAttempt = e.getElementsByTagName("section")[0]
        currentMissingCstAttempt = e.closest('tr')
        e.getElementsByTagName("section")[0].style.display= "flex"
    }

    let idCst,enteredValueCst = null

    window.fillMissCst = function (){
        idCst = currentMissingCstAttempt.getElementsByClassName('rmpl-dt')[0].innerHTML

        enteredValueCst = currentMissingCstAttempt.getElementsByTagName("input")[0].value

        if (enteredValueCst === ''){
            alert("customer name not specified")
            return
        }

        confirmBtn.removeEventListener("click", isClickedCst);

        confirmBtn.addEventListener("click", isClickedCst);

        confirmation_dialog.showModal()
    }

    function isClickedCst() {
        confirmation_dialog.close()
        loading.showModal()
        $.ajax({
            type: "POST",
            url: fill_missing_cst,
            data: {
                id: idCst,
                missingCst: enteredValueCst,
                csrfmiddlewaretoken: $('[name=csrfmiddlewaretoken]').val()
            },
            dataType: 'json',
            success: function() {
                getMissingFlCstAjax()
            },
            error: function(error) {
                console.error('Error submiting customer name:', error);
            }
        });

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

    window.names_to_excel = async function (){
        data = flCstData

        const headers = [
          'Service Partner',
          'Material Number',
          'Serials Number',
          'Modality',
          'IVK Name',
          'Status',
          'SubStatus',
          'Customer Name',
        ];
        try {
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: 'exported_missing_names.csv',
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
                `${item.servicepartner},${item.materialnumber},${item.serialnumber},${item.modality},${item.ivkname},${item.status},${item.substatus},${item.customername}`
              )
            );

            await writableStream.write(csvData.join('\n'));
            await writableStream.close();

            console.log('File saved successfully');
          } catch (error) {
            console.error('Error saving file:', error);
          }
    }

    function getMissingFlCstAjax() {
        loading.showModal()
        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        $.ajax({
            type: "POST",
            url: missing_customerName_URL,
            dataType: 'json',
            data: {
                filters: JSON.stringify(currentFilters),
                csrfmiddlewaretoken: csrfToken
            },
            success: function(fetchedData) {
                flCstData = fetchedData;
                updatePaginationInfoCst();
                updatePageContentCst();
                loading.close()
            },
            error: function(error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    getMissingFlCstAjax();

    updateData()
});


// $(document).ready(function () {
//
// });


let filtersGate = document.getElementsByClassName("filters")[0]
filtersGate.onclick = function() {
    filters_dialog.showModal()
}

filters_dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
});

loading.addEventListener('cancel', (event) => {
    event.preventDefault();
});