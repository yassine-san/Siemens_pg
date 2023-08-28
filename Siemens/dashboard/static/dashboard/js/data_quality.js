$(document).ready(function () {
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

    $('.pagination-btn-country.left').on('click', function () {
        if (page > 1) {
            page--;
            updatePaginationInfo();
            updatePageContent();
        }
    });

    $('.pagination-btn-country.right').on('click', function () {
        let totalPages = Math.ceil(flCountryData.length / rowsPerPage);
        if (page < totalPages) {
            page++;
            updatePaginationInfo();
            updatePageContent();
        }
    });

    function getMissingFlCountryAjax() {
        $.ajax({
            url: missing_flCountry_URL,
            dataType: 'json',
            success: function (fetchedData) {
                flCountryData = fetchedData;
                updatePaginationInfo();
                updatePageContent();
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    getMissingFlCountryAjax();
});


$(document).ready(function () {
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

    $('.pagination-btn-cst.left').on('click', function () {
        if (pageCst > 1) {
            pageCst--;
            updatePaginationInfoCst();
            updatePageContentCst();
        }
    });

    $('.pagination-btn-cst.right').on('click', function () {
        let totalPages = Math.ceil(flCstData.length / rowsPerPageCst);
        if (pageCst < totalPages) {
            pageCst++;
            updatePaginationInfoCst();
            updatePageContentCst();
        }
    });

    function getMissingFlCstAjax() {
        $.ajax({
            url: missing_customerName_URL,
            dataType: 'json',
            success: function (fetchedData) {
                flCstData = fetchedData;
                updatePaginationInfoCst();
                updatePageContentCst();
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    getMissingFlCstAjax();
});


let filtersGate = document.getElementsByClassName("filters")[0]
filtersGate.onclick = function (){
    filters_dialog.showModal()
}

filters_dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
});