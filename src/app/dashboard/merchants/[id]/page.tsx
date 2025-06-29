import React from "react";
import Link from "next/link";
import { FaLongArrowAltLeft } from "react-icons/fa";

import Button from "@/src/components/Global/Button";
import Pagination from "@/src/components/Shared/Paginatioin";
import { IUser } from "@/src/interfaces/users";
import { DummyOrders } from "@/src/interfaces/orders";
import MerchantDetails from "@/src/components/Admin/MerchantComponents/MerchantDetails";
import getUserDetails from "@/src/libs/customers";

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

            <MerchantDetails
                customer={userDetails}
                transactionHistory={DummyOrders}
            />
        </>
    );
}