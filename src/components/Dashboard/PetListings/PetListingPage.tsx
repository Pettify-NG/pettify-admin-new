"use client";

import Link from "next/link";
import { useState } from "react";
import { FaShoppingBag } from "react-icons/fa";

import Pagination from "@/components/Shared/Paginatioin";
import PetListingsTable from "./PetListingsTable";

export default function PetListingPage () {
    const [selectedPetListings, setSelectedPetListings] = useState<any>([]);

    const handleChangeSelectedPetListings = (e: any) => {
      console.log(e.value);

      setSelectedPetListings(e.value);
    };

    return (
        <section>
          <div className='w-full mb-8 py-4'>
            <div>
              <div className="flex gap-3">
                <FaShoppingBag />

                <h2>Pet Listings</h2>
              </div>
              <Pagination/>
            </div>
    
            {/* Add pet listing button. */}
            <div className='flex my-4 items-center justify-center w-full'>
                <div className='flex items-center gap-[16px]'>
                    <Link href='/dashboard/pets/create'>
                        <button className='rounded-[8px] h-fit w-fit text-[14px] text-white gap-[4px] flex items-center whitespace-nowrap bg-[#ED770B] py-[10px] px-[14px] ' >
                            {/* <FaPlus /> */}
                            Create A New Pet listing
                        </button>
                    </Link>
                </div>
            </div>
          </div>
    
          {/* Pet listings Table */}
          <PetListingsTable
            handleChangeSelectedPetListings={handleChangeSelectedPetListings}
            selectedPetListings={selectedPetListings}
          />
      </section>
    );
};