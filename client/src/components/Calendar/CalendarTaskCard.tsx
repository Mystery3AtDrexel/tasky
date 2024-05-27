import { PiArrowCircleLeft } from "react-icons/pi";
import { bgColors, taskDateFormat } from "../../lib/constants";
import { Task } from "../../lib/schema";
import * as Popover from "@radix-ui/react-popover";

type CalendarTaskCardProps = {
  task: Task;
};

export function CalendarTaskCard({ task }: CalendarTaskCardProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={`text-left text-white font-medium w-full p-1 rounded text-ellipsis text-nowrap overflow-hidden cursor-pointer ${
            bgColors[task.color]
          }`}
        >
          {task.title}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="right" sideOffset={4}>
          <div className="rounded-lg shadow-md p-2 bg-white border border-gray-200 w-[350px] space-y-1">
            <div className="flex justify-between">
              <p className="font-bold text-lg">{task.title}</p>
              <Popover.Close asChild>
                <PiArrowCircleLeft className="cursor-pointer text-2xl" />
              </Popover.Close>
            </div>
            <div>{taskDateFormat.format(task.date)}</div>
            <p>{task.description}</p>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
