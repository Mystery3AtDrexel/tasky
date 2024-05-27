import { Task } from '../../lib/schema';
import { bgColors } from '../../lib/constants';
import { useState } from 'react';
import { IoFilter, IoCheckmark } from 'react-icons/io5';
import * as Dropdown from "@radix-ui/react-dropdown-menu";

type TaskFilterProps = {
  tasks: Task[];
  setOldDoneFilter: React.Dispatch<React.SetStateAction<((task: Task) => boolean)>>;
  setColorFilter: React.Dispatch<React.SetStateAction<((task: Task) => boolean)>>;
  setDateRangeFilter: React.Dispatch<React.SetStateAction<((task: Task) => boolean)>>;
};

const dateNow = new Date();

function toInputValueDate(date: Date) {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); //date.getMonth() starts at 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; //must be in yyyy-mm-dd format
};

function TaskFilter({ 
  tasks,
  setOldDoneFilter,
  setColorFilter,
  setDateRangeFilter
 }: TaskFilterProps) {
  const taskColors = [...new Set(tasks.map(task => task.color))]

  // how to filter
  const [byColor, setByColor] = useState(false);
  const [byDoneBeforeToday, setByDoneBeforeToday] = useState(false);
  const [byDateRange, setByDateRange] = useState(false);

  const [colorsToFilter, setColorsToFilter] = useState([] as string[]);
  const [startDateRange, setStartDateRange] = useState(toInputValueDate(dateNow));
  const [endDateRange, setEndDateRange] = useState(toInputValueDate(dateNow));

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <div className="flex flex-col flex-none justify-between outline-none rounded-2xl w-full h-full border font-bold text-xl shadow hover:shadow-md transition duration-100 ease-in-out bg-stone-50 cursor-pointer">
          <IoFilter className="m-auto mb-0.5"/>
          <div className="m-auto mt-0.5 px-2">Filters</div>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={-20} className="flex flex-col gap-0.5 p-2 rounded-2xl w-full h-full border text-l shadow hover:shadow-md transition duration-100 ease-in-out bg-stone-50">
          <Dropdown.Item onSelect={(e) => (e.preventDefault())}>
            <button
              className="flex flex-row content-start gap-2 pl-2.5 pr-3.5 py-0.5 rounded-xl border-none justify-start w-full transition hover:bg-stone-300 ease-in-out"
              onClick={() => {
                if (byDoneBeforeToday === true) {setOldDoneFilter(() => (task: Task) => true)}
                else {setOldDoneFilter(() => (task: Task) => !((task.date < dateNow) && (task.done === true)))}
                setByDoneBeforeToday(!byDoneBeforeToday);
              }}
            >
              {byDoneBeforeToday ? (<IoCheckmark className="my-auto w-4" />) : <div className="my-auto w-4"/>}
              Filter Old Tasks
            </button>
          </Dropdown.Item>
          <Dropdown.Separator className="h-[2px] w-full bg-stone-300" />
          <Dropdown.Item onSelect={(e) => (e.preventDefault())}>
            <button
              className="flex flex-row content-start gap-2 pl-2.5 pr-3.5 py-0.5 rounded-xl border-none justify-start w-full transition hover:bg-stone-300 ease-in-out"
              onClick={() => {
                if (byColor === true) {setColorFilter(() => (task: Task) => (true))}
                else {setColorFilter(() => (task: Task) => (colorsToFilter.includes(task.color)))};
                setByColor(!byColor);
              }}
            >
              {byColor ? (<IoCheckmark className="my-auto w-4" />) : <div className="my-auto w-4"/>}
              Filter By Color
            </button>
          </Dropdown.Item>
          {taskColors.map((color) => (
            <Dropdown.Item key={color} onSelect={(e) => (e.preventDefault())}>
              <button
                className={`flex flex-row content-start capitalize gap-2 pl-2.5 pr-3.5 py-0.5 rounded-xl border-none justify-start w-full transition ease-in-out
                  ${
                    colorsToFilter.includes(color) ? `hover:${bgColors[color]} ${bgColors[color]} text-white`
                    : "hover:bg-stone-300"
                  }
                `}
                onClick={byColor ? () => {
                  let newColors = colorsToFilter.includes(color) ? colorsToFilter.filter((c) => c !== color) : [...colorsToFilter, color];
                  setColorsToFilter(newColors);
                  setColorFilter(() => (task: Task) => (newColors.includes(task.color)));
                } : undefined}
              >
                {colorsToFilter.includes(color) ? (<IoCheckmark color="white" className="my-auto w-4" />) : <div className="my-auto w-4"/>}
                {color}
              </button>
            </Dropdown.Item>
          ))}
          <Dropdown.Separator className="h-[2px] w-full bg-stone-300" />
          <Dropdown.Item onSelect={(e) => (e.preventDefault())}>
            <button
              className="flex flex-row content-start gap-2 pl-2.5 pr-3.5 py-0.5 rounded-xl border-none justify-start w-full transition hover:bg-stone-300 ease-in-out"
              onClick={() => {
                if (byDateRange === true) {setDateRangeFilter(() => (task: Task) => (true))}
                else {setDateRangeFilter(() => (task: Task) => (new Date(`${startDateRange}T00:00:00`) <= task.date && new Date(`${endDateRange}T00:00:00`) >= task.date))};
                setByDateRange(!byDateRange);
              }}
            >
              {byDateRange ? (<IoCheckmark className="my-auto w-4" />) : <div className="my-auto w-4"/>}
              Filter By Date Range
            </button>
          </Dropdown.Item>
          <Dropdown.Item onSelect={(e) => (e.preventDefault())} className="flex flex-row content-start gap-2 pl-2.5 pr-3.5 py-0.5 rounded-xl border-none justify-start w-full transition hover:bg-stone-300 ease-in-out">
            <div className="my-auto w-4"/>
            <div>From</div>
            <input 
              className="bg-white border h-full rounded-lg"
              type="date"
              value={startDateRange}  
              onChange={(e) => {
                setStartDateRange(e.target.value);
                if (byDateRange) {setDateRangeFilter(() => (task: Task) => (new Date(`${e.target.value}T00:00:00`) <= task.date && new Date(`${endDateRange}T00:00:00`) >= task.date))}
              }}
            />
          </Dropdown.Item>
          <Dropdown.Item onSelect={(e) => (e.preventDefault())} className="flex flex-row content-start gap-2 pl-2.5 pr-3.5 py-0.5 rounded-xl border-none justify-start w-full transition hover:bg-stone-300 ease-in-out">
            <div className="my-auto w-4"/>
            <div>To</div>            
            <input 
              className="bg-white border h-full rounded-lg"
              type="date"
              value={endDateRange}
              onChange={(e) => {
                setEndDateRange(e.target.value);
                if (byDateRange) {setDateRangeFilter(() => (task: Task) => (new Date(`${startDateRange}T00:00:00`) <= task.date && new Date(`${e.target.value}T00:00:00`) >= task.date))}
              }}
            />
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};

export default TaskFilter;