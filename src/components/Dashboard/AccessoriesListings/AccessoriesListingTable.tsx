"use client"

import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta, DataTablePageEvent } from "primereact/datatable";
import moment from "moment";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa6";
import Link from "next/link";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";

import { IListing } from "@/interfaces/listings";
import { formatCurrency, calculatePetAge } from "@/helpers";
import useLocalStorage from "@/hooks/useLocalStorage";
import { paginatorTemplate } from "@/components/Dashboard/OrdersComponents/OrdersTable";
import HTTPService from "@/services/http";
import Modal from "@/components/Global/Modal";
import ENDPOINTS from "@/config/ENDPOINTS";
import Button from "@/components/Global/Button";

interface IPetListingsTable {
    searchValue: string;
    selectedDate: number | null;
    handleChangeSelectedListings: (e: any) => void;
    selectedListings: any;
}

export interface LazyTableState { 
    first: number; 
    rows: number; 
    page?: number | undefined; 
    pageCount?: number; 
    sortField?: string; 
    sortOrder?: number; 
    filters?: DataTableFilterMeta; 
}

export default function AccessoriesListingsTable ({
    searchValue,
    selectedDate,
    handleChangeSelectedListings,
    selectedListings,
}: IPetListingsTable) {  
    const router = useRouter();
    
    const httpService = new HTTPService();

    const cookies = new Cookies(); 
    const token = cookies.get("pettify-token"); 
  
    const [rowClick, setRowClick] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0); 
    const [totalPages, setTotalPages] = useState<number>(0); 
    const [lazyListings, setLazyListings] = useState<IListing[] | null>(null); 
    const [loading, setLoading] = useState<boolean>(false); 
    const [lazyState, setlazyState] = useState<LazyTableState>({ 
       first: 0, 
       rows: 10, 
       page: 0, 
    }); 

   const [timeFilter, setTimeFilter] = useState<string>("All-time");

    const loadLazyData = useCallback(() => { 
          setLoading(true); 
     
          //imitate delay of a backend call 
              const fetchData = () => { 
                  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 
           
                  fetch(`${baseUrl}/api/v1/accessories/admin?page=${(lazyState.page ?? 0) + 1}&limit=${lazyState.rows}&type=${timeFilter}`, { 
                    headers: {
                      "Authorization": `Bearer ${token}`,
                    },
                    cache: 'no-store', 
                  }).then(response => { 
                      if (!response.ok) { 
                          throw new Error('Network response was not ok'); 
                      } 
                      return response.json(); 
                  }).then(data => { 
                          console.log(data.meta); 
                          setTotalRecords(data.meta.totalRecords); 
                          setTotalPages(data.meta.totalPages); 
                          console.log(data.data); 
                          setLazyListings(data.data); 
                          setLoading(false); 
                  }).catch(error => { 
                      toast.error(error.message); 
                      console.error('There was a problem with the fetch operation:', error); 
                  }); 
              }; 
           
              fetchData(); 
    }, [lazyState, timeFilter, token]);
    
     useEffect(() => { 
        loadLazyData(); 
     }, [loadLazyData]); 
    
     const onPage = (event: DataTablePageEvent) => {  
        setlazyState(event);
        console.log(event); 
     }; 
  
    const dateTemplate = (listing: IListing) =>
      moment(listing.createdAt).format('MMM Do YYYY');
  
    function amountTemplate(listing: IListing) {
      return formatCurrency(+listing.price);
    }

    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [toBeDeleted, setToBeDeleted] = useState<string>();
  
    async function deleteAccessory(id: string | undefined) {  
        toast.loading('Deleting accessory...');
  
        const res = await httpService.deleteById(
          `${ENDPOINTS.ACCESSORY}/${id}`,
          `Bearer ${token}`
        );
  
        toast.dismiss();
        if (res.success) {
          console.log(res);
          toast.success('Accessory deleted.');

          setDeleteModal(false);

          router.refresh();
          loadLazyData();
        } else toast.error('Could not delete accessory.');
    }
  
    function actionTemplate(listing: any) {
      return (
        <div className='flex items-center gap-3'>
          <Link
            href={`/dashboard/accessories/${listing._id}`}
            className='text-xl text-neutral'
          >
            <FaEye />
          </Link>
          <Link
            href={`/dashboard/accessories/${listing._id}/edit`}
            className='text-xl text-neutral'
          >
            <MdOutlineModeEdit />
          </Link>
          <button onClick={() => {
            setDeleteModal(true);
            setToBeDeleted(listing._id);
          }}>
            <RiDeleteBin6Line className='text-xl' />
          </button>
        </div>
      );
    }
  
    function checkIfUrl(imageUrl: string) {
      if (!/^https?:\/\//.test(imageUrl) && !/^\/ /.test(imageUrl)) {
        // console.error(`Invalid image URL: ${imageUrl}`);
        return false;
      }
      return true;
    }
  
    function listingTemplate(listing: any) {
      return (
        <div className='flex items-center gap-4'>
          {listing?.accessoryImages?.length > 0 && checkIfUrl(listing.accessoryImages[0]) ? (
            <Image
              src={listing.accessoryImages[0]}
              alt={listing.description}
              width={20}
              height={20}
              className='h-12 w-12 bg-[#1b1b1b] rounded-md'
            />
          ) : (
            <div className='h-12 w-12 bg-[#1b1b1b] rounded-md'></div>
          )}
          <div className='flex-1 '>
            <p className='text-sm font-medium'>{listing?.name}</p>
          </div>
        </div>
      );
    }
  
    const getListingsByDate = useMemo(() => {
      if (selectedDate) {
        return lazyListings?.filter(
          (listing) => moment(listing.createdAt).valueOf() >= selectedDate
        );
      } else return lazyListings;
    }, [lazyListings, selectedDate]);
  
    const matchedListings = useMemo(() => {
      if (searchValue.trim().length === 0) return getListingsByDate;
  
      return getListingsByDate?.filter(
        (listing) =>
          listing.breed.toLowerCase().includes(searchValue) ||
          listing.description.toLowerCase().includes(searchValue)
      );
    }, [getListingsByDate, searchValue]);
  
    const rowClassTemplate = (data: IListing) => {
      return {
          'cursor-pointer': data.id
      };
    };
  
    return (
      <div>
      <div className='card rounded-xl p-4 bg-white border border-gray-200'>

        <div className='px-4 flex flex-col w-full justify-between lg:flex-row lg:items-center gap-8 mb-8'>
          <p className='font-bold text-xl text-gray-700'>All listings</p>
        </div>
        
        <DataTable
          value={matchedListings ?? []}
          lazy 
          first={lazyState.first}  
          onPage={onPage} 
          loading={loading} 
          totalRecords={totalRecords}
          selectionMode={rowClick ? null : 'multiple'}
          selection={selectedListings!}
          onSelectionChange={handleChangeSelectedListings}
          dataKey='_id'
          paginator
          paginatorClassName='flex justify-between'
          paginatorTemplate={paginatorTemplate(totalRecords, lazyState.page)}
          rows={10}
          className='rounded-xl text-sm capitalize'
          sortOrder={-1}
          sortField='createdAt'
          sortIcon={<IoIosArrowDown />}
          showSelectAll
          selectionAutoFocus={true}
          alwaysShowPaginator={true}
          onRowClick={(e) => router.push(`/dashboard/accessories/${e.data._id}`)}
          rowClassName={rowClassTemplate}
        >
          <Column header='Accessory' body={listingTemplate} />
          {/* <Column selectionMode='multiple' headerStyle={{ width: '3rem' }} /> */}
          <Column field='category' header='Category' sortable />
          <Column field='quantity' header='Quantity' sortable />
          <Column
            field='price'
            header='Price'
            body={amountTemplate}
            sortable
          />
          <Column
            field='action'
            header='Action'
            body={actionTemplate}
          ></Column>
          {/* <Column field='createdAt' header='Added' body={dateTemplate} sortable /> */}
        </DataTable>

        {/* Delete Accessory Modal */}
        <Modal
          isOpen={deleteModal}
          handleClose={() => setDeleteModal(false)}
          title='Delete Accessory'
        > 
          <h3 className='mb-4 text-lg text-black'> Are you sure you want to delete this accessory? </h3>
          <div className='flex items-center gap-2 justify-between'>
            <Button onClick={() => deleteAccessory(toBeDeleted)}>Yes</Button>
            <Button variant='outlined' onClick={() =>  setDeleteModal(false)}>
              No
            </Button>
          </div>
        </Modal>
      </div>
      </div>
    );
}