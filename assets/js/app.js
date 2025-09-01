const tasks = {
  incomplete: [],
  completed: [],
};

const body = document.querySelector("body");
const taskCreator = document.getElementById("task-creator");
const taskDescriptionInput = document.getElementById("task-description");
const incompleteList = document.getElementById("incomplete-list");
const taskCategoryInput = document.getElementById("task-category");
const taskDueDateInput = document.getElementById("task-due-date");
const taskForm = document.getElementById("task-form");

loadTasksFromStorage();
renderTasks();

body.addEventListener("click", (clickEvent) => {
  const openButton = clickEvent.target.closest(
    '[data-role="open-task-creator"]'
  );
  const closeButton = clickEvent.target.closest(
    '[data-role="close-task-creator"]'
  );
  const createButton = clickEvent.target.closest('[data-role="create-task"]');
  const completeButton = clickEvent.target.closest(
    '[data-role="complete-task"]'
  );
  const deleteButton = clickEvent.target.closest('[data-role="delete-task"]');

  if (openButton) {
    openTaskCreator();
  } else if (closeButton) {
    closeTaskCreator();
  } else if (createButton) {
    createTask();
  } else if (completeButton) {
    handleTaskCompletion(completeButton);
  } else if (deleteButton) {
    handleTaskDeletion(deleteButton);
  }
});

// allows user to press enter on KB devices
taskForm.addEventListener("submit", (submitEvent) => {
  submitEvent.preventDefault();
  createTask();
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
      description: sanitizeInput(taskDescriptionInput.value.trim()),
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
  return taskDescription.length > 0 && taskDescription.length <= 40;
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
    ? `<span class="badge badge-${getCategoryBadgeColor(
        task.category
      )}">${sanitizeInput(task.category)}</span>`
    : "";

  const dueDateHTML = task.dueDate
    ? `<small class="task-due">Due ${sanitizeInput(task.dueDate)}</small>`
    : "";

  const taskDetailsDiv = dueDateHTML
    ? `<div>
         <div class="task-details">
           <p class="task-description">${sanitizeInput(task.description)}</p>
           ${categoryHTML}
         </div>
         ${dueDateHTML}
       </div>`
    : `<div class="task-details">
         <p class="task-description">${sanitizeInput(task.description)}</p>
         ${categoryHTML}
       </div>`;

  return `
    <li class="list-item" data-task-id="${task.id}">
      <div class="task">
        <input
          type="checkbox"
          class="task-checkbox"
          data-role="complete-task"
          data-task-id="${task.id}"
        />
        <div class="task-content">
          ${taskDetailsDiv}
          <button class="delete-task-button" data-role="delete-task">
            <ion-icon name="trash-outline"></ion-icon>
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
    console.log("tasks loaded from storage");
  }
}

function renderTasks() {
  if (tasks.incomplete.length === 0) {
    incompleteList.innerHTML = createEmptyStateHTML();
    console.log("empty state rendered");
  } else {
    incompleteList.innerHTML = tasks.incomplete
      .map((task) => createTaskHTML(task))
      .join("");
    console.log("tasks rendered");
  }
}

function sanitizeInput(input) {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = input; // set text content to escape HTML
  return tempDiv.innerHTML;
}

function createEmptyStateHTML() {
  return `
    <figure class="empty-state">
      <p>No tasks yet!</p>
      <figcaption>Click the <mark>+</mark> button to create a task</figcaption>
    </figure>
  `;
}
