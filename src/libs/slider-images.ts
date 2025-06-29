"use server";

import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

import ENDPOINTS from "@/config/ENDPOINTS";

export default async function getSliderImages() {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const token = getCookie("pettify-token", { cookies });

    const apiRes = await fetch(`${baseURL}/api/v1/${ENDPOINTS.SLIDER_IMAGES}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache, max-age=0"
        },

        cache: "no-store"
    });

    const res = await apiRes.json();

    if(!res.success) {
        console.log(res);
        return;
    }

    return res.data;
}