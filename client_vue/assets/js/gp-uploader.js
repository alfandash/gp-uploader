const url = 'http://35.185.189.3:3000'

var index = new Vue({
  el: '#index',
  data: {
    file: null,
    lists: [],
      number: 0
  },
  methods: {
    upload() {
      let self = this
      let config = {
        file: self.file,
        headers: {
          token: localStorage.getItem('gp-uploader-token') //harus req.headers
        }
      }

      var gpuploadertoken = {'token': localStorage.getItem('gp-uploader-token')}
      var form = new FormData($("#add-file")[0]);
      console.log(form);
      $.ajax({
        url: `${url}/storage/upload`,
        method: "POST",
        dataType: 'json',
        data: form,
        processData: false,
        contentType: false,
        headers: gpuploadertoken,
        success: function(response){
          alert('Upload berhasil')
          self.getdata()
        }
      })
    },


    deleteFile(paramId, paramLink) {
      let self = this
      axios({
        url: `${url}/storage/delete`,
        method: 'delete',
        data: {
          id: paramId,
          linkDelete: paramLink
        },
        headers: {
          token: localStorage.getItem('gp-uploader-token')
        }
      })
      .then(response => {
        alert('Berhasil delete')
        console.log(response);
        self.getdata()
      })
      .catch(err => {
        alert('Gagal delete')
        console.log(err);
      })
    },
    signout() {
      localStorage.removeItem('gp-uploader-token')
      alert('logout berhasil')
      window.location.href = 'index.html'
    },
    processFile() {
      this.file = event.target.files[0]
      console.log('process file nih', this.file);
    },
    getdata(){
      let self = this
      axios({
        headers: {
          token: localStorage.getItem('gp-uploader-token')
        },
        method: 'get',
        url: `${url}/storage`
      })
      .then(response => {
        console.log(response);
        self.lists = response.data
        console.log('response nih >', self.lists);
      })
      .catch(err => {
        console.log('error nih >', err);
        alert('anda harus login terlebih dahulu')
        window.location.href = 'index.html'
      })
    }
  },
  mounted() {
    this.getdata()
  }
})
