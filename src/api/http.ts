import { z } from "zod"
import api from "@api/request"

export const TodoSchema = z.object({
    id: z.coerce.string(),
    title: z.string(),
    done: z.boolean(),
})
export type Todo = z.infer<typeof TodoSchema>;

export async function getTodos(): Promise<Todo[]> {
  const data = await api.get("/todos");
  return z.array(TodoSchema).parse(data);
}

export async function addToTodo(todo: Todo): Promise<Todo> {
  const data = await api.post("/todos", todo);
  return TodoSchema.parse(data);
}

export async function updateTodo(id: string,patch:Partial<Omit<Todo,"id">>): Promise<Todo> {
  const data = await api.patch(`/todos/${id}`, patch);
  return TodoSchema.parse(data);
}

export async function deleteTodo(id: string): Promise<void> {
  await api.delete(`/todos/${id}`);
}