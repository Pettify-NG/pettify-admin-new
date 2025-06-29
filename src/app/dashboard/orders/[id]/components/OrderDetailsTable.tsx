'use client';

import Image from 'next/image';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useMemo } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import { formatCurrency } from '@/helpers';
import { IProductItem } from '@/interfaces/orders';

export default function OrdersTable({
  orderList,
}: {
  orderList: IProductItem[];
}) {
  function quantityTemplate(item: IProductItem) {
    return item.quantity;
  }

  function amountTemplate(item: IProductItem) {
    return formatCurrency(item.price);
  }
  function totalTemplate(item: IProductItem) {
    return formatCurrency(item.totalPrice ?? (item.quantity * item.price));
  }

  function productTemplate(item: IProductItem) {
    // const color = `bg-[` + item.color + `]`;

    return (
      <div className='flex items-center gap-4'>
        <Image
          src={item?.productType === "pet" ? item?.product?.pet_images?.[0] ?? "" : item?.product?.accessoryImages?.[0] ?? ""}
          alt={"Product Image"}
          width={20}
          height={20}
          className='h-12 w-12 bg-[#1b1b1b] rounded-md'
        />
        <div className='flex flex-col gap-1'>
          <p className='text-sm flex-1 font-medium'>{(item.productType === "pet" ? item.product.breed : item.product.name) ?? ""}</p>
          {/* <div className='text-xs flex gap-1 items-center '>
            <div style={{ backgroundColor: item.color }} className={`h-4 w-4 rounded`}></div>
            <p className='text-xs text-neutral'>{item.color}</p>
          </div> */}
          <p className='text-sm'>{item?.product?.category ?? ""}</p>
        </div>
      </div>
    );
  }

  const subTotal = useMemo(() => {
    if (orderList) {
      const total = orderList.reduce((a, b: IProductItem) => {
        return a + (b.totalPrice ?? (b.price * b.quantity));
      }, 0);

      return total;
    } else return 0;
  }, [orderList]);

  return (
    <div className='w-full'>
      <DataTable
        value={orderList}
        dataKey='_id'
        key={1}
        tableStyle={{ minWidth: '50rem' }}
        className='rounded-xl text-sm'
        sortOrder={-1}
        sortField='date'
        sortIcon={<IoIosArrowDown />}
      >
        <Column
          body={productTemplate}
          header='Product'
          // style={{ width: '20%' }}
          className='border-b border-b-gray-100'
        />
        <Column
          body={quantityTemplate}
          header='QTY'
          // style={{ width: '20%' }}
          className='border-b border-b-gray-100'
        />
        <Column
          header='Price'
          body={amountTemplate}
          // style={{ width: '20%' }}
          className='border-b border-b-gray-100'
        />
        <Column
          header='Total'
          body={totalTemplate}
          // style={{ width: '20%' }}
          className='border-b border-b-gray-100'
        />
      </DataTable>

      <div className='text-gray-700 text-sm'>
        {/*  Subtotal */}
        <div className='grid grid-cols-2 sm:grid-cols-4 border-b border-b-gray-100 py-6'>
          <div className=''></div>
          <div className=''></div>
          <p className='px-4'>Subtotal</p>
          <p className='px-4'>{formatCurrency(subTotal)}</p>
        </div>

        {/* Delivery Rate */}
        
        {/* <div className='grid grid-cols-2 sm:grid-cols-4 border-b border-b-gray-100 py-6'>
          <div className=''></div>
          <div className=''></div>
          <p className='px-4'>Delivery Price</p>
          <p className='px-4'></p>
        </div> */}

        {/* Shipping Rate */}
        <div className='grid grid-cols-2 sm:grid-cols-4 pt-6 text-gray-800'>
          <div className=''></div>
          <div className=''></div>
          <p className='px-4'>Grand Total</p>
          <p className='px-4'>{formatCurrency(subTotal)}</p>
        </div>
      </div>
    </div>
  );
}
