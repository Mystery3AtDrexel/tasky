import { FaPlus } from "react-icons/fa6";
import { UpsertTaskInput } from "../../lib/schema";
import { useState } from "react";
import EditTaskCard from "./EditTaskCard";

type CreateTaskCardProps = {
  onSubmit: (taskInput: UpsertTaskInput) => Promise<void>;
};

export function CreateTaskCard({ onSubmit }: CreateTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const onStartCreateTask = () => setIsEditing(true);

  if (isEditing)
    return <EditTaskCard onFinish={onSubmit} setIsEditing={setIsEditing} />;

  return (
    <div
      onClick={onStartCreateTask}
      className="flex justify-center gap-2 items-center rounded-2xl border p-2 w-full font-bold text-xl shadow hover:shadow-md transition duration-100 ease-in-out bg-stone-50 cursor-pointer"
    >
      <FaPlus />
      <p>Create Task</p>
    </div>
  );
}
