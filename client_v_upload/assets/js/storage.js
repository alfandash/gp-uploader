var url = 'http://35.185.189.3:3000'


$(document).ready(function(){
  if (localStorage.getItem('gp-uploader-token')) {
    loadTask()
  } else {
    window.location.href = "/"
  }
})

$('.logout').click((function() {
  localStorage.removeItem('gp-uploader-token')
  window.location.href = "/index.html"
}))

$('form.form-add-file').submit(eventHandler=>{
  var gpuploadertoken = {'token': localStorage.getItem('gp-uploader-token')}
  console.log($('#add-file').val());
  eventHandler.preventDefault()
  var form = new FormData($("#add-file")[0]);
  $.ajax({
    url: `${url}/storage/upload`,
    method: "POST",
    dataType: 'json',
    data: form,
    processData: false,
    contentType: false,
    headers: gpuploadertoken,
    success: function(response){
      console.log(response);
      $('#form-add-status').fadeOut('fast')
      $('#form-add-status').empty()
      $('#form-add-status').append(`File baru berhasil di tambahkan`)
      $('#form-add-status').fadeIn('slow')
      loadTask()
    }
  })
})


function destroy(link,id){
  console.log(link);
  console.log(id);
  $.ajax({
    url: `${url}/storage/delete`,
    type: 'DELETE',
    headers: {'token':localStorage.getItem('gp-uploader-token')},
    data: {linkDelete: `${link}`, id: `${id}`},
    success: function(response){
      loadTask()
    }
  })
}

//
function loadTask(){
  var adatodotoken = {'token': localStorage.getItem('gp-uploader-token')}
  $.ajax({
    url: `${url}/storage`,
    type: 'GET',
    headers: adatodotoken,
    success: function(response) {
      if (response.error === 'belum login') {
        window.location.href = "/"
      }
      // $('#data-table').fadeOut('slow')
      // $('#data-table').fadeIn('slow')
      $('#task-data').empty()
      var num = 1;
      response.forEach((storage)=>{
        var created_at = new Date(storage.created_at)
        var updated_at = new Date(storage.updated_at)
        $('#task-data').append(`<tr>`)
        $('#task-data').append(`<td>${num++}</td>`)
        $('#task-data').append(`<td><a href="${storage.link_file}">${storage.link_file}</a></td>`)
        $('#task-data').append(`<td>${created_at.toDateString()}</td>`)
        $('#task-data').append(`<td>${updated_at.toDateString()}</td>`)
        $('#task-data').append(`
          <td>
            <form class="delete" method="post" onsubmit="destroy('${storage.link_file}','${storage._id}');return false">
               <button type="submit" name="submit" class="btn btn-danger"> delete</button>
           </form>
          </td>
          `)
        $('#task-data').append(`</tr>`)

      })
    }
  })
}


// Smooth scrolling using jQuery easing
$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000, "easeInOutExpo");
      return false;
    }
  }
});
