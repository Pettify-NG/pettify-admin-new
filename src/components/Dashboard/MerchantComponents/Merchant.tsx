'use client';

import React, { useState } from 'react';

import Pagination from '../../Shared/Paginatioin';
import { IUsers } from '@/interfaces/users';
import UsersTable from '../UsersComponents/UsersTable';

export default function Merchants() {
  // const [selectedDate, setSelectedDate] = useState<
  //   Date | (Date | null)[] | Date[] | null | number | undefined
  // >(null);

  const [selectedMerchants, setSelectedMerchants] = useState<IUsers>([]);

  const handleChangeSelectedMerchant = (e: any) => {
    console.log(e.value);

    setSelectedMerchants(e.value);
  }

  return (
    <div>
      <div className='flex flex-col w-full justify-between sm:flex-row lg:items-center gap-8 mb-8'>
        <div>
          <p className='text-xl font-bold text-gray-700'>Merchants</p>
          <Pagination />
        </div>
      </div>

      <section>
        {/* Users Table */}
        <UsersTable 
          userType="merchants"
          selectedUsers={selectedMerchants}
          handleChangeSelectedUsers={handleChangeSelectedMerchant}
        />
      </section>
    </div>
  );
}
