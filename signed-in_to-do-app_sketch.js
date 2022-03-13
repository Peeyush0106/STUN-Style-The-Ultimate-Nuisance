function addTask() {
    var previousScale = document.getElementById("body").style.transform
    var previousTransition = document.getElementById("body").style.transition
    document.getElementById("body").style.transition = "1.5s";
    document.getElementById("body").style.transform = "scale(0)";
    document.getElementById("body").style.marginLeft = "100%";
    setTimeout(function () {
        document.getElementById("body").hidden = true;
        document.getElementById("no-tasks").hidden = true;
        document.getElementById("task-groups").hidden = true;
        document.getElementById("add-task").hidden = true;
        document.getElementById("body").style.marginLeft = 0;
        document.getElementById("body").style.transform = previousScale;
        document.getElementById("body").style.transition = previousTransition;
        setTimeout(function () { document.getElementById("body").hidden = false }, 500);
    }, 1500);
}

function getTasks() {
    var addTaskBtn = document.createElement("button");
    addTaskBtn.id = "add-task";
    addTaskBtn.onclick = addTask;
    addTaskBtn.innerHTML = `
        <img src="plus.png" height="` + window.innerWidth * 100 / 1440 + `" />
        <p>
            Add a task
        </p>
    `;
    document.getElementById("body").appendChild(addTaskBtn);
    database.ref("Users/" + auth.currentUser.uid + "/Tasks").get().then((data) => {
        if (data.exists() && data.val()) {
            for (var i in data.val()) {
                var task = data.val();
                console.log(task);
            }
        }
        else {
            document.getElementById("no-tasks").hidden = false;
        }
    });
}

function backToHome() {
    setTimeout(function () {
        document.getElementById("body").style.transition = ".6s";
        document.getElementById("body").style.transform = "scale(0.01)";
        setTimeout(function () {
            location.href = "signed-in_index.html";
        }, 600);
    }, 100);
}