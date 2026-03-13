import Link from "next/link";
import { FaShoppingBag, FaPlus } from "react-icons/fa";

import Pagination from "@/components/Shared/Paginatioin";
import PushNotificationsTable from "./components/PushNotificationsTable";

export default function PushNotifications () {
    return (
        <section>
          <div className='w-full mb-8 py-4'>
            <div>
              <div className="flex gap-3">
                <FaShoppingBag />

                <h2>Admin Push Notifications</h2>
              </div>
              <Pagination/>
            </div>
    
            {/* Add pet listing button. */}
            <div className='flex my-4 items-center justify-center w-full'>
                <div className='flex items-center gap-[16px]'>
                    <Link href='/dashboard/pets/create'>
                        <button className='rounded-[8px] h-fit w-fit text-[14px] text-white gap-[4px] flex items-center whitespace-nowrap bg-[#ED770B] py-[10px] px-[14px] ' >
                            <FaPlus />
                            Send/schedule push notification
                        </button>
                    </Link>
                </div>
            </div>
          </div>
    
          {/* Push notifications table */}
          <PushNotificationsTable />
      </section>
    )
}