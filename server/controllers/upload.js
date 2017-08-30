const fs = require("fs");
const restify = require("restify");
const uuidv4 = require("uuid/v4");

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
      console.log('berhasil',req.file.cloudStoragePublicUrl);
      res.send(req.file.cloudStoragePublicUrl)
    });
  });

  stream.end(req.file.buffer);
};


const deleteFile = (req,res)=>{
  var ret = req.body.linkDelete.replace('https://storage.googleapis.com/gp-cloud-bucket/','');
  var link = `https://www.googleapis.com/storage/v1/b/${CLOUD_BUCKET}/o/${ret}`
  var file = bucket.file(`${ret}`);
  file.delete(function(err, apiResponse) {
    res.send(apiResponse)
  });
}


module.exports= {
  uploadUser,
  deleteFile
};
