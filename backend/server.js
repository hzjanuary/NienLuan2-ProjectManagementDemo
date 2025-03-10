require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema dự án
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  client: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model("Project", ProjectSchema);

// API thêm dự án
app.post("/projects", async (req, res) => {
  try {
    const { name, client, description, deadline } = req.body;
    if (!name || !client || !description || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProject = new Project({
      name,
      client,
      description,
      deadline: new Date(deadline), // Chuyển từ YYYY-MM-DD
    });
    const savedProject = await newProject.save();

    res.status(201).json({
      ...savedProject._doc,
      deadline: savedProject.deadline.toISOString().split("T")[0], // YYYY-MM-DD
      createdAt: savedProject.createdAt.toISOString().split("T")[0], // YYYY-MM-DD
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API lấy danh sách dự án
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    const formattedProjects = projects.map((project) => ({
      ...project._doc,
      deadline: project.deadline.toISOString().split("T")[0], // YYYY-MM-DD
      createdAt: project.createdAt.toISOString().split("T")[0], // YYYY-MM-DD
    }));
    res.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API cập nhật dự án
app.put("/projects/:id", async (req, res) => {
  try {
    const { name, client, description, deadline } = req.body;
    if (!name || !client || !description || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        client,
        description,
        deadline: new Date(deadline), // Chuyển từ YYYY-MM-DD
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      ...updatedProject._doc,
      deadline: updatedProject.deadline.toISOString().split("T")[0], // YYYY-MM-DD
      createdAt: updatedProject.createdAt.toISOString().split("T")[0], // YYYY-MM-DD
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API xóa dự án
app.delete("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));