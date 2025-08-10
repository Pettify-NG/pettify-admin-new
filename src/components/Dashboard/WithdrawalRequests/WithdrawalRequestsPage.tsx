"use client";

import React from "react";
import { BiMoneyWithdraw } from "react-icons/bi";

import { WithdrawalListingTable } from "./WithdrawalsListingTable";
import Pagination from "@/components/Shared/Paginatioin";

export default function WithdrawalRequestPage () {

    return (
        <section>
            <div className="w-full mb-8 py-4">
                <div className="flex gap-3">
                    <BiMoneyWithdraw />
                    <h2>Withdrawal Requests</h2>
                </div>
                <Pagination/>
            </div>
            
            <WithdrawalListingTable />
        </section>
    )
}