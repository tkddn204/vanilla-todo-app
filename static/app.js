class TodoStorage {
  static isEmpty() {
    const todoList = localStorage.getItem("todoList");
    return (
      !todoList ||
      (Object.keys(JSON.parse(todoList)).length === 0 &&
        JSON.parse(todoList).constructor === Object)
    );
  }
  static get() {
    return JSON.parse(localStorage.getItem("todoList"));
  }
  static set(item) {
    if (typeof item === "object") {
      item = JSON.stringify(item);
    }
    return localStorage.setItem("todoList", item);
  }
}

function makeEmptyTodoElement() {
  const todoListElement = document.querySelector("#todo-list");
  const todoElement = document.createElement("div");
  const todoInput = document.createElement("input");
  const id = "_" + Math.random().toString(36).substr(2, 9);
  todoInput.setAttribute("id", id);
  todoInput.addEventListener("keypress", e => {
    if (e.which === 13) {
      const todoList = TodoStorage.get();
      const todoInputValue = todoInput.value;
      if (todoInputValue) {
        const todoId = todoInput.getAttribute("id");
        todoList[todoId] = todoInputValue;
        TodoStorage.set(todoList);
        console.log(TodoStorage.get());
        makeEmptyTodoElement();
      }
    }
  });

  todoElement.appendChild(todoInput);
  todoListElement.appendChild(todoElement);
  todoInput.focus();
}

function makeTodoList() {
  const todoListElement = document.querySelector("#todo-list");

  const todoList = TodoStorage.get();
  for (const todoId in todoList) {
    const todoElement = document.createElement("div");
    const todoInput = document.createElement("input");
    todoInput.setAttribute("id", todoId);
    todoInput.value = todoList[todoId];
    todoInput.addEventListener("keypress", e => {
      if (e.which === 13) {
        const todoList = TodoStorage.get();
        const todoInputValue = todoInput.value;
        if (todoInputValue) {
          const todoId = todoInput.getAttribute("id");
          todoList[todoId] = todoInputValue;
          TodoStorage.set(todoList);
          console.log(TodoStorage.get());
        }
      }
    });

    todoElement.appendChild(todoInput);
    todoListElement.appendChild(todoElement);
  }
  todoListElement.firstChild.firstChild.focus();
  makeEmptyTodoElement();
}

function init() {
  if (TodoStorage.isEmpty()) {
    TodoStorage.set({});
    makeEmptyTodoElement();
  } else {
    makeTodoList();
  }
}

window.addEventListener("DOMContentLoaded", init);
