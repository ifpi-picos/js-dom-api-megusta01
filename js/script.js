// Função para carregar os repositórios do GitHub do usuário
async function loadRepos(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        const repoSelect = document.getElementById('repoSelect');
        repoSelect.innerHTML = '';
        repos.forEach(repo => {
            addOption(repoSelect, repo.name);
        });
    } catch (error) {
        handleLoadReposError(error);
    }
}

function handleLoadReposError(error) {
    console.error('Erro ao carregar repositórios:', error);
}

function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        const listItem = createTaskListItem(task);
        taskList.appendChild(listItem);
    });
}

function createTaskListItem(task) {
    const listItem = document.createElement('li');
    listItem.classList.add('task-item');
    listItem.setAttribute('data-task-id', task.id);
    listItem.classList.add(task.completed ? 'task-completed' : 'task-not-completed');

    const taskInfo = document.createElement('div');
    taskInfo.classList.add('task-info');
    taskInfo.classList.add(task.completed ? 'task-completed' : 'task-not-completed');

    const taskContentWrapper = document.createElement('div');
    taskContentWrapper.classList.add('task-content-wrapper');

    // Formatando a data e hora
    const taskDateTime = new Date(task.datetime);
    const formattedDateTime = taskDateTime.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const taskContent = createElementWithClass('div', 'task-content', `${task.content} - ${formattedDateTime}`);
    const taskDescription = createElementWithClass('div', 'task-description', task.description);
    const repoLink = createRepoLink(task);
    const completeButton = createButton('Concluído', 'complete-button', () => {
        task.completed = !task.completed;
        updateTask(task);
    });
    const removeButton = createButton('Remover', 'remove-button', () => removeTask(task.id));

    taskContentWrapper.append(taskContent, taskDescription, repoLink);
    taskInfo.append(taskContentWrapper);
    listItem.append(taskInfo, completeButton, removeButton);

    return listItem;
}

function createElementWithClass(elementType, className, textContent) {
    const element = document.createElement(elementType);
    element.classList.add(className);
    element.textContent = textContent;
    return element;
}

function createRepoLink(task) {
    const repoLink = document.createElement('a');
    repoLink.href = `https://github.com/${task.username}/${task.repo}`;
    repoLink.textContent = task.repo;
    repoLink.target = '_blank';
    return repoLink;
}

function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener('click', onClick);
    return button;
}

function addOption(selectElement, text) {
    const option = document.createElement('option');
    option.value = text;
    option.textContent = text;
    selectElement.appendChild(option);
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(event) {
    event.preventDefault();
    const taskInput = document.getElementById('taskInput').value.trim();
    const taskDescription = document.getElementById('taskDescription').value.trim();
    const taskDatetime = document.getElementById('taskDatetime').value.trim();
    const username = document.getElementById('username').value.trim();
    const repoSelect = document.getElementById('repoSelect').value.trim();

    if ([taskInput, taskDescription, taskDatetime, username, repoSelect].some(value => value === '')) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    const task = {
        id: Date.now(),
        content: taskInput,
        description: taskDescription,
        datetime: taskDatetime,
        username: username,
        repo: repoSelect,
        completed: false,
    };

    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);

    clearTaskForm();
    displayTasks();
}

function clearTaskForm() {
    document.getElementById('taskInput').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskDatetime').value = '';
    document.getElementById('username').value = '';
    document.getElementById('repoSelect').selectedIndex = 0;
}

function updateTask(updatedTask) {
    const tasks = getTasksFromLocalStorage();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
        tasks[index] = updatedTask;
        saveTasksToLocalStorage(tasks);
        displayTasks();
        const taskListItem = document.querySelector(`[data-task-id="${updatedTask.id}"]`);
        if (updatedTask.completed) {
            taskListItem.classList.add('task-completed');
        } else {
            taskListItem.classList.remove('task-completed');
        }
    }
}

function removeTask(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocalStorage(tasks);
    displayTasks();
}

const taskForm = document.getElementById('taskForm');
taskForm.addEventListener('submit', addTask);

const usernameInput = document.getElementById('username');
usernameInput.addEventListener('blur', () => {
    const username = usernameInput.value.trim();
    if (username !== '') {
        loadRepos(username);
    }
});

window.addEventListener('load', displayTasks);
