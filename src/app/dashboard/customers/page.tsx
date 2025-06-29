import Customers from '@/src/components/Admin/CustomersComponent/Customers'
import React from 'react'
import { dummyCustomer } from '@/src/interfaces/customers'

export default async function CustomersDashboard () {
  return (
    <section>
        <Customers customers={dummyCustomer}/>
    </section>
  )
}

// export default CustomersDashboard;