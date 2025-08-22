const tasks = {
  incomplete: [],
  incompleteCount: 0,
};

const body = document.querySelector("body");
const incompleteCount = document.getElementById("incomplete-count");
const incompleteEmptyMessage = document.getElementById("incomplete-empty");
const incompleteTasksList = document.getElementById("incomplete-tasks");
const taskCreator = document.getElementById("task-creator");
const taskDescription = document.getElementById("task-description");
const taskCategory = document.getElementById("task-category");
const taskDueDate = document.getElementById("task-due-date");

body.addEventListener("click", (clickEvent) => {
  switch (clickEvent.target.dataset.role) {
    case "open-task-creator":
      openTaskCreator();
      break;
    case "close-task-creator":
      closeTaskCreator();
      break;
    case "create-task":
      if (validateTask()) {
        createTask();
      }
  }
});

function populateTaskCounters() {
  console.log(
    `populating task counters | incomplete: ${tasks.incompleteCount}`
  );
  incompleteCount.textContent = tasks.incompleteCount;
}

function openTaskCreator() {
  console.log("opening task creator");
  taskCreator.setAttribute("open", "");
}
function closeTaskCreator() {
  console.log("closing task creator and clearing inputs");
  taskDescription.removeAttribute("aria-invalid");
  taskDescription.value = "";
  taskCategory.value = "";
  taskDueDate.value = "";
  taskCreator.removeAttribute("open");
}

// validation helper function
function isDescriptionValid(description) {
  const trimmedDescription = description.trim();
  return trimmedDescription.length > 0;
}
// real time validation
taskDescription.addEventListener("input", () => {
  const isValid = isDescriptionValid(taskDescription.value);
  taskDescription.setAttribute("aria-invalid", (!isValid).toString());
});
// submit time validation
function validateTask() {
  const validTask = true;

  console.log("validating task details");

  if (!isDescriptionValid(taskDescription.value)) {
    console.error("task description is missing");
    taskDescription.setAttribute("aria-invalid", "true");
    return !validTask;
  }

  return validTask;
}

function createTask() {
  console.log("creating task");

  const newTask = {
    description: taskDescription.value,
    category: taskCategory.value,
    dueDate: taskDueDate.value,
    finished: false,
    createdOn: new Date(),
    deletedOn: null,
  };

  tasks.incomplete.push(newTask);
  tasks.incompleteCount++;

  renderUI();
  closeTaskCreator();
}

function populateIncompleteTasks() {
  if (tasks.incompleteCount === 0) {
    console.log("rendering empty message for incomplete tasks list");
    incompleteEmptyMessage.style.display = "block";
    incompleteTasksList.style.display = "none";
  } else {
    console.log("rendering incomplete tasks list");
    incompleteTasksList.style.display = "block";
    incompleteEmptyMessage.style.display = "none";

    let htmlString = "";
    tasks.incomplete.forEach((task) => {
      htmlString += `
      <li class="list-item">
        <div class="task">
          <input type="radio" name="" id="" />
          <div class="task-data">
            <h3 class="task-description">${task.description}</h3>
            <div class="task-metadata">
              <span class="category">${task.category}</span>
              <span>Due on ${task.dueDate}</span>
            </div>
          </div>
        </div>
      </li>
      `;
    });

    incompleteTasksList.innerHTML = htmlString;
  }
}

function renderUI() {
  populateTaskCounters();
  populateIncompleteTasks();
}

(() => {
  renderUI();
})();
