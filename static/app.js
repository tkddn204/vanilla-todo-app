/**
 * @class TodoModel
 *
 * Todo 목록 저장소(모델)
 */
class TodoModel {
  storageName = "todoList";
  constructor() {
    this.todoList = JSON.parse(localStorage.getItem(this.storageName)) || [];
  }

  bindTodoListChanged(cb) {
    this.onTodoListChanged = cb;
  }

  _commit(todoList) {
    this.onTodoListChanged(todoList);
    localStorage.setItem(this.storageName, JSON.stringify(todoList));
  }

  addTodo(todoText) {
    const todoId = "_" + Math.random().toString(36).substr(2, 9);
    const todo = {
      id: todoId,
      text: todoText,
      complete: false
    };

    this.todoList.push(todo);
    this._commit(this.todoList);
  }

  editTodo(id, updatedText) {
    this.todoList = this.todoList.map(todo =>
      todo.id === id
        ? {
            id: todo.id,
            text: updatedText,
            complete: todo.complete
          }
        : todo
    );

    this._commit(this.todoList);
  }

  deleteTodo(id) {
    this.todoList = this.todoList.filter(todo => toto.id !== id);

    this._commit(this.todoList);
  }

  toggleTodoCheck(id) {
    this.todoList = this.todoList.map(todo =>
      todo.id === id
        ? {
            id: todo.id,
            text: todo.text,
            complete: !todo.complete
          }
        : todo
    );

    this._commit(this.todoList);
  }

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

/**
 * @class todoView
 *
 * todo 목록을 보여주는 클래스
 */
class TodoView {
  constructor() {
    this.root = document.querySelector("#root");
    this._initView();
    this._initLocalListeners();
  }

  _initView() {
    this.form = this.createElement("form");
    this.input = this.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "할 일 입력";
    this.input.name = "todo";
    this.submitButton = this.createElement("button");
    this.submitButton.textContent = "추가";
    this.form.append(this.input, this.submitButton);

    this.title = this.createElement("h1");
    this.title.textContent = "할 일 목록";
    this.todoList = this.createElement("ul", "todo-list");
    this.root.append(this.title, this.form, this.todoList);
  }

  get _todoText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.value = "";
  }

  _resetTodoList() {
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  displayTodoList(todoList) {
    this._resetTodoList();

    if (todoList.length === 0) {
      const p = this.createElement("p");
      p.textContent = "할 일을 추가해주세요!";
      this.todoList.append(p);
    } else {
      todoList.forEach(todo => {
        const li = this.createElement("li");
        li.id = todo.id;

        const checkbox = this.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.complete;

        const span = this.createElement("span");
        span.contentEditable = true;
        span.classList.add("editable");

        if (todo.complete) {
          const strike = this.createElement("s");
          strike.textContent = todo.text;
          span.append(strike);
        } else {
          span.textContent = todo.text;
        }

        const deleteButton = this.createElement("button", "delete");
        deleteButton.textContent = "삭제";
        li.append(checkbox, span, deleteButton);

        this.todoList.append(li);
      });
    }
  }

  _initLocalListeners() {
    this.todoList.addEventListener("input", event => {
      if (event.target.className === "editable") {
        this._editTodoText = event.target.innerText;
      }
    });
  }

  bindAddTodo(handler) {
    this.form.addEventListener("submit", event => {
      event.preventDefault();

      if (this._todoText) {
        handler(this._todoText);
        this._resetInput();
      }
    });
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener("click", event => {
      if (event.target.className === "delete") {
        const id = event.target.parentElement.id;
        handler(id);
      }
    });
  }

  bindEditTodo(handler) {
    this.todoList.addEventListener("focusout", event => {
      if (this._editTodoText) {
        const id = event.target.parentElement.id;
        handler(id, this._editTodoText);
        this._editTodoText = "";
      }
    });
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener("change", event => {
      if (event.target.type === "checkbox") {
        const id = event.target.parentElement.id;
        handler(id);
      }
    });
  }
}

/**
 * @class TodoController
 *
 * 모델과 뷰를 컨트롤하는 컨트롤러
 *
 * @param model 할 일 모델
 * @param view 할 일 뷰
 */
class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.bindTodoListChanged(this.onTodoListChanged);
    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindEditTodo(this.handleEditTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);

    this.onTodoListChanged(this.model.todoList);
  }

  onTodoListChanged = todoList => this.view.displayTodoList(todoList);
  handleAddTodo = todoText => this.model.addTodo(todoText);
  handleEditTodo = (id, todoText) => this.model.editTodo(id, todoText);
  handleDeleteTodo = id => this.model.deleteTodo(id);
  handleToggleTodo = id => this.model.toggleTodoCheck(id);
}

new TodoController(new TodoModel(), new TodoView());
