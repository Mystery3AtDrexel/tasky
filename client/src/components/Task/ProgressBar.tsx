import { Task } from "../../lib/schema";
import { bgColors } from "../../lib/constants";

function tasksCompletedPercentage(tasks: Task[]) {
  return tasks.filter((task) => (task.done === true)).length / tasks.length * 100;
};

function colorsToDraw(tasks: Task[]) {
  let colors: string[] = [];
  tasks.forEach((task) => (colors.includes(task.color) ? null : colors.push(task.color)));
  return colors;
};

function tasksCompletedPercentagePerColor(color: string, tasks: Task[]) {
  return tasks.filter((task) => (task.done === true && task.color === color)).length / tasks.length * 100;
};

type ProgressBarProps = {
  tasks: Task[];
};

function ProgressBar({tasks}: ProgressBarProps) {
  return (
    <div className="flex-1 rounded-2xl border px-2 pb-4 pt-2 w-full font-bold text-xl shadow hover:shadow-md transition duration-100 ease-in-out bg-stone-50">
      <div className="w-full flex mb-1 justify-between">
        <span className="">Task Progress</span>
        <span className="">{`${tasksCompletedPercentage(tasks).toFixed(0)}%`}</span>
      </div>
      <div className="flex flex-row w-full bg-gray-400 rounded-full h-6 overflow-hidden shadow-md">
        {colorsToDraw(tasks).map((color) => (
          <div 
            className={`${bgColors[color]} h-6`}
            style={{width: `${tasksCompletedPercentagePerColor(color, tasks)}%`}} 
            key={color}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;