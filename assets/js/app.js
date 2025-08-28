const tasks = {
  incomplete: [],
  completed: [],
  nextId: 1,
};

const body = document.querySelector("body");
const taskCreator = document.getElementById("task-creator");
const taskDescriptionInput = document.getElementById("task-description");
const incompleteList = document.getElementById("incomplete-list");

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
      id: `T-${tasks.nextId++}`, // use current ID then increment
      description: taskDescriptionInput.value,
      completed: false,
      createdOn: new Date(),
      completedOn: null,
    };

    tasks.incomplete.push(newTask);

    incompleteList.innerHTML += `
      <li class="list-item" data-task-id="${newTask.id}">
        <div class="task">
          <input type="checkbox" class="task-checkbox" data-task-id="${newTask.id}" />
          <div class="task-details">
            <p class="task-description">${newTask.description}</p>
            <button class="delete-task-button" data-role="delete-task">
              <ion-icon name="trash-outline" data-role="delete-task"></ion-icon>
            </button>
          </div>
        </div>
      </li>
    `;

    console.log("task validated and created successfully:", newTask);
    closeTaskCreator();
  } else {
    console.log("task validation failed");
  }
}

function handleTaskCompletion(checkbox) {
  const taskId = checkbox.dataset.taskId;
  const taskElement = checkbox.closest(".list-item");

  // find task in app data
  const taskIndex = tasks.incomplete.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    const completedTask = tasks.incomplete[taskIndex];
    // update app data
    completedTask.completed = true;
    completedTask.completedOn = new Date();

    // move from incomplete to complete
    tasks.incomplete.splice(taskIndex, 1);
    tasks.completed.push(completedTask);

    taskElement.remove(); // remove task from DOM

    console.log("task completed:", completedTask);
  }
}

function handleTaskDeletion(deleteButton) {
  const taskId = deleteButton.closest(".list-item").dataset.taskId;
  const taskElement = deleteButton.closest(".list-item");

  // find task in app data
  const taskIndex = tasks.incomplete.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    const deletedTask = tasks.incomplete.splice(taskIndex, 1)[0];
    taskElement.remove();

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
}
