const multer = require("multer");
// const multerS3 = require("multer-s3");
// const AWS = require("aws-sdk");
const upload = multer({ dest: "uploads/" });
const dotenv = require("dotenv");
dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

exports.uploads = multer({ storage: storage });

// const s3 = new AWS.S3({
//   accessKeyId: process.env.S3_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_KEY,
//   region: process.env.S3_REGION,
// });

// const storage = multerS3({
//   s3: s3,
//   bucket: process.env.S3_BUCKET_NAME,
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   acl: "public-read-write",
//   metadata: function (req, file, cb) {
//     cb(null, { fieldName: file.fieldname });
//   },
//   key: function (req, file, cb) {
//     cb(null, `uploads/${Date.now()}_${file.originalname}`);
//   },
// });
