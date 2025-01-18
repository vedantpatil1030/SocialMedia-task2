const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
// MongoDB connection
mongoose.connect("mongodb+srv://vedantpatil1602:vedant1602@userdb.mrr0pbh.mongodb.net/submission?retryWrites=true&w=majority&appName=userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const userSchema = new mongoose.Schema({
  name: String,
  socialHandle: String,
  images: [String],
});

const User = mongoose.model("User", userSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
app.post("/submit", upload.array("images"), async (req, res) => {
  const { name, socialHandle } = req.body;
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  const user = new User({ name, socialHandle, images: imagePaths });
  await user.save();

  res.status(201).json({ message: "Submission successful!" });
});

app.get("/submissions", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
