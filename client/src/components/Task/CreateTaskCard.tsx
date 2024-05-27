import { FaPlus } from "react-icons/fa6";
import { InsertTaskInput } from "../../lib/schema";
import { useState } from "react";
import { CreateTaskOutput, getMe } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import ColorPicker from "./ColorPicker";
import { bgColors } from "../../lib/constants";

type CreateTaskCardProps = {
  onSubmit: (taskInput: InsertTaskInput) => Promise<CreateTaskOutput>;
};

export function CreateTaskCard({ onSubmit }: CreateTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [color, setColor] = useState("pink");
  const [dueTime, setDueTime] = useState("");

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const onStartCreateTask = () => setIsEditing(true);

  const onCancel = () => {
    setIsEditing(false);
    setTitle("");
    setDescription("");
    setDueDate("");
    setColor("pink");
    setDueTime("");
  };

  const onCreate = async () => {
    const taskInput: InsertTaskInput = {
      title,
      description,
      done: false,
      date: new Date(`${dueDate}T${dueTime}`),
      color: color,
      userId: meQuery.data?.user.id,
    };
    await onSubmit(taskInput);
    onCancel();
  };

  return (
    <div
      className={`rounded-2xl border p-2 w-full font-bold text-xl shadow hover:shadow-md transition duration-100 ease-in-out bg-stone-50 ${
        !isEditing ? "cursor-pointer" : ""
      }`}
    >
      {!isEditing && (
        <div
          onClick={onStartCreateTask}
          className="flex justify-center gap-2 items-center"
        >
          <FaPlus />
          <p>Create Task</p>
        </div>
      )}
      {isEditing && (
        <div className="flex flex-col gap-2">
          <input
            placeholder="Name"
            className="rounded-xl border p-2 outline-none"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <textarea
            placeholder="Description"
            className="rounded-xl border p-2 outline-none"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
          <div className="flex flex-wrap pl-2 gap-2 items-center">
            Date:
            <input
              type="date"
              className="rounded-xl border p-2 outline-none w-fit"
              value={dueDate}
              onChange={(e) => setDueDate(e.currentTarget.value)}
            />
            <input
              type="time"
              className="rounded-xl border p-2 outline-none w-fit"
              value={dueTime}
              onChange={(e) => setDueTime(e.currentTarget.value)}
            />
            Color: 
            <ColorPicker 
              color={color}
              setColor={setColor}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="rounded-xl border py-1 px-3 bg-white"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={`rounded-xl py-1 px-3 ${bgColors[color]} text-white`}
              onClick={onCreate}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
