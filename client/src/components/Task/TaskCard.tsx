import { useState } from 'react';
import { Task } from '../../lib/schema';
import DisplayTaskCard from './DisplayTaskCard';
import EditingTaskCard from './EditingTaskCard';
import { deleteTask, updateTask } from '../../lib/api';
import { useMutation, useQueryClient } from "@tanstack/react-query";

type TaskCardProps = { 
  task: Task,
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

  if (isEditing) {
    return (
      <EditingTaskCard 
        initialTask={task} 
        setIsEditing={setIsEditing} 
        onUpdateTask={updateTaskMutation.mutateAsync}
      />
    );
  };
  return (
    <DisplayTaskCard 
      task={task} 
      setIsEditing={setIsEditing} 
      onDeleteTask={deleteTaskMutation.mutateAsync}
      onUpdateTask={updateTaskMutation.mutateAsync}
    />
  );
};

export default TaskCard;
