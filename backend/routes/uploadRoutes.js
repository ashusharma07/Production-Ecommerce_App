import express from "express";
import path from "path";
import multer from "multer";
const router = express.Router();

// this helps in the storage of the file with destination folder and filename.
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// function to check the type of a file can be uploaded.
function checkFileType(file, cb) {
  const fileType = /jpg|jpeg|png/;
  // path.extname give the extension of a file.
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileType.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Image only");
  }
}

// this is the eecution start of a upload.
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
