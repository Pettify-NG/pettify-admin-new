"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta, DataTablePageEvent } from "primereact/datatable";
import moment from "moment";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { IoCheckmarkDone } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

import { useDebounce } from "@/hooks/useDebounce";
import { IListing } from "@/interfaces/listings";
import { formatCurrency } from "@/helpers";
import { paginatorTemplate } from "@/components/Dashboard/OrdersComponents/OrdersTable";
import HTTPService from "@/services/http";
import Modal from "@/components/Global/Modal";
import ENDPOINTS from "@/config/ENDPOINTS";
import Button from "@/components/Global/Button";
import TextInput from "@/components/Global/TextInput";
import IWithdrawalRequest, { IWithdrawalRequests } from "@/interfaces/withdrawals";

export interface LazyTableState { 
    first: number; 
    rows: number; 
    page?: number | undefined; 
    pageCount?: number; 
    sortField?: string; 
    sortOrder?: number; 
    filters?: DataTableFilterMeta; 
}

export function WithdrawalListingTable () {
    const router = useRouter();
    
    const httpService = new HTTPService();

    const cookies = new Cookies(); 
    const token = cookies.get("pettify-token"); 

    // const [approveWithdrawal, setApproveWithdrawal] = useState<boolean>(false);
    const [approveModal, setApproveModal] = useState<boolean>(false);
    const [rejectModal, setRejectModal] = useState<boolean>(false);
    const [withdrawal, setWithdrawal] = useState("");
    
    // const [rowClick, setRowClick] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0); 
    const [totalPages, setTotalPages] = useState<number>(0); 
    const [lazyListings, setLazyListings] = useState<IWithdrawalRequests | null>(null); 
    const [loading, setLoading] = useState<boolean>(false); 
    const [lazyState, setlazyState] = useState<LazyTableState>({ 
        first: 0, 
        rows: 10, 
        page: 0, 
    }); 

    const [globalFilter, setGlobalFilter] = useState<string>('');
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
                  status: "pending",
                  ...(debouncedGlobalFilter && { search : debouncedGlobalFilter }),
                });
      
                const response = await fetch(`${baseUrl}/api/v1/admin/withdrawals?${params}`, {
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
        console.log(event); 
    }; 

    function sellerTemplate(listing: IWithdrawalRequest) {
        return (
        <div className='flex items-center gap-4'>
            {/* {listing?.seller.profileImage && checkIfUrl(listing.seller.profileImage) ? ( */}
            {
                listing.seller.profileImage ? 
                    <Image
                        src={listing.seller.profileImage ?? ""}
                        alt='image'
                        width={20}
                        height={20}
                        sizes='20'
                        className='h-12 w-12 bg-[#1b1b1b] rounded-md'
                    />
                : <FaCircleUser className="w-12 h-12"/>
            }

                <div className='flex-1 '>
                <p className='text-sm font-medium'>{listing?.seller.username}</p>
            </div>
        </div>
        );
    }
 
    function actionTemplate(listing: any) {
      return (
        <div className='flex items-center gap-3'>
            <button onClick={() => {
                setApproveModal(true);
                setWithdrawal(listing._id);
            }}>
                <IoCheckmarkDone className="text-green-800 text-lg" />
            </button>
            <button onClick={() => {
                setRejectModal(true);
                setWithdrawal(listing._id);
            }}>
                <IoClose className='text-xl text-red-800' />
            </button>
        </div>
      );
    }

    async function rejectWithdrawal (id: string, adminNote: string) {
        toast.loading('Submitting...');
  
        const res = await httpService.patch(
          `admin/withdrawals/${id}/approve`,
          {},
          `Bearer ${token}`
        );
  
        toast.dismiss();
        if (res.success) {
            toast.success('Withdrawal rejected.');

            setRejectModal(false);

            // router.refresh();
            // loadLazyData();
            // setLazyListings();

            const newWithdrawals = lazyListings?.map((withdrawal, index) => {
                if(withdrawal._id === id) {
                    return { ...withdrawal, status: "rejected" };
                }

                return withdrawal;
            }) ?? null;

            setLazyListings(newWithdrawals);
        } else toast.error('Could not process this request.');
    }

    async function approveWithdrawal (id: string) {
        toast.loading("Submitting...");

        const response = await httpService.patch(
            `admin/withdrawals/${id}/approve`,
            {},
            `Bearer ${token}`
        );

        toast.dismiss();
        if(response.success) {
            toast.success("Withdrwal approved");

            setApproveModal(true);

            const newWithdrawals = lazyListings?.map((withdrawal, index) => {
                if(withdrawal._id === id) {
                    return {...withdrawal, status: "approved"};
                }

                return withdrawal;
            }) ?? null;

            setLazyListings(newWithdrawals);
        } else toast.error("Could not process this request right now!");
    }

    function statusTemplate(withdrawal: IWithdrawalRequest) {    
        let styles = '';
    
        switch (withdrawal.status) {
          case 'pending':
            styles = 'bg-orange-100 text-orange-600';
            break;
          case 'approved':
            styles = 'bg-green-100 text-green-600';
            break;
          case 'rejected':
            styles = 'bg-red-100 text-red-600';
            break;
          default:
            styles = 'bg-purple-50 text-purple-600';
            break;
        }
    
        return (
          <span className={`p-2 px-4 text-xs font-medium rounded-full whitespace-nowrap ${styles}`}>
            {status}
          </span>
        );
    }

    function amountTemplate(listing: IWithdrawalRequest, type: string) {
        if(type === "amount") {
            return formatCurrency(+listing.amount);
        }
        
        return formatCurrency(+listing.wallet.balance) 
    }

    const dateTemplate = (listing: IListing) =>
        moment(listing.createdAt).format('MMM Do YYYY');

    return (
      <div>
        <div className='justify-between flex items-center gap-3 mb-2 w-full'>
          <div className='w-full max-w-md'>
            <TextInput
              placeholder='Search withdrawal requests by seller details...'
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
            // selectionMode={rowClick ? null : 'multiple'}
            // selection={selectedListings!}
            // onSelectionChange={handleChangeSelectedListings}
            dataKey='_id'
            paginator
            paginatorClassName='flex justify-between'
            paginatorTemplate={paginatorTemplate(totalRecords, lazyState.page)}
            rows={10}
            className='rounded-xl text-sm capitalize'
            sortOrder={-1}
            sortField='createdAt'
            sortIcon={<IoIosArrowDown />}
            // showSelectAll
            // selectionAutoFocus={true}
            alwaysShowPaginator={true}
            onRowClick={(e) => router.push(`/dashboard/accessories/${e.data._id}`)}
          >
            <Column field="Seller" header="Seller" body={sellerTemplate}/>
            {/* <Column selectionMode='multiple' headerStyle={{ width: '3rem' }} /> */}
            <Column
              field='amount'
              header='Amount'
              body={(withdrawal) => amountTemplate(withdrawal, "amount")}
              sortable
            />
            <Column
              field='wallet.balance'
              header='Wallet Balance'
              body={(withdrawal) => amountTemplate(withdrawal, "balance")}
              sortable
            />
            <Column field='status' header='Status' sortable body={statusTemplate} />
            <Column field='createdAt' header='Added' body={dateTemplate} sortable />
            <Column
              field='action'
              header='Action'
              body={actionTemplate}
            ></Column>
          </DataTable>

          {/* Approve Withdrawal Request Modal */}
          <Modal
            isOpen={approveModal}
            handleClose={() => setApproveModal(false)}
            title='Delete Accessory'
          > 
            <h3 className='mb-4 text-lg text-black'> Are you sure you want to approve this withdrawal request? </h3>
            <div className='flex items-center gap-2 justify-between'>
              <Button variant='outlined' onClick={() =>  setApproveModal(false)}>
                No
              </Button>

              <Button onClick={() => approveWithdrawal(withdrawal)}>Yes</Button>
            </div>
          </Modal>

            {/* Reject Withdrawal Request Modal */}
            <Modal
                isOpen={rejectModal}
                handleClose={() => setRejectModal(false)}
                title='Delete Accessory'
            > 
                <h3 className='mb-4 text-lg text-black'> Are you sure you want to reject this withdrawal request? </h3>
                <div className='flex items-center gap-2 mb-4 justify-between'>
                    <Button variant='outlined' onClick={() =>  setRejectModal(false)}>
                        No
                    </Button>

                    <Button onClick={() => rejectWithdrawal(withdrawal, "Balance exceeded.")}>Yes</Button>
                </div>
            </Modal>
        </div>
      </div>
    );
}