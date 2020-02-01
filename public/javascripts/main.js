$(document).ready(function(){
    $('.delete-user').on('click', function(e){
    var r = confirm("¿Seguro que deseas borrar al usuario?");
    if (r == true) {
        $target = $(e.target);
        const id = $target.attr('data-id');
    
        $.ajax({
            type: 'DELETE',
            url: '/users/'+id,
            success: function (response){
            alert('Borrando usuario');
            window.location.href='/';
            },
            error: function(err){
            console.error(err);
            }
        });
    } else {
    }
      
    });
  });