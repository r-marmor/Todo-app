const listsContainer = document.querySelector('[data-lists-container]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const listTitle = document.querySelector('[data-list-title]');
const taskCounter = document.querySelector('[data-task-counter]');
const deleteListBtn = document.querySelector('[data-delete-list-btn]');
const todoContainer = document.querySelector('[data-todo-container]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const todoBody = document.querySelector('[data-todo-body]');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasks = document.querySelector('[data-clear-complete-task]');

const LOCAL_STORAGE_LIST_KEY = 'lists_name';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'list_id_key';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

clearCompleteTasks.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
});

deleteListBtn.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    saveAndRender();
});


tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        updateTaskCounter(selectedList);
    }
});


listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
});


newListForm.addEventListener('submit', e => {
    e.preventDefault();

    const listName = newListInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    lists.push(list);
    newListInput.value = null;
    saveAndRender();
});


newTaskForm.addEventListener('submit', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    e.preventDefault();

    const taskName = newTaskInput.value;
    if (taskName == null || taskName == '') return;
    const task = createTask(taskName);
    selectedList.tasks.push(task);
    newTaskInput.value = null;
    saveAndRender();
});


function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false };
}


function saveAndRender() {
    save();
    render();
}


function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}


function render() {
    clearElements(listsContainer);
    renderLists();
    
    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedListId == null) {
        todoContainer.style.display = "none";
    } else {
        todoContainer.style.display = "";
        listTitle.innerText = selectedList.name;
        updateTaskCounter(selectedList);
        clearElements(tasksContainer);
        renderTasks(selectedList);
    }   
}


function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    });
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add('list-name');
        listElement.innerText = list.name;
        
        if (list.id === selectedListId) {
            listElement.classList.add('active');
        }

        listsContainer.appendChild(listElement);
    });
}

function updateTaskCounter(selectedList) {
    const incompleteTasks = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTasks < 2 ? "task" : "tasks";
    taskCounter.innerText = `${incompleteTasks} ${taskString} remaining`;
}

function clearElements(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();