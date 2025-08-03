'use client';

import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import React, { useState, useMemo, useEffect, useCallback, ChangeEvent } from 'react';
import { FaEye } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import toast from 'react-hot-toast';
import { classNames } from 'primereact/utils';
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { 
  PaginatorCurrentPageReportOptions, 
  PaginatorRowsPerPageDropdownOptions, 
  PaginatorNextPageLinkOptions, 
  PaginatorPageLinksOptions, 
  PaginatorPrevPageLinkOptions } 
from 'primereact/paginator';

import { formatCurrency } from '@/helpers';
import IOrder from '@/interfaces/orders';
import ENDPOINTS from '@/config/ENDPOINTS';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import TextInput from '@/components/Global/TextInput';
import { CiSearch } from 'react-icons/ci';

export interface IDataFilters {
  status?: string;
  amountFrom?: number;
  amountTo?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface LazyTableState {
    first: number;
    rows: number;
    page?: number | undefined;
    pageCount?: number;
    sortField?: string;
    sortOrder?: number;
    filters?: IDataFilters;
}

export const paginatorTemplate = (totalRecords: number, page: number | undefined) => {
  return {
          layout: 'CurrentPageReport RowsPerPageDropdown PrevPageLink PageLinks NextPageLink ',
          RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
              return (
                  <div className="invisible">
                  </div>
              );
          },
          PageLinks: (options: PaginatorPageLinksOptions) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });

                return (
                    <span className={classNames('border px-3 py-1 mx-1 rounded-sm cursor-pointer border-[#ED770B]')} style={{ userSelect: 'none' }}>
                        ...
                    </span>
                );
            }
          
            return (
                <span 
                className={classNames(`${options.page === page ? "bg-[#ED770B] text-white" : "bg-white text-[#ED770B]"} px-3 cursor-pointer py-1 mx-1 rounded-sm border border-[#F2C94C] `)} 
                onClick={options.onClick}
                >
                    {options.page + 1}
                </span>
            );
          },
          CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
          return (
              <div style={{ color: 'var(--text-color)', userSelect: 'none', width: 'auto', textAlign: 'left'}} className='text-sm text-neutral cursor-pointer items-center my-auto mr-auto'>
                  {`Showing ${options.first} - ${options.last} from ${totalRecords}`}
              </div>
          );
          },
          PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
              return (
                  <span 
                      className={classNames('rounded-sm bg-[#ED770B] text-white p-2 mx-1 cursor-pointer')} 
                      onClick={options.onClick}
                  >
                      <MdOutlineKeyboardArrowLeft color="white"/>
                  </span>
              );
          },
          NextPageLink: (options: PaginatorNextPageLinkOptions) => {
              return (
                  <span 
                  className={classNames('rounded-sm p-2 mx-1 bg-[#ED770B] text-white cursor-pointer')} 
                  onClick={options.onClick}
                  >
                      <MdKeyboardArrowRight color="white"/>
                  </span>
              );
          },
  }
};

export default function OrdersTable({
  page = 'orders',
}: {
  page?: 'orders' | 'return-request' | 'cancelled orders' | 'recent orders';
  handleChangeSelectedOrders?: (e: any) => void;
  selectedOrders?: IOrder[];
}) {
  const [selectedOrders, setSelectedOrders] = useState<IOrder[]>([]);

  const [defaultFilterOption, setDefaultFilterOption] = useState(0);

  const [rowClick, setRowClick] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [lazyOrders, setLazyOrders] = useState<IOrder[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lazyState, setlazyState] = useState<LazyTableState>({
    first: 0,
    rows: 10,
    page: 0,
    filters: {}
  });

  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [tempFilters, setTempFilters] = useState<IDataFilters>({});
  
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  const [timeFilter, setTimeFilter] = useState<string>("All-time");

  const loadLazyData = useCallback((stateOverride?: LazyTableState) => {
      setLoading(true);

      const fetchData = async () => {
        try {
          const cookies = new Cookies();
          const token = cookies.get('pettify-token');
          // console.log(token);

          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

          const state = stateOverride || lazyState;

          // const params = new URLSearchParams({
          //   page: ((lazyState.page ?? 0) + 1).toString(),
          //   limit: (lazyState.rows).toString(),
          //   type: timeFilter,
          //   ...(debouncedGlobalFilter && { search: debouncedGlobalFilter }),
          //   ...(lazyState?.filters?.status && { status: lazyState.filters.status }),
          //   ...(lazyState?.filters?.amountFrom && { amountFrom: lazyState.filters.amountFrom.toString() }),
          //   ...(lazyState?.filters?.amountTo && { amountTo: lazyState.filters.amountTo.toString() }),
          //   ...(lazyState?.filters?.dateFrom && { dateFrom: lazyState.filters.dateFrom }),
          //   ...(lazyState?.filters?.dateTo && { dateTo: lazyState.filters.dateTo }),
          // });

          const params = new URLSearchParams({
            page: ((lazyState.page ?? 0) + 1).toString(),
            limit: (lazyState.rows).toString(),
            type: timeFilter,
            ...(debouncedGlobalFilter && { search: debouncedGlobalFilter }),
            ...(state?.filters?.status && { status: state.filters.status }),
            ...(state?.filters?.amountFrom && { amountFrom: state.filters.amountFrom.toString() }),
            ...(state?.filters?.amountTo && { amountTo: state.filters.amountTo.toString() }),
            ...(state?.filters?.dateFrom && { dateFrom: state.filters.dateFrom }),
            ...(state?.filters?.dateTo && { dateTo: state.filters.dateTo }),
          });

          const response = await fetch(`${baseUrl}/api/v1/${ENDPOINTS.ORDERS}?${params}`, {
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
              setLazyOrders(data.data); 

              console.log(data.data);
          }
        
        } catch(error: any) {
          toast.error(error.message);

          console.error('There was a problem with the fetch operation:', error);
        } finally {
          setLoading(false);
        };
      };
  
      fetchData();
  }, [lazyState, timeFilter, debouncedGlobalFilter]);

  const handleApplyFilters = () => {
    const newLazyState: LazyTableState = {
      ...lazyState,
      first: 0,
      page: 0,
      filters: tempFilters,
    };

    setlazyState(newLazyState);
    setShowFilterDialog(false);
    loadLazyData(newLazyState);
  }

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters: IDataFilters = {};
    setTempFilters(clearedFilters);
    const newLazyState: LazyTableState = {
      ...lazyState,
      first: 0,
      page: 0,
      filters: clearedFilters,
    };

    setlazyState(newLazyState);
    setShowFilterDialog(false);
    loadLazyData();
  };

  // Open filter dialog
  const openFilterDialog = () => {
    setTempFilters({ ...lazyState.filters });
    setShowFilterDialog(true);
  };

  useEffect(() => {
    loadLazyData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGlobalFilter, lazyState]);

  // loadLazyData, debouncedGlobalFilter, lazyState.filters

  const onPage = (event: DataTablePageEvent) => {
    setlazyState(event);
  };

  const dateTemplate = (order: IOrder) => {
    const { createdAt } = order;

    return moment(createdAt).format('MMM Do YYYY');
  };

  function amountTemplate(order: IOrder) {
    const total = order.totalPriceAll || order.products.reduce((acc: number, curr: any) => {
      return acc + curr.totalPrice;
    }, 0);

    return formatCurrency(total);
  }

  function actionTemplate(order: IOrder) {
    return (
      <div className='flex items-center gap-3'>
        <Link
          href={page === "cancelled orders" ? `/dashboard/orders/cancelled-orders/${order._id}` : page === "recent orders" ? `/dashboard/orders/${order._id}` : `/dashboard/${page}/${order._id}`}
          className='text-xl text-neutral'
        >
          <FaEye />
        </Link>
      </div>
    );
  }

  function statusTemplate(type: string, order: IOrder) {
    const { paymentStatus, deliveryStatus } = order;

    let styles = '';

    switch (type === "payment" ? paymentStatus?.toLowerCase() : deliveryStatus?.toLowerCase()) {
      case 'processing':
        styles = 'bg-orange-100 text-orange-600';
        break;
      case 'shipped':
        styles = 'bg-[#E8F8FD] text-[#13B2E4]';
        break;
      case 'picked':
        styles = 'bg-green-100 text-green-600';
        break;
      case 'delivered':
        styles = 'bg-green-100 text-green-600';
        break;
      case 'paid':
        styles = 'bg-green-100 text-green-600';
        break;
      case 'cancelled':
        styles = 'bg-red-100 text-red-600';
        break;
      case 'refunded':
        styles = 'bg-red-100 text-red-600';
        break;
      case 'packed':
        styles = 'bg-[#E8F8FD] text-[#13B2E4]';
        break;
      default:
        styles = 'bg-purple-50 text-purple-600';
        break;
    }

    return (
      <span className={`p-2 px-4 text-xs font-medium rounded-full whitespace-nowrap ${styles}`}>
        {String(type === "payment" ? paymentStatus : deliveryStatus).charAt(0).toUpperCase() + String(type === "payment" ? paymentStatus : deliveryStatus).slice(1)}
      </span>
    );
  }

  function productTemplate(order: IOrder) {
    const firstProduct = order.products[0];
    return (
      <div className='flex items-center gap-4'>
        <Image
          src={firstProduct.productType === "pet" ? (firstProduct.product?.pet_images?.[0] ?? "") : (firstProduct.product?.accessoryImages?.[0] ?? "")}
          alt='image'
          width={20}
          height={20}
          className='h-12 w-12 bg-[#1b1b1b] rounded-md'
        />

        <div className='div capitalize flex-1'>
          <p className='text-sm flex-1 font-medium'>
            {firstProduct.productType === "pet" ? firstProduct.product?.breed : firstProduct.product?.name}
          </p>
          {order.products.length > 1 && (
            <p className='text-xs text-neutral'>
              +{order.products.length} other products
            </p>
          )}
        </div>
      </div>
    );
  }

  const router = useRouter();

  const rowClassTemplate = (data: IOrder) => {
    return {
        'cursor-pointer': data.uuid
    };
  };

  const idTemplate = (data: IOrder) => {
    return `#${data.uuid}`
  }

  const handleChangeSelectedOrders = (e: any) => {
    console.log(e.value);

    setSelectedOrders(e.value);
  };

  // function hasDeliveryTimeExceeded(deliveryDate: string): boolean {
  //   const fortyEightHoursAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 48 hours ago
  //   return new Date(deliveryDate) < fortyEightHoursAgo;
  // }

  const handleCategoryChange = (newIndex: number, option: any) => {            
    switch (option) {
        case 'All time':
            setTimeFilter("All-Time");
            break;
        case '12 months':
            setTimeFilter("12-Months");
            break;
        case '30 days':
            setTimeFilter("30-Day");
            break;
        case '7 days':
            setTimeFilter("7-Day");
            break;
        case '24 hours':
            setTimeFilter("24-Hour");
            break;
        default:
            return; // return null for unknown filter options
    }
    setDefaultFilterOption(newIndex);
    console.log(option);
  }

  // Status options for dropdown
  // 'pending', 'paid', 'failed', 'cancelled', 'completed'
  const statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Failed', value: 'failed' },
    { label: 'Paid', value: 'paid'},
    { label: 'Cancelled', value: 'cancelled'}
  ];

  // Filter dialog content
  const renderFilterDialog = () => {
    return (
      <Dialog
        visible={showFilterDialog}
        onHide={() => setShowFilterDialog(false)}
        header="Filter Options"
        className="w-1/2 md:w-20rem"
        modal
      >
        <div className="grid formgrid p-fluid">
          {/* First row of filters */}
          <div className="field col-12 md:col-4">
            <label htmlFor="status">Status</label>
            <Dropdown
              id="status"
              value={tempFilters.status || null}
              options={statusOptions}
              onChange={(e) => setTempFilters({ ...tempFilters, status: e.value })}
              placeholder="Select Status"
            />
          </div>

          {/* Amount range */}
          <div className="field col-12 md:col-6">
            <label htmlFor="amountFrom">Amount From</label>
            <InputNumber
              id="amountFrom"
              value={tempFilters.amountFrom || null}
              onValueChange={(e) => setTempFilters({ ...tempFilters, amountFrom: e.value || undefined })}
              placeholder="0.00"
            />
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="amountTo">Amount To</label>
            <InputNumber
              id="amountTo"
              value={tempFilters.amountTo || null}
              onValueChange={(e) => setTempFilters({ ...tempFilters, amountTo: e.value || undefined })}
              placeholder="0.00"
            />
          </div>

          {/* Date range */}
          <div className="field col-12 md:col-6">
            <label htmlFor="dateFrom">Date From</label>
            <Calendar
              id="dateFrom"
              value={tempFilters.dateFrom ? new Date(tempFilters.dateFrom) : null}
              onChange={(e) => setTempFilters({ 
                ...tempFilters, 
                dateFrom: e.value ? e.value.toISOString().split('T')[0] : undefined 
              })}
              dateFormat="yy-mm-dd"
              placeholder="Select Date"
              showIcon
            />
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="dateTo">Date To</label>
            <Calendar
              id="dateTo"
              value={tempFilters.dateTo ? new Date(tempFilters.dateTo) : null}
              onChange={(e) => setTempFilters({ 
                ...tempFilters, 
                dateTo: e.value ? e.value.toISOString().split('T')[0] : undefined 
              })}
              dateFormat="yy-mm-dd"
              placeholder="Select Date"
              showIcon
            />
          </div>
        </div>

        <div className="flex justify-content-end gap-2 mt-4">
          <Button
            label="Clear Filters"
            outlined
            onClick={handleClearFilters}
          />
          <Button
            label="Apply Filters"
            onClick={handleApplyFilters}
          />
        </div>
      </Dialog>
    );
  };

  return (
    <>
      <div className='justify-between flex items-center gap-3 mb-2 w-full'>
        {/* <div >
          <CategoryNavigation
            categories={[
              'All time',
              '12 months',
              '30 days',
              '7 days',
              '24 hours',
            ]}
            defaultOption={defaultFilterOption}
            handleCategoryChange={handleCategoryChange}
          />
        </div> */}

        <div className='w-full max-w-md'>
          <TextInput
            placeholder='Search orders...'
            leftIcon={<CiSearch />}
            onChange={(e) => setGlobalFilter(e.target.value)}
            value={globalFilter}
          />
        </div>

        <div className="flex gap-2">
          <Button
            icon="pi pi-filter"
            label="Filter By"
            outlined
            onClick={openFilterDialog}
          />
          <Button
            icon="pi pi-refresh"
            label="Refresh"
            onClick={() => loadLazyData()}
          />
        </div>
      </div>
    
      <div className='card rounded-xl p-4 bg-white border border-gray-200'>
          <DataTable
            value={lazyOrders ?? []}
            lazy
            first={lazyState.first} 
            onPage={onPage}
            loading={loading}
            totalRecords={totalRecords}
            selectionMode={rowClick ? null : 'multiple'}
            selection={selectedOrders!}
            scrollable={true}
            onSelectionChange={handleChangeSelectedOrders}
            dataKey='_id'
            // tableStyle={{ minWidth: '80rem' }}
            paginator
            paginatorClassName='flex justify-between overflow-x-auto'
            paginatorTemplate={paginatorTemplate(totalRecords, lazyState.page)}
            rows={10}
            className='rounded-md text-sm'
            sortOrder={-1}
            sortField='createdAt'
            showSelectAll
            sortIcon={<IoIosArrowDown />}
            selectionAutoFocus={true}
            onRowClick={(e) => router.push(`/dashboard/orders/${e.data._id}`)}
            rowClassName={rowClassTemplate}
          >
            {/* <Column selectionMode='multiple' body={checkBoxTemplate} headerStyle={{ width: '3rem' }} className='group'/> */}
            <Column field='uuid' body={idTemplate} header='Order ID' className='text-[#F2C94C]'/>
            <Column body={productTemplate} header='Product' />
            <Column
              field='totalAmount'
              header='Total Amount'
              body={amountTemplate}
              sortable
            />
            <Column field='paymentStatus' header='Payment Status' sortable body={(order) => statusTemplate("payment", order)} />
            <Column field='deliveryStatus' header='Delivery Status' sortable body={(order) => statusTemplate("delivery", order)} />
            <Column field='date' header='Date' body={dateTemplate} sortable />
            <Column field='action' header='Action' body={actionTemplate} />
          </DataTable>
      </div>

      {/* Filter Dialog */}
      {renderFilterDialog()}
    </>
  );
}
