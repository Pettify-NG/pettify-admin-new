'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { CiSearch } from 'react-icons/ci';
import { PiExportBold } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa';
import Cookies from 'universal-cookie';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import ENDPOINTS from '@/config/ENDPOINTS';
import Pagination from '../../Shared/Paginatioin';
import TextInput from '../../Global/TextInput';
import Button from '../../Global/Button';
import MerchantsTable from './MerchantsTable';
import { IUsers, IUser } from '@/interfaces/users';
import HTTPService from '@/services/http';

export default function Merchants({
  merchants,
}: {
  merchants?: IUsers | undefined;
}) {
  const [selectedDate, setSelectedDate] = useState<
    Date | (Date | null)[] | Date[] | null | number | undefined
  >(null);

  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedMerchants, setSelectedMerchants] = useState<IUsers>([]);

//   const cookies = new Cookies();
//   const httpService = new HTTPService();

//   const router = useRouter();

  const debouncedSearch = useMemo(() => {
    let timer: NodeJS.Timeout;

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setSearchValue(e.target.value);
      }, 500);
    };

    return handleSearchChange;
  }, []);

  const handleChangeSelectedMerchant = (e: any) => {
    console.log(e.value);

    setSelectedMerchants(e.value);
  }

//   const handleSelectDate = (
//     date: Date | (Date | null)[] | Date[] | null | undefined
//   ) => {
//     if (date) {
//       const formatted = new Date(date as Date);
//       setSelectedDate(formatted.getTime());

//       console.log(formatted.getTime());
//     }
//   };

  return (
    <div>
      <div className='flex flex-col w-full justify-between sm:flex-row lg:items-center gap-8 mb-8'>
        <div>
          <p className='text-xl font-bold text-gray-700'>Merchants</p>
          <Pagination />
        </div>
      </div>

      <section>
        <div className='flex items-center justify-between mb-4'>
          <div className='w-full max-w-md'>
            <TextInput
              placeholder='Search merchants...'
              leftIcon={<CiSearch />}
              onChange={debouncedSearch}
            />
          </div>

          {/* Time filter select */}
          <div>
            <select className='bg-grey-400 '>
              <option value="all-time">All time</option>
              <option value="all-time">12 months</option>
              <option value="30-days">30 Days</option>
              <option value="7-days">7 Days</option>
              <option value="24-hours">24 Hours</option>
            </select>
          </div>
        </div>

        {/* Merchants Table */}
        <MerchantsTable 
          selectedDate={selectedDate} 
          merchants={merchants}
          searchValue={searchValue.toLowerCase()}
          selectedMerchants={selectedMerchants}
          handleChangeSelectedMerchants={handleChangeSelectedMerchant}
        />
      </section>
    </div>
  );
}
