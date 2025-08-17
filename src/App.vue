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
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-gray-50">
    <div class ="p-6 rounded-2xl shadow-lg bg-white space-y-4 space-y-4 w-full max-w-md">
      <h1 class ="text-2xl font-bold">Hello Vue 3 + TS + Tailwind</h1>
      <p class = "text-sm opacity-80">Todo:{{ todo }}</p>
      <button class ="px-3 py-1 rounded-2xl shadow" @click="add">+1</button>
      <span class="text-xl font-mono">count:{{count}}</span>
    </div>
  </div>
</template>

<style>

</style>
