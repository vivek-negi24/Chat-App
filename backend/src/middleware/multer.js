// middleware/multer.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'uploads/');
    cb(null, path.join(__dirname, "../../uploads")); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // const ext = path.extname(file.originalname);
    // cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    cb(null, `file-${uniqueSuffix}-${file.originalname}`);
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
});

export default upload;
