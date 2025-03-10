import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/projects";

function App() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
    client: "",
    description: "",
    deadline: "",
    createdAt: new Date().toISOString().split("T")[0],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(API_URL);
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { name, client, description, deadline } = form;
        await axios.put(`${API_URL}/${editingId}`, {
          name,
          client,
          description,
          deadline,
        });
        setEditingId(null);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({
        name: "",
        client: "",
        description: "",
        deadline: "",
        createdAt: new Date().toISOString().split("T")[0],
      });
      fetchProjects();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      client: project.client,
      description: project.description,
      deadline: project.deadline, // YYYY-MM-DD
      createdAt: project.createdAt, // YYYY-MM-DD
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // Hàm định dạng ngày thành DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string" || isNaN(Date.parse(dateString))) {
      return "N/A"; // Hoặc giá trị mặc định khác
    }
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="container">
      <h1>Quản lý Dự án</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Tên Dự án"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="client"
          placeholder="Tên Khách Hàng"
          value={form.client}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Mô Tả"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="createdAt"
          value={form.createdAt}
          onChange={handleChange}
          disabled
        />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm Dự án"}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Tên Dự án</th>
            <th>Khách Hàng</th>
            <th>Mô Tả</th>
            <th>Hạn Chót</th>
            <th>Ngày Tạo</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>{project.client}</td>
              <td>{project.description}</td>
              <td>{formatDate(project.deadline)}</td>
              <td>{formatDate(project.createdAt)}</td>
              <td>
                <button onClick={() => handleEdit(project)}>Sửa</button>
                <button onClick={() => handleDelete(project._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;