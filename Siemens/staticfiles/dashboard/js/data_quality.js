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
            rowsHTML += `
                <tr class="ms-countries-tr ${rowClass}">
                    <td class="ms-countries-td">${flCountryData[i].servicepartner}</td>
                    <td class="ms-countries-td">${flCountryData[i].materialnumber}</td>
                    <td class="ms-countries-td">${flCountryData[i].serialnumber}</td>
                    <td class="ms-countries-td">${flCountryData[i].modality}</td>
                    <td class="ms-countries-td">${flCountryData[i].ivkname}</td>
                    <td class="ms-countries-td">${flCountryData[i].status}</td>
                    <td class="ms-countries-td">${flCountryData[i].substatus}</td>
                    <td class="ms-countries-td">${flCountryData[i].flcountry}</td>
                </tr>`;
        }

        $tableBody.html(rowsHTML);
        filters_dialog.close()
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
            rowsHTML += `
                <tr class="ms-names-tr ${rowClass}">
                    <td class="ms-names-td">${flCstData[i].servicepartner}</td>
                    <td class="ms-names-td">${flCstData[i].materialnumber}</td>
                    <td class="ms-names-td">${flCstData[i].serialnumber}</td>
                    <td class="ms-names-td">${flCstData[i].modality}</td>
                    <td class="ms-names-td">${flCstData[i].ivkname}</td>
                    <td class="ms-names-td">${flCstData[i].status}</td>
                    <td class="ms-names-td">${flCstData[i].substatus}</td>
                    <td class="ms-names-td">${flCstData[i].customername}</td>
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