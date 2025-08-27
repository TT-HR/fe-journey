import axios from "axios"

export interface ToDo {
  id: number;
  title: string;
  done: boolean;
}
const api = axios.create({
    baseURL:"/api",
    timeout:8000
})

export async function getTodo():Promise<ToDo[]> {
    return (await api.get<ToDo[]>("/todos")).data
}

export async function addTodo(todo:ToDo) {
    return (await api.post<ToDo>("/todos",todo)).data
}

export async function upTodo(id:number,todo:Partial<Omit<ToDo, 'id'>>) {
    return await api.put<ToDo>(`/todos/${id}`,todo)
}

export async function delTodo(id:number):Promise<void> {
    await api.delete(`/todos/${id}`)
}

export async function cleanAll(id:number):Promise<void> {
    await api.delete(`/todos/${id}`)
}