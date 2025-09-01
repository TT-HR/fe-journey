import axios from "axios"
import { z } from "zod"

const api = axios.create({
    baseURL:"/api",
    timeout:8000
})

export const TodoSchema = z.object({
    id: z.number(),
    title: z.string(),
    done: z.boolean(),
})
export type Todo = z.infer<typeof TodoSchema>;

export async function getTodos(): Promise<Todo[]> {
  const data = await api.get("/todos");
  console.log(data.data)
  return z.array(TodoSchema).parse(data.data);
}

export async function addToTodo(todo: Omit<Todo, "id">): Promise<Todo> {
  const data = await api.post("/todos", todo);
  return TodoSchema.parse(data);
}

export async function updateTodo(id: number,patch:Partial<Omit<Todo,"id">>): Promise<Todo> {
  const data = await api.put(`/todos/${id}`, patch);
  return TodoSchema.parse(data);
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}