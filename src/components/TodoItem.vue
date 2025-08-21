<script setup lang="ts">
import { ref , nextTick} from 'vue'
const props = defineProps({
    todo: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['delete', 'toggle', 'updateTodo'])

const isEdit = ref(false)
const editText = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function startEdit() {
    isEdit.value = true
    editText.value = props.todo.title
    nextTick(()=> {
        inputRef.value?.focus()
    })
}

function saveEdit() {
    if (editText.value.trim() && editText.value !== props.todo.title)
        emit('updateTodo', {id:props.todo.id,title:editText})
    isEdit.value = false
}

</script>

<template>
    <li class="cursor-pointer flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100">
        <span v-if="!isEdit" :class="{ 'line-through text-gray-400': todo.done }" class="flex-1 cursor-pointer"
            @click="$emit('toggle', todo.id)" @dblclick="startEdit">{{ todo.title }}
        </span>
        <input v-else v-model="editText" @keyup.enter="saveEdit" @blur="saveEdit" ref="inputRef"
            class="flex-1 border rounded px-2 py-1" autofocus />
        <button class="text-red-500 hover:text-red-700" @click="$emit('delete', todo.id)">Del</button>
    </li>
</template>