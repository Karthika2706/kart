function addTask() {

    // Get the input value
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();

    // Check if input is empty
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create a new list item
    let li = document.createElement("li");

    // Create task text
    let span = document.createElement("span");
    span.textContent = taskText;

    // Create delete button
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");

    // Complete task when clicking the task
    span.onclick = function () {
        li.classList.toggle("completed");
    };

    // Delete task
    deleteButton.onclick = function () {
        li.remove();
    };

    // Add elements to list item
    li.appendChild(span);
    li.appendChild(deleteButton);

    // Add list item to task list
    document.getElementById("taskList").appendChild(li);

    // Clear input
    taskInput.value = "";
}