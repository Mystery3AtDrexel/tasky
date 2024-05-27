import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TaskView from "../components/Task/TaskView";
import { createTask, getTasks } from "../lib/api";

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

  return (
    <div className="space-y-4 w-full lg:w-[800px] h-full mx-auto">
      <TaskView
        tasks={tasksResult.data?.tasks ?? []}
        onCreateTask={createTaskMutation.mutateAsync}
      />
    </div>
  );
}

export default Tasks;
