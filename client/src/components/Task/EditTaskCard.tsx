import { useState } from "react";
import { UpsertTaskInput } from "../../lib/schema";
import ColorPicker from "./ColorPicker";
import { bgColors } from "../../lib/constants";
import { getMe } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

type EditTaskCardProps = {
  initialValues?: UpsertTaskInput;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: (task: UpsertTaskInput) => Promise<void>;
};

function toInputValueDate(date: Date) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); //date.getMonth() starts at 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; //must be in yyyy-mm-dd format
}

function toInputValueTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`; //must be in hh:mm format
}

function EditTaskCard({
  initialValues,
  setIsEditing,
  onFinish,
}: EditTaskCardProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [dueDate, setDueDate] = useState(
    initialValues?.date && toInputValueDate(initialValues.date),
  );
  const [dueTime, setDueTime] = useState(
    initialValues?.date && toInputValueTime(initialValues.date),
  );
  const [color, setColor] = useState(initialValues?.color ?? "pink");
  const [errors, setErrors] = useState(getEmptyErrors());

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const onSubmit = async () => {
    const userId = initialValues?.userId || meQuery.data?.user.id;
    if (!userId) return;

    const { isValid, errors: validateErrors } = validateTaskInput(
      title,
      description,
      dueDate ?? "",
      dueTime ?? "",
    );
    if (!isValid) {
      setErrors(validateErrors);
      return;
    }
    setErrors(getEmptyErrors());

    const task: UpsertTaskInput = {
      id: initialValues?.id,
      title: title,
      description: description,
      date: new Date(`${dueDate}T${dueTime}`),
      color: color,
      done: initialValues?.done ?? false,
      userId,
    };
    await onFinish(task);
    onCancel();
  };

  const onCancel = () => {
    setIsEditing(false);
    setTitle("");
    setDescription("");
    setDueDate("");
    setColor("pink");
    setDueTime("");
    setErrors(getEmptyErrors());
  };

  return (
    <div className="rounded-2xl border p-2 w-full font-bold text-xl shadow hover:shadow-md transition duration-100 ease-in-out bg-stone-50">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <input
            placeholder="Name"
            className={`rounded-xl border p-2 outline-none ${
              errors.title.length &&
              "outline-3 outline-red-400 outline-offset-0"
            }`}
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          {errors.title.map((error) => (
            <p className="text-sm text-red-400">{error}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <textarea
            placeholder="Description"
            className="rounded-xl border p-2 outline-none"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
          {errors.description.map((error) => (
            <p className="text-sm text-red-400">{error}</p>
          ))}
        </div>
        <div className="flex flex-wrap pl-2 gap-2 items-top justify-start">
          <div className="flex-grow-0 flex flex-col gap-2">
            <input
              type="date"
              className="rounded-xl border p-2 outline-none w-fit"
              value={dueDate}
              onChange={(e) => setDueDate(e.currentTarget.value)}
            />
            {errors.date.map((error) => (
              <p className="text-sm text-red-400">{error}</p>
            ))}
          </div>
          <div className="flex-grow-0 flex flex-col gap-2">
            <input
              type="time"
              className="rounded-xl border p-2 outline-none w-fit"
              value={dueTime}
              onChange={(e) => setDueTime(e.currentTarget.value)}
            />
            {errors.time.map((error) => (
              <p className="text-sm text-red-400">{error}</p>
            ))}
          </div>
          <div className="flex-grow-0 flex flex-row items-baseline gap-2">
            Color:
            <ColorPicker color={color} setColor={setColor} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-xl border py-1 px-3 bg-white"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`rounded-xl py-1 px-3 ${bgColors[color]} text-white`}
            onClick={onSubmit}
          >
            {initialValues?.id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function validateTaskInput(
  title: string,
  description: string,
  date: string,
  time: string,
) {
  const errors = getEmptyErrors();

  if (!title?.length) {
    errors.title.push("Name is required");
  } else if (title?.length > 256) {
    errors.title.push("Name is too long");
  }

  if (description?.length > 1000) {
    errors.description.push("Description is too long");
  }

  if (!date) {
    errors.date.push("Date is required");
  } else if (dayjs(`${date}T${time}`).diff(dayjs()) < 0) {
    errors.date.push("Cannot set date in the past");
  }

  if (!time) {
    errors.time.push("Time is required");
  }

  const isValid = !Object.entries(errors).some(
    ([, fieldErrors]) => fieldErrors.length,
  );

  return { isValid, errors };
}

function getEmptyErrors() {
  return {
    title: [],
    description: [],
    date: [],
    time: [],
  } as Record<string, string[]>;
}

export default EditTaskCard;
