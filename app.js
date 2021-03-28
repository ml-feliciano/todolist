const taskInput = document.querySelector("#task");
const taskForm = document.querySelector("form");
const taskList = document.querySelector(".collection");
const filterInput = document.querySelector("#filter");
const clearButton = document.querySelector(".clr-btn");
const quoteText = document.querySelector(".quote");
const grayScreen = document.querySelector(".grayscreen");
const alertDiv = document.querySelector(".alert-div");
const message = document.querySelector(".message");


getQuote()
.catch(function(){
    quoteText.innerHTML = "Error getting quote.";
    quoteText.style.color = "red";
}
);
document.body.addEventListener("click", (e) => {
    if(e.target.className.includes('ok-Btn')){
        toggleAlert();
    }
});

loadEventListeners();

function toggleAlert(msg){
    grayScreen.classList.toggle("hide");
    alertDiv.classList.toggle("hide");
    message.textContent = msg;
}

function loadEventListeners(){
    document.addEventListener("DOMContentLoaded", displayTasks);
    taskForm.addEventListener("submit", addTask);
    taskList.addEventListener("click", removeTask);
    clearButton.addEventListener("click", clearTasks);
    filterInput.addEventListener("keyup", filterTasks);
};

function addTask(e){
    if(taskInput.value){
        const task = document.createElement("li");
        task.className = "collection-item";
        task.textContent = taskInput.value;
        taskList.appendChild(task);
        const removeBtn = document.createElement('a');
        removeBtn.className = "remove secondary-content";
        removeBtn.innerHTML = '<i class="material-icons red-text">cancel</i>';
        task.appendChild(removeBtn);
        storeToLocalStorage(taskInput.value);
        taskInput.value = "";
        toggleAlert("Added task.");
    }else{
        toggleAlert("Please add a task.");
    }
    e.preventDefault();
}

function removeTask(e){
    if(e.target.parentElement.className.includes("remove")){
        taskList.removeChild(e.target.parentElement.parentElement);
        removeFromLocalStorage(e.target.parentElement.parentElement.firstChild.textContent);
    }
    toggleAlert("Removed task.");
}

function clearTasks(e){
    while(taskList.firstChild){
        taskList.removeChild(taskList.firstChild);
    }
    localStorage.clear();
    toggleAlert("Cleared all tasks.");
    e.preventDefault();
}

function filterTasks(e){
    const text = filterInput.value.toLowerCase();
    const tasks = document.querySelectorAll(".collection-item");
    tasks.forEach((task) => {
        if(task.firstChild.textContent.toLowerCase().includes(text)){
            task.style.display = "block";
        }else{
            task.style.display = "none";
        }
    });
}

function getLocalStorage(){
    return localStorage.getItem("tasks") === null ? [] : JSON.parse(localStorage.getItem("tasks"));
}

function storeToLocalStorage(task){
    const tasks = getLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeFromLocalStorage(taskEntry){
    const tasks = getLocalStorage();
    tasks.forEach((task, index) => {
        if(task === taskEntry){
            tasks.splice(index, 1);
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks(){
    tasks = getLocalStorage();
    tasks.forEach((storedTask) => {
        const task = document.createElement("li");
        task.className = "collection-item";
        task.textContent = storedTask;
        taskList.appendChild(task);
        const removeBtn = document.createElement('a');
        removeBtn.className = "remove secondary-content";
        removeBtn.innerHTML = '<i class="material-icons red-text">cancel</i>';
        task.appendChild(removeBtn);
    });
}

async function getQuote(){
    const quotes = await axios.get("https://type.fit/api/quotes");
    const randomQuote = quotes.data[Math.floor(Math.random() * quotes.data.length)];
    let author = randomQuote.author;
    if(randomQuote.author === null){author = "Anonymous"};
    quoteText.innerHTML = `"${randomQuote.text}" <br> - ${author}`;
    setTimeout(getQuote, 15000);
}

