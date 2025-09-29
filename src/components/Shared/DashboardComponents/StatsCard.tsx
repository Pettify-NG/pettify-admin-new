import React from 'react';
import Link from 'next/link';
import { BiWallet } from 'react-icons/bi';
import { CiMoneyBill } from 'react-icons/ci';
import { FaPaw } from "react-icons/fa";
import { FaBone } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from 'react-icons/fa6';

export default function StatCards({
  totalBalance,
  totalOrders,
  totalAccessories,
  totalPets,
  totalBuyers,
  totalSellers,
}: {
  totalBalance: number | undefined,
  totalOrders: number | undefined,
  totalPets: number | undefined,
  totalAccessories: number | undefined,
  totalSellers: number | undefined,
  totalBuyers: number | undefined
}) {
  const card_icon_style =
    'h-10 w-10 text-xl flex items-center justify-center rounded-full';
  return (
    <section className='my-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
      {/*  */}
      
      {/* <Link href="/dashboard/wallet"> */}
        <div className='rounded-lg bg-white border border-neural p-6'>
            <span className={`${card_icon_style} bg-[#DEDEFA] text-purple-700`}>
              <CiMoneyBill className='text-2xl fill-[#F2C94C]' />
            </span>
            <p className='my-3 text-neutral text-sm'>Total Revenue</p>

          <div className='flex items-center gap-4'>
            <p className='text-gray-700 text-2xl font-medium'>
                ₦{totalBalance ? (totalBalance).toLocaleString() : (0).toLocaleString()}
            </p>

            {/* <span className='py-1 px-2 bg-green-100 text-green-600 text-xs rounded-full font-semibold'>
              +10%
            </span> */}
          </div>
        </div>
      {/* </Link> */}

      {/*  */}

      <Link href="/dashboard/orders">
        <div className='rounded-lg bg-white border border-neural p-6'>
          <span className={`${card_icon_style} bg-[#FAE1CF] text-blue-700`}>
            <FaShoppingCart className='fill-[#E46A11]'/>
          </span>
          <p className='my-3 text-neutral text-sm'>Total Orders</p>

          <div className='flex items-center gap-4'>
            <p className='text-gray-700 text-2xl font-medium'>
              {totalOrders ? (totalOrders).toLocaleString() : (0).toLocaleString()}
            </p>

            {/* <span className='py-1 px-2 bg-red-100 text-red-600 text-xs rounded-full font-semibold'>
              -25%
            </span> */}
          </div>
        </div>
      </Link>

      {/*  */}

      <Link href="/dashboard/pets">
        <div className='rounded-lg bg-white border border-neural p-6'>
          <span className={`${card_icon_style} bg-[#FAE1CF] text-blue-700`}>
            <FaPaw className='fill-[#E46A11]'/>
          </span>
          <p className='my-3 text-neutral text-sm'>Total Pet Listings</p>

          <div className='flex items-center gap-4'>
            <p className='text-gray-700 text-2xl font-medium'>
              {totalPets ? (totalPets).toLocaleString() : (0).toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      {/*  */}

      <Link href="/dashboard/accessories">
        <div className='rounded-lg bg-white border border-neural p-6'>
          <span className={`${card_icon_style} bg-[#FAE1CF] text-blue-700`}>
            <FaBone className='fill-[#E46A11]'/>
          </span>
          <p className='my-3 text-neutral text-sm'>Total Accessory Listings</p>

          <div className='flex items-center gap-4'>
            <p className='text-gray-700 text-2xl font-medium'>
              {totalAccessories ? (totalAccessories).toLocaleString() : (0).toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      {/*  */}

      <Link href="/dashboard/users">
        <div className='rounded-lg bg-white border border-neural p-6'>
          <span className={`${card_icon_style} bg-[#FAE1CF] text-blue-700`}>
            <FaUser className='fill-[#E46A11]'/>
          </span>
          <p className='my-3 text-neutral text-sm'>Total Buyers</p>

          <div className='flex items-center gap-4'>
            <p className='text-gray-700 text-2xl font-medium'>
              {totalBuyers ? (totalBuyers).toLocaleString() : (0).toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      {/*  */}

      <Link href="/dashboard/merchants">
        <div className='rounded-lg bg-white border border-neural p-6'>
          <span className={`${card_icon_style} bg-[#FAE1CF] text-blue-700`}>
            <FaUser className='fill-[#E46A11]'/>
          </span>
          <p className='my-3 text-neutral text-sm'>Total Merchants</p>

          <div className='flex items-center gap-4'>
            <p className='text-gray-700 text-2xl font-medium'>
              {totalSellers ? (totalSellers).toLocaleString() : (0).toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}
