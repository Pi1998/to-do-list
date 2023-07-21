// import _ from 'lodash';
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
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

// Update the indexes of remaining tasks after a task is deleted
function updateIndexes() {
  tasks.forEach((task, index) => {
    task.index = index + 1;
  });
}

// Function to save the tasks to local storage
function save() {
  localStorage.setItem(LOCAL_STORAGE_TASK_KEY, JSON.stringify(tasks));
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
    // checkbox.checked = task.completed;

    // checkbox.addEventListener('change', () => {
    //   task.completed = checkbox.checked;
    //   save();
    // });

    const description = document.createElement('input');
    description.classList.add('tdl-list-txt');
    description.type = 'text';
    description.value = task.description;
    description.style.outline = 'none';

    // Check if the task is completed and apply the style with strike-through if true
    if (task.completed) {
      description.style.textDecoration = 'line-through';
    } else {
      description.style.textDecoration = 'none';
    }

    const optionIcon = document.createElement('span');
    optionIcon.innerHTML = '<button><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>';
    optionIcon.classList.add('option-icon');

    description.addEventListener('click', () => {
      editTask(task.index);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(description);
    listItem.appendChild(optionIcon);
    toDoList.appendChild(listItem);
  });
}

function saveAndRender() {
  save();
  renderTasks();
}

// function to remove individual task
function removeTask(index) {
  tasks = tasks.filter((task) => task.index !== index); // Remove the task with the specified index
  updateIndexes(); // Update the indexes of remaining tasks
  saveAndRender();
}

function editTaskDescription(index, newDescription) {
  const task = tasks.find((task) => task.index === index);
  if (task) {
    task.description = newDescription;
    saveAndRender();
  }
}

function editTask(index) {
  const listItem = toDoList.children[index - 1];
  const description = listItem.querySelector('.tdl-list-txt');
  const optionIcon = listItem.querySelector('.option-icon');

  // Save the current description value before editing
  const currentDescription = description.value;

  // Change the background color to "bisque"
  listItem.style.backgroundColor = 'bisque';
  listItem.classList.add('tdl-item-transition');
  description.style.backgroundColor = 'bisque';
  description.classList.add('tdl-description-transition');

  // Replace the option icon with the trash can icon
  optionIcon.innerHTML = '<button class="trash-can-icon"><i class="fa fa-trash-can" aria-hidden="true"></i></button>';

  // Focus on the input box for easy editing
  description.focus();

  // Add event listener to the input box to handle editing
  description.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const newDescription = description.value.trim();
      if (newDescription !== '') {
        listItem.style.backgroundColor = ''; // Reset background color
        optionIcon.innerHTML = '<button><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>'; // Reset option icon
        editTaskDescription(index, newDescription);
      } else {
        description.value = currentDescription; // Revert to the original description if empty
      }
    }
  });

  // Add event listener to the input box for when focus is lost
  description.addEventListener('click', () => {
    const newDescription = description.value.trim();
    if (newDescription !== '') {
      listItem.style.backgroundColor = ''; // Reset background color
      optionIcon.innerHTML = '<button><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>'; // Reset option icon
      editTaskDescription(index, newDescription);

      // Remove the transition class after the editing is done
      listItem.classList.remove('tdl-item-transition');
      description.classList.remove('tdl-description-transition');
    } else {
      description.value = currentDescription; // Revert to the original description if empty
      // Remove the transition class after the editing is done
      listItem.classList.remove('tdl-item-transition');
      description.classList.remove('tdl-description-transition');
    }
  });

  // Add event listener to the trash can icon button for removing the task
  const trashCanIcon = optionIcon.querySelector('i.fa-trash-can');
  trashCanIcon.addEventListener('click', (e) => {
    e.stopPropagation(); // Stop the click event from propagating to the parent elements
    removeTask(index); // Call the removeTask function when the trash can icon is clicked
  });
}

// Function to create a new task object
function addTask(description) {
  return {
    description,
    completed: false,
    index: tasks.length + 1,
  };
}

// Add event listener to the form for adding a new task
addNewListForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = addNewListInput.value.trim();
  if (description === '') return;

  // Create a new task object and add it to the tasks array
  const task = addTask(description);
  addNewListInput.value = '';
  tasks.push(task);
  saveAndRender();
});

// Add event listener to the "Clear all completed" button
// clearTaskBtn.addEventListener('click', () => {
//   tasks = tasks.filter((task) => !task.completed); // Remove completed tasks from the tasks array
//   updateIndexes(); // Update the indexes of remaining tasks
//   saveAndRender();
// });

// Event delegation for trash can icon
toDoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-trash-can')) {
    const listItem = e.target.closest('.tdl-item');
    const index = parseInt(listItem.querySelector('.check-box').index, 10); // Set radix to 10
    removeTask(index);
  }
});

// Event delegation for checkbox
toDoList.addEventListener('change', (e) => {
  if (e.target.classList.contains('check-box')) {
    const index = parseInt(e.target.index, 10); // Set radix to 10
    const task = tasks.find((task) => task.index === index);
    task.completed = e.target.checked;
    saveAndRender();
  }
});

// Event listener to render the tasks list when the page is loaded
document.addEventListener('DOMContentLoaded', saveAndRender);

// Initial render of tasks
renderTasks();
