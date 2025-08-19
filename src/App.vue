<script setup lang="ts">
import { ref,onMounted } from 'vue';

const count = ref(0);
const todo = ref('loading...')

function add(){
  count.value++;
}

onMounted(async() =>{
  try{
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    const data = await res.json();
    todo.value = data.title;
  }catch (e){
    todo.value = 'fetch failed'
  }
})

// todolist
interface ToDo{
  id:number,
  title:string,
  done:boolean
}

const todos = ref<ToDo[]>([])

const newToDo = ref("")

function addToDo(){
  if(!newToDo.value.trim()) return
  todos.value.push({
    id:Date.now(),
    title:newToDo.value.trim(),
    done:false,
  })
  newToDo.value = ""
}
function toggleTodo(todo:ToDo){
  todo.done = !todo.done
}

</script>

<template>
  <div class="min-h-full grid place-items-start bg-gray-50">
    <div class ="p-6 rounded-2xl shadow-lg bg-white space-y-4 space-y-4 w-full max-w-md">
      <h1 class ="text-2xl font-bold">Hello Vue 3 + TS + Tailwind</h1>
      <p class = "text-sm opacity-80">Todo:{{ todo }}</p>
      <button class ="px-3 py-1 rounded-2xl shadow" @click="add">+1</button>
      <span class="text-xl font-mono">count:{{count}}</span>
    </div>
  </div>

  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4">
      <h1 class="text-2xl font-bold">TO-DO LIST</h1>
      <div class="flex gap-2">
        <input class="flex-1 border rounded px-2 py-1" v-model="newToDo" 
        @keyup.enter="addToDo"
        placeholder="请输入任务"></input>
        <button @click="addToDo" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">add</button>
      </div>

      <ul class="space-y-2">
        <li v-for="todo in todos"
        :key="todo.id"
        @click="toggleTodo(todo)"
        class="cursor-pointer">
        <span :class="{'line-through text-gray-400': todo.done}">{{todo.title}}</span>
        </li>
      </ul>
    </div>
    

  </div>
</template>

<style>

</style>
