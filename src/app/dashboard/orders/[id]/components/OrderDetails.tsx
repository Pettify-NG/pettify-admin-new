import clsx from 'clsx';
import moment from 'moment';
import React, { useState } from 'react';
import { BsTruck } from 'react-icons/bs';
import { CiCreditCard1, CiMail, CiUser } from 'react-icons/ci';
import { FaCartArrowDown, FaCheck } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import {
  IoCheckmark,
  IoLocationOutline,
  IoPhonePortraitOutline,
} from 'react-icons/io5';
import { LuTruck } from 'react-icons/lu';
import { PiCalendarCheck } from 'react-icons/pi';
import { RiRefreshLine } from 'react-icons/ri';
import { TbFileInvoice } from 'react-icons/tb';
import toast from 'react-hot-toast';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';

import OrderDetailsTable from './OrderDetailsTable';
import ENDPOINTS from '@/config/ENDPOINTS';
import HTTPService from '@/services/http';
import Button from '@/components/Global/Button';
import Modal from '@/components/Global/Modal';
import IOrder, { IProductItem } from '@/interfaces/orders';

function StatusTemplate ({ status }: { status: string | undefined}) {
  let styles = '';

  switch (status?.toLowerCase()) {
    case 'processing':
      styles = 'bg-orange-100 text-orange-600';
      break;
    case 'shipped':
      styles = 'bg-[#E8F8FD] text-[#13B2E4]';
      break;
    case 'delivered':
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
    <span className={`p-2 px-4 text-xs font-medium rounded-full ${styles}`}>
      {status}
    </span>
  );
}

export default function OrderDetails({ order }: { order: IOrder | null }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [cancelOrderModal, setCancelOrderModal] = useState(false);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  const cookies = new Cookies();
  const token = cookies.get('pettify-token');

  const httpService = new HTTPService();

  const { push } = useRouter();

  // function hasDeliveryTimeExceeded(deliveryDate: string): boolean {
  //   const fortyEightHoursAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 48 hours ago
  //   return new Date(deliveryDate) < fortyEightHoursAgo;
  // }

  const updateOrder = (orderId?: string, orderStatus?: string,) => {
    try {
      toast.loading("Updating order...");

      // setOrderShippedModal(false);
      closeModal();

      const data = {
        deliveryStatus: orderStatus
      }

      httpService
        .patch(`${ENDPOINTS.ORDERS}/${orderId}/complete`, data, `Bearer ${token}`)
        .then((apiRes) => {
          console.log('Response: ', apiRes);

          toast.dismiss();
          if (apiRes.status === 200) {
            toast.success('Order successfully updated.');
            setTimeout(() => {
              push('/dashboard/orders');
            }, 1000);
          }
        });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const activateModal = () => {
    if(order?.status.toLowerCase() === "cancelled" && order?.deliveryStatus.toLowerCase() === "cancelled") {
      toast.error("This order has been cancelled.");
    } else if (order?.deliveryStatus.toLowerCase() !== "picked-up" && order?.deliveryStatus.toLowerCase() !== "delivered") {
      openModal();
    } else if (order.deliveryStatus.toLowerCase() === "delivered" && order.deliveryStatus.toLowerCase() === "picked-up") {
      toast.error("This order has been delivered. You can no longer update this order.");
    }
  }

  return (
    <div>
      {/* Grid 1 */}
      <div className='grid md:grid-cols-2 xl:grid-cols-2 gap-4 mb-8'>
        {/* Order Details */}
        <div className='py-4 px-2 sm:p-4 border border-gray-200 bg-white rounded-xl'>
          <p className='text-lg font-medium text-gray-700 mb-8 flex items-center justify-between'>
            <span>Order #{order?.uuid}</span>
            {/* <span className='p-2 px-4 text-xs bg-blue-100 rounded-full'>
              {order?.status}
            </span> */}
            <StatusTemplate status={order?.status}/>
          </p>
          {/*  */}
          <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <PiCalendarCheck />
              </div>
              <div className='flex-1'>
                <p>Added</p>
              </div>
            </div>
            <p>{moment(order?.createdAt).format('MMM Do YYYY, h:mm a')}</p>
          </div>
          {/*  */}

          {/* <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <CiCreditCard1 />
              </div>
              <div className='flex-1'>
                <p>Payment Method</p>
              </div>
            </div>
            <p>{order?.paymentMethod}</p>
          </div> */}
          {/*  */}

          <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <LuTruck />
              </div>
              <div className='flex-1'>
                <p>Delivery Option</p>
              </div>
            </div>
            <p>{order?.deliveryOption === "pick-up" ? "Pick up" : "Delivery"}</p>
          </div>
          {/*  */}
        </div>

        {/* Customer Details */}
        <div className='py-4 px-2 sm:p-4 border border-gray-200 bg-white rounded-xl'>
          <p className='text-lg font-medium text-gray-700 mb-8'>Customer</p>

          {/*  */}
          <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <CiUser />
              </div>
              <div className='flex-1'>
                <p>Customer</p>
              </div>
            </div>
            <p>
              {/* {order?.buyerName} */}
              {order?.buyer.firstname + " " + order?.buyer.lastname}
            </p>
          </div>

          {/*  */}
          <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm '>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <CiMail />
              </div>
              <div className='flex-1'>
                <p>Email</p>
              </div>
            </div>
            <p className='break-all'>{order?.buyerEmail}</p>
            {/* <p className='break-word'>{"These are words for me to use."}</p> */}
          </div>

          {/*  */}
          <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <IoPhonePortraitOutline />
              </div>
              <div className='flex-1'>
                <p>Phone</p>
              </div>
            </div>
            <p>{order?.buyerPhone}</p>
          </div>
        </div>
        
      </div>

      {/* Grid 2 */}
      <div className='grid grid-cols-1 xl:grid-cols-6 gap-4 w-full'>
        <div className='col-span-1 xl:col-span-4 w-full'>
          <div className='p-4 sm:p-6 border border-gray-200 bg-white rounded-xl w-full'>
            <p className='text-lg font-medium text-gray-700 mb-8'>Order List</p>
            <OrderDetailsTable
              orderList={order?.products as IProductItem[]}
            />
          </div>
        </div>
        <div className='grid md:grid-cols-2 xl:grid-cols-1 xl:col-span-2 gap-4'>
          {/* <div className='p-4 sm:p-6 border border-gray-200 bg-white rounded-xl'>
            <p className='text-lg font-medium text-gray-700 mb-8'>Address</p>

            

            <div className='flex items-center gap-2 mt-6'>
              <div className='h-12 w-12 bg-gray-200 border-2 border-gray-100 rounded-full flex items-center justify-center text-xl text-neutral'>
                <IoLocationOutline />
              </div>
              <div className='flex-1'>
                <p className='text-gray-700 font-medium'>Billing</p>
                <p className='text-gray-600 text-sm font-light'>
                  {order?.address}
                </p>
              </div>
            </div>

            
            
            <div className='flex items-center gap-2 mt-6'>
              <div className='h-12 w-12 bg-gray-200 border-2 border-gray-100 rounded-full flex items-center justify-center text-xl text-neutral'>
                <IoLocationOutline />
              </div>
              <div className='flex-1'>
                <p className='text-gray-700 font-medium'>Shipping</p>
                <p className='text-gray-600 text-sm font-light'>
                  {order?.address}
                </p>
              </div>
            </div>

          </div> */}

          <div className='p-4 sm:p-6 border border-gray-200 bg-white rounded-xl'>
            <p className='text-lg font-medium text-gray-700 mb-8'>
              Order Status
            </p>

            {/* Order Statuses */}
            <div className='relative'>
              <div className='absolute w-0.5 h-[90%] border border-gray-200 left-6 top-2 order-border'></div>

              {/* Order Placed */}
              <div className='flex items-center gap-2 my-8 z-10 relative'>
                <div className='h-12 w-12 bg-[#eeeeff] border-2 border-[#f5f5ff] rounded-full flex items-center justify-center text-xl text-primary'>
                  <FaCartArrowDown />
                </div>
                <div className='flex-1'>
                  <p className='text-gray-600'>Order Placed</p>
                  <p className='text-neutral text-xs font-light'>
                    An order has been placed
                  </p>
                  <p className='text-neutral text-xs font-light'>
                    {moment(order?.createdAt).format('MMM Do YYYY, h:mm a')}
                  </p>
                </div>
              </div>
              {/* Order Processing */}
              <div className='flex items-center gap-2 my-8 z-10 relative'>
                <div
                  className={clsx(
                    'h-12 w-12 rounded-full flex items-center justify-center text-xl border-4',
                    order?.status.toLowerCase() === 'paid' || order?.status.toLowerCase() === 'processing' || order?.status.toLowerCase() === 'shipping' || order?.status.toLowerCase() === 'delivered'
                      ? 'border-[#f5f5ff] bg-[#eeeeff] text-primary'
                      : 'bg-gray-200 border-gray-100 text-neutral'
                  )}
                >
                  <RiRefreshLine />
                </div>
                <div className='flex-1'>
                  <p className='text-gray-600'>Processing</p>
                  <p className='text-neutral text-xs font-light'>
                    Seller has processed your order
                  </p>
                  <p className='text-neutral text-xs font-light'>
                    {moment(order?.createdAt).format('MMM Do YYYY, h:mm a')}
                  </p>
                </div>
              </div>
              {/* Order Shipped */}
              <div className='flex items-center gap-2 my-8 z-10 relative'>
                <div
                  className={clsx(
                    'h-12 w-12 rounded-full flex items-center justify-center text-xl bg-gray-200 border-4 border-gray-100 text-neutral',
                    order?.status.toLowerCase() === 'shipping' || order?.status.toLowerCase() === 'delivered' &&
                      'border-[#f5f5ff] bg-[#eeeeff] text-primary'
                  )}
                >
                  <BsTruck />
                </div>
                <div className='flex-1'>
                  <p className='text-gray-600'>Shipped</p>

                  <p className='text-neutral text-xs font-light'>
                    {order?.status.toLowerCase() === 'shipped' || order?.status.toLowerCase() === 'delivered' ? (
                      <span>
                        {moment(order?.updatedAt).format('MMM Do YYYY, h:mm a')}
                      </span>
                    ) : (
                      <span>DD/MM/YY, 00:00</span>
                    )}
                  </p>
                </div>
              </div>
              {/* Order Delivered/Picked */}
              <div className='flex items-center gap-2 my-8 z-10 relative'>
                <div
                  className={clsx(
                    'h-12 w-12 rounded-full flex items-center justify-center text-xl bg-gray-200 border-4 border-gray-100 text-neutral',
                    order?.status.toLowerCase() === 'delivered' &&
                      'border-[#f5f5ff] bg-[#eeeeff] text-primary'
                  )}
                >
                  <IoCheckmark />
                </div>
                <div className='flex-1'>
                  <p className='text-gray-600'>Picked/Delivered</p>

                  <p className='text-neutral text-xs font-light'>
                    {order?.status.toLowerCase() === 'delivered' ? (
                      <span>
                        {moment(order?.deliveryDate).format('MMM Do YYYY, h:mm a')}
                      </span>
                    ) : (
                      <span>DD/MM/YY, 00:00</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {
              order?.status.toLowerCase() !== 'delivered' && order?.status.toLowerCase() !== 'cancelled' && order?.status.toLowerCase() !== 'refunded' && 
              <div className='flex items-center gap-2 flex-wrap'>
                <Button onClick={activateModal} className='text-white'>Mark Order as ${order?.deliveryOption === "pick-up" ? "Picked" : "Delivered"}</Button>
                <Button variant='outlined' onClick={() => setCancelOrderModal(true)}>Cancel Order</Button>
              </div>
            }

            {/* Order delivered Modal */}
            <Modal
              isOpen={modalOpen}
              handleClose={() => setModalOpen(false)}
              title='Status Update'
            > 
              <h3 className='mb-4 text-lg text-black'> Has this order been delivered/picked? </h3>
              <div className='flex items-center gap-2'>
                <Button 
                    onClick={() => updateOrder(order?._id, (order?.deliveryOption === "pick-up" ? "picked-up" : "delivered"))}
                >
                    Yes
                </Button>
                <Button variant='outlined' onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </Modal>

            {/* Cancel Order Modal */}
            <Modal
              isOpen={cancelOrderModal}
              handleClose={() => setCancelOrderModal(false)}
              title='Cancel order'
            > 
              <h3 className='mb-4 text-lg text-black'> Are you sure you want to cancel this order? </h3>
              <div className='flex items-center gap-2 justify-between'>
                <Button onClick={() => updateOrder(order?._id, "Cancelled")}>Yes</Button>
                <Button variant='outlined' onClick={() =>  setCancelOrderModal(false)}>
                  No
                </Button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}


        // Document
        // <div className='py-4 px-2 sm:p-4 border border-gray-200 bg-white rounded-xl'>
        //   <p className='text-lg font-medium text-gray-700 mb-8'>Document</p>

          {/*  */}
          {/* <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <TbFileInvoice />
              </div>
              <div className='flex-1'>
                <p>Invoice</p>
              </div>
            </div>
            <p>{order?.uuid}</p>
          </div> */}

          {/*  */}
          {/* <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <LuTruck />
              </div>
              <div className='flex-1'>
                <p>Shipping</p>
              </div>
            </div>
            <p>{order?.shippingId}</p>
          </div> */}

          {/*  */}
          {/* <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <LuTruck />
                <FaLocationDot />
              </div>
              <div className='flex-1'>
                <p>Postal/Zip Code</p>
              </div>
            </div>
            <p>{order?.shippingAddress?.zipCode ?? ""}</p>
          </div> */}

          {/*  */}
          {/* <div className='text-gray-600 flex items-center justify-between gap-8 mt-2 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='h-12 w-12 bg-gray-200 border-4 border-gray-100 rounded-full flex items-center justify-center text-xl'>
                <HiOutlineBadgeCheck />
              </div>
              <div className='flex-1'>
                <p>Rewards</p>
              </div>
            </div>
            <p>40000 Points</p>
          </div> */}
        // </div>
