import React from "react";
import Link from "next/link";
import { FaLongArrowAltLeft } from "react-icons/fa";


import { getUserDetails } from "@/libs/products";
import { IUser } from "@/interfaces/users";
import Pagination from "@/components/Shared/Paginatioin";
import Button from "@/components/Global/Button";
// import CustomerDetails from "@/components/Shared/CustomersComponent/CustomerDetails";

export default async function UserDetailsPage ( { params } : { params: { id: string } } ) {

    const apiRes: Promise<IUser | undefined> = getUserDetails(params.id); 
    const userDetails = await apiRes;

    return (
        <>
            <div className='flex flex-col w-full justify-between sm:flex-row lg:items-center gap-8 mb-8'>
                <div>
                    <p className='text-xl font-bold text-gray-700'>User Details</p>
                    <Pagination lastPage="User details"/>
                </div>
                
                <div className='flex items-center gap-4'>
                    <Link href='/admin/users'>
                        <Button variant='outlined' color='#ED770B'>
                            <FaLongArrowAltLeft />
                            Go back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* <CustomerDetails
                customer={userDetails}
                transactionHistory={DummyOrders}
            /> */}
        </>
    );
}