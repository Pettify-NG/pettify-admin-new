'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CiImageOn } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import Cookies from 'universal-cookie';

import Button from '@/components/Global/Button';
import ENDPOINTS from '@/config/ENDPOINTS';
import HTTPService from '@/services/http';

export default function AdminNewHomeSlideshow() {
  const cookies = new Cookies();
  const httpService = new HTTPService();
  const [image, setImage] = useState<File | null>(null);
  const { back, replace, push } = useRouter();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const addNewImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileSizeInBytes = e.target.files[0].size;
      const fileType = e.target.files[0].type;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      let imgWidth;
      let imgHeight;
      img.src = url;

      img.onload = () => {
        imgWidth = img.width;
        imgHeight = img.height;
        console.log(imgWidth, imgHeight);

        if(imgWidth <= imgHeight) {
          toast.error('File dimensions not supported! Your image has to be a rectangle.');
          img.onload = null; 
          return;
        }

        if(fileType !== "image/jpeg" && fileType !== "image/png") {
          toast.error('File type not supported!');
          return;
        }
  
        if (fileSizeInMB >= 1) {
          toast.error('File size too large.');
          return;
        }
        
        setImage(e?.target?.files![0] ?? null);
      };

      // if(fileType !== "image/jpeg" && fileType !== "image/png") {
      //   toast.error('File type not supported!');
      //   return;
      // }

      // if (fileSizeInMB >= 1) {
      //   toast.error('File size too large.');
      //   return;
      // }
      
      // setImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const addHomeSlideshow = async () => {
    if (image) {
      const token = cookies.get('pettify-token');

      const formdata = new FormData();
      formdata.append('file', image);

      try {
        setLoading(true);

        const requestOptions = {
          method: 'POST',
          body: formdata,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const fileReq = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/${ENDPOINTS.UPLOAD_FILE}`,
          requestOptions
        );
        const fileRes = await fileReq.json();

        if (fileRes) {
          const apiRes = await httpService.post(
            ENDPOINTS.SLIDER_IMAGES,
            {
              image: fileRes.data.url,
            },
            `Bearer ${token}`
          );

          console.log(apiRes);
          setImage(null);
          setLoading(false);

          toast.success('Slider image saved successfully.');

          setTimeout(() => {
            router.push('/dashboard/slider-images');
          }, 1000);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else toast.error('Image must not be empty');
  };

  return (
    <section>
      <div className='mt-8 p-8 bg-white rounded-xl'>
        <p className='text-xl mb-8'>Slide Image</p>
        <div>
          <p className='text-neutral mb-4 text-sm'>Photo</p>
          <div className='p-8 bg-gray-100 rounded-lg flex items-center justify-center flex-col border border-gray-200'>
            <div className='flex items-center flex-wrap gap-2 mb-4'>
              {image && (
                <div key={image.name} className='h-28 w-28 relative rounded-xl'>
                  <span className='text-xs absolute top-2 left-2 text-dark bg-green-100 py-1 px-2 rounded-md'>
                    {1}
                  </span>
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    width={100}
                    height={100}
                    className='rounded-lg w-auto h-auto'
                  />
                  <button
                    className='absolute bottom-4 right-4 text-dark rounded-md p-1 bg-green-100'
                    onClick={() => removeImage()}
                  >
                    <RiDeleteBin6Fill />
                  </button>
                </div>
              )}
            </div>

            {!image && (
              <div className='flex items-center justify-center flex-col max-w-md gap-4 mb-4'>
                <CiImageOn className='text-primary text-4xl border-8 border-[#EFEFFD] bg-[#DEDEFA] rounded-full h-16 w-16 p-2' />
                <p className='text-neutral text-center font-light'>
                  Drag and drop image here. Image size shouldnt exceed 1MB and should be of type jpeg, jpg, or png.
                </p>
              </div>
            )}

            <Button
              size='small'
              onClick={() => imageInputRef.current?.click()}
              color={image ? 'dark' : 'primary'}
            >
              <input
                type='file'
                accept='.jpg,.png,.jpeg'
                id='image'
                className='pointer-events-none opacity-0 w-0'
                ref={imageInputRef}
                onChange={addNewImage}
              />
              {image ? 'Change Image' : 'Add Image'}
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='fixed right-0 bottom-0 w-full p-4 bg-white flex items-center justify-end gap-4'>
        <Button color='dark' variant='outlined' onClick={back}>
          <IoMdClose />
          Cancel
        </Button>
        <Button onClick={addHomeSlideshow} className='text-white' loading={loading}>
          Save Slider Image
        </Button>
      </div>
    </section>
  );
}
