"use client";

import React from 'react';
import Cookies from 'universal-cookie';

import SellerDashboardPage from '@/components/Seller/SellerDashboardPage';
import { IDashboardData } from '@/interfaces/dashboard';
import useFetch from '@/hooks/useFetch';
import LoadingScreen from '@/components/Global/LoadingScreen';

export default function SellerDashboard() {
  const fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/dashboard`

  const cookies = new Cookies();
  const token = cookies.get("pettify-token");

  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const { data, error, isLoading, refetch } = useFetch<IDashboardData>(fetchUrl, options);

  if(isLoading) {
    return <LoadingScreen />
  }

  return (
    <section>
      <SellerDashboardPage
        dashboardData={data || null}
      />
    </section>
  );
};