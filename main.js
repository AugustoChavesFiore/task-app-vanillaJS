const form = document.querySelector('#taskForm');
const taskInput = document.querySelector('#Task');
const taskContainer = document.querySelector('#taskContainer');
const updateTaskModal = document.querySelector('#updateTaskModal');
const sortButton = document.querySelector('#sortTask');
const clearDoneButton = document.querySelector('#cleanTask');
const doneAllButton = document.querySelector('#doneTask');
const darkModeToggle = document.querySelector('#darkModeToggle');
const toggleLabel = document.querySelector('#toggleLabel');
const scrollTask = document.querySelector('#scrollTask');



if (localStorage.getItem('darkMode') === 'true') {
    darkModeToggle.checked = true;
    document.body.setAttribute('data-bs-theme', 'dark');
    toggleLabel.textContent = 'Light Mode';
}
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.setAttribute('data-bs-theme', 'dark');
        toggleLabel.textContent = 'Light Mode';
    } else {
        document.body.removeAttribute('data-bs-theme');
        toggleLabel.textContent = 'Dark Mode';
    }

    localStorage.setItem('darkMode', darkModeToggle.checked);
});

// agregar scroll a la tabla de tareas 
scrollTask.style.maxHeight = '300px';
scrollTask.style.overflowX = 'auto';
scrollTask.style.display = 'block';
// estilizar el scroll
scrollTask.style.scrollbarWidth = 'thin';





let tasks = [];

const getTasks = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
};

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const orderByDone = () => {
    tasks.sort((a, b) => a.status - b.status);
    renderTask(tasks);
};

const renderTask = (tasks) => {
    taskContainer.innerHTML = '';
    tasks.forEach((task, index) => {
        taskContainer.innerHTML += `
        <tr id='${index}' class="${task.status ? 'table-success' : 'table-danger'}">
            <td class='fw-bold ${task.status && 'text-decoration-line-through' }'>${task.task}</td>
            <td class='text-break ${task.status ? 'text-decoration-line-through' : ''}'>${task.description}</td>
            <td>
                <button type="button" class="btn btn-primary"   data-bs-toggle="modal" data-bs-target="#updateTaskModal" onClick="updateTask(${index})"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-danger" onClick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
                <button type="button" class="btn btn-success" onClick="completeTask(${index})">${task.status ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-list-check"></i>'}</button>
            </td>
        </tr>`;
    });
    saveTasks();
};

const deleteTask = (index) => {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    tasks = tasks.filter((task, taskIndex) => taskIndex !== index);
    renderTask(tasks);
};

const updateTask = (index) => {
    const task = tasks[index];
    const taskInput = document.querySelector('#updateTask');
    const descriptionInput = document.querySelector('#updateDescription');
    taskInput.value = task.task;
    descriptionInput.value = task.description;
    const updateTaskForm = document.querySelector('#updateTaskForm');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!taskInput.value || !descriptionInput.value) {
            return alert('Task or description is missing');
        }

        tasks[index] = {
            task: taskInput.value,
            description: descriptionInput.value,
            status: tasks[index].status
        };
        renderTask(tasks);
        // bootstrap.Modal.getInstance(updateTaskModal).hide();
        updateTaskForm.removeEventListener('submit', handleSubmit);
    };

    updateTaskForm.addEventListener('submit', handleSubmit);

    // const bootstrapModal = new bootstrap.Modal(updateTaskModal);
    // bootstrapModal.show();
};

const completeTask = (index) => {
    tasks[index].status = !tasks[index].status;
    renderTask(tasks);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const task = formData.get('task');
    const description = formData.get('description');
    if (!task || !description) {
        return alert('Task or description is missing');
    }
    tasks.push({ task, description, status: false });
    orderByDone();
    renderTask(tasks);
    form.reset();
});

sortButton.addEventListener('click', () => {
    orderByDone();
});

clearDoneButton.addEventListener('click', () => {
    if (!confirm('Are you sure you want to delete all done tasks?')) return;
    tasks = tasks.filter(task => !task.status);
    renderTask(tasks);
});

doneAllButton.addEventListener('click', () => {
    if (!confirm('Are you sure you want to mark all tasks as done?')) return;
    tasks.forEach(task => task.status = true);
    renderTask(tasks);
});

document.addEventListener('DOMContentLoaded', () => {
    getTasks();
    orderByDone();
    renderTask(tasks);
});
