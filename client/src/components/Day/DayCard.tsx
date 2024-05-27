import TaskCard from "../Task/TaskCard";
import { Task } from "../../lib/schema";
import { useState } from "react";

function getFormattedDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function defaultTask(date: Date): Task {
  //api call to get a new id here
  let id = -1;

  return {
    title: "New Task",
    description: "Task description.",
    date: date,
    done: false,
    id: id,
    userId: 0, // this value is temporary
  };
}

type DayCardProps = { date: Date; initialTasks: Array<Task> };

function DayCard({ date, initialTasks }: DayCardProps) {
  function addTask() {
    setTasks([...tasks, defaultTask(date)]);
  }

  const [tasks, setTasks] = useState(
    initialTasks.sort(
      (task1, task2) => task1.date.getTime() - task2.date.getTime(),
    ),
  );

  return (
    <div className="w-full pt-4 pb-8">
      <div className="flex justify-between w-full text-2xl py-1 border-b border-gray-900">
        <span>
          <b>{getFormattedDate(date)}</b> {getDayOfWeek(date)}
        </span>
        <svg
          className="cursor-pointer"
          onClick={(e) => {
            e;
            addTask();
          }}
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 45.4 45.4"
        >
          <path d="M41 19H27V4a4 4 0 1 0-8 0v15H4a4 4 0 0 0 0 8h15v14a4 4 0 0 0 4 4c2 0 4-1 4-4V27h14a4 4 0 0 0 0-8z" />
        </svg>
      </div>
      {tasks.map((task) => (
        <TaskCard initialTask={task} />
      ))}
    </div>
  );
}

export default DayCard;
