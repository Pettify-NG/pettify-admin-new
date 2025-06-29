'use client';

import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import * as Yup from 'yup';
import Image from 'next/image';

import logo from "../../../public/1-Photoroom.png";
import authImage from "../../../public/auth-image.png"
import TextInput from '@/components/Global/TextInput';
import Button from '@/components/Global/Button';
import storeCookies from '@/libs/cookies';
import ENDPOINTS from '@/config/ENDPOINTS';
import { API_RESPONSES } from '@/config/API_RESPONSES';
import HTTPService from '@/services/http';

export default function Register() {
  const httpService = new HTTPService();

  const { replace, push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      firstname: '',
      lastname: '',
      phonenumber: undefined,
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required().label('Email'),
      password: Yup.string().required().label('Password'),
      firstname: Yup.string().required().label("Firstname"),
      lastname: Yup.string().required().label("Lastname"),
      username: Yup.string().required().label("Username"),
      phonenumber: Yup.number().min(0).required().label("Phone number"),
      confirmPassword: Yup.string().required().label('Confirm Password').test('confirmPassword', 'Confirm password and password must be the same.', function () {
        const { confirmPassword, password } = this.parent;
        return confirmPassword === password;
      }),
    }),
    onSubmit: async (values) => {
      const data = {
        ...values,
        role: "admin"
      };
      
      const res = await httpService.post(ENDPOINTS.SIGN_UP, data);
      console.log(res);

      if (res.error) toast.error(API_RESPONSES.SIGN_UP[res.statusCode]);

      if (res.success && !res.error) {
        toast.success(
          API_RESPONSES.SIGN_UP[201]
        );

        localStorage.setItem('pettify-details', JSON.stringify(res.newUser));
        
        setTimeout(() => {
          push(`/verify-account/${res.newUser._id}`);
        }, 1000);
      }
      // else {
        // && (res.data.userType.toLowerCase() === "seller" || res.data.userType.toLowerCase() === "buyer")
        // if (res.success) {
          // toast.success(
          //   API_RESPONSES.SIGN_UP[res.statusCode] ||
          //     API_RESPONSES.SIGN_UP[res.status]
          // );

          // setTimeout(() => {
          //   push(`/auth/verify-email?role=${res.data.userType.toLowerCase()}`);
          // }, 1000);
          // localStorage.setItem('pettify-details', JSON.stringify(res.data.newUser));
          // setTimeout(() => {
          //   push(`/dashboard`);
          // }, 1000);

          // storeCookies([
          //   {
          //     key: 'pettify-token',
          //     value: res.data.token,
          //   },
          // ]);

          // localStorage.setItem('pettify-admin', JSON.stringify(res.data));
          // push('/admin/dashboard');
        // }

        // if (res.statusCode === 203) {
        //   storeCookies([
        //     {
        //       key: 'pettify-email',
        //       value: res.data.email,
        //     },

        //     {
        //       key: 'pettify-secret-reference',
        //       value: res.data.secretReference,
        //     },
        //   ]);
        // }
      // }
    },

    validateOnChange: true,
  });

  return (
    <div className=''>

      <div className='p-4 bg-white fixed top-0 left-0 w-full shadow-md z-10'>
        <Link href='/'>
          <Image src={logo} alt='Urban Overstock Logo' className='w-[100px] h-[30px]' />
        </Link>
      </div>

      <div className='flex space-between gap-6 bg-orange-300 w-full px-4 lg:px-14 py-14 mt-14'>
        <div className='w-full rounded-md p-6 shadow-xl bg-white flex justify-center align-start flex-col'>
            <p className='font-bold text-3xl mb-4 text-black'>
              Create an account
            </p>

            <form
              action=''
              className='w-full'
              onSubmit={formik.handleSubmit}
            >
              {/* Firstname and last name field */}
              <div className='my-4 flex flex-col lg:flex-row justify-between w-full gap-3'>
                {/* Firstname */}
                <div className='w-full'>
                  <label htmlFor='firstname' className='mb-2  '>
                    Firstname
                  </label>
                  <TextInput
                    onChange={formik.handleChange}
                    placeholder='Enter firstname'
                    type='text'
                    id='firstname'
                    value={formik.values.firstname}
                    error={formik.errors.firstname}
                  />
                </div>

                {/* Lastname */}
                <div className='w-full'>
                  <label htmlFor='lastname' className='mb-2'>
                    Lastname
                  </label>
                  <TextInput
                    onChange={formik.handleChange}
                    placeholder='Enter lastname'
                    type='text'
                    id='lastname'
                    value={formik.values.lastname}
                    error={formik.errors.lastname}
                  />
                </div>
              </div>

              {/* Email input field */}
              <div className='my-4'>
                <label htmlFor='email' className='mb-2'>
                  Email
                </label>
                <TextInput
                  onChange={formik.handleChange}
                  placeholder='Enter your email'
                  type='email'
                  id='email'
                  value={formik.values.email}
                  error={formik.errors.email}
                />
              </div>

              {/* Username input field */}
              <div className='my-4'>
                <label htmlFor='username' className='mb-2  '>
                  Username
                </label>
                <TextInput
                  onChange={formik.handleChange}
                  placeholder='Enter your username'
                  type='text'
                  id='username'
                  value={formik.values.username}
                  error={formik.errors.username}
                />
              </div>

              {/* Phonenumber input field */}
              <div className='my-4'>
                <label htmlFor='phonenumber' className='mb-2  '>
                  Phone number
                </label>
                <TextInput
                  onChange={formik.handleChange}
                  placeholder='Enter your phone number'
                  type='number'
                  id='phonenumber'
                  value={formik.values.phonenumber}
                  error={formik.errors.phonenumber}
                />
              </div>

              {/* Password input field */}
              <div className='my-4'>
                <label htmlFor='password' className='mb-2  '>
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

              {/* Confirm Password Input Field */}
              <div className='my-4'>
                <label htmlFor='confirmPassword' className='mb-2  '>
                  Confirm Password
                </label>
                <TextInput
                  onChange={formik.handleChange}
                  placeholder='* * * * * *'
                  type={showPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  rightIcon={showPassword ?  <IoEye /> : <IoEyeOff />}
                  rightIconClick={() => setShowPassword((prev) => !prev)}
                  value={formik.values.confirmPassword}
                  error={formik.errors.confirmPassword}
                />
              </div>

              <Button block loading={formik.isSubmitting} className='text-white font-semibold' type='submit'>
                Create Account
              </Button>

              <div className='flex items-center justify-end'>
                <Link
                  href='/login'
                  className='font-semibold text-black'
                >
                  Already have an account? <span className='hover:text-underline text-[#ED770B] hover:opacity-80 cursor-pointer hover:text-gray'> Log In.</span>
                </Link>
              </div>

              <div className='text-xs text-center text-black font-normal my-4'>
                <span>
                  {`By clicking create account, I acknowledge that I have read and do hereby accept the terms and conditions in the Pettify's`} <a href="https://docs.google.com/document/d/1BtkwJgZ5a2j8O9ZsXF8rHzp4pq27h4hRKX7KGl7v2Jg/edit?tab=t.0#heading=h.p59hquhxqchk" className='hover:text-underline text-black font-semibold'>Terms of service</a> and <a href=" https://docs.google.com/document/d/1q6iWboCW7ACP-Bzv6jniATrtZbsUP7UoksqfSmiM3OU/edit?tab=t.0#heading=h.nsm3wv9h0zcc" className='hover:text-underline text-black font-semibold'>Privacy Policy.</a>
                </span>
              </div>
            </form>
        </div>

        <div className='w-full h-[52rem] rounded-md shadow-lg hidden lg:block'>
          <Image 
            src={authImage} 
            alt='Hero image' 
            className='object-cover h-full rounded'
          />
        </div>
      </div>
    </div>
  );
}
