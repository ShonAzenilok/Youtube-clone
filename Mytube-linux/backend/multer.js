const multer = require("multer");
const path = require("path");

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "uploadImage") {
      cb(null, "./resources/Thumbnails");
    } else if (file.fieldname === "uploadVideo") {
      cb(null, "./resources/videos");
    } else if (file.fieldname === "profilePic") {
      cb(null, "./resources/Profilepics");
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// File filter function
const checkFileType = (file, cb, filetypes) => {
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Unsupported file type!");
  }
};

// Initialize upload for multiple files
const upload = multer({
  storage: storage,
  limits: { fileSize: 500000000 }, // 500MB limit for videos
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "uploadImage") {
      const imageTypes = /jpeg|jpg|png|gif/;
      checkFileType(file, cb, imageTypes);
    } else if (file.fieldname === "uploadVideo") {
      const videoTypes = /mp4|mkv/;
      checkFileType(file, cb, videoTypes);
    } else if (file.fieldname === "profilePic") {
      const imageTypes = /jpeg|jpg|png/;
      checkFileType(file, cb, imageTypes);
    }
  }
}).fields([
  { name: "uploadImage", maxCount: 1 },
  { name: "uploadVideo", maxCount: 1 },
  { name: "profilePic", maxCount: 1 }
]);

module.exports = { upload };
