document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("new-task");
  const addTaskButton = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");

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

  // Add task to DOM
  const addTaskToDOM = (task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    // Task text (textarea element)
    const textarea = document.createElement("textarea");
    textarea.value = task.text;
    textarea.className = "task-text";
    textarea.style.textDecoration = task.done ? "line-through" : "none"; // Strike-through if done

    // Save changes on blur
    textarea.addEventListener("blur", () => {
      updateTask(index, textarea.value.trim());
    });

    // Buttons container
    const actions = document.createElement("div");
    actions.className = "task-actions";

    // Done/Undo button
    const doneButton = document.createElement("button");
    doneButton.textContent = task.done ? "Undo" : "Done";
    doneButton.className = "task-action done-task";
    doneButton.addEventListener("click", () => {
      toggleTaskDone(index);
    });

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "task-action edit-task";
    editButton.addEventListener("click", () => {
      textarea.focus();
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "task-action delete-task";
    deleteButton.addEventListener("click", () => {
      removeTask(index);
    });

    actions.appendChild(doneButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(textarea); // Add task text
    li.appendChild(actions); // Add action buttons
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
