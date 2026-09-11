const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const emptyMessage = document.querySelector(".empty-message");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const remainingTasks = document.getElementById("remaining-tasks");
const clearAllButton = document.getElementById("clear-all-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search-input");

// Events
addTaskButton.addEventListener("click", addTask);
clearAllButton.addEventListener("click", clearAllTasks);
searchInput.addEventListener("input", searchTasks);

filterButtons.forEach(function(button) {
    button.addEventListener("click", filterTasks);
});

// Add Task Function
function addTask() {

    const task = taskInput.value.trim();

    if (task === "") {
        return;
    }

    // Create list item
    const li = document.createElement("li");

    // Create task text
    const span = document.createElement("span");
    span.textContent = task;
    li.appendChild(span);

    // Create Complete Button
    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.classList.add("complete-btn");
    completeButton.addEventListener("click", completeTask);
    li.appendChild(completeButton);

    // Create Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", deleteTask);
    li.appendChild(deleteButton);
    // cretate edit Button
   const editButton = document.createElement("button");
   editButton.textContent = "Edit";
   editButton.classList.add("edit-btn");
   editButton.addEventListener("click", editTask);
   li.appendChild(editButton);

    // Add task to list
    taskList.appendChild(li);

    // Clear input
    taskInput.value = "";

    checkEmptyList();
    updateCounters();
    saveTasks();
    applyView();
}

// Complete Task Function
function completeTask(event) {
const button = event.target;
const li = button.parentElement;
const span = li.querySelector("span");

    // Add completed class
span.classList.add("completed");
// Change button text
    button.textContent = "Completed";
    // Disable button
    button.disabled = true;
    updateCounters();
    saveTasks();
    applyView();
}

// Delete Task Function
function deleteTask(event) {
const button = event.target;
const li = button.parentElement;
li.remove();
checkEmptyList();
  updateCounters();
  saveTasks();
  applyView();
}
// Clear All Tasks Function
function clearAllTasks() {
 taskList.innerHTML = "";
 checkEmptyList();
updateCounters();
saveTasks();
applyView();
}
// edit tasks function
function editTask(event) {

    const button = event.target;
    const li = button.parentElement;
    const span = li.querySelector("span");

    const newTask = prompt("Edit Task", span.textContent);

    if (newTask !== null && newTask.trim() !== "") {

        span.textContent = newTask.trim();

        saveTasks();
        applyView();
    }
}
// Check Empty List Function
function checkEmptyList() {

    if (taskList.children.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}

// Update Counter Function
function updateCounters() {
 const total = taskList.children.length;
 totalTasks.textContent = total;
    let completed = 0;
    for (let i = 0; i < taskList.children.length; i++) {
        const li = taskList.children[i];
        const span = li.querySelector("span");
        if (span.classList.contains("completed")) {
         completed++;
        }
    }
    completedTasks.textContent = completed;
    remainingTasks.textContent = total - completed;
}
 // filter task function
  
 let currentFilter = "all";

function filterTasks(event){
    currentFilter = event.target.dataset.filter;
    filterButtons.forEach(function(button) {
    button.classList.remove("active");
});
event.target.classList.add("active");
applyView();
}

function searchTasks() {
    applyView();
}

//apply View

function applyView() {
    const searchText = searchInput.value.toLowerCase();
    const tasks = taskList.children;
    for(let i = 0; i < tasks.length; i++){
        const task = tasks[i];
        const span = task.querySelector("span");

        const taskText = span.textContent.toLowerCase();
        const isCompleted = span.classList.contains("completed");

        const matchesSearch = taskText.includes(searchText);

        let matchesFilter = false;
    
        if (currentFilter === "all") {
    matchesFilter = true;
} else if (currentFilter === "pending") {
    matchesFilter = !isCompleted;
} else if (currentFilter === "completed") {
    matchesFilter = isCompleted;
}
        if (matchesSearch && matchesFilter){
            task.style.display = "flex";
        }else{
            task.style.display = "none";
        }
    }
}


taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});
//LOCAL STORAGE

function saveTasks() {
    const tasks = [];
    for (let i = 0; i < taskList.children.length; i++) {
const li = taskList.children[i];
const span = li.querySelector("span");
const isCompleted = span.classList.contains("completed");
const task = {
    text: span.textContent,
    completed: isCompleted
};
tasks.push(task);
}
localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    for (let i = 0; i < tasks.length; i++) {

        const task = tasks[i];

        // Create list item
        const li = document.createElement("li");

        // Create task text
        const span = document.createElement("span");
        span.textContent = task.text;
        li.appendChild(span);

        // Create Complete button
        const completeButton = document.createElement("button");
        completeButton.textContent = "Complete";
        completeButton.classList.add("complete-btn");
        completeButton.addEventListener("click", completeTask);
        li.appendChild(completeButton);

        // Create Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", deleteTask);
        li.appendChild(deleteButton);

        // Create Edit Button
const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.classList.add("edit-btn");
editButton.addEventListener("click", editTask);
li.appendChild(editButton);

        // Restore completed task
        if (task.completed) {
            span.classList.add("completed");
            completeButton.textContent = "Completed";
            completeButton.disabled = true;
        }

        // Add task to the list
        taskList.appendChild(li);
    }

    checkEmptyList();
    updateCounters();
    applyView();
}

loadTasks();