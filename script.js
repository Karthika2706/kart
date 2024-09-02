 function addTask() {
            const taskInput = document.getElementById('taskInput');
            const taskValue = taskInput.value.trim();
            if (taskValue === '') {
                alert('Please enter a task');
                return;
            }

            const taskList = document.getElementById('taskList');
            const li = document.createElement('li');
            li.innerHTML = `
                ${taskValue}
                <button class="delete" onclick="removeTask(this)">Delete</button>
            `;
            taskList.appendChild(li);

            taskInput.value = '';
        }

        function removeTask(button) {
            const taskList = document.getElementById('taskList');
            taskList.removeChild(button.parentElement);
        }

