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
  })
