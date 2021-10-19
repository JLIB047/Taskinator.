var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

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

  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  };

  createTaskEl(taskDataObj);
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
