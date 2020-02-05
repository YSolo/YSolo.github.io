'use strict';

let taskData = [];

if (localStorage.getItem('tasks')) {
  taskData = JSON.parse(localStorage.getItem('tasks'));
  renderTasks(taskData);
}


// constructor function for new Task
function Task(title, description) {
  this.title = title;
  this.description = description;
  this.done = false;
  this.collapsed = description ? false : true;
  this.id = Date.now().toString(36) + Math.random().toString(36).substring(2,5);
  this.date = new Date();
}

// Helper function to create buttons
function createTaskButton (text, dataAction) {
  const $taskButton = document.createElement('button');
  $taskButton.className = 'button task_button';
  $taskButton.setAttribute('data-action', dataAction);
  $taskButton.textContent = text;

  return $taskButton;
}

// create div structure for the given Task
function createTaskDiv(taskObj) {
  // general container
  const $taskDiv = document.createElement('div')
  $taskDiv.className = 'task';
  $taskDiv.id = taskObj.id;

    // task title
    const $taskTitleDiv = document.createElement('div');
    $taskTitleDiv.className = 'task_title';


      const $taskTitleName = document.createElement('h3');
      $taskTitleName.className = 'task_title_name';
      $taskTitleName.textContent = taskObj.title;
      if (taskObj.done) {
        $taskTitleName.classList.add('done');
      };
      $taskTitleDiv.appendChild($taskTitleName);

      const $taskButtons = document.createElement('div');
      $taskButtons.className = 'task-buttons';

        if (!taskObj.done) $taskButtons.appendChild(createTaskButton('Edit', 'edit'));

        $taskButtons.appendChild(createTaskButton('Remove', 'remove'));

        $taskButtons.appendChild(createTaskButton('Collapse', 'collapse'));

        if (!taskObj.done) $taskButtons.appendChild(createTaskButton('Done', 'done'));

      $taskTitleDiv.appendChild($taskButtons);

    $taskDiv.appendChild($taskTitleDiv);

  const $taskDescription = document.createElement('p');
  $taskDescription.className = 'task_description';
  $taskDescription.textContent = taskObj.description;
  if (taskObj.done) {
    $taskDescription.classList.add('done');
  }

  $taskDescription.hidden = taskObj.collapsed ? true : false;
  $taskDiv.appendChild($taskDescription);

  return $taskDiv;
}

// render All Tasks
function renderTasks(listOfTasks) {
  const taskContainer = document.querySelector('.task-container');
  taskContainer.innerHTML = '';

  listOfTasks.forEach( task => {

    taskContainer.appendChild(createTaskDiv(task));

  })

  document.querySelector('.completed').textContent = listOfTasks.reduce((acc, t) => acc + (t.done === true), 0);
  document.querySelector('.total').textContent = listOfTasks.reduce((acc, t) => acc + 1, 0);
}

document.querySelector("#clear")
  .addEventListener('click', e => {
    const confirmed = confirm("All data will be cleared. Are you sure you want it?")
    if (confirmed) {
      localStorage.clear();
      location.reload();
    }
  })

document.querySelector("#help")
  .addEventListener('click', e => {
    alert(`
      Вам нужно создать список задач, который умеет:

      добавлять новые задачи и проверять их уникальность.

      У каждой задачи есть статус,
      время создания название и текст

      удалять задачу, но с условием
      (тут передаете в качестве аргумента confirm)
      редактировать задачу (тоже спрашиваете
      нужно ли сохранить изменения)

      выводить общее количество задач,
      сколько выполнили и сколько осталось

      Данные должны сохраняться при обновлении страницы

    `)
  })

// 'ADD NEW TASK button functions'
document.querySelector("#new_task_button")
  .addEventListener('click', e => {
    // reveal form for a new task
    document.querySelector(".new-task-form").hidden = false;

    // set focus on the Input of new title
    document.querySelector("input.task_title_name").focus();
  })

// Actions for new task form and its buttons
document.querySelector('.new-task-form')
  .addEventListener('click', e => {
    e.preventDefault();

    const target = e.target;
    const form = e.currentTarget;

    if (target.name === 'cancel') {
      form.reset();
      form.hidden = true;
    }

    if (target.name === 'save') {
      const title = form.querySelector('.task_title_name').value;
      const descr = form.querySelector('.task_description').value;

      if (!title || !descr) {
        alert('Please enter valid task name & description');
        return;
      }

      const task = new Task(title, descr);
      taskData.unshift(task);
      renderTasks(taskData);

      localStorage.setItem('tasks', JSON.stringify(taskData));

      form.reset();
      form.querySelector('.task_title_name').focus();
    }
  })

document.querySelector('.task-container')
  .addEventListener('click', e => {
    const target = e.target;
    if (!target.classList.contains("task_button")) return;
    const task = target.closest('.task');
    if (!task) return;
    const title = task.querySelector('.task_title_name');
    const descr = task. querySelector('.task_description');
    const taskObject = taskData.find(taskObj => taskObj.id === task.id);

    switch (target.dataset.action) {
      case 'collapse':
      taskObject.collapsed = !taskObject.collapsed;
      break;

      case 'edit':
      const buttons = task.querySelector('.task-buttons');
      buttons.innerHTML = '';

      buttons.appendChild(createTaskButton('Save changes', 'save'));
      buttons.appendChild(createTaskButton('Cancel', 'cancel'));

      const titleInput = document.createElement('input')
      titleInput.className = "task_title_name";
      titleInput.type = 'text';
      titleInput.value = title.textContent;
      title.replaceWith(titleInput);
      titleInput.focus();

      const descrInput = document.createElement('input')
      descrInput.className = "task_description";
      descrInput.type = 'text';
      descrInput.value = descr.textContent;
      descr.replaceWith(descrInput);

      buttons.addEventListener ('click',  e => {

        if (e.target.dataset.action === 'save') {
          const confirmed = confirm("Are you sure?");
          if (confirmed) {
            taskObject.title = titleInput.value;
            taskObject.description = descrInput.value;
          }
        }

        if (!e.target.dataset.action === 'cancel') return;

      }, {once: true});
      break;

      case 'done':
        taskObject.done = true;
      break;

      case 'remove':
        const confirmed = confirm('Are you sure, you want to remove this item?');

        if (confirmed) {
          taskData.splice(taskData.indexOf(taskObject), 1);
        }
      break;
    }

    localStorage.setItem('tasks', JSON.stringify(taskData));
    if (!(e.target.dataset.action === 'edit')) {
      renderTasks(taskData);
    }
  })
