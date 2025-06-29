"use client";

import React from "react";
import Cookies from 'universal-cookie';

import DeliveryPriceForm from "@/components/Dashboard/DeliveryPriceForm";
import LoadingScreen from "@/components/Global/LoadingScreen";
import useFetch from "@/hooks/useFetch";
import { DeliveryPrices } from "@/interfaces";

export default function Settings() {
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
        <div>
            <DeliveryPriceForm initialPrices={data!} />
        </div>
    )
}