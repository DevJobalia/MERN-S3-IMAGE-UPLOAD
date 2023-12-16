import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import multer, { memoryStorage } from "multer";
import { getUserPresignedUrls, uploadToS3 } from "./s3.js";

const app = express();

const PORT = process.env.PORT || 4000;

const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg"]; // Define your accepted file types

const fileFilter = (req, file, cb) => {
  if (acceptedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG and JPEG are allowed."), false);
  }
};
const storage = memoryStorage();
const upload = multer({ storage, fileFilter });

app.use(
  cors({
    origin: "*",
  })
);
app.use(json());

app.get("/", (req, res) => res.send("success"));
app.post("/image", upload.single("image"), (req, res) => {
  const { file } = req;
  const userId = req.headers["x-user-id"];
  console.log(file);
  if (!file || !userId) return res.status(400).json({ message: "Bad request" });
  const { error, key } = uploadToS3({ file, userId });
  if (error) return res.status(500).json({ message: error.message });
  return res.status(201).json({ key });
});

app.get("/image", async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId) return res.status(400).json({ message: "Bad request" });
  const { error, presignedUrls } = await getUserPresignedUrls(userId);
  if (error) return res.status(400).json({ message: error.message });
  return res.status(201).json(presignedUrls);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
