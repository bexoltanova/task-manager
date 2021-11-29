var taskInput = $("#task");
var addTask = $("#add_task");
var inProgress = "In progress";
var done = "Done";
var empty = "";

var getFromLocalStorage = function () {
  var tasks = localStorage.getItem("tasks");
  tasks = JSON.parse(tasks) || [];
  return tasks;
};

var addToLocalStorage = function() {
  var tasks = getFromLocalStorage();
  var data = {
    id: tasks.length,
    text: taskInput.val(),
    type: 0
  }
  tasks.push(data);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
};

var createTask = function (id, taskText, buttonType, taskId) {
  var newBoardTask = $("<div class='board_task' data-id=" + taskId +"></div>");
  var newBtnWrapper = $("<div class='btn_wrapper'><button class='btn_remove'></button></div>");
  var newTaskText = $("<p class='task_text'>" + taskText + "</p>");
  var newMoveBtn = $("<a href='#' class='btn_move'></a>").html(buttonType);

  if (id === "toDoList") {
    newBoardTask.addClass("board_task_first");
    newMoveBtn.addClass("move_to_progress");
  } else if (id === "inProgressList") {
    newBoardTask.addClass("board_task_second");
    newMoveBtn.addClass("move_to_done");
  } else {
    newBoardTask.addClass("board_task_last");
    newMoveBtn.hide();
  }

  newBtnWrapper.appendTo(newBoardTask);
  newTaskText.appendTo(newBoardTask);
  newMoveBtn.appendTo(newBoardTask);
  newBoardTask.appendTo($("#" + id));
};

var addTasksToBoard = function (data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].type === 0) {
      createTask("toDoList", data[i].text, inProgress, data[i].id)
    } else if (data[i].type === 1) {
      createTask("inProgressList", data[i].text, done, data[i].id)
    } else {
      createTask("doneList", data[i].text, empty, data[i].id)
    }
  }
};

var init = function () {
  var allTasks = getFromLocalStorage();
  if (allTasks) {
    addTasksToBoard(allTasks);
  }
};

init();

addTask.on("click", function (e) {
  e.preventDefault();
  if (!taskInput.val()) {
    alert("Please enter the task!");
  } else {
    addToLocalStorage();
  }
});

var changeTaskType = function (index) {
  var tasks = getFromLocalStorage();
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === index) {
      if (tasks[i].type < 2) {
        tasks[i].type++;
      }
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
};

var removeFromLocalStorage = function (index) {
  var tasks = getFromLocalStorage();
  for (var j = 0; j < tasks.length; j++) {
    if (tasks[j].id === index) {
      tasks.splice(j, 1)
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
};

$(".btn_move").on("click", function (e) {
  var taskIndex = parseInt($(this).parents(".board_task").attr("data-id"));
  changeTaskType(taskIndex);
});

$(".btn_remove").on("click", function () {
  var taskIndex = parseInt($(this).parents(".board_task").attr("data-id"));
  removeFromLocalStorage(taskIndex);
});

