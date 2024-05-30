import { useState } from "react";
import { Task, UpsertTaskInput } from "../../lib/schema";
import { CreateTaskCard } from "./CreateTaskCard";
import ProgressBar from "./ProgressBar";
import TaskCard from "./TaskCard";
import TaskFilter from "./TaskFilter";

type TaskViewProps = {
  tasks: Task[];
  onCreateTask: (taskInput: UpsertTaskInput) => Promise<void>;
};

function TaskView({ tasks, onCreateTask }: TaskViewProps) {
    const [oldDoneFilter, setOldDoneFilter] = useState(() => (task: Task) => true);
    const [colorFilter, setColorFilter] = useState(() => (task: Task) => true);
    const [dateRangeFilter, setDateRangeFilter] = useState(() => (task: Task) => true);

    let filters = [oldDoneFilter, colorFilter, dateRangeFilter]

    const filteredTasks = filters.reduce((tasks, filter) => (tasks.filter(filter)), tasks)

    return (
        <div className="space-y-2 pb-2">
            <div className="flex flex-row flex-wrap space-y-2 md:flex-nowrap md:space-x-2 md:space-y-0">
                <ProgressBar tasks={filteredTasks} />
                <TaskFilter 
                    tasks={tasks}
                    setOldDoneFilter={setOldDoneFilter}
                    setColorFilter={setColorFilter}
                    setDateRangeFilter={setDateRangeFilter}
                />
            </div>
            <CreateTaskCard onSubmit={onCreateTask} />

      {filteredTasks.map((task) => (
        <TaskCard task={task} key={task.id} />
      ))}
    </div>
  );
}

export default TaskView;
