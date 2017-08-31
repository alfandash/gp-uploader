const url = 'http://35.185.189.3:3000'

var signup = new Vue({
  el: '#signup',
  data: {
    email: '',
    username: '',
    password: ''
  },
  methods: {
    signup() {
      let self = this
      let dataSignup = {
        email: self.email,
        username: self.username,
        password: self.password
      }

      axios.post(`${url}/users/signup`,{
        email: self.email,
        username: self.username,
        password: self.password
      })
      .then(response => {
        console.log(response);
        alert(`Daftar berhasil ${response.data.message} silahkan login`)
        window.location.href = 'index.html'
      })
      .catch(err => {
        console.log(err);
        alert('Signup gagal harap ulangi')
        res.send(err)
      })
    }
  }
})

var signin = new Vue({
  el: '#signin',
  data: {
    username: '',
    password: ''
  },
  methods: {
    signin() {
      let self = this
      let dataSignin = {
        username: self.username,
        password: self.password
      }
      axios.post(`${url}/users/signin`,{
        username: self.username,
        password: self.password
      })
      .then(response => {
        console.log('response nih',response.data);
        alert(`Login berhasil`)
        localStorage.setItem('gp-uploader-token',response.data.token)
        window.location.href = 'gp-uploader.html'
      })
      .catch(err => {
        alert(err)
        console.log('error',err);
      })

    }
  }
})

// var index = new Vue({
//   el: '#index',
//   data: {
//     file: null,
//     list: []
//   },
//   methods: {
//     upload() {
//       let self = this
//       let config = {
//         file: self.file,
//         headers: {
//           token: localStorage.getItem('gp-uploader-token') //harus req.headers
//         }
//       }
//
//       var formData = new FormData();
//       var fileUpload = document.querySelector('#add-file');
//       formData.append("file", fileUpload.file[0]);
//       axios.post(`${url}/storage/upload`, formData, {
//          headers: {
//            'Content-Type': 'multipart/form-data',
//            'token': localStorage.getItem('gp-uploader-token')
//          }
//       })
//       // console.log(config);
//       // console.log('self.file nih', self.file);
//       // // axios.post('http://localhost:3000/storage/upload', config)
//       // axios({
//       //   method: 'post',
//       //   url: 'http://localhost:3000/storage/upload',
//       //   file: self.file,
//       //   headers: {
//       //     token : localStorage.getItem('gp-uploader-token')
//       //   }
//       // })
//       .then(response => {
//         console.log('response nih',response);
//         // window.location.href = 'signin.html'
//       })
//       .catch(err => {
//         console.log('error nih',err);
//       })
//     },
//     delete() {
//       //
//     },
//     signout() {
//       localStorage.removeItem('gp-uploader-token')
//       window.location.href = 'signin.html'
//     },
//     processFile() {
//       this.file = event.target.files[0]
//       console.log('process file nih', this.file);
//     }
//   },
//   mounted() {
//     let self = this
//     axios({
//       headers: {
//         token: localStorage.getItem('gp-uploader-token')
//       },
//       method: 'get',
//       url: `${url}/storage`
//     })
//     .then(response => {
//       console.log(response);
//       //self.list = response.data
//       //console.log('response nih >', response.data);
//     })
//     .catch(err => {
//       console.log('error nih >', err);
//     })
//   }
// })
