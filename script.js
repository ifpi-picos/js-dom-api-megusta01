
// Função para carregar os repositórios do GitHub do usuário
async function loadRepos(username) {

    // var username = document.getElementById("username").value;
    // var selectRepo = document.getElementById("repoSelect");

    // if (username.trim() !== "") {
    //     // Mostra o select se o campo username estiver preenchido
    //     selectRepo.style.display = "block";
    //     // Aqui você pode adicionar a lógica para preencher o select com os repositórios do usuário

    //     // Exemplo de como preencher o select com opções de repositórios (substitua pelo seu código real)
    //     selectRepo.innerHTML = ""; // Limpa o select
    //     var option = document.createElement("option");
    //     option.text = "Repositório 1";
    //     selectRepo.add(option);
    //     // Adicione mais opções conforme necessário
    // } else {
    //     // Esconde o select se o campo username estiver vazio
    //     selectRepo.style.display = "none";
    // }

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`)
        const repos = await response.json();
        console.log(repos)
        const repoSelect = document.getElementById('repoSelect');
        repoSelect.innerHTML = '';
        repos.forEach(repo => {
            const option = document.createElement('option');
            option.value = repo.name;
            option.textContent = repo.name;
            repoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar repositórios:', error);
    }
}

function displayTasks() {
    const taskDescription = document.getElementById('taskDescription');
    const taskDatetime = document.getElementById('taskDatetime');
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed; // Marcar checkbox como concluído se a tarefa estiver marcada como concluída
        checkbox.addEventListener('change', function() {
            task.completed = this.checked;
            updateTask(task);
        });
        listItem.appendChild(checkbox);

        const taskContent = document.createElement('span');
        taskContent.textContent = task.content + ' - ' + taskDescription.value + " - " + task.repo + ' - ' + taskDatetime.value;
        if (task.completed) {
            taskContent.classList.add('completed');
        }
        listItem.appendChild(taskContent);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remover';
        deleteButton.addEventListener('click', function() {
            removeTask(task.id);
        });
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
}

// Função para adicionar uma nova tarefa
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskInputValue = taskInput.value.trim();
    if (taskInputValue === '') return;

    const task = {
        id: Date.now(),
        content: taskInputValue,
        completed: false,
        repo: document.getElementById('repoSelect').value
    };

    // Adicionar a tarefa ao armazenamento local
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = '';
    document.getElementById('repoSelect').selectedIndex = 0;

    displayTasks();
}

function updateTask(updatedTask) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
        tasks[index] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}

function removeTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

const usernameInput = document.getElementById('username');
usernameInput.addEventListener('blur', function () {
    const username = usernameInput.value;
    if (username.trim() !== '') {
        loadRepos(username);
    }
});

window.addEventListener('load', function () {
    displayTasks();
});
