"use client";

import Link from "next/link";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";

import Pagination from "@/components/Shared/Paginatioin";
import AccessoriesListingsTable from "./AccessoriesListingTable";

export default function AccessoriesListingPage () {
    const [selectedListings, setSelectedPetListings] = useState<any>([]);

    const handleChangeSelectedListings = (e: any) => {
      console.log(e.value);

      setSelectedPetListings(e.value);
    };

    return (
        <section>
          <div className='w-full mb-8 py-4'>
            <div>
              <div className="flex gap-3">
                <FaShoppingBag />

                <h2>Accessories</h2>
              </div>
              <Pagination/>
            </div>
    
            {/* Add accessories button. */}
            <div className='flex my-4 items-center justify-center w-full'>
                <div className='flex items-center gap-[16px]'>
                    <Link href='/dashboard/accessories/create'>
                        <button className='rounded-[8px] h-fit w-fit text-[14px] text-white gap-[4px] flex items-center whitespace-nowrap bg-[#ED770B] py-[10px] px-[14px] ' >
                            <FaPlus />
                            Create New Accessory Listing
                        </button>
                    </Link>
                </div>
            </div>
          </div>
    
          {/* Product listings Table */}
          <AccessoriesListingsTable
            handleChangeSelectedListings={handleChangeSelectedListings}
            selectedListings={selectedListings}
          />
      </section>
    );
};