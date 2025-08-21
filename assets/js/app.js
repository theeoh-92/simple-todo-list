const tasks = {
  incomplete: [],
  complete: [],
  totalIncompleteTasks: 0,
  totalCompleteTasks: 0,
};

const body = document.querySelector("body");
const incompleteTasksCount = document.querySelector("#incomplete-tasks-count");
const completeTasksCount = document.querySelector("#complete-tasks-count");
const taskCreator = document.querySelector("#task-creator");
const taskDescriptionInput = document.querySelector("#task-description");
const taskCategorySelect = document.querySelector("#task-category-select");
const taskDueDatePicker = document.querySelector("#task-due-date");

body.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.dataset.role === undefined) return;

  switch (clickEvent.target.dataset.role) {
    case "open-task-creator":
      console.log("open task creator button clicked");
      openTaskCreator();
      break;
    case "close-task-creator":
      console.log("close task creator button clicked");
      closeTaskCreator();
      break;
    case "create-task":
      console.log("create task button clicked");
      if (validateTask()) {
        createTask();
      }
      break;
    default:
      break;
  }
});

function populateTaskCounters() {
  console.log("populating task counters");
  incompleteTasksCount.textContent = tasks.totalIncompleteTasks;
  completeTasksCount.textContent = tasks.totalCompleteTasks;
}
function openTaskCreator() {
  taskCreator.setAttribute("open", "");
}
function closeTaskCreator() {
  taskCreator.removeAttribute("open");
}
function validateTask() {
  let valid = true;

  const description = taskDescriptionInput.value.trim();
  if (!description) {
    console.log("task invalid");
    valid = false;
    taskDescriptionInput.setAttribute("aria-invalid", "true");
    return valid;
  }

  console.log("task valid");
  taskDescriptionInput.removeAttribute("aria-invalid");
  return valid;
}
function createTask() {
  const description = taskDescriptionInput.value.trim();
  const category = taskCategorySelect.value;
  const dueDate = taskDueDatePicker.value;

  tasks.incomplete.push({
    description,
    category,
    dueDate,
    finished: false,
    createdOn: new Date().toISOString(),
    finishedOn: null,
  });
  tasks.totalIncompleteTasks++;

  updateUI();
  closeTaskCreator();
}
function updateUI() {
  populateTaskCounters();
}

(() => {
  populateTaskCounters();
})();
