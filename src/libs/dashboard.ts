'use server';

import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

export const getUserDashboard = async () => {
    const token = getCookie("pettify-token", { cookies });

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const apiRes = await fetch(`${baseURL}/api/v1/users/dashboard`, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Cache-control': 'no-chache, max-age=0'
            },

            cache: "no-store"
        }
    );
    console.log(apiRes);

    const res = await apiRes.json();

    console.log(res);

    if(!res.status) {
        console.log(res);
        return;
    }

    return res.data;
}