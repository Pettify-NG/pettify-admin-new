"use client";

import React, { useState } from "react";
import Cookies from 'universal-cookie';

import LoadingScreen from "@/components/Global/LoadingScreen";
import useFetch from "@/hooks/useFetch";
import { DeliveryPrices } from "@/interfaces";
import Link from "next/link";

export default function DeliveryPricesPage() {
    const fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/delivery-prices`

    const cookies = new Cookies();
    const token = cookies.get("pettify-token");

    const options = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const { data, error, isLoading, refetch } = useFetch<DeliveryPrices>(fetchUrl, options);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div>Error loading delivery prices. Please try again later.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Delivery Prices</h1>

            <div className="flex gap-3">
                <div className='flex my-4 items-center justify-center w-full'>
                    <div className='flex items-center gap-[16px]'>
                        <Link href='/dashboard/delivery-prices/accessories'>
                            <button className='rounded-[8px] h-fit w-fit text-[14px] text-white gap-[4px] flex items-center whitespace-nowrap bg-[#ED770B] py-[10px] px-[14px] ' >
                                Update accessories delivery prices
                            </button>
                        </Link>
                    </div>
                </div>

                <div className='flex my-4 items-center justify-center w-full'>
                    <div className='flex items-center gap-[16px]'>
                        <Link href='/dashboard/delivery-prices/pets'>
                            <button className='rounded-[8px] h-fit w-fit text-[14px] text-white gap-[4px] flex items-center whitespace-nowrap bg-[#ED770B] py-[10px] px-[14px]'>
                                Update pet delicery prices
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">All Delivery Prices</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border">Name</th>
                                <th className="px-4 py-2 border">Price</th>
                                <th className="px-4 py-2 border">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((price, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2 border">{price.name}</td>
                                    <td className="px-4 py-2 border">{price.price}</td>
                                    <td className="px-4 py-2 border">{price.type || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}