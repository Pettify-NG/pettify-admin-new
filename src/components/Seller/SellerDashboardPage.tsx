'use client';
import React from 'react'
import { useState } from 'react';

import StatCards from '../Shared/DashboardComponents/StatsCard';
import DashboardOrdersTable from '../Dashboard/OrdersComponents/DashboardOrdersTable';
import CreateListingPopup from '../Dashboard/CreateListingPopup';
import { IDashboardData } from '@/interfaces/dashboard';

const filter_options = [
    "All orders",
    "Last Week",
    "Last Month",
    "Last Year"
];

export default function SellerDashboardPage ({
    dashboardData,
}: {
    dashboardData?: IDashboardData | null;
}) {
    console.log(dashboardData);
    const [isPopupVisible, setPopupVisible] = useState(false);

    return (
        <div>
            {/* Statistic cards */}
            <StatCards 
                totalBalance={dashboardData?.totalBalance}
                // pendingBalance={dashboardData?.wallet.pendingBalance}
                totalOrders={dashboardData?.totalOrders}
                totalPets={dashboardData?.totalPets}
                totalAccessories={dashboardData?.totalAccessories}
                totalSellers={dashboardData?.totalSellers}
                totalBuyers={dashboardData?.totalBuyers}
            />

            {/* Add pet listing button. */}
            <div className='flex my-4 items-center justify-center w-full'>
                <div className='flex items-center gap-[16px]' onClick={() => setPopupVisible(true)}>
                    <button className='rounded-[8px] h-fit w-fit text-[14px] text-white gap-[4px] flex items-center whitespace-nowrap bg-[#ed770b] py-[10px] px-[14px] ' >
                        Create New Listing
                    </button>
                </div>
            </div>

            <section className='my-4'>
                <DashboardOrdersTable orders={dashboardData?.orders}/>
            </section>

            {/* // Orders Table - All time, last week, last month, & last year. */}
            {/* <section className='my-4'>
                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} scrollable>
                    {
                        filter_options.map((time, index) => {
                            return  (
                                <TabPanel header={time} key={index}>
                                    <OrdersTable
                                        orders={dashboardData.orders}
                                        selectedOrders={[]}
                                        searchValue=''
                                        page="recent orders"
                                    />
                                </TabPanel>
                            )
                        })
                    }
                    <TabPanel header="All orders">
                        <OrdersTable
                            orders={DummyOrders}
                            selectedOrders={[]}
                            searchValue=''
                            page="recent orders"
                        />
                    </TabPanel>
                    <TabPanel header="Last Week">
                        <OrdersTable
                            orders={DummyOrders}
                            selectedOrders={[]}
                            searchValue=''
                            page="recent orders"
                        />
                    </TabPanel>
                    <TabPanel header="Last Month">
                        <OrdersTable
                            orders={DummyOrders}
                            selectedOrders={[]}
                            searchValue=''
                            page="recent orders"
                        />
                    </TabPanel>
                    <TabPanel header="Last Year">
                        <OrdersTable
                            orders={DummyOrders}
                            selectedOrders={[]}
                            searchValue=''
                            page="recent orders"
                        />
                    </TabPanel>
                </TabView>
            </section> */}

            {/* Popup */}
            {isPopupVisible && (
                <CreateListingPopup closePopup={() => setPopupVisible(false)} />
            )}
        </div>
    )
};
  
