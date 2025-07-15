// middleware for handling file upload
import multer from "multer";
import path from "path";


// Ensure '/public/temp' exists manually before using this
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname);
    const name = `avatar-${Date.now()}${ext}`;
    cb(null, name)
  }
})

export const upload = multer(
  { storage })



  