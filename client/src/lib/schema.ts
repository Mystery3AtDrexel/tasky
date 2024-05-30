export type Task = {
  id: number;
  title: string;
  description: string;
  date: Date;
  color: string;
  done: boolean;
  userId: number;
};

export type InsertTaskInput = Partial<Omit<Task, "id">>;
export type UpsertTaskInput = Partial<Task>;
export type UpdateTaskInput = InsertTaskInput & { id: Task["id"] };

export type User = {
  id: number;
  name: string;
};

export type Filter = ((task: Task) => boolean)