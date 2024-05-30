import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TaskView from "../components/Task/TaskView";
import { createTask, getTasks } from "../lib/api";
import { UpsertTaskInput } from "../lib/schema";

function Tasks() {
  const queryClient = useQueryClient();
  const tasksResult = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasks(),
  });
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const onCreateTask = async (values: UpsertTaskInput) => {
    await createTaskMutation.mutateAsync(values);
  };

  return (
    <div className="space-y-4 w-full lg:w-[800px] h-full mx-auto">
      <TaskView
        tasks={tasksResult.data?.tasks ?? []}
        onCreateTask={onCreateTask}
      />
    </div>
  );
}

export default Tasks;
