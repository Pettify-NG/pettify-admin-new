"use client";

import React from "react";
import Cookies from 'universal-cookie';

import DeliveryPriceForm from "@/components/Dashboard/DeliveryPriceForm";
import LoadingScreen from "@/components/Global/LoadingScreen";
import useFetch from "@/hooks/useFetch";
import { DeliveryPrices } from "@/interfaces";

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

    const filteredPrices = data?.filter(price => {
        if (price.type === 'Pet') return true;
        return false;
    }) || [];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Delivery Prices</h1>

            <DeliveryPriceForm 
                initialPrices={filteredPrices} 
                type={'Pet'}
            />
        </div>
    )
}