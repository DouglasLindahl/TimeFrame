"use client"
import { useRouter } from "next/navigation";

export default function EventCard(props) {
    const router = useRouter();

    function redirectToSingleEvent(){
      router.push(`singleEvent/${[props.id]}?id=${props.id}`);
    }


    const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const isCurrentDate = isToday(date);
    const dateClassName = isCurrentDate ? "text-xl font-bold" : "text-xl";


    return (
      <button
        onClick={redirectToSingleEvent}
        style={{
          // borderBottom: `solid 8px ${props.color}`,
          // borderTop: `solid 8px #6C63FF`,
          borderBottom: `solid 8px #6C63FF`,
          // borderLeft: `solid 8px #6C63FF`,
          // borderRight: `solid 8px #6C63FF`,
        }}
        className={`flex flex-col items-left justify-between text-white py-2 px-4 font-medium rounded-xl`}
      >
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl text-left">{props.title}</h1>
          <p className={dateClassName}>{`${day} ${month}`}</p>
        </div>
        <p className="font-medium text-lg">{props.time.slice(0, 5)}</p>
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
