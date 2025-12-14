import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// recreate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// storage setup

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,"../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".jpg" || ext === ".png" || ext === ".jpeg") {
    cb(null, true); //cb(error,result)
  } else {
    cb(new Error("Only JPG/PNG allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;