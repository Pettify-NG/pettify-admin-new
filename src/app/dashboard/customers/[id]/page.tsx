import React from "react";
import Link from "next/link";
import { FaLongArrowAltLeft } from "react-icons/fa";


// import { DummyOrders } from "@/src/interfaces/orders";
import Button from "@/components/Global/Button";
import Pagination from "@/components/Shared/Paginatioin";
import CustomerDetails from "@/components/Shared/CustomersComponent/CustomerDetails";
import { IUser } from "@/interfaces/users";
import { getUserDetails } from "@/libs/products";

export default async function CustomerDetailsPage ( { params }: { params: { id: string } } ) {

    const apiRes: Promise<IUser | undefined> = getUserDetails(params.id); 
    const customerDetails = await apiRes;

    return (
        <>
            <div className='flex flex-col w-full justify-between sm:flex-row lg:items-center gap-8 mb-8'>
                <div>
                    <p className='text-xl font-bold text-gray-700'>Customer Details</p>
                    <Pagination lastPage="Customer details"/>
                </div>
                
                <div className='flex items-center gap-4'>
                    <Link href='/admin/customers'>
                        <Button variant='outlined' color='#ED770B'>
                            <FaLongArrowAltLeft />
                            Go back
                        </Button>
                    </Link>
                </div>
            </div>

            {/* <CustomerDetails
                customer={customerDetails}
                transactionHistory={DummyOrders}
            /> */}
        </>
    )
}