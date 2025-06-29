import React from "react";
import Link from "next/link";
import { FaLongArrowAltLeft } from "react-icons/fa";

import { getUserDetails } from "@/libs/products";
import MerchantDetails from "@/components/Dashboard/MerchantComponents/MerchantDetails";
import { IUsers, IUser } from "@/interfaces/users";
import Pagination from "@/components/Shared/Paginatioin";
import Button from "@/components/Global/Button";

export default async function MerchantsDetailsPage ( { params } : { params: { id: string } } ) {

    const apiRes: Promise<IUser | undefined> = getUserDetails(params.id); 
    const userDetails = await apiRes;

    return (
        <>
            <div className='flex flex-col w-full justify-between sm:flex-row lg:items-center gap-8 mb-8'>
                <div>
                    <p className='text-xl font-bold text-gray-700'>Merchant Details</p>
                    <Pagination lastPage="Merchant details"/>
                </div>
                
                <div className='flex items-center gap-4'>
                    <Link href='/admin/merchants'>
                        <Button variant='outlined' color='#ED770B'>
                            <FaLongArrowAltLeft />
                            Go back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* <MerchantDetails
                customer={userDetails}
                transactionHistory={DummyOrders}
            /> */}
        </>
    );
}