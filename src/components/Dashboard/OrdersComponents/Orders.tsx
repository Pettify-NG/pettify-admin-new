'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';

import OrdersTable from './OrdersTable';
import Pagination from '../../Shared/Paginatioin';
import IOrder from '@/interfaces/orders';

export default function Orders() {
  const [selectedOrders, setSelectedOrders] = useState<IOrder[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  return (
    <>
      <div className='flex flex-col w-full justify-between sm:flex-row lg:items-center gap-8 mb-4 py-4'>
        <div>
          <p className='text-xl font-medium text-gray-700'>Orders</p>
          <Pagination /> 
        </div>
      </div>

      {/* <div className='justify-between flex flex-wrap items-center gap-4 mb-2 w-full'>
        <div className='w-full max-w-md'>
          <TextInput
            placeholder='Search orders...'
            leftIcon={<CiSearch />}
            onChange={debouncedSearch}
            value={searchValue}
          />
        </div>
      </div> */}

      {/* Orders Table */}
      <OrdersTable />
    </>
  );
}
