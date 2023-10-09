import Link from "next/link";

export default function EventCard(props) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const isCurrentDate = isToday(date);

    const dateClassName = isCurrentDate ? "text-xl font-bold" : "text-xl";

    return (
      <Link
        style={{
          borderBottom: `solid 8px ${props.color}`,
          borderTop: `solid 2px ${props.color}`,
          borderLeft: `solid 2px ${props.color}`,
          borderRight: `solid 2px ${props.color}`,
        }}
        href="home"
        className={`flex flex-col items-left justify-between text-black py-2 px-4 font-medium rounded-xl`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{props.title}</h1>
          <span className={dateClassName}>{`${day} ${month}`}</span>
        </div>
        <p className="font-medium text-lg">{props.time.slice(0, 5)}</p>
      </Link>
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
