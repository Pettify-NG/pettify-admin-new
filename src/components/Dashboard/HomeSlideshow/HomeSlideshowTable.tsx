'use client';

import Image from 'next/image';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect } from 'react';
import { MdOutlineDelete } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import Cookies from 'universal-cookie';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { SliderImageType } from '@/interfaces';
import HTTPService from '@/services/http';
import ENDPOINTS from '@/config/ENDPOINTS';
import { paginatorTemplate } from '@/components/Shared/PaginatorTemplate';
import { ISlideShows } from '@/interfaces';

export default function HomeSlideshowTable({
  selectedDate,
  slideshows,
}: {
  selectedDate: number | null;
  slideshows: SliderImageType[] | null | ISlideShows[];
}) {

  const cookies = new Cookies();
  const httpService = new HTTPService();

  const router = useRouter();

  async function deleteSliderImage(id: string) {
    const token = cookies.get('pettify-token');

    if (
      confirm(
        'Are you sure you want to delete this slider image? This cannot be undone.'
      )
    ) {
      toast.loading('Deleting slideshow...');

      const res = await httpService.deleteById(
        `${ENDPOINTS.SLIDER_IMAGES}/${String(id)}`,
        `Bearer ${token}`
      );

      toast.dismiss();
      if (res.success) {
        // console.log(res);
        toast.success('Slider image deleted');

        router.refresh();
      } else toast.error('Cannot delete slider image at this time');
    }
  }

  function actionTemplate(slideshow: SliderImageType) {
    return (
      <div className='flex items-center justify-end gap-3'>
        <button onClick={() => deleteSliderImage(slideshow.id)}>
          <MdOutlineDelete className='text-xl' />
        </button>
      </div>
    );
  }

  function template(slideshow: SliderImageType) {
    return (
      <div className='flex items-center gap-4'>
        {slideshow.image.length > 0 ? (
          <Image
            src={slideshow.image}
            height={100}
            width={100}
            className='h-12 w-12 bg-[#1b1b1b] rounded-md object-cover'
            alt={String(slideshow.id)}
          />
        ) : (
          <div className='h-12 w-12 bg-[#1b1b1b] rounded-md'></div>
        )}
      </div>
    );
  }

  return (
    <div className='rounded-xl p-4 bg-white border border-gray-200'>
      <DataTable
        value={slideshows ?? []}
        dataKey='_id'
        paginator
        paginatorTemplate={paginatorTemplate(slideshows!.length, 1)}
        paginatorClassName='flex'
        rows={20}
        rowsPerPageOptions={[5, 25, 50, 100]}
        className='rounded-xl text-sm'
      >
        <Column body={template} header='Image'></Column>
        <Column field='imageType' header="Type"></Column>
        <Column field='imageSize' header="Size"></Column>
        <Column field='imageDimensions' header="Dimension"></Column>
        <Column
          field='action'
          header='Action'
          body={actionTemplate}
          align='right'
        ></Column>
      </DataTable>
    </div>
  );
}
