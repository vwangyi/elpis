// TodoList.jsx
import { nextTick, onMounted, ref } from "vue";
import "./style.scss";

// 初始化状态
const todos = ref([
  { text: "学习 Vue 3", done: false },
  { text: "编写 TodoList", done: false },
]);

const newTodo = ref("");

// 添加新任务
const addTodo = () => { 
  if (newTodo.value.trim() !== "") {
    todos.value.push({ text: newTodo.value, done: false });
    newTodo.value = "";
  }
};

// 切换任务完成状态
const toggleTodo = (index) => {
  todos.value[index].done = !todos.value[index].done;
};

// 删除任务
const removeTodo = (index) => {
  todos.value.splice(index, 1);
};

function handleInputValue(value) { 
  // newTodo.value = value
}
const todolist = ref("TODO LIST ");

const center = {
  color: "red",
  border: "1px solid red",
};

function setup() {
  return () => (
    <div class={"container1"}>
      <h1>{todolist.value} </h1>
      <a-input
        value={newTodo.value}
        onInput={(e) => (newTodo.value = e.target.value)}
        type="text"
        placeholder="请输入新的任务"
      />
      <button onClick={addTodo}>添加任务</button>
      <ul>
        {todos.value.map((todo, index) => (
          <div
            key={index}
            style={{ textDecoration: todo.done ? "line-through" : "none" }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(index)}
            />
            {todo.text}
            <button onClick={() => removeTodo(index)}>删除</button>
          </div>
        ))}
      </ul>
    </div>
  );
}
export default { setup };
