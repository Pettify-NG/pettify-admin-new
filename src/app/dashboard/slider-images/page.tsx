import Link from 'next/link';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import sizeOf from "image-size";

import HomeSlideshowTable from '@/components/Dashboard/HomeSlideshow/HomeSlideshowTable';
import Button from '@/components/Global/Button';
import { SliderImageType } from '@/interfaces';
import getSliderImages from '@/libs/slider-images';
import Pagination from '@/components/Shared/Paginatioin';
import { ISlideShows } from '@/interfaces';

export default async function AdminHomeSlideshow() {
  const apiRes: Promise<ISlideShows[] | null> = getSliderImages();
  const sliderImages = await apiRes;

  if (sliderImages) {
    await Promise.all(sliderImages.map(async (slideshow, index) => {
      const response = await fetch(slideshow.image);
      const arrayBuffer = await response.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      // const image = sharp(imageBuffer);
      // const metadata = await image.metadata();
      const metadata = sizeOf(imageBuffer);

      console.log('Image type:', metadata.type); // e.g. "jpeg"
      console.log('Image size:', imageBuffer.length); // e.g. 102400 (in bytes)
      console.log('Image dimensions:', metadata.width, 'x', metadata.height); // e.g. 800 x 600

      slideshow.imageType = metadata.type?.toString().toUpperCase();
      slideshow.imageDimensions = `${metadata.width}x${metadata.height}`;
      slideshow.imageSize = `${((imageBuffer.length)/1024).toFixed(2)}kb`;
    }));
  }

  return (
    <section>
      <div className='flex flex-col w-full justify-between sm:flex-row lg:items-center gap-8 my-8'>
        <div>
          <p className='text-xl font-bold mb-4 text-gray-700'>
            Home Slideshow Images
          </p>
          <Pagination />
        </div>

        <Link href='/dashboard/slider-images/create'>
          <Button>
            <FaPlus />
            Add Slide Image
          </Button>
        </Link>
      </div>

      {/* Home Slideshow Table */}
      <HomeSlideshowTable selectedDate={null} slideshows={sliderImages} />
    </section>
  );
}
