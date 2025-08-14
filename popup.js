document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("new-task");
  const addTaskButton = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");
  const dateTimeElement = document.getElementById("date-time");

  // Function to update the date and time dynamically
  const updateDateTime = () => {
    const now = new Date();
    const formattedDateTime = now.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    dateTimeElement.textContent = formattedDateTime;
  };

  // Update the date and time every second
  setInterval(updateDateTime, 1000);
  updateDateTime(); // Initialize the date and time on load

  // Load tasks from chrome.storage
  const loadTasks = () => {
    chrome.storage.local.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      taskList.innerHTML = ""; // Clear the task list
      tasks.forEach((task, index) => addTaskToDOM(task, index));
    });
  };

  // Save tasks to chrome.storage
  const saveTasks = (tasks) => {
    chrome.storage.local.set({ tasks }, () => {
      loadTasks(); // Reload tasks after saving
    });
  };

  // Function to auto-resize a textarea
  const autoResize = (textarea) => {
    textarea.style.height = "auto"; // Reset height to calculate new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
  };

  // Add task to DOM with auto-resizing functionality
  const addTaskToDOM = (task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Create the textarea
    const textarea = document.createElement("textarea");
    textarea.value = task.text;
    textarea.className = "task-text";
    textarea.style.textDecoration = task.done ? "line-through" : "none";

    // Auto-resize on input and initialize height
    textarea.addEventListener("input", () => autoResize(textarea));
    autoResize(textarea); // Initialize height for preloaded content

    // Save changes on blur
    textarea.addEventListener("blur", () => {
      updateTask(index, textarea.value.trim());
    });

    // Create buttons
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const doneButton = document.createElement("button");
    doneButton.textContent = task.done ? "Undone" : "Done";
    doneButton.className = "task-action done-task";
    doneButton.addEventListener("click", () => {
      toggleTaskDone(index);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "task-action delete-task";
    deleteButton.addEventListener("click", () => {
      removeTask(index);
    });

    actions.appendChild(doneButton);
    actions.appendChild(deleteButton);

    li.appendChild(textarea);
    li.appendChild(actions);
    taskList.appendChild(li);
  };

  // Add a new task
  const addTask = () => {
    const taskText = taskInput.value.trim(); // Remove extra spaces
    if (!taskText) return; // Prevent adding empty tasks

    chrome.storage.local.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      tasks.push({ text: taskText, done: false });
      saveTasks(tasks); // Save and reload tasks
    });

    taskInput.value = ""; // Clear input field
  };

  // Remove a task
  const removeTask = (index) => {
    chrome.storage.local.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      tasks.splice(index, 1);
      saveTasks(tasks); // Save and reload tasks
    });
  };

  // Toggle task done/undone
  const toggleTaskDone = (index) => {
    chrome.storage.local.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      tasks[index].done = !tasks[index].done;
      saveTasks(tasks); // Save and reload tasks
    });
  };

  // Update a task
  const updateTask = (index, updatedText) => {
    chrome.storage.local.get(["tasks"], (result) => {
      const tasks = result.tasks || [];
      tasks[index].text = updatedText;
      saveTasks(tasks); // Save and reload tasks
    });
  };

  // Event listeners
  addTaskButton.addEventListener("click", addTask);

  // Load tasks on startup
  loadTasks();
});
