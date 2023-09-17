// users.js
$(document).ready(function () {

    updatetableData();
    function updatetableData(){
        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        
        $.ajax({
            url :  update_manage_users_url,
            type : 'POST',
            data : {
                'csrfmiddlewaretoken' : csrfToken,
            },
            success : function(response){
                $("#table-tbody").html(response.table_data);
            },
            error : function(xhr, status, error){
                console.log(error);
            }
        });
    }

    window.delete_user=function(id){
        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        $.ajax({
            url :  delete_user_url,
            type : 'POST',
            data : {
                'csrfmiddlewaretoken' : csrfToken,
                'user_id' : id,
            },
            success : function(response){
                updatetableData();
            },
            error : function(xhr, status, error){
                console.log(error);
            }
        });
    }

    $('#search-input').on('keyup', function () {
        var searchText = $(this).val().toLowerCase();
        $('table tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(searchText) > -1);
        });
    });

    $('#add-user-btn').click(function(){
        window.location.replace(add_user_url);        


    });
});
