// import _ from 'lodash';
/* eslint-disable no-unused-vars */
import './style.css';

// Get references to the HTML elements
const toDoList = document.getElementById('tdl-lists');
const addNewListForm = document.getElementById('tdl-add');
const addNewListInput = document.getElementById('tdl-add-input');
const clearTaskBtn = document.getElementById('clear-btn');

// Define the key for local storage
const LOCAL_STORAGE_TASK_KEY = 'task.tasks';

// Retrieve tasks from local storage or create an empty array if no tasks are stored
let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASK_KEY)) || [];

// Function to render the tasks list
function renderTasks() {
  toDoList.innerHTML = '';

  tasks.forEach((task) => {
    const listItem = document.createElement('div');
    listItem.classList.add('tdl-item');

    const checkbox = document.createElement('input');
    checkbox.classList.add('check-box');
    checkbox.type = 'checkbox';
    checkbox.index = task.index;
    checkbox.checked = task.completed;

    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;

      // Re-render the tasks to apply the strike-through style for completed tasks
      renderTasks();
    });

    const description = document.createElement('span');
    description.textContent = task.description;

    // Check if the task is completed and apply the style with strike-through if true
    if (task.completed) {
      description.style.textDecoration = 'line-through';
    } else {
      description.style.textDecoration = 'none';
    }

    const optionIcon = document.createElement('span');
    optionIcon.innerHTML = '<button><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>';
    optionIcon.classList.add('option-icon');

    listItem.appendChild(checkbox);
    listItem.appendChild(description);
    listItem.appendChild(optionIcon);
    toDoList.appendChild(listItem);
  });
}

// Function to save the tasks to local storage
function save() {
  localStorage.setItem(LOCAL_STORAGE_TASK_KEY, JSON.stringify(tasks));
}

function saveAndRender() {
  save();
  renderTasks();
}

// Update the indexes of remaining tasks after a task is deleted
function updateIndexes() {
  tasks.forEach((task, index) => {
    task.index = index + 1;
  });
}

// Add event listener to the "Clear all completed" button
clearTaskBtn.addEventListener('click', (e) => {
  tasks = tasks.filter((task) => !task.completed); // Remove completed tasks from the tasks array
  updateIndexes(); // Update the indexes of remaining tasks
  saveAndRender();
});

// Function to create a new task object
function addTask(description) {
  return {
    description,
    completed: false,

    // Set the index based on the current length of the tasks array
    index: tasks.length + 1,
  };
}

// Add event listener to the form for adding a new task
addNewListForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = addNewListInput.value;
  if (description == null || description === '') return;

  // Create a new task object and add it to the tasks array
  const task = addTask(description);
  addNewListInput.value = null;
  tasks.push(task);

  // Save and render the updated tasks list
  saveAndRender();
});

// Event listener to render the tasks list when the page is loaded
document.addEventListener('DOMContentLoaded', saveAndRender);
