import { useState } from "react";
import { Task, UpdateTaskInput, UpsertTaskInput } from "../../lib/schema";
import DisplayTaskCard from "./DisplayTaskCard";
import { deleteTask, updateTask } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditTaskCard from "./EditTaskCard";

type TaskCardProps = {
  task: Task;
};

function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const onUpdateTask = async (values: UpsertTaskInput) => {
    if (!values.id) return;
    await updateTaskMutation.mutateAsync(values as UpdateTaskInput);
  };

  if (isEditing) {
    return (
      <EditTaskCard
        initialValues={task}
        setIsEditing={setIsEditing}
        onFinish={onUpdateTask}
      />
    );
  }
  return (
    <DisplayTaskCard
      task={task}
      setIsEditing={setIsEditing}
      onDeleteTask={deleteTaskMutation.mutateAsync}
      onUpdateTask={updateTaskMutation.mutateAsync}
    />
  );
}

export default TaskCard;
