import axios from "axios";
import { InsertTaskInput, Task, UpdateTaskInput, User } from "./schema";
import qs from "qs";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

const client = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type GetAuthStateOutput = {
  isAuthenticated: boolean;
};

export const getAuthState = async () =>
  (await client.get<GetAuthStateOutput>("/auth/auth-state")).data;

type GetMeOutput = {
  user: User;
};

export const getMe = async () =>
  (await client.get<GetMeOutput>("/auth/me")).data;

export const postLogout = async () => await client.post("/auth/logout");

type GetTasksInput = {
  filters?: Record<string, any>;
};

type GetTasksOutput = {
  tasks: Task[];
};

export const getTasks = async ({ filters }: GetTasksInput = {}) => {
  const querystring = qs.stringify(filters, { addQueryPrefix: true });
  const res = await client.get<GetTasksOutput>(`/tasks${querystring}`);
  res.data.tasks.forEach((task) => {
    task.date = new Date(task.date);
  });
  return res.data;
};

export type CreateTaskOutput = {
  task: Task;
};

export const createTask = async (task: InsertTaskInput) => {
  const res = await client.post<CreateTaskOutput>("/tasks", task);
  return res.data;
};

export type UpdateTaskOutput = {
  task: Task;
};

export const updateTask = async (task: UpdateTaskInput) => {
  const res = await client.patch<UpdateTaskOutput>(`/tasks/${task.id}`, task);
  return res.data;
};

export type DeleteTaskOutput = {
  task: Task;
};

export const deleteTask = async (taskId: number) => {
  const res = await client.delete<DeleteTaskOutput>(`/tasks/${taskId}`);
  return res.data;
};
