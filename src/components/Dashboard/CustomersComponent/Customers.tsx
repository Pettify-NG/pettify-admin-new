'use client';

import React, { useState, } from 'react';

import Pagination from '../../Shared/Paginatioin';
import UsersTable from '../UsersComponents/UsersTable';
import { IUser, IUsers } from '@/interfaces/users';

export default function Customers() {
  // const [selectedDate, setSelectedDate] = useState<
  //   Date | (Date | null)[] | Date[] | null | number | undefined
  // >(null);

  const [selectedUsers, setSelectedUsers] = useState<IUsers>([]);

  const handleChangeSelectedUser = (e: any) => {
    console.log(e.value);

    setSelectedUsers(e.value);
  }

  return (
    <div>
      <div className='flex flex-col w-full justify-between sm:flex-row lg:items-center gap-8 mb-8'>
        <div>
          <p className='text-xl font-bold text-gray-700'>Users</p>
          <Pagination />
        </div>
      </div>

      <section>
        {/* Users Table */}
        <UsersTable 
          userType="customers"
          selectedUsers={selectedUsers}
          handleChangeSelectedUsers={handleChangeSelectedUser}
        />
      </section>
    </div>
  );
}
