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

    window.reset_user=function(id){
        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        $.ajax({
            url :  reset_user_url,
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


    $('#search-btn').click(function(){
        const csrfToken = $('[name=csrfmiddlewaretoken]').val();
        const search = $('#search-input').val();
        $.ajax({
            url :  update_manage_users_url,
            type : 'POST',
            data : {
                'csrfmiddlewaretoken' : csrfToken,
                'search_query' : search,
            },
            success : function(response){
                $("#table-tbody").html(response.table_data);
            },
            error : function(xhr, status, error){
                console.log(error);
            }
        });
    });

    $('#add-user-btn').click(function(){
        window.location.replace(add_user_url);        


    });
});
