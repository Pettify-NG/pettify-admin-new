'use client';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoEye, IoEyeOff, IoMailSharp } from 'react-icons/io5';
import * as Yup from 'yup';
import Image from 'next/image';

import logo from "../../../public/1-Photoroom.png";
import authImage from "../../../public/auth-image.png";
import TextInput from '@/components/Global/TextInput';
import Button from '@/components/Global/Button';
import ENDPOINTS from '@/config/ENDPOINTS';
import { API_RESPONSES } from '@/config/API_RESPONSES';
import storeCookies from '@/libs/cookies';
import HTTPService from '@/services/http';
import AuthLayout from '@/layouts/AuthLayout';
import useLocalStorage from '@/hooks/useLocalStorage';

export default function Login() {
  const httpService = new HTTPService();

  const { replace, push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useLocalStorage<any>("pettify-details", {});

  const formik = useFormik({
    initialValues: {
      email_or_username: '',
      password: '',
    },
    validationSchema: Yup.object({
      email_or_username: Yup.string().required().label('Email or username'),
      password: Yup.string().required().label('Password'),
    }),
    onSubmit: async (values) => {
      const res = await httpService.post(ENDPOINTS.SIGN_IN, values);
      console.log(res);

      if (!res.success) {
        toast.error(res.message);
        if(res.message === "User not verified. Please check your email for the verification email.") {
          setTimeout(() => {
            push(`/verify-account/${res.data._id}`);
          }, 1000);
        }
      }

      storeCookies([
        {
          key: 'pettify-email',
          value: res.data.email,
        },

        {
          key: 'pettify-secret-reference',
          value: res.data.secretReference,
        },
      ]);

      if(res.data.user.role === "admin") {
        toast.success("Login successful.");

        storeCookies([
          {
            key: 'pettify-token',
            value: res.data.token,
          },
        ]);

        setData(res.data);

        push('/dashboard');
      } 

      if (res.data.user.role === "buyer" || res.data.user.role === "seller") {
          toast.error("You are not allowed to use this.");
      }
    },
    validateOnChange: true,
  });

  return (
    <div className=''>
      <div className='p-4 bg-white fixed top-0 left-0 w-full shadow-md z-10'>
        <Link href='/'>
          <Image src={logo} alt='Urban Overstock Logo' className='w-[100px] h-[30px]'/>
        </Link>
      </div>

      <div className='flex lg:flex-row md:flex-row flex-col gap-2 lg:gap-6 space-between gap-6 bg-orange-300 lg:h-screen md:h-screen h-auto w-full px-4 lg:px-14 py-14 mt-14'>
        <div className='w-full rounded-md p-6 shadow-xl bg-white flex justify-center align-start flex-col'>
            <p className='font-bold text-3xl mb-4 text-black'>
              Log in to your account
            </p>

            <form
              action=''
              className='w-full'
              onSubmit={formik.handleSubmit}
            >
              <div className='my-4'>
                <label htmlFor='email_or_username' className='mb-2'>
                  Email or username
                </label>
                <TextInput
                  onChange={formik.handleChange}
                  placeholder='Enter your email/username'
                  type='text'
                  id='email_or_username'
                  value={formik.values.email_or_username}
                  error={formik.errors.email_or_username}
                />
              </div>
              
              {/*  */}
              <div className='my-4'>
                <label htmlFor='password' className='mb-2'>
                  Password
                </label>
                <TextInput
                  onChange={formik.handleChange}
                  placeholder='* * * * * *'
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  rightIcon={showPassword ?  <IoEye /> : <IoEyeOff />}
                  rightIconClick={() => setShowPassword((prev) => !prev)}
                  value={formik.values.password}
                  error={formik.errors.password}
                />
              </div>

              <Button block loading={formik.isSubmitting} className='text-white font-semibold' type='submit'>
                Log In
              </Button>

              <div className='flex items-center justify-end mt-6'>
                <Link
                  href='/register'
                  className='font-semibold text-black'
                >
                  {`Don't have an account? `} <span className='hover:text-underline text-[#ED770B] hover:opacity-80 cursor-pointer hover:text-gray'>Sign Up</span>
                </Link>
              </div>
            </form>
        </div>

        <div className='w-full lg:h-[40rem] lg:h-[400px] rounded-md shadow-lg lg:block'>
          <Image 
            src={authImage} 
            alt='Hero image' 
            className='lg:object-cover md:object-cover lg:h-[35rem] md:h-full h-[300px] rounded'
          />
        </div>
      </div>
    </div>
  );
}
