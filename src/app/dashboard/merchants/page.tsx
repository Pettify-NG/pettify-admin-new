import React from 'react'
import Merchants from '@/src/components/Admin/MerchantComponents/Merchant'
import { dummyUsers } from '@/src/interfaces/users';

export default async function MerchantDashboard () {
  return (
    <section>
        <Merchants 
          // merchants={dummyUsers}
        /> 
    </section>
  )
};