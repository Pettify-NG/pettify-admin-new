'use client';

import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta, DataTablePageEvent } from 'primereact/datatable';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { RxPencil2 } from 'react-icons/rx';
import moment from 'moment';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoIosArrowDown } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'universal-cookie';

import ENDPOINTS from '@/src/config/ENDPOINTS';
import { formatCurrency, formatDate } from '@/src/helpers';
import { IUser, IUsers } from '@/src/interfaces/users';
import TablePaginatorTemplate from '../../Shared/TablePaginatorTemplate';

interface LazyTableState {
  first: number;
  rows: number;
  page?: number | undefined;
  pageCount?: number;
  sortField?: string;
  sortOrder?: number;
  filters?: DataTableFilterMeta;
}

export default function UsersTable({
  selectedDate,
  users,
  searchValue,
  selectedUsers,
  handleChangeSelectedUsers,
}: {
  selectedDate: Date | (Date | null)[] | Date[] | null | undefined | number;
  searchValue: string;
  users: IUsers | undefined;
  selectedUsers: IUsers;
  handleChangeSelectedUsers?: (e: any) => void;
}) {
  // const [selectedCustomers, setSelectedCustomers] = useState<
  //   ICustomer[] | null
  // >(null);
  const [rowClick, setRowClick] = useState<boolean>(true);

  const cookies = new Cookies();
  const token = cookies.get('pettify-token');
  console.log(token);

  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [lazyUsers, setLazyUsers] = useState<IUsers | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lazyState, setlazyState] = useState<LazyTableState>({
    first: 0,
    rows: 10,
    page: 1,
  });

  let networkTimeout: string | number | NodeJS.Timeout | null | undefined = null;

  useEffect(() => {
      loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
      setLoading(true);

      if (networkTimeout) {
          clearTimeout(networkTimeout);
      }

      //imitate delay of a backend call
      networkTimeout = setTimeout(() => {
          const fetchData = () => {
              
              // const baseUrl = process.env.API_BASE_URL;
              const baseUrl = "https://pettify-backend.onrender.com/api/v1"
      
              fetch(`${baseUrl}/${ENDPOINTS.ALL_USERS}?page=${lazyState.page}&limit=${lazyState.rows}`, {
                  // headers: {
                  //     Authorization: `Bearer ${token}`,
                  // },
                  cache: 'no-store',
              }).then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response.json();
              }).then(data => {
                  console.log(data);
                  if (data.data) {
                      console.log(data.meta);
                      setTotalRecords(data.meta.totalUsers);
                      setTotalPages(data.meta.totalPages);
                      console.log(data.data);
                      setLazyUsers(data.data.length === 0 ? lazyUsers : data.data);
                      setLoading(false);
                  }
              }).catch(error => {
                  toast.error(error.message);
                  console.error('There was a problem with the fetch operation:', error);
              });
          };
      
          fetchData();
      }, Math.random() * 1000 + 250);
  };

  const onPage = (event: DataTablePageEvent) => {
      setlazyState(event);
      console.log(event);
  };

//   const deleteCustomer = (customerId?: number) => {
//     if(customerId) {
//       try {
//         toast.loading("Deleting customer...");

//         const data = {
//           status: "SUSPENDED"
//         }
  
//         httpService
//           .deleteLikePatch(`${ENDPOINTS.CUSTOMERS}/${customerId}`, data, `Bearer ${token}`)
//           .then((apiRes) => {
//             console.log('Response: ', apiRes);
  
//             toast.dismiss();
//             if (apiRes.status === 200) {
  
//               toast.success('Customer successfully deleted.');
//             }
//           });
//       } catch (error) {
//         console.log(error);
//       }
//     } else {toast.error("Could not delete customer.")}
//   }

  const dateTemplate = (customer: IUser) =>
    moment(customer.createdAt).format('MMM Do YYYY');

//   function amountTemplate(customer: IUser) {
//     return formatCurrency(customer.orderBalance);
//   }

  function actionTemplate(customer: IUser) {
    return (
      <div className='flex items-center gap-3'>
        <Link
          href={`/admin/customers/${customer.id}?edit=false`}
          className='text-xl text-neutral'
        >
          <FaEye />
        </Link>
       {/*  <Link
        {/* <Link
          href={`/admin/customers/${customer.id}?edit=true`}
          className='text-xl text-neutral'
        >
          <RxPencil2 /> 
          <MdOutlineModeEdit />
        </Link>*/}
        <button
        //   onClick={() => deleteCustomer(customer?.id)}
        >
          <RiDeleteBin6Line className='text-xl'/>
        </button>
      </div>
    );
  }

  function customerTemplate(customer: IUser) {
    return (
      <div className='flex items-center gap-4'>
        <Image
          src={customer.profileImage ?? ""}
          alt='image'
          width={20}
          height={20}
          className='h-12 w-12 bg-[#1b1b1b] rounded-md'
        />

        <div className='div capitalize'>
          <p className='text-xs font-medium'>{customer.firstname + " " + customer.lastname}</p>
          <p className='text-xs font-medium'>{customer.username}</p>
          {/* <p className='text-xs text-neutral font-light'>{customer.email}</p>
          <p className='text-xs text-neutral font-light'>{customer.phonenumber}</p> */}
        </div>
      </div>
    );
  }

  const dateChangeHandler = (e: any) => {
    // setSelectedCustomers(e.value);
    handleChangeSelectedUsers!(e.value);
  };

//   function statusTemplate(customer: IUser) {
//     const { status } = customer;

//     let styles = '';

//     switch (status) {
//       case 'ACTIVATED':
//         styles = 'bg-green-100 text-green-600';
//         break;
//       case 'SUSPENDED':
//         styles = 'bg-red-100 text-red-600';
//         break;
//       default:
//         styles = 'bg-yellow-100 text-yellow-600';
//     }

//     return (
//       <span
//         className={`p-2 px-4 text-xs font-semibold rounded-full capitalize ${styles}`}
//       >
//         {customer.status.toLowerCase() === "activated" ? "Active" : customer.status.toLowerCase() === "suspended" ? "Blocked" : customer.status}
//       </span>
//     );
//   }

  const matchedUsers = useMemo(() => {
    if (searchValue.trim().length === 0) return lazyUsers;

    return lazyUsers?.filter(
      (user) =>
        user.firstname.toLowerCase().includes(searchValue) ||
        user.lastname.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
    );
  }, [searchValue, lazyUsers]);

  const router = useRouter();
  console.log(users);

  return (
    <div className='card rounded-md p-4 bg-white border border-gray-200'>
      <div className='px-4 flex flex-col w-full justify-between lg:flex-row lg:items-center gap-8 mb-8'>
        <p className='font-bold text-xl text-gray-700'>Customers Table</p>
      </div>
      <DataTable
        value={matchedUsers ?? []}
        lazy
        first={lazyState.first} 
        onPage={onPage}
        loading={loading}
        totalRecords={totalRecords}
        paginator
        paginatorTemplate={TablePaginatorTemplate(totalRecords)}
        showSelectAll
        selectionAutoFocus={true}
        paginatorClassName='flex justify-between'
        selection={selectedUsers}
        selectionMode={rowClick ? null : 'multiple'}
        onSelectionChange={handleChangeSelectedUsers}
        dataKey='_id'
        tableStyle={{ minWidth: '20rem' }}
        rows={10}
        // rowsPerPageOptions={[20, 50, 100, 250]}
        className='rounded-md'
        // sortOrder={-1}
        sortField='createdAt'
        onRowClick={(e) => router.push(`/admin/users/${e.data._id}`)}
      >
        <Column
          selectionMode='multiple'
          headerStyle={{ width: '3rem' }}
          className=''
          headerClassName='text-sm'
        ></Column>
        <Column
          field='customer.item'
          header='Customer'
          sortable
          body={customerTemplate}
          headerClassName='text-sm'
        ></Column>
        <Column field='email' header='Email Address' sortable headerClassName='text-sm'></Column>
        <Column field='phonenumber' header='Phone' sortable headerClassName='text-sm'></Column>
        <Column field='totalPurchases' header='Purchases' sortable headerClassName='text-sm'></Column>
        <Column field='deliveryAddress' header='Delivery Address' sortable headerClassName='text-sm'></Column>
        {/* <Column field='orders' header='Orders' sortable></Column> */}
        {/* <Column
          field='orderCount'
          header='Order Count'
          body={amountTemplate}
          sortable
          headerClassName='text-sm'
        ></Column> */}
        {/* <Column
          field='orderBalance'
          header='Order Balance'
          body={amountTemplate}
          sortable
          headerClassName='text-sm'
        ></Column> */}
        {/* <Column
          field='status'
          header='Status'
          sortable
          body={statusTemplate}
          headerClassName='text-sm'
        ></Column> */}
        <Column
          field='created'
          header='Created'
          body={dateTemplate}
          sortable
          headerClassName='text-sm'
        ></Column>
        <Column field='action' header='Action' body={actionTemplate} headerClassName='text-sm'></Column>
      </DataTable>
    </div>
  );
}
