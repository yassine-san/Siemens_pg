$(document).ready(function() {
 // ajax function to update table data  with id = 'table-tbody' based on selected filters
 update_ccr_data();
 var updateCCRDataCalled = false;
 function update_ccr_data(){
    const csrfToken = $('[name=csrfmiddlewaretoken]').val();

     var partner_number = $("input[name='service-partner']:checked").val();
     var modality = $("input[name='modality']:checked").val();
     var country = $("input[name='country']:checked").val();
     var searchQuery = $(".search-input").val();

        $.ajax({
            url :  update_ccr_data_url,
            type : 'POST',
            data : {
                'partner_number' : partner_number,
                'modality' : modality,
                'country' : country,
                'searchQuery' : searchQuery,
                csrfmiddlewaretoken: csrfToken,
            },
            success : function(response){
              // update table with new data 
                
                $("#table-tbody").html(response.table_data);
                $("#nb_contracts").html(response.nb_contracts);
                $("#active_systems").html(response.active_systems);
                $("#ccr_percent").html(Number(response.ccr_percent).toFixed(2) + "%");
                loading.close();
                updateCCRDataCalled = false;
            },
            error : function(error){
                console.log(error.resonseText);
            }
        
        });

            // event listner for filter radio buttons and search bar
            $("input[type='radio']").change(function(){
                if (!updateCCRDataCalled) {
                    loading.show();
                    update_ccr_data();
                    updateCCRDataCalled = true; // Set the flag to true
                }
            });

            $("#search_ccr").on("keyup", function() {
                loading.show();
                update_ccr_data();
            });
     

 }

 function uncheck_inputs(name){
    $("input[name='"+name+"']").prop('checked', false);
    update_ccr_data();

}
    
// associate a onclick event to a button with class = 'erase-btn'
$(".erase-btn").click(function(){
    var name = $(this).attr("name");
    uncheck_inputs(name);});

$(".search-btn").click(function(){
    loading.show();
    update_ccr_data();
});

$("#openFormBtn").click(function(){
    document.getElementById("popupFormContainer").style.display = "block";
});

$(".close").click(function(){
    document.getElementById("popupFormContainer").style.display = "none";
    clearPopupform();
});

function clearPopupform(){
    document.getElementById("systemSerialNumber").value = "";
    document.getElementById("systemMaterialNumber").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("deliveryDate").value = "";
    document.getElementById("handoverDate").value = "";
    document.getElementById("contractStartDate").value = "";
    document.getElementById("contractEndDate").value = "";
    document.getElementById("contractNumber").value = "";
    document.getElementById("eos").value = "";
    document.getElementById("eod").value = "";
    document.getElementById("endCustomer").value = "";
    document.getElementById("city").value = "";
    document.getElementById("country").value = "";
    document.getElementById("modality").value = "";
}

$("#submit-popupForm").click(function(){
    var systemSerialNumber = document.getElementById("systemSerialNumber").value;
    var systemMaterialNumber = document.getElementById("systemMaterialNumber").value;
    var productName = document.getElementById("productName").value;
    var deliveryDate = document.getElementById("deliveryDate").value;
    var handoverDate = document.getElementById("handoverDate").value;
    var contractStartDate = document.getElementById("contractStartDate").value;
    var contractEndDate = document.getElementById("contractEndDate").value;
    var contractNumber = document.getElementById("contractNumber").value;
    var eos = document.getElementById("eos").value;
    var eod = document.getElementById("eod").value;
    var endCustomer = document.getElementById("endCustomer").value;
    var city = document.getElementById("city").value;
    var country = document.getElementById("country").value;
    var modality = document.getElementById("modality").value;

    var selectedBox = document.getElementById("servicePartnerId");
    var servicePartnerId = selectedBox.value;
    if (servicePartnerId == "none"){
        for( var i = 0; i < selectedBox.options.length; i++){
            if(selectedBox.options[i].value == partenariat){
                selectedBox.selectedIndex = i;
                break;
            }
        }
    }
    servicePartnerId = selectedBox.value;
    var servicePartner = selectedBox.options[selectedBox.selectedIndex].text;
    

    const csrfToken = $('[name=csrfmiddlewaretoken]').val();

    $.ajax({
        url :  add_ccr_data_url,
        type : 'POST',
        data : {
            'systemSerialNumber' : systemSerialNumber,
            'systemMaterialNumber' : systemMaterialNumber,
            'productName' : productName,
            'deliveryDate' : deliveryDate,
            'handoverDate' : handoverDate,
            'contractStartDate' : contractStartDate,
            'contractEndDate' : contractEndDate,
            'contractNumber' : contractNumber,
            'eos' : eos,
            'eod' : eod,
            'endCustomer' : endCustomer,
            'city' : city,
            'country' : country,
            'modality' : modality,
            'servicePartner' : servicePartner,
            'servicePartnerId' : servicePartnerId,
            csrfmiddlewaretoken: csrfToken,
        },
        success : function(response){
            document.getElementById("popupFormContainer").style.display = "none";
            loading.show();
            update_ccr_data();
            clearPopupform();
        },
        error : function(error){
            console.log(error.resonseText);
        }
    
    });




});

});