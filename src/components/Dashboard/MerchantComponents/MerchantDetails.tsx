"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";

import logo from "../../../../public/Pettify.png"
import { IUser } from "@/src/interfaces/users";
import { IOrder, OrderProductItem } from "@/src/interfaces/orders";
import { FaEye } from "react-icons/fa";
import { formatCurrency } from "@/src/helpers";
import { CiMoneyBill } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { TbLineScan } from "react-icons/tb";

interface ICustomerDetails {
    customer: IUser | undefined
    transactionHistory: IOrder[] | undefined | null
}

const card_icon_style =
'h-10 w-10 text-xl flex items-center justify-center rounded-full';

const MerchantDetails = ({ customer, transactionHistory }: ICustomerDetails) => {

    const router = useRouter();

    const dateTemplate = (order: IOrder) => {
        const { createdAt } = order;

        return moment(createdAt).format('MMM Do YYYY');
    };
    
    function amountTemplate(order: IOrder) {
      const { orderProduct } = order;

      const totalAmount = orderProduct.reduce((a, b: OrderProductItem) => {
          return a + b.amount;
      }, 0);

      return formatCurrency(totalAmount);
    }
    
    function actionTemplate(order: IOrder) {
        return (
            <div className='flex items-center gap-3'>
                <Link
                    href={`/admin/orders/${order.id}`}
                    className='text-xl text-neutral'
                >
                    <FaEye />
                </Link>
            </div>
        );
    }
    
    function statusTemplate(order: IOrder) {
        const { status } = order;

        let styles = '';

        switch (status.toLowerCase()) {
            case 'processing':
            styles = 'bg-orange-100 text-orange-600';
            break;
            case 'shipped':
            styles = 'bg-[#E8F8FD] text-[#13B2E4]';
            break;
            case 'delivered':
            styles = 'bg-green-100 text-green-600';
            break;
            case 'cancelled' || 'refunded':
            styles = 'bg-red-100 text-red-600';
            break;
            case 'packed':
            styles = 'bg-[#E8F8FD] text-[#13B2E4]';
            break;
            default:
            styles = 'bg-purple-50 text-purple-600';
            break;
        }

        return (
            <span className={`p-2 px-4 text-xs font-medium rounded-full ${styles}`}>
            {order.status}
            </span>
        );
    }

    function productTemplate(order: IOrder) {
        return (
            <div className='flex items-center gap-4'>
                <Image
                    // src={order.orderProduct[0].image}
                    src={""}
                    alt='image'
                    width={20}
                    height={20}
                    className='h-12 w-12 bg-[#1b1b1b] rounded-md'
                />

                <div className='div capitalize'>
                    <p className='text-xs flex-1 font-medium'>
                    {order.orderProduct[0].productName}
                    </p>
                    {order.orderProduct.length > 1 && (
                    <p className='text-xs text-neutral'>
                        +{order.orderProduct.length} pet(s)
                    </p>
                    )}
                </div>
            </div>
        );
    }

    function customerTemplate(order: IOrder) {
        return (
            <div className='flex flex-col gap-2 capitalize'>
                <p className='text-sm flex-1 font-medium'>{order.customer.firstName + " " + order.customer.lastName}</p>
                {/* <p className='text-xs text-neutral'>{order.receiverPhone}</p> */}
                <p className='text-xs text-neutral'>{order.customer.email}</p>
            </div>
        );
    }

    function merchantTemplate(order: IOrder) {
        return (
            <div className='flex flex-col gap-2 capitalize'>
                <p className='text-sm flex-1 font-medium'>{order.merchant.firstName + " " + order.merchant.lastName}</p>
                {/* <p className='text-xs text-neutral'>{order.receiverPhone}</p> */}
                <p className='text-xs text-neutral'>{order.merchant.email}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Top section: displays customer profile image and username */}
            <section className="flex items-center justify-center w-full">
                <div className="py-4">
                    <Image
                        src={logo}
                        alt="Customer image"
                        height={100}
                        width={100}
                        className="rounded-full w-[100px] h-[100px]"
                    />

                    <div className="flex gap-2 mt-2">
                        <p>Username:</p>
                        <p className="font-semibold text-black">{customer?.username}</p>
                    </div>
                </div>
            </section>

            {/* Other customer details */}
            <section className="border border-gray-400 w-full rounded-md p-4">
                <div className="space-y-4 m-auto">
                    <div className="flex gap-2">
                        <p>Firstname:</p>
                        <p className="font-semibold text-black">{customer?.firstname}</p>
                    </div>

                    <div className="flex gap-2">
                        <p>Lastname:</p>
                        <p className="font-semibold text-black">{customer?.lastname}</p>
                    </div>

                    <div className="flex gap-2">
                        <p>Phone:</p>
                        <p className="font-semibold text-black">{customer?.phonenumber}</p>
                    </div>

                    <div className="flex gap-2">
                        <p>Email address:</p>
                        <p className="font-semibold text-black">{customer?.email}</p>
                    </div>

                    <div className="flex gap-2">
                        <p>Address:</p>
                        <p className="font-semibold text-black">{customer?.deliveryAddress}</p>
                    </div>
                </div>
            </section>

            {/* Total revenue, total listings, and total transactions */}
            <section className='my-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
              {/*  */}

              <div className='rounded-lg bg-white border border-neural p-6'>
                  <span className={`${card_icon_style} bg-[#DEDEFA] text-purple-700`}>
                    <CiMoneyBill className='text-2xl fill-[#F2C94C]' />
                  </span>
                <p className='my-3 text-neutral text-sm'>
                    Total Revenue
                </p>

                <div className='flex items-center gap-4'>
                  <p className='text-gray-700 text-3xl font-medium'>
                    {/* ${(59000).toLocaleString()} */}
                    {formatCurrency(customer?.totalAmountSpent ?? 0)}
                  </p>
                </div>
              </div>

              {/*  */}
              
              <div className='rounded-lg bg-white border border-neural p-6'>
                <span className={`${card_icon_style} bg-[#CFE7DC] text-green-800`}>
                  <FiShoppingCart className='fill-[#0D894F]'/>
                </span>
              
                <p className='my-3 text-neutral text-sm'>Listings</p>

                <div className='flex items-center gap-4'>
                  <p className='text-gray-700 text-3xl font-medium'>
                    {/* {(990).toLocaleString()} */}
                    {customer?.totalListings ?? 0}
                  </p>
                </div>
              </div>
              
              {/*  */}

              <div className='rounded-lg bg-white border border-neural p-6'>
                <span className={`${card_icon_style} bg-[#FCDAD7] text-pink-700`}>
                  <TbLineScan className="fill-[#F04438]"/>
                </span>
                <p className='my-3 text-neutral text-sm'>Total Transacitons</p>

                <div className='flex items-center gap-4'>
                  <p className='text-gray-700 text-3xl font-medium'>
                    {/* {(112).toLocaleString()} */}
                    {transactionHistory?.length ?? 0}
                  </p>
                </div>
              </div>

              {/*  */}
            </section>

            {/* Merchant transaction history table */}
            <section>
                <div className='card rounded-xl p-4 bg-white border border-gray-200'>
                    <div className='px-4 flex flex-col w-full justify-between lg:flex-row lg:items-center gap-8 mb-8'>
                        <p className='font-bold text-xl text-gray-700'>Transaction History</p>
                    </div>

                    <DataTable
                        value={transactionHistory ?? []}
                        dataKey='uuid'
                        tableStyle={{ minWidth: '50rem' }}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[20, 50, 100, 250]}
                        className='rounded-md text-sm'
                        sortOrder={-1}
                        sortField='createdAt'
                        selectionAutoFocus={true}
                        onRowClick={(e) => router.push(`/admin/orders/${e.data.id}`)}
                    >
                        <Column field='uuid' header='Order ID' className='text-[#F2C94C]'/>
                        <Column body={productTemplate} header='Product' />
                        
                        <Column
                        // field='customer.email'
                        body={customerTemplate}
                        header='Customer'
                        />
                        <Column
                        // field='customer.email'
                        body={merchantTemplate}
                        header='Merchant'
                        />
                        <Column field='date' header='Date' body={dateTemplate} sortable />
                        <Column
                        field='totalAmount'
                        header='Price'
                        body={amountTemplate}
                        sortable
                        />
                        <Column header='Payment' field="paymentMethod" />
                        <Column field='status' header='Status' sortable body={statusTemplate} />
                        <Column field='action' header='Action' body={actionTemplate} />
                    </DataTable>
                </div>
            </section>
        </div>
    )
};

export default MerchantDetails;