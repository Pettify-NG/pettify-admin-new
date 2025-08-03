'use client';

import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta, DataTablePageEvent } from 'primereact/datatable';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FaEye } from 'react-icons/fa';
import moment from 'moment';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Cookies from 'universal-cookie';
import { FaCircleUser } from "react-icons/fa6";

import ENDPOINTS from '@/config/ENDPOINTS';
import HTTPService from '@/services/http';
import { IUser, IUsers } from '@/interfaces/users';
import { paginatorTemplate } from '@/components/Shared/PaginatorTemplate';
import { useDebounce } from '@/hooks/useDebounce';
import { CiSearch } from 'react-icons/ci';
import TextInput from '@/components/Global/TextInput';

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
  userType,
}: {
  userType: "customers" | "merchants" | "users"
  selectedUsers?: IUsers;
  handleChangeSelectedUsers?: (e: any) => void;
}) {
  const httpService = new HTTPService();

  const cookies = new Cookies();
  const token = cookies.get('pettify-token');

  const [globalFilter, setGlobalFilter] = useState<string>('');
  
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [lazyUsers, setLazyUsers] = useState<IUsers | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lazyState, setlazyState] = useState<LazyTableState>({
    first: 0,
    rows: 10,
    page: 0,
  });

  const type = userType === "customers" ? "customers" : userType === "merchants" ? "merchants" : "users";
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  const loadLazyData = useCallback(() => {
      setLoading(true);

      const fetchData = async () => {
        try {
          const cookies = new Cookies();
          const token = cookies.get('pettify-token');

          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

          const params = new URLSearchParams({
            page: ((lazyState.page ?? 0) + 1).toString(),
            limit: (lazyState.rows).toString(),
            ...(debouncedGlobalFilter && { name: debouncedGlobalFilter }),
          });

          const type = userType === "customers" ? "customers" : userType === "merchants" ? "merchants" : "users";
          const response = await fetch(`${baseUrl}/api/v1/${type === "customers" ? ENDPOINTS.CUSTOMERS : type === "merchants" ? ENDPOINTS.MERCHANTS : ENDPOINTS.ALL_USERS}?${params}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              cache: 'no-store',
          })

          if (!response.ok) {
            throw new Error('An error occured.');
          }
          
          const data = await response.json();

          if (data.data) {
              setTotalRecords(data.meta.totalRecords);
              setTotalPages(data.meta.totalPages);
              setLazyUsers(data.data); 
          }
        
        } catch(error: any) {
          toast.error(error.message);

          console.error('There was a problem with the fetch operation:', error);
        } finally {
          setLoading(false);
        };
      };
  
      fetchData();
  }, [lazyState, userType, debouncedGlobalFilter]);

  useEffect(() => {
    loadLazyData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGlobalFilter, lazyState]);

  const onPage = (event: DataTablePageEvent) => {
    setlazyState(event);
    console.log(event);
  };

  const deleteCustomer = (customerId?: string) => {
    if(customerId) {
      try {
        toast.loading("Deleting user...");
  
        httpService
          .deleteById(`users/${customerId}`, `Bearer ${token}`)
          .then((apiRes) => {  
            toast.dismiss();
            if (apiRes.success) {
              toast.success('User deleted.');
              loadLazyData();
            }
          });
      } catch (error: any) {
        console.log(error);
        toast.dismiss();
        toast.error(error.message);
      }
    } else {toast.error("Could not delete user.")}
  }

  const dateTemplate = (customer: IUser) =>
    moment(customer.createdAt).format('MMM Do YYYY');

  function actionTemplate(customer: IUser) {
   
    return (
      <div className='flex items-center gap-3'>
        <Link
          href={`/dashboard/${type}/${customer._id}?edit=false`}
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
          onClick={() => deleteCustomer(customer?._id)}
        >
          <RiDeleteBin6Line className='text-xl'/>
        </button>
      </div>
    );
  }

  function customerTemplate(customer: IUser) {
    return (
      <div className='flex items-center gap-4'>
        {
          customer.profileImage ? 
            <Image
              src={customer.profileImage ?? ""}
              alt='image'
              width={20}
              height={20}
              sizes='20'
              className='h-12 w-12 bg-[#1b1b1b] rounded-md'
            />
          : <FaCircleUser className="w-12 h-12"/>
        }

        <div className='div capitalize'>
          <p className='text-xs font-medium'>{customer.firstname + " " + customer.lastname}</p>
          <p className='text-xs font-medium'>{customer.username}</p>
        </div>
      </div>
    );
  }

  const router = useRouter();

  return (
    <>
      <div className='justify-between flex items-center gap-3 mb-2 w-full'>
        <div className='w-full max-w-md'>
          <TextInput
            placeholder='Search users...'
            leftIcon={<CiSearch />}
            onChange={(e) => setGlobalFilter(e.target.value)}
            value={globalFilter}
          />
        </div>
      </div>
    
      <div className='card rounded-md p-4 bg-white border border-gray-200'>
        <DataTable
          value={lazyUsers ?? []}
          lazy
          first={lazyState.first} 
          onPage={onPage}
          loading={loading}
          totalRecords={totalRecords}
          paginator
          paginatorTemplate={paginatorTemplate(totalRecords, lazyState.page)}
          // showSelectAll
          selectionAutoFocus={true}
          paginatorClassName='flex justify-between'
          // selection={selectedUsers}
          // selectionMode={rowClick ? null : 'multiple'}
          // onSelectionChange={handleChangeSelectedUsers}
          dataKey='_id'
          tableStyle={{ minWidth: '20rem' }}
          rows={10}
          // rowsPerPageOptions={[20, 50, 100, 250]}
          className='rounded-md'
          // sortOrder={-1}
          sortField='createdAt'
          onRowClick={(e) => router.push(`/dashboard/${type}/${e.data._id}`)}
        >
          {/* <Column
            selectionMode='multiple'
            headerStyle={{ width: '3rem' }}
            className=''
            headerClassName='text-sm'
          ></Column> */}
          <Column
            field='customer.item'
            header='User'
            sortable
            body={customerTemplate}
            headerClassName='text-sm'
          ></Column>
          <Column field='email' header='Email Address' sortable headerClassName='text-sm'></Column>
          <Column field='phonenumber' header='Phone' sortable headerClassName='text-sm'></Column>
          {
            userType !== "merchants" ?
              <Column field='totalPurchases' header='Purchases' sortable headerClassName='text-sm'></Column>
            : null
          }
          {
            userType === "merchants" ?
              <Column field='totalPets' header='Pets' sortable headerClassName='text-sm'></Column> 
            : null
          }
          {
            userType === "merchants" ?
              <Column field='totalAccessories' header='Accessories' sortable headerClassName='text-sm'></Column> 
            : null
          }
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
    </>
  );
}
