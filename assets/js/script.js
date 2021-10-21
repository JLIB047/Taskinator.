var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name'").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // check if inputs are empty (validate)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }
  
  formEl.reset();

  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  var isEdit = formEl.hasAttribute("data-task-id");
//has data attribute, so get task id and call function to complete edit process
  if(isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  //no data attribute, so create onject as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to-do"
    };

    createTaskEl(taskDataObj);
  }

};

var completeEditTask = function(taskName, taskType, taskId) {
  var taskSelected =document.querySelector(".task-item[data-task-id='" + taskId + "']");
  //set new values 
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  //loop through tasks array and task object with new content 
  for(var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)){
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }

  saveTasks();
  alert("Task Updated!");
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  //add task id as a custom attribute 
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  tasksToDoEl.appendChild(listItemEl);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  console.dir(listItemEl);

  // add list item to list
  tasksToDoEl.appendChild(listItemEl);

  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);
  saveTasks();
  //increase task counter for next unique item 
  taskIdCounter++;
  
};

var createTaskActions = function(taskId){
    var actionContainerEl = document.createElement("div");
    actionContainerEl.classname = "task-action";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id" , taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button 
    var delButtonEl = document.createElement("button");
    delButtonEl.textContent = "Delete";
    delButtonEl.className = "btn delete-btn";
    delButtonEl.setAttribute("data-task-id" , taskId);

    actionContainerEl.appendChild(delButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "Select";
    statusSelectEl.setAttribute("name" , "status-change");
    statusSelectEl.setAttribute("data-task-id" , taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do" , "In Progress" , "Completed"];
    for(var i = 0; i < statusChoices.length; i++) {
        //create option element 
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value" , statusChoices[i]);

        //append to select 
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};
formEl.addEventListener("submit", taskFormHandler);

var editTask = function(taskId) {
  console.log("editing task #" + taskId);
  //get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  //get content from name and type 
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
}


var deleteTask = function(taskId){
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  //create new array to hold updated list of tasks 
  var updatedTaskArr = [];

  //loop through current tasks
  for (var i = 0; i < tasks.length; i++){
    //if tasks[i].id doesnt match the value of taskId, lets keep that task and push it into the new array
    if(tasks[i].id !== parseInt(taskId)){
      updatedTaskArr.push(tasks[i]);
    }
  }
  tasks = updatedTaskArr;
  saveTasks();
}

var taskButtonHandler = function(event) {
  //get target element ffrom event 
  var targetEl = event.target;

  //edit button was clicked 
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }

  if(event.target.matches(".delete-btn")) {
    //get element's task id 
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);

  }
};
pageContentEl.addEventListener("click" , taskButtonHandler);

var taskStatusChangeHandler = function(event) {
  //get task item's id 
  var taskId = event.target.getAttribute("data-task-id");

  //get the currently selected option's value and convert to lowercase 
  var statusValue = event.target.value.toLowerCase();

  //find the parent task item element based on the id 
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to-do") {
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  //update task's in tasks array 
  for (var i = 0; i<tasks.length; i++){
    if (tasks[i].id === parseInt(taskId)){
      tasks[i].status = statusValue;
    }
  }
  saveTasks();
}

var saveTasks = function(){
  localStorage.setItem("tasks" , JSON.stringify(tasks));
  

}

var loadTasks = function(){
  //Get tasks from local storage 
  var savedTasks = localStorage.getItem("tasks");
    console.log(savedTasks)

  
  //Convert tasks from the string format back into an array of objects 

  //Iterates through a tasks array and create task elements on the page from it 
}
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();