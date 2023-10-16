"use client";
import { useRouter } from "next/navigation";

export default function EventCard(props) {
  const router = useRouter();

  function redirectToSingleEvent() {
    router.push(`singleEvent/${[props.id]}?id=${props.id}`);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const isCurrentDate = isToday(date);
    const dateClassName = isCurrentDate ? "text-xl font-bold bg-primary-dark" : "text-xl";

    return (
      <button
        onClick={redirectToSingleEvent}
        className={`relative flex flex-col items-left bg-[#303030] justify-between text-white py-4 px-6 font-semibold text-lg rounded-md shadow-lg shadow-[#101010]`}
      >
        <div className="absolute right-0 bottom-0 w-20 h-20 overflow-hidden">
        <div
          style={{
            backgroundColor: `${props.color}`,
          }}
          className="absolute right-4 bottom-[-20px] w-4 h-20 rotate-45"
        ></div>
        </div>
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl text-left text-white">{props.title}</h1>
          <p className={dateClassName}>{`${day} ${month}`}</p>
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="font-semibold text-lg">{props.time.slice(0, 5)}</p>
        </div>
      </button>
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return formatDate(props.date);
}
