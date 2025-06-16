const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const addBtn = document.getElementById("add-btn");

let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach(task => renderTask(task));
  }
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function renderTask(task) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  const taskInfo = document.createElement("div");
  taskInfo.className = "task-info";

  const span = document.createElement("span");
  span.textContent = task.text;
  span.className = "task-text";
  span.onclick = () => {
    li.classList.toggle("completed");
    task.completed = !task.completed;
    saveTasks();
  };

  const time = document.createElement("small");
  time.textContent = `🕒 ${formatDateTime(task.createdAt)}`;
  time.className = "timestamp";

  taskInfo.append(span, time);

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.onclick = () => {
    const updated = prompt("Edit task:", task.text);
    if (updated !== null && updated.trim() !== "") {
      task.text = updated.trim();
      span.textContent = task.text;
      saveTasks();
    }
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.onclick = () => {
    li.remove();
    tasks = tasks.filter(t => t !== task);
    saveTasks();
  };

  li.append(taskInfo, editBtn, delBtn);
  list.appendChild(li);
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  const newTask = {
    text,
    createdAt: new Date().toISOString(),
    completed: false
  };

  tasks.push(newTask);
  renderTask(newTask);
  saveTasks();
  input.value = "";
}

addBtn.onclick = addTask;
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

window.onload = loadTasks;

//Dark Mode
const toggleBtn = document.getElementById("toggle-theme");
const body = document.body;

function applyTheme(theme) {
  body.classList.toggle("dark", theme === "dark");
  toggleBtn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", theme);
}

toggleBtn.addEventListener("click", () => {
  const isDark = body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
});

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
});

