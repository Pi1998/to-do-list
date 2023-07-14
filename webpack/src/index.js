import _ from 'lodash';
import './style.css';

const tasks = [
    {
        description: 'Task 1',
        completed: false,
        index: 1
    },
    {
        description: 'Task 2',
        completed: false,
        index: 2
    },
    {
        description: 'Task 3',
        completed: false,
        index: 3
    },
];

function renderTasks() {
    const todoList = document.getElementById('tdl-lists');
    todoList.innerHTML = '';

    tasks.forEach((task) => {
        const listItem = document.createElement('div');
        listItem.classList.add('tdl-item');

        const checkbox = document.createElement('input');
        checkbox.classList.add('check-box');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const description = document.createElement('span');
        description.textContent = task.description;

        const optionIcon = document.createElement('span');
        optionIcon.innerHTML = '<button><i class="fa fa-ellipsis-v" aria-hidden="true"></i></button>';
        optionIcon.classList.add('option-icon');

        listItem.appendChild(checkbox);
        listItem.appendChild(description);
        listItem.appendChild(optionIcon);
        todoList.appendChild(listItem);

    });
}


document.addEventListener('DOMContentLoaded', renderTasks);
