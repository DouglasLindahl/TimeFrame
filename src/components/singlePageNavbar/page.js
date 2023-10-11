import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabase";

export default function SinglePageNavbar(props) {
  const router = useRouter();
  const [isConfirmingRemoval, setConfirmingRemoval] = useState(false);

  const removeEvent = async () => {
    const { error } = await supabase.from("Events").delete().eq("id", props.id);
    router.push(`/home`);
  };

  const confirmRemoveEvent = () => {
    setConfirmingRemoval(true);
  };

  const denyRemoveEvent = () => {
    setConfirmingRemoval(false);
  };

  return (
    <>
      {isConfirmingRemoval && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-dark p-4 rounded-lg shadow-md text-white">
          <h2 className="text-2xl mb-4">
            Are you sure you want to delete this event?
          </h2>
          <div className="flex gap-4">
            <button onClick={removeEvent} className="bg-success-dark text-white w-full py-2 rounded-md hover:bg-secondary-dark">
              Remove Event
            </button>
            <button
              onClick={denyRemoveEvent}
              className="bg-white text-primary-dark w-full py-2 rounded-md hover:bg-primary-dark hover:text-white hover:outline hover:outline-2 hover:outline-white transform"
            >
              Keep Event
            </button>
          </div>
        </div>
      )}

      <div className="w-full px-4 py-4 ">
        <div className="container mx-auto flex justify-between items-center">
          <div className="inline-flex">
            <Link
              href="/home"
              className="flex gap-2 pl-4 pr-6 py-2 bg-primary-dark rounded-full cursor-pointer"
            >
              <img
                src="/icons/arrowWhite.svg"
                width="18px"
                alt="Return"
                style={{ transform: "rotate(90deg)" }}
              />
              <p className="text-white text-lg">Return</p>
            </Link>
          </div>
          <button
            onClick={confirmRemoveEvent}
            className="flex text-lg text-white gap-2 pl-6 pr-6 py-2 bg-secondary-dark rounded-full cursor-pointer"
          >
            Remove Event
          </button>
        </div>
      </div>
    </>
  );
}
