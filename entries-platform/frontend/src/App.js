import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://entries-platform-1.onrender.com";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchEntries = async () => {
    const params = {};
    if (filterCategory) params.category = filterCategory;
    if (search) params.q = search;

    const res = await axios.get(API_URL, { params });
    setEntries(res.data);
  };

  useEffect(() => {
    fetchEntries();
  }, [filterCategory, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, {
      title,
      description,
      category,
      tags: tags.split(",").map((t) => t.trim()),
    });
    setTitle("");
    setDescription("");
    setCategory("");
    setTags("");
    fetchEntries();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Καταχωρήσεις</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Τίτλος"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Περιγραφή"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Κατηγορία"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Tags (χωρισμένα με κόμμα)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 w-full"
        />
        <button className="bg-blue-500 text-white p-2 rounded">Προσθήκη</button>
      </form>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Αναζήτηση"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1"
        />
        <input
          type="text"
          placeholder="Φίλτρο Κατηγορίας"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 flex-1"
        />
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry._id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-xl">{entry.title}</h2>
            <p>{entry.description}</p>
            <p className="text-sm text-gray-600">Κατηγορία: {entry.category}</p>
            <p className="text-sm text-gray-600">Tags: {entry.tags.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
