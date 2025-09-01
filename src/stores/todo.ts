import { ref } from "vue"
import { getTodos, addToTodo, updateTodo, deleteTodo, type Todo } from "@api/http"
import { defineStore } from "pinia"

export const useTodoStore = defineStore("todo", () => {
    const todos = ref<Todo[]>([]);
    const loading = ref(false)

    async function fetchTodos() {
        loading.value = true;
        try {
            todos.value = await getTodos()
        } finally {
            loading.value = false
        }
    }

    //新增
    async function addToDo(title: string) {
        title = title.trim()
        if (!title) return;
        const todo: Todo = { id: Date.now(), title, done: false }
        // 请求保存接口
        addToTodo(todo)
        // 刷新列表
        todos.value = await getTodos()
    }

    //删除
    async function delTodo(id: number) {
        await deleteTodo(id)
        // 刷新列表
        todos.value = await getTodos()
    }

    //更新
    async function upTodo(id: number, title: string) {
        await updateTodo(id, { "title": title })
        todos.value = await getTodos()
    }

    //更新状态
    async function toggleTodo(id: number) {
        const todo = todos.value.find((e) => e.id === id);
        await updateTodo(id, { "done": !todo?.done })
    }

    return { todos, loading, fetchTodos, addToDo, delTodo, upTodo, toggleTodo }
})