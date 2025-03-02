import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/projects";

function App() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", client: "", description: "", deadline: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get(API_URL);
    setProjects(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ name: "", client: "", description: "", deadline: "" });
    fetchProjects();
  };

  const handleEdit = (project) => {
    setForm(project);
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchProjects();
  };

  return (
    <div className="container">
      <h1>Quản lý Dự án</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Tên Dự án" value={form.name} onChange={handleChange} required />
        <input type="text" name="client" placeholder="Tên Khách Hàng" value={form.client} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Mô Tả" value={form.description} onChange={handleChange} required />
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm Dự án"}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Tên Dự án</th>
            <th>Khách Hàng</th>
            <th>Mô Tả</th>
            <th>Hạn Chót</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>{project.client}</td>
              <td>{project.description}</td>
              <td>{project.deadline}</td>
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
