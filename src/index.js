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

function editTask(index) {
  const listItem = toDoList.children[index - 1];
  const description = listItem.querySelector('span');
  const optionIcon = listItem.querySelector('.option-icon');

  // Make the task description editable
  const textBox = document.createElement('input');
  textBox.classList.add('txt-box');
  textBox.type = 'text';
  textBox.value = description.textContent;

  // Style the input box to remove the outline (border) on focus
  textBox.style.outline = 'none';

  // Replace the description with the editable text box
  listItem.replaceChild(textBox, description);

  // Show the trash can icon
  optionIcon.innerHTML = '<button><i class="fa fa-trash-can" aria-hidden="true"></i></button>';

  // Add event listener to save the edited task on pressing Enter
  textBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const newDescription = textBox.value;
      editTaskDescription(index, newDescription);
    }
  });

  // Add event listener to save the edited task when focus is lost from the text box
  textBox.addEventListener('blur', () => {
    const newDescription = textBox.value;
    editTaskDescription(index, newDescription);
  });

  // Show the trash can icon and add event listener to it for removing the task
  const trashIcon = document.createElement('i');
  trashIcon.classList.add('fa', 'fa-trash-can');
  optionIcon.innerHTML = '';
  optionIcon.appendChild(trashIcon);
  trashIcon.addEventListener('click', () => {
    removeTask(index);
  });
}

function editTaskDescription(index, newDescription) {
  const task = tasks.find((task) => task.index === index);
  if (task) {
    task.description = newDescription;
    saveAndRender();
    // Get the listItem and optionIcon elements
    const listItem = toDoList.children[index - 1];
    const optionIcon = listItem.querySelector('.option-icon');

    // Set the optionIcon HTML back to the option icon
    optionIcon.innerHTML = '<button><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>';
  }
}

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

    // Add event listener to the task description for editing
    listItem.addEventListener('dblclick', () => {
      editTask(task.index); // Call editTask function when the listItem is clicked
    });

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

// function to remove individual task
function removeTask(index) {
  tasks = tasks.filter((task) => task.index !== index); // Remove the task with the specified index
  updateIndexes(); // Update the indexes of remaining tasks
  saveAndRender();
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
