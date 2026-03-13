import { DataTableFilterMeta, DataTablePageEvent } from "primereact/datatable";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export interface LazyTableState {
    first: number;
    rows: number;
    page?: number | undefined;
    pageCount?: number;
    sortField?: string;
    sortOrder?: number;
    filters?: DataTableFilterMeta;
}

const useLazyTableData = <T,>(endpoint: string, token?: string, baseUrl?: string) => {
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [lazyRecords, setLazyRecords] = useState<T[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [lazyState, setLazyState] = useState<LazyTableState>({
        first: 0,
        rows: 10,
        page: 0,
    });

      const onPage = (event: DataTablePageEvent) => {  
        setLazyState(event);
        console.log(event); 
      }; 

    const loadLazyData = useCallback(() => {
        setLoading(true);

        const fetchData = async () => {
            if (!token) {
                throw new Error('Token is required');
            }
            if (!baseUrl) {
                throw new Error('Base URL is required');
            }
            try {
                const params = new URLSearchParams({
                    page: ((lazyState.page ?? 0) + 1).toString(),
                    limit: (lazyState.rows).toString(),
                });

                const response = await fetch(`${baseUrl}${endpoint}?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('An error occurred.');
                }

                const data = await response.json();

                if (data.data) {
                    setTotalRecords(data.meta.totalRecords);
                    setTotalPages(data.meta.totalPages);
                    setLazyRecords(data.data);
                }
            } catch (error: any) {
                toast.error(error.message);
                console.error('There was a problem with the fetch operation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [lazyState, endpoint, token, baseUrl]);

    useEffect(() => {
        loadLazyData();
    }, [loadLazyData]);

    return {
        records: lazyRecords,
        loading,
        totalRecords,
        totalPages,
        lazyState,
        setLazyState,
        onPage
    };
};

export default useLazyTableData;