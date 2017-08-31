var express = require('express');
var router = express.Router();

const controllersStorage = require('../controllers/upload');
// require multer
let multer = require('multer');
const upload = multer({
  storage: multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

// add controllers
const jwt = require('../helper/jwtHelper');

router.use(jwt.loginCheck)

/* GET users listing. */
router.post('/upload', upload.single('file'), controllersStorage.uploadUser);
router.delete('/delete', controllersStorage.deleteFile);
router.get('/', controllersStorage.findById)

router.get("/", (req, res) => {
  console.log('masuk');
  //res.sendFile(path.join(`${__dirname}/index.html`));
});

module.exports = router;
