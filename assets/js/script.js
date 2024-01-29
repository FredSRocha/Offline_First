document.addEventListener('DOMContentLoaded', setupEventListenersAndFetchTasks);
window.addEventListener('online', updateAppStatusOnConnectivityChange);
window.addEventListener('offline', updateAppStatusOnConnectivityChange);

const apiBaseUrl = 'http://localhost/project/sync-localstorage/2/src/api/v1/';
let currentEditingId = null;

function setupEventListenersAndFetchTasks() {
    fetchTasksFromServer();
    updateOnlineOfflineIndicator();
    renderAndSortLocalTasks();
    document.querySelector('.close').addEventListener('click', closeEditModal);
}

function updateAppStatusOnConnectivityChange() {
    updateOnlineOfflineIndicator();
    if (navigator.onLine) {
        fetchTasksFromServer();
        syncUnsyncedTasksToServer();
    } else {
        renderAndSortLocalTasks();
    }
}

function updateOnlineOfflineIndicator() {
    const statusIndicator = document.getElementById('statusIndicator');
    const isOnline = navigator.onLine;
    statusIndicator.textContent = isOnline ? 'Online' : 'Offline';
    statusIndicator.classList.toggle('online', isOnline);
    statusIndicator.classList.toggle('offline', !isOnline);
}

// Task Operations: Add, Edit, Delete, Toggle Status, Sync, etc.

function addTask() {
    const taskInput = document.getElementById('newTask');
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const newTask = { id: Date.now(), text: taskText, status: 'pending', synced: false };
    navigator.onLine ? createTaskOnServer(newTask) : addTaskToLocal(newTask);
    taskInput.value = '';
}

function openTaskEditModal(id) {
    let taskText;

    if (navigator.onLine) {
        const taskElement = getTaskElement(id);
        taskText = taskElement ? taskElement.querySelector('span').innerText : '';
    } else {
        const task = getTaskById(id);
        taskText = task ? task.text : '';
    }

    if (taskText === undefined) {
        console.error('Erro: Task not found.');
        return;
    }

    document.getElementById('editTaskText').value = taskText;
    currentEditingId = id;
    document.getElementById('editModal').style.display = 'block';
}

function saveEditedTaskAndCloseModal() {
    const updatedText = document.getElementById('editTaskText').value;
    if (!updatedText || currentEditingId === null) return;

    const status = getTaskElement(currentEditingId).classList.contains('completed') ? 'completed' : 'pending';
    navigator.onLine ? updateTaskOnServer(currentEditingId, updatedText, status) : updateTaskInLocal(currentEditingId, updatedText);
    closeEditModal();
}

function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    navigator.onLine ? deleteTaskOnServer(taskId) : deleteTaskFromLocal(taskId);
}

function toggleTaskStatus(taskId) {
    if (!navigator.onLine) {
        updateTaskStatusInLocal(taskId);
        return;
    }

    const taskElement = getTaskElement(taskId);
    if (!taskElement) return;

    const text = taskElement.querySelector('span').innerText;
    const status = taskElement.classList.contains('completed') ? 'pending' : 'completed';
    updateTaskOnServer(taskId, text, status);
}

function syncUnsyncedTasksToServer() {
    const tasks = getTasksFromLocal().filter(task => !task.synced);
    tasks.forEach(task => createTaskOnServer(task));
}

// Server Communication

function fetchTasksFromServer() {
    if (!navigator.onLine) return;
    sendRequest('read.php')
        .then(tasks => renderAndSortTasksFromServer(tasks))
        .catch(error => console.error('Error:', error));
}

function updateTaskOnServer(taskId, text, status) {
    sendRequest('update.php', { id: taskId, text, status })
        .then(() => fetchTasksFromServer())
        .catch(error => console.error('Error:', error));
}

function deleteTaskOnServer(taskId) {
    sendRequest('delete.php', { id: taskId })
        .then(() => removeTaskFromUI(taskId))
        .catch(error => console.error('Error:', error));
}

function createTaskOnServer(task) {
    sendRequest('create.php', { text: task.text, status: task.status })
        .then(data => {
            fetchTasksFromServer();
            markTaskAsSynced(task.id);
        })
        .catch(error => console.error('Error:', error));
}

// Local  Operations

function getTasksFromLocal() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToLocal(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTaskToLocal(task) {
    const tasks = getTasksFromLocal();
    tasks.unshift(task);
    saveTasksToLocal(tasks);
    renderAndSortLocalTasks();
}

function updateTaskInLocal(taskId, updatedText) {
    let tasks = getTasksFromLocal();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].text = updatedText;
        tasks[taskIndex].synced = false;
        saveTasksToLocal(tasks);
        renderAndSortLocalTasks();
    }
}

function deleteTaskFromLocal(taskId) {
    let tasks = getTasksFromLocal();
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasksToLocal(tasks);
    renderAndSortLocalTasks();
}

function updateTaskStatusInLocal(taskId) {
    let tasks = getTasksFromLocal();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].status = tasks[taskIndex].status === 'pending' ? 'completed' : 'pending';
        tasks[taskIndex].synced = false;
        saveTasksToLocal(tasks);
        renderAndSortLocalTasks();
    }
}

// Helper Functions

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingId = null;
}

function getTaskElement(taskId) {
    return document.querySelector(`.task[data-id="${taskId}"]`);
}

function getTaskById(taskId) {
    return getTasksFromLocal().find(task => task.id === taskId);
}

function renderAndSortTasksFromServer(tasks) {

    tasks.sort((a, b) => {
        if (a.status === 'pending' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status === 'pending') return 1;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskEl = createTaskElement(task);
        taskList.appendChild(taskEl);
    });
}

function renderAndSortLocalTasks() {
    
    const tasks = getTasksFromLocal();
 
    tasks.sort((a, b) => {
        if (a.status === 'pending' && b.status === 'completed') return -1;
        if (a.status === 'completed' && b.status === 'pending') return 1;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskEl = createTaskElement(task);
        taskList.appendChild(taskEl);
    });
}

function createTaskElement(task) {
    const taskEl = document.createElement('div');
    taskEl.className = `task ${task.status}`;
    taskEl.setAttribute('data-id', task.id);
    taskEl.innerHTML = `
        <span>${task.text}</span>
        <div class="box-buttons">
            <button onclick="toggleTaskStatus(${task.id})">✔️</button>
            <button onclick="openTaskEditModal(${task.id})">✏️</button>
            <button onclick="deleteTask(${task.id})">❌</button>
        </div>`;
    return taskEl;
}

function removeTaskFromUI(taskId) {
    getTaskElement(taskId)?.remove();
}

function sendRequest(endpoint, data = {}) {
    return fetch(`${apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

function markTaskAsSynced(taskId) {
    let tasks = getTasksFromLocal();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].synced = true;
        saveTasksToLocal(tasks);
        clearSyncedTasksFromLocal();
    }
}

// Additional helper functions as needed

function clearSyncedTasksFromLocal() {
    let tasks = getTasksFromLocal();
    tasks = tasks.filter(task => !task.synced);

    if (tasks.length === 0) {
        localStorage.removeItem('tasks');
    } else {
        saveTasks(tasks);
    }
}