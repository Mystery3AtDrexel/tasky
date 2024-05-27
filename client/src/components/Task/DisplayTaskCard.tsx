import { useState } from "react";
import { DeleteTaskOutput, UpdateTaskOutput } from "../../lib/api";
import { Task, UpdateTaskInput } from "../../lib/schema";
import { IoMdAlert } from "react-icons/io";
import { 

    borderColors, 
    accentColors,
    taskDateFormat,

} from "../../lib/constants";

const dateNow = new Date();

type DisplayTaskCardProps = {
  task: Task;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteTask: (taskId: Task["id"]) => Promise<DeleteTaskOutput>;
  onUpdateTask: (task: UpdateTaskInput) => Promise<UpdateTaskOutput>;
};

function DisplayTaskCard({
  task,
  setIsEditing,
  onDeleteTask,
  onUpdateTask,
}: DisplayTaskCardProps) {
  const [done, setDone] = useState(task.done);
  function changeCheck() {
    onUpdateTask({
      id: task.id,
      title: task.title,
      description: task.description,
      date: task.date,
      color: task.color,
      done: !done,
      userId: task.userId,
    });
    setDone(!done);
  }

  return (
    <div
      className={`rounded-sm flex flex-row w-full p-2 pl-3 border-l-8 bg-stone-50 shadow hover:shadow-md transition duration-100 ease-in-out ${
        borderColors[task.color]
      } ${accentColors[task.color]} ${
        done ? "text-gray-400" : "text-gray-800"
      }`}
    >
      <input
        type="checkbox"
        className={`rounded-full mr-2 mt-2 h-6 w-6 cursor-pointer ${
          borderColors[task.color]
        } ${accentColors[task.color]}`}
        name="done"
        value=""
        defaultChecked={done}
        onClick={() => {
          changeCheck();
        }}
      />

      <div className="w-full">
        <div className="flex flex-row w-full justify-between m-1">
          <div className="flex flex-col pt-[1px]">
            <span className="text-xl font-bold">{task.title}</span> 
            <div className="flex flex-row flex-wrap items-center">
                <span className="text-m pr-2">{taskDateFormat.format(task.date)}</span>
                {task.date < dateNow && <span className={`flex flex-row items-center accent-red-600 text-red-600 font-bold transition duration-100 ease-in-out ${done ? "opacity-0" : "opacity-100"}`}>
                    <span className="pr-1 pt-[3px]"><IoMdAlert /></span> Overdue
                </span>}
            </div>
          </div>
          <div className="flex -mt-1 mr-2">
            {/*editing button*/}
            <svg
              onClick={() => {
                setIsEditing(true);
              }}
              className="mt-1 mr-2 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="2 2 22 22"
            >
              <path d="M8.7 19.1 3 21l1.9-5.7ZM20.4 7.4a2.1 2.1 0 0 0 0-3l-.8-.8a2.1 2.1 0 0 0-3 0l-10 10 3.7 3.8Z" />
            </svg>
            {/*deleting button*/}
            <svg
              onClick={() => {
                onDeleteTask(task.id);
              }}
              className="mt-1 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 461 461"
            >
              <path d="M285 230 456 59c6-6 6-16 0-22L424 5a16 16 0 0 0-22 0L230 176 59 5a16 16 0 0 0-22 0L5 37c-7 6-7 16 0 22l171 171L5 402c-6 6-6 15 0 21l32 33a16 16 0 0 0 22 0l171-171 172 171a16 16 0 0 0 21 0l33-33c6-6 6-15 0-21L285 230z" />
            </svg>
          </div>
        </div>
        <div className="m-1 my-3">
          <span className="text-base break-words">{task.description}</span>
        </div>
      </div>
    </div>
  );
}

export default DisplayTaskCard;
