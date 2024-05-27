type AvatarProps = {
  firstName: string;
  lastName: string;
};

export default function Avatar({ firstName, lastName }: AvatarProps) {
  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      <span className="text-xl text-gray-600 dark:text-gray-300">
        {firstName[0]?.toUpperCase() ?? ""}
        {lastName[0]?.toUpperCase() ?? ""}
      </span>
    </div>
  );
}
