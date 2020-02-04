'use strict';

const taskData = [];

// constructor function for new Task
function Task(title, description) {
  this.title = title;
  this.description = description;
  this.done = false;
  this.collapsed = description ? false : true;
  this.id = Date.now().toString(36) + Math.random().toString(36).substring(2,5);
}

// create div structure for the given Task
function createTaskDiv(taskObj) {
  // general container
  const $taskDiv = document.createElement('div')
  $taskDiv.className = 'task';

    // task title
    const $taskTitleDiv = document.createElement('div');
    $taskTitleDiv.className = 'task_title';


      const $taskTitleName = document.createElement('h3');
      $taskTitleName.className = 'task_title_name';
      $taskTitleName.textContent = taskObj.title;
      $taskTitleDiv.appendChild($taskTitleName);

      const $taskButtons = document.createElement('div');
      $taskButtons.className = 'task-buttons';

        const $taskButtonCollapse = document.createElement('button');
        $taskButtonCollapse.className = 'button task_button';
        $taskButtonCollapse.setAttribute('data-aciton', 'collapse');
        $taskButtonCollapse.textContent = 'Collapse';
        $taskButtons.appendChild($taskButtonCollapse);

        const $taskButtonDone = document.createElement('button');
        $taskButtonDone.className = 'button task_button';
        $taskButtonDone.setAttribute('data-aciton', 'done');
        $taskButtonDone.textContent = 'Done';
        $taskButtons.appendChild($taskButtonDone);

      $taskTitleDiv.appendChild($taskButtons);

    $taskDiv.appendChild($taskTitleDiv);

  const $taskDescription = document.createElement('p');
  $taskDescription.className = 'task_description';
  $taskDescription.textContent = taskObj.description;
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
}

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

      // Чтобы редактировать заметку - кликни на нее дважды
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

      const task = new Task(title, descr);
      taskData.unshift(task);
      form.reset();
      form.querySelector('.task_title_name').focus();
    }
  })
