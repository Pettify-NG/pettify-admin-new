"use client"

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import Cookies from "universal-cookie";
import moment from "moment";

import { IPushNotification, IPushNotifications } from "@/interfaces/pushNotifications"; // ] this closing bracket was removed by Kenny because it was causing a syntax error.... clean this damn coment before you push haha.
import { paginatorTemplate } from "@/components/Dashboard/OrdersComponents/OrdersTable";
import useLazyTableData from "@/hooks/useLazyTableData";

export default function PushNotificationsTable () {
    const cookies = new Cookies(); 
    const token = cookies.get('pettify-token'); 

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const { records, loading, totalRecords, onPage, lazyState } = useLazyTableData<IPushNotifications>('/api/v1/admin/push-notifications', token, baseUrl); 

    const dateTemplate = (notification: IPushNotification) =>
        moment(notification.createdAt).format('MMM Do YYYY');

    const dateTemplateSch = (notification: IPushNotification) =>
        moment(notification.scheduledAt).format('MMM Do YYYY');

    const statusTemplate = (notification: IPushNotification) => {
        const status = notification.status.toLowerCase();
        const statusColors: Record<string, string> = {
            sent: 'bg-green-100 text-green-800',
            pending: 'bg-blue-100 text-blue-800',
            processing: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {notification.status}
            </span>
        );
    }
  
    return (
        <div className='card rounded-xl p-4 bg-white border border-gray-200'>
          <DataTable
            value={records ?? []}
            lazy 
            first={lazyState.first}  
            onPage={onPage} 
            loading={loading} 
            totalRecords={totalRecords}
            dataKey='_id'
            tableStyle={{ minWidth: '30rem' }}
            paginator
            paginatorClassName='flex justify-between'
            paginatorTemplate={paginatorTemplate(totalRecords, lazyState.page)}
            rows={10}
            className='rounded-xl text-sm capitalize'
            sortOrder={-1}
            sortField='createdAt'
            showSelectAll={false}
            alwaysShowPaginator={true}
          >
            <Column field='title' header='Title' sortable />
            <Column field='body' header='Body' sortable />
            <Column field='target' header='Target' body={(notification) => notification.target} />
            <Column field='status' header='Status' body={statusTemplate} />
            <Column field='scheduledAt' header='Scheduled' body={dateTemplateSch} sortable />
            <Column field='createdAt' header='Added' body={dateTemplate} sortable />
          </DataTable>
        </div>
    );
}