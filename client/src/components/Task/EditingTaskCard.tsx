import { useState } from "react";
import { Task, UpdateTaskInput } from "../../lib/schema";
import { UpdateTaskOutput } from '../../lib/api';
import ColorPicker from "./ColorPicker";
import { bgColors } from "../../lib/constants";

type EditingTaskCardProps = {
  initialTask: Task;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateTask: (task: UpdateTaskInput) => Promise<UpdateTaskOutput>,
};

function toInputValueDate(date: Date) {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') //date.getMonth() starts at 0
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` //must be in yyyy-mm-dd format
}

function toInputValueTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}` //must be in hh:mm format
}

function EditingTaskCard({
  initialTask,
  setIsEditing,
  onUpdateTask,
}: EditingTaskCardProps) {
  const [title, setTitle] = useState(initialTask.title);
  const [description, setDescription] = useState(initialTask.description);
  const [dueDate, setDueDate] = useState(toInputValueDate(initialTask.date));
  const [dueTime, setDueTime] = useState(toInputValueTime(initialTask.date));
  const [color, setColor] = useState(initialTask.color);

  function onUpdate() {
    const task: Task = {
      id: initialTask.id,
      title: title,
      description: description,
      date: new Date(`${dueDate}T${dueTime}`),
      color: color,
      done: initialTask.done,
      userId: initialTask.userId,
    };
    onUpdateTask(task);
    setIsEditing(false);
  };

  function onCancel() {
    setIsEditing(false);
  };

  return (
    <div
      className="rounded-2xl border p-2 w-full font-bold text-xl shadow hover:shadow-md transition duration-100 ease-in-out bg-stone-50"
    >
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
            onClick={onUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>  
  );
};

export default EditingTaskCard;

