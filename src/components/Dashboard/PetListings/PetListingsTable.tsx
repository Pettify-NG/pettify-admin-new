"use client"

import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta, DataTablePageEvent } from "primereact/datatable";
import moment from "moment";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

import HTTPService from "@/services/http";
import { IPet } from "@/interfaces/pet";
import ENDPOINTS from "@/config/ENDPOINTS";
import { formatCurrency, calculatePetAge } from "@/helpers";
import Button from "@/components/Global/Button";
import Modal from "@/components/Global/Modal";
import { paginatorTemplate } from "@/components/Dashboard/OrdersComponents/OrdersTable";
import { useDebounce } from "@/hooks/useDebounce";
import TextInput from "@/components/Global/TextInput";
import { CiSearch } from "react-icons/ci";

interface IPetListingsTable {
  handleChangeSelectedPetListings: (e: any) => void;
  selectedPetListings: any;
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

export default function PetListingsTable ({
    handleChangeSelectedPetListings,
    selectedPetListings,
}: IPetListingsTable) {
    const httpService = new HTTPService();

    const cookies = new Cookies(); 
    const token = cookies.get('pettify-token'); 
  
    const router = useRouter();

    const [globalFilter, setGlobalFilter] = useState<string>('');
  
    const [rowClick, setRowClick] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0); 
    const [totalPages, setTotalPages] = useState<number>(0); 
    const [lazyListings, setLazyListings] = useState<IPet[] | null>(null); 
    const [loading, setLoading] = useState<boolean>(false); 
    const [lazyState, setlazyState] = useState<LazyTableState>({ 
       first: 0, 
       rows: 10, 
       page: 0, 
    }); 

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
              ...(debouncedGlobalFilter && { search : debouncedGlobalFilter }),
            });
  
            const response = await fetch(`${baseUrl}/api/v1/pets/admin?${params}`, {
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
                setLazyListings(data.data); 
            }
          
          } catch(error: any) {
            toast.error(error.message);
  
            console.error('There was a problem with the fetch operation:', error);
          } finally {
            setLoading(false);
          };
        };
    
        fetchData();
    }, [lazyState, debouncedGlobalFilter]);
    
    useEffect(() => { 
      loadLazyData(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedGlobalFilter, lazyState]); 
    
    const onPage = (event: DataTablePageEvent) => {  
      setlazyState(event);
    }; 

    const ageTemplate = (listing: IPet) => {
      if(!listing.date_of_birth) {
        return "N/A";
      }

      const age = calculatePetAge(listing.date_of_birth);
      return age;
    }
  
    function amountTemplate(listing: IPet) {
      return formatCurrency(+listing.price);
    }

    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [toBeDeleted, setToBeDeleted] = useState<string>();
  
    async function deletePet(id: string | undefined) {  
        toast.loading('Deleting pet...');
  
        const res = await httpService.deleteById(
          `${ENDPOINTS.PET}/${id}`,
          `Bearer ${token}`
        );
  
        toast.dismiss();
        if (res.success) {
          toast.success('Pet deleted.');

          setDeleteModal(false);

          router.refresh();
          loadLazyData();
        } else toast.error('Could not delete pet.');
    }

    function actionTemplate(listing: IPet) {
      return (
        <div className='flex items-center gap-3'>
          <Link
            href={`/dashboard/pets/${listing._id}`}
            className='text-xl text-neutral'
          >
            <FaEye />
          </Link>
          <Link
            href={`/dashboard/pets/${listing._id}/edit`}
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
  
    function listingTemplate(listing: IPet) {
      return (
        <div className='flex items-center gap-4'>
          {listing.pet_images?.length > 0 && checkIfUrl(listing.pet_images[0]) ? (
            <Image
              src={listing.pet_images[0]}
              alt={listing.name || ""}
              width={20}
              height={20}
              className='h-12 w-12 bg-[#1b1b1b] rounded-md'
            />
          ) : (
            <div className='h-12 w-12 bg-[#1b1b1b] rounded-md'></div>
          )}
          {/* <div className='flex-1'>
            <p className='text-sm font-medium'>{listing?.breed}</p>
            <p className='text-xs font-medium'>{listing?.age}</p>
            <p className='text-xs font-medium'>{listing?.gender}</p>
          </div> */}
        </div>
      );
    }

    function sellerTemplate(listing: IPet) {
      return (
        <div className='flex items-center gap-4'>
          {listing?.seller.profileImage && checkIfUrl(listing.seller.profileImage) ? (
            <Image
              src={listing.seller.profileImage}
              alt="User image"
              width={20}
              height={20}
              className='h-12 w-12 bg-[#1b1b1b] rounded-md'
            />
          ) : (
            <div className='h-12 w-12 bg-[#1b1b1b] rounded-md'></div>
          )}
          <div className='flex-1 '>
            <p className='text-sm font-medium'>{listing?.seller.username}</p>
          </div>
        </div>
      );
    }
  
    const rowClassTemplate = (data: IPet) => {
      return {
          'cursor-pointer': data._id
      };
    };
  
    return (
      <div>
        <div className='justify-between flex items-center gap-3 mb-2 w-full'>
          <div className='w-full max-w-md'>
            <TextInput
              placeholder='Search pet listings by breed...'
              leftIcon={<CiSearch />}
              onChange={(e) => setGlobalFilter(e.target.value)}
              value={globalFilter}
            />
          </div>
        </div>

        <div className='card rounded-xl p-4 bg-white border border-gray-200'>
          
          <DataTable
            value={lazyListings ?? []}
            lazy 
           first={lazyState.first}  
           onPage={onPage} 
           loading={loading} 
           totalRecords={totalRecords}
            selectionMode={rowClick ? null : 'multiple'}
            selection={selectedPetListings!}
            onSelectionChange={handleChangeSelectedPetListings}
            dataKey='_id'
            tableStyle={{ minWidth: '30rem' }}
            paginator
            paginatorClassName='flex justify-between'
            paginatorTemplate={paginatorTemplate(totalRecords, lazyState.page)}
            rows={10}
            // rowsPerPageOptions={[20, 50, 100]}
            className='rounded-xl text-sm capitalize'
            sortOrder={-1}
            sortField='createdAt'
            sortIcon={<IoIosArrowDown />}
           showSelectAll
           selectionAutoFocus={true}
            alwaysShowPaginator={true}
            onRowClick={(e) => router.push(`/dashboard/pets/${e.data._id}`)}
            rowClassName={rowClassTemplate}
          >
            {/* <Column selectionMode='multiple' headerStyle={{ width: '3rem' }} /> */}
            <Column field='Pet' header='Listing' body={listingTemplate} />
            <Column field='gender' header='Gender' sortable />
            <Column field='category' header='Category' sortable />
            <Column field='breed' header='Breed' sortable />
            <Column field="Seller" header="Seller" body={sellerTemplate}/>
            <Column field='date_of_birth' header='Age' body={ageTemplate} sortable />
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

          {/* Delete Pet Modal */}
          <Modal
            isOpen={deleteModal}
            handleClose={() => setDeleteModal(false)}
            title='Delete Pet'
          > 
            <h3 className='mb-4 text-lg text-black'> Are you sure you want to delete this pet listing? </h3>
            <div className='flex items-center gap-2 justify-between'>
              <Button onClick={() => deletePet(toBeDeleted)}>Yes</Button>
              <Button variant='outlined' onClick={() =>  setDeleteModal(false)}>
                No
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    );
}