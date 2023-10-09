import Link from "next/link";
export default function EventCard(props) {
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0'); // Add leading zeros if necessary
      const month = date.toLocaleString('en-US', { month: 'short' });
      return `${day} ${month}`;
    };
  
    const formattedDate = formatDate(props.start_date);
    const isCurrentDay = new Date().toDateString() === props.start_date.toDateString();
    const dateClassName = isCurrentDay ? 'font-bold' : '';
  
    return (
      <>
        <Link href="home" className="flex items-center justify-between bg-amber-300 py-2 px-4 rounded-xl">
          <h1 className="text-2xl">{props.title}</h1>
          <span className={`text-xl ${dateClassName}`}>{formattedDate}</span>
        </Link>
      </>
    );
  }
  