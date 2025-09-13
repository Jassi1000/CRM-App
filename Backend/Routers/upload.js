import express from "express";
import multer from "multer";
import { isLoggedIn } from "../Middleware/protect.js";
import { uploadExcel } from "../Controllers/uploadController.js";

const uploadRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// Protect + handle file upload
uploadRouter.post("/upload-excel", isLoggedIn, upload.single("file"), uploadExcel);

export default uploadRouter;
