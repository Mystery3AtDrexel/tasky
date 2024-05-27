import dayjs from "dayjs";
import { Task } from "../../lib/schema";
import { useMemo, useState } from "react";
import { getTasks } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { PiArrowLeft, PiArrowRight } from "react-icons/pi";
import { CalendarTaskCard } from "./CalendarTaskCard";

const DAY_MS = 1000 * 60 * 60 * 24;

const calendarTitleDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const onNextMonth = () => setCurrentDate((date) => date.add(1, "month"));
  const onPrevMonth = () => setCurrentDate((date) => date.subtract(1, "month"));

  const dateRange = useMemo(
    () => getMonthDateRange(currentDate.get("month"), currentDate.get("year")),
    [currentDate.get("month"), currentDate.get("year")],
  );

  const tasksFilters = useMemo(() => {
    const startDateString = currentDate.startOf("month").toISOString();
    const endDateString = currentDate.endOf("month").toISOString();
    return {
      date: {
        gte: startDateString,
        lt: endDateString,
      },
    };
  }, [currentDate]);

  const tasksResult = useQuery({
    queryKey: ["tasks", tasksFilters],
    queryFn: () => getTasks({ filters: tasksFilters }),
  });

  const dateTasks = useMemo(
    () => groupTasksByDate(tasksResult.data?.tasks ?? []),
    [tasksResult.data?.tasks],
  );

  return (
    <div className="w-fit h-fit bg-white md:py-8 px-4 lg:max-w-7xl lg:mx-auto lg:px-8 text-4xl">
      <div className="flex flex-row items-end gap-3 mb-8">
        <button
          className="rounded-full hover:bg-gray-100 text-gray-400"
          onClick={onPrevMonth}
        >
          <PiArrowLeft />
        </button>
        <button
          className="rounded-full hover:bg-gray-100 text-gray-400"
          onClick={onNextMonth}
        >
          <PiArrowRight />
        </button>
        <p className="text-4xl font-bold text-gray-800">
          {calendarTitleDateFormat.format(currentDate.toDate())}
        </p>
      </div>
      <div className="inline-flex flex-col space-y-1 items-start justify-start h-full w-full">
        <div className="inline-flex space-x-28 items-start justify-start pr-24 h-fit w-full">
          <p className="w-12 h-full text-sm font-medium text-gray-800 uppercase">
            Monday
          </p>
          <p className="w-12 h-full text-sm font-medium text-gray-800 uppercase">
            Tuesday
          </p>
          <p className="w-12 h-full text-sm font-medium text-gray-800 uppercase">
            Wednesday
          </p>
          <p className="w-12 h-full text-sm font-medium text-gray-800 uppercase">
            Thursday
          </p>
          <p className="w-12 h-full text-sm font-medium text-gray-800 uppercase">
            Friday
          </p>
          <p className="w-12 h-full text-sm font-medium text-gray-800 uppercase">
            Saturday
          </p>
          <p className="w-12 h-full text-sm font-medium text-gray-800 uppercase">
            Sunday
          </p>
        </div>
        <div className="inline-flex flex-col items-start justify-start divide-y divide-gray-200 border border-gray-200">
          {dateRange.map((weekRange, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-start h-full w-full divide-x divide-gray-200"
            >
              {weekRange.map((date) => (
                <div
                  key={getDateHash(date)}
                  className={`inline-flex flex-col gap-1 justify-start w-40 h-40 p-2 text-sm ${
                    currentDate.month() !== date.getMonth() ? "opacity-50" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800">
                    {date.getDate()}
                  </p>
                  <div className="flex-1 flex flex-col gap-1 w-full">
                    {(dateTasks.get(getDateHash(date)) ?? []).map((task) => (
                      <CalendarTaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getMonthDateRange(month: number, year: number) {
  const monthDate = dayjs().set("year", year).set("month", month);
  const monthStartDate = monthDate.startOf("month").startOf("week");
  const monthEndDate = monthDate.endOf("month").endOf("week").endOf("day");

  let curDate = monthStartDate.clone();
  const dates = [];

  do {
    dates.push(curDate.toDate());
    curDate = curDate.add(1, "days");
  } while (curDate.isBefore(monthEndDate));

  const weekDates: Date[][] = [[]];

  for (let i = 0; i < dates.length; ++i) {
    if (i !== 0 && i % 7 === 0) weekDates.push([]);
    weekDates[weekDates.length - 1].push(dates[i]);
  }

  return weekDates;
}

function getDateHash(date: Date) {
  return date.getTime() - (date.getTime() % DAY_MS);
}

function groupTasksByDate(tasks: Task[]) {
  const tasksMap = new Map<number, Task[]>();

  for (const task of tasks ?? []) {
    const hash = getDateHash(task.date);
    if (tasksMap.has(hash)) {
      tasksMap.get(hash)?.push(task);
    } else {
      tasksMap.set(hash, [task]);
    }
  }

  return tasksMap;
}
