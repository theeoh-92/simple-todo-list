const tasks = {
  incomplete: [],
  completed: [],
  nextId: 1,
};

const body = document.querySelector("body");
const taskCreator = document.getElementById("task-creator");
const taskDescriptionInput = document.getElementById("task-description");
const incompleteList = document.getElementById("incomplete-list");
const taskCategoryInput = document.getElementById("task-category");
const taskDueDateInput = document.getElementById("task-due-date");

loadTasksFromStorage();
renderTasks();

body.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.dataset.role === "open-task-creator") {
    openTaskCreator();
  } else if (clickEvent.target.dataset.role === "close-task-creator") {
    closeTaskCreator();
  } else if (clickEvent.target.dataset.role === "create-task") {
    createTask();
  } else if (clickEvent.target.classList.contains("task-checkbox")) {
    handleTaskCompletion(clickEvent.target);
  } else if (clickEvent.target.dataset.role === "delete-task") {
    handleTaskDeletion(clickEvent.target);
  }
});

taskDescriptionInput.addEventListener("input", () => {
  const isValid = validateTask();
  updateValidationState(isValid);
});

/**
 * FUNCTIONS
 */

function openTaskCreator() {
  console.log("task creator opened");
  taskCreator.setAttribute("open", "");
}

function closeTaskCreator() {
  console.log("task creator closed");
  clearInputs();
  removeValidationState();
  taskCreator.removeAttribute("open");
}

function createTask() {
  const isValid = validateTask();
  updateValidationState(isValid);

  if (isValid) {
    const newTask = {
      id: crypto.randomUUID(),
      description: taskDescriptionInput.value,
      category: taskCategoryInput.value || null,
      dueDate: taskDueDateInput.value || null,
      completed: false,
      createdOn: new Date(),
      completedOn: null,
    };

    tasks.incomplete.push(newTask);
    saveTasksToStorage();
    renderTasks();

    console.log("task validated and created successfully:", newTask);
    closeTaskCreator();
  } else {
    console.log("task validation failed");
  }
}

function handleTaskCompletion(checkbox) {
  const taskId = checkbox.dataset.taskId;

  // find task in app data
  const taskIndex = tasks.incomplete.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    const completedTask = tasks.incomplete[taskIndex];
    // update app data
    completedTask.completed = true;
    completedTask.completedOn = new Date();

    // remove from incomplete and push to complete
    tasks.incomplete.splice(taskIndex, 1);
    tasks.completed.push(completedTask);
    saveTasksToStorage();
    renderTasks();

    console.log("task completed:", completedTask);
  }
}

function handleTaskDeletion(deleteButton) {
  const taskId = deleteButton.closest(".list-item").dataset.taskId;

  // find task in app data
  const taskIndex = tasks.incomplete.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    const deletedTask = tasks.incomplete.splice(taskIndex, 1)[0];
    saveTasksToStorage();
    renderTasks();

    console.log("task deleted:", deletedTask);
  }
}

/**
 * HELPER FUNCTIONS
 */

function validateTask() {
  const taskDescription = taskDescriptionInput.value.trim();
  return taskDescription.length > 0;
}

function updateValidationState(isValid) {
  if (isValid) {
    taskDescriptionInput.setAttribute("aria-invalid", "false");
  } else {
    taskDescriptionInput.setAttribute("aria-invalid", "true");
  }
}

function removeValidationState() {
  taskDescriptionInput.removeAttribute("aria-invalid");
}

function clearInputs() {
  taskDescriptionInput.value = "";
  taskCategoryInput.value = "";
  taskDueDateInput.value = "";
}

function createTaskHTML(task) {
  const categoryHTML = task.category
    ? `<span class="badge badge-${getCategoryBadgeColor(task.category)}">${
        task.category
      }</span>`
    : "";

  const dueDateHTML = task.dueDate
    ? `<small class="task-due">Due ${task.dueDate}</small>`
    : "";

  const taskDetailsDiv = dueDateHTML
    ? `<div>
         <div class="task-details">
           <p class="task-description">${task.description}</p>
           ${categoryHTML}
         </div>
         ${dueDateHTML}
       </div>`
    : `<div class="task-details">
         <p class="task-description">${task.description}</p>
         ${categoryHTML}
       </div>`;

  return `
    <li class="list-item" data-task-id="${task.id}">
      <div class="task">
        <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" />
        <div class="task-content">
          ${taskDetailsDiv}
          <button class="delete-task-button" data-role="delete-task">
            <ion-icon name="trash-outline" data-role="delete-task"></ion-icon>
          </button>
        </div>
      </div>
    </li>
  `;
}

function getCategoryBadgeColor(category) {
  const colorMap = {
    Home: "lavender",
    Personal: "rose",
    Life: "mint",
    Social: "peach",
    Professional: "sky",
    Hobby: "sand",
    Errand: "amber",
    Planning: "sage",
  };

  return colorMap[category] || "sand"; // default to sand if category 404
}

function saveTasksToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log("tasks saved to storage");
}

function loadTasksFromStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    const parsedTasks = JSON.parse(storedTasks);
    tasks.incomplete = parsedTasks.incomplete;
    tasks.completed = parsedTasks.completed;
    tasks.nextId = parsedTasks.nextId;
    console.log("tasks loaded from storage");
  }
}

function renderTasks() {
  incompleteList.innerHTML = tasks.incomplete
    .map((task) => createTaskHTML(task))
    .join("");

  console.log("tasks rendered");
}
