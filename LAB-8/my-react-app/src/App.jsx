import React, { useState, useEffect } from "react";

/**
 * App.jsx
 * - To-Do app using React hooks
 * - Features: add, edit, delete, toggle complete, filter, import/export JSON, persist to localStorage
 * - Drop into src/App.jsx in a Create React App or Vite React project with Tailwind configured
 */

export default function App() {
  const STORAGE_KEY = "todo_tasks_v1";

  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to parse tasks from localStorage", e);
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask = {
      id: Date.now() + Math.random().toString(36).slice(2, 9),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((t) => [newTask, ...t]);
    setTitle("");
  };

  const removeTask = (id) => {
    setTasks((t) => t.filter((x) => x.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)));
  };

  const startEdit = (id) => {
    setEditingId(id);
  };

  const saveEdit = (id, newTitle) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, title: trimmed } : x)));
    setEditingId(null);
  };

  const clearCompleted = () => {
    setTasks((t) => t.filter((x) => !x.completed));
  };

  const clearAll = () => {
    if (confirm("Clear all tasks? This cannot be undone.")) setTasks([]);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!Array.isArray(imported)) throw new Error("Invalid format: expected array");
        const normalized = imported.map((it) => ({
          id: it.id || Date.now() + Math.random().toString(36).slice(2, 9),
          title: String(it.title || "Untitled Task"),
          completed: Boolean(it.completed),
          createdAt: it.createdAt || new Date().toISOString(),
        }));
        setTasks(normalized);
      } catch (err) {
        alert("Failed to import JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">To-Do List</h1>
          <div className="text-sm text-gray-500">
            Tasks: <span className="font-medium">{tasks.length}</span>
          </div>
        </header>

        <form onSubmit={addTask} className="flex gap-2 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Add a new task..."
            aria-label="New task title"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-60"
            disabled={!title.trim()}
          >
            Add
          </button>
        </form>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded ${filter === "active" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded bg-red-100 text-red-700" onClick={clearCompleted}>
              Clear Completed
            </button>
            <button className="px-3 py-1 rounded bg-gray-100" onClick={clearAll}>
              Clear All
            </button>

            <label className="cursor-pointer px-3 py-1 bg-gray-100 rounded">
              Import
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => importJSON(e.target.files?.[0])}
              />
            </label>

            <button className="px-3 py-1 rounded bg-gray-100" onClick={exportJSON}>
              Export
            </button>
          </div>
        </div>

        <section>
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm">Add your first task using the input above.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="w-5 h-5"
                      aria-label={`Mark ${task.title} completed`}
                    />

                    {editingId === task.id ? (
                      <InlineEditor
                        initial={task.title}
                        onCancel={() => setEditingId(null)}
                        onSave={(val) => saveEdit(task.id, val)}
                      />
                    ) : (
                      <div>
                        <div className={`text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-sm bg-gray-100 rounded" onClick={() => startEdit(task.id)}>
                      Edit
                    </button>
                    <button className="px-2 py-1 text-sm bg-red-50 text-red-600 rounded" onClick={() => removeTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="mt-6 text-sm text-gray-500">
          <p>Tip: tasks persist in localStorage; export to save externally.</p>
        </footer>
      </div>
    </div>
  );
}

/** InlineEditor component (declared in same file) **/
function InlineEditor({ initial, onSave, onCancel }) {
  const [val, setVal] = useState(initial);
  return (
    <div className="flex items-center gap-2">
      <input value={val} onChange={(e) => setVal(e.target.value)} className="border px-2 py-1 rounded" />
      <button className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded" onClick={() => onSave(val)}>
        Save
      </button>
      <button className="px-2 py-1 text-sm bg-gray-100 rounded" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
