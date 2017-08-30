const fs = require("fs");
const restify = require("restify");
const uuidv4 = require("uuid/v4");

// add model
const Task = require('../model/storage');

// add helper
const jwt = require('../helper/jwtHelper');

/////
const Storage = require("@google-cloud/storage");
const CLOUD_BUCKET = "gp-cloud-bucket";
const storage = Storage({
  projectId: 'gp-cloud-178409',
  keyFilename: 'gp-cloud-139544b26635.json'
})

const bucket = storage.bucket(CLOUD_BUCKET);
/////////

function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

const findById = (req,res)=>{
  jwt.decode(req.headers.token,(err,decoded)=>{
    var query = {'id_user':`${decoded.id}`}
    Task.find(query)
    .then((documents)=>{
      res.send(documents)
    })
    .catch((error)=>{
      res.send(error)
    })
  })
}


const uploadUser = (req, res) => {
  if (!req.file) {
    return next();
  }
  console.log(req.file.originalname.split(' ').join('_'));
  const gcsname = uuidv4() + req.file.originalname.split(' ').join('_');
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    var error = {error: err}
    req.file.cloudStorageError = err;
    res.send(error)
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    file.makePublic().then(() => {
      req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);

      jwt.decode(req.headers.token,(err,decoded)=>{
        console.log('berhasil',req.file.cloudStoragePublicUrl);
        var add = {
          id_user: `${decoded.id}`,
          link_file: `${req.file.cloudStoragePublicUrl}`
        }
        Task.create(add)
        .then((response)=>{
          res.send(response)
        })
        .catch((error)=>{
          res.send(error)
        })

      })
    });
  });

  stream.end(req.file.buffer);
};


const deleteFile = (req,res)=>{
  var id = {'_id':`${req.body.id}`}
  Task.deleteOne(id)
  .then((result)=>{
    var ret = req.body.linkDelete.replace('https://storage.googleapis.com/gp-cloud-bucket/','');
    console.log(ret);
    var link = `https://www.googleapis.com/storage/v1/b/${CLOUD_BUCKET}/o/${ret}`
    var file = bucket.file(`${ret}`);
    file.delete(function(err, apiResponse) {
      console.log(err);
      //res.send(apiResponse)
    });
    res.send(result)
  })
  .catch((error)=>{
    res.send(error)
  })
}


module.exports= {
  uploadUser,
  deleteFile,
  findById
};
