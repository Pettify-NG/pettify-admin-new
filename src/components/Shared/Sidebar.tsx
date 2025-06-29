"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CgMenu } from 'react-icons/cg';
import { CgClose } from 'react-icons/cg';
import { IoIosLogOut } from "react-icons/io";
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoPersonCircleSharp } from "react-icons/io5";

// Rest of your imports from custom components...
import logoIcon from '../../../public/pettify-logo.png';
import logo from '../../../public/pettify-logo.png';
import { ISidebarLink, adminLinks } from '@/static';
import useLocalStorage from '@/hooks/useLocalStorage';

type SidebarProps = {
  isOpen: Boolean;
  toggleSidebar: () => void;
  setSidebarOpen: any;
  notifications: any;
  orders: any;
  returnRequests: any;
};

export default function Sidebar({ isOpen, toggleSidebar, setSidebarOpen, notifications, orders, returnRequests}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState<null | number>(null);

  const [adminDetails, setData] = useLocalStorage<any>("pettify-details", {} as any);

  const cookies = new Cookies();
  const router = useRouter();
  const pathname = usePathname();

  const logOut = () => {
    cookies.remove("pettify-token");
    cookies.set('pettify-token', "", {
      path: '/',
    });
    router.push("/login");
  };

  const links = adminLinks;

  return (
    <>
    {/* For smaller and medium screens */}
    <div className='lg:hidden'>
      <div
        className={`w-screen h-screen z-30 fixed top-0 left-0 bg-[#0000004f] duration-300 block lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed top-0 z-50 bg-white h-screen duration-300 overflow-y-auto ${
          isOpen
            ? 'lg:w-1/6 translate-x-0 w-64 left-0'
            : 'lg:w-1/12 -translate-x-[100%] lg:translate-x-0 w-0 -left-4 lg:left-0'
        }`}
      >
        <div
          className='font-bold mt-2 mb-4 capitalize text-2xl text-gray-700 flex items-center justify-center'
          onClick={toggleSidebar}
        >
          {isOpen && <CgClose />}
          {!isOpen && <CgMenu />}
        </div>
        <div className='p-4 mt-2 mb-4 flex items-center justify-center'>
          <Image
            onClick={toggleSidebar}
            src={isOpen ? logo : logoIcon}
            alt='Pettify Logo'
            className={`duration-500 ${isOpen ? 'w-2/3' : 'w-1/2'}`}
          />
        </div>
        <div className={'p-2'}>
          {/* {links.map((link) => (
            <Link
              key={link.name}
              href={link.page}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '16px 0',
              }}
            >
              <div
                className={`py-4 flex gap-4 w-full h-10 items-center duration-500 rounded-md text-sm ${
                  pathname.trim() === link.page
                    ? 'bg-primary-2 text-white hover:bg-primary'
                    : 'white text-neutral hover:bg-gray-100'
                } ${isOpen ? 'justify-start pl-6' : 'justify-center pl-0'}`}
              >
                <span>{link.icon}</span>
                {isOpen && <p className={`capitalize`}>{link.name}</p>}
              </div>

            </Link>
          ))} */}

          {
            links.map((link: ISidebarLink, index: number) => {
                return (
                    <Link
                      key={link.name}
                      href={link.name === "profile" ? `${link.page}/${adminDetails?.user?._id}`: link.page}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '16px 0',
                      }}
                    >
                      <div
                        className={`py-4 flex gap-4 w-full h-10 items-center duration-500 rounded-md text-sm ${
                          pathname.trim() === link.page
                            ? 'bg-gray-200 text-[#ED770B] hover:bg-gray-200'
                            : 'white text-neutral hover:bg-gray-100'
                        } ${isOpen ? 'justify-start pl-6' : 'justify-center pl-0'}`}
                      >
                        <span>{link.icon}</span>
                        {isOpen && <p className={`capitalize`}>{link.name}</p>}
                      </div>
                    </Link>
                )                            
            })
          }
        </div>

        {/* Logout */}
        <div className='cursor-pointer self-end rounded p-2 flex items-center'>
            <div
              onClick={() => logOut()}
              className={`uo-tool-tip py-4 flex  gap-4 w-full h-10 items-center duration-500 rounded-md font-medium white text-neutral hover:bg-gray-50
              } ${isOpen ? 'justify-start pl-6' : 'justify-center pl-0'}`}
              data-pr-tooltip="Logout"
              data-pr-position="right"
            >
              <IoIosLogOut />
              {isOpen && <p className='capitalize'>Logout</p>}
            </div>
        </div>
      </div>
    </div>

    {/* For larger screens */}
    <div className='hidden lg:block'>
      <div
        className={`w-screen h-screen z-30 fixed top-0 left-0 bg-[#0000004f] duration-300 block lg:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleSidebar}
      ></div>

      <div
        className={`fixed top-0 z-50 bg-white h-screen duration-300 ${
          isOpen
            ? 'lg:w-1/6 translate-x-0 w-64 left-0'
            : 'lg:w-1/12 -translate-x-[100%] lg:translate-x-0 w-0 -left-4 lg:left-0'
        }`}
      >
        {/* Button for toggling sidebar */}
        <div className='flex items-center justify-center h-[50px] mx-auto w-1/2'>
          <Image
              onClick={toggleSidebar}
              src={isOpen ? logo : logoIcon}
              alt='Urban Overstock Logo'
              className={`duration-500 ${isOpen ? 'w-2/3' : 'w-1/2'}`}
            />
        </div>

        {/* User profile */}
        {/* Sidebar content */}
        <div className="flex flex-col h-full gap-[10px] px-[18px]">
          {/* Your sidebar navigation links */}
          {
              links.map((link: ISidebarLink, index: number) => {
                return (
                    <Link
                      key={link.name}
                      // href={link.page}
                      href={link.name === "profile" ? `${link.page}/${adminDetails?.user?._id}`: link.page}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        //margin: '16px 0',
                      }}
                    >
                      <div
                        className={`py-4 uo-tool-tip flex gap-4 w-full h-10 items-center duration-500 rounded-md text-sm ${
                          pathname.trim() === link.page
                            ? 'bg-gray-200 text-[#ED770B] hover:bg-gray-200'
                            : 'white text-neutral hover:bg-gray-100'
                        } ${isOpen ? 'justify-start pl-6' : 'justify-center pl-0'}`}
                        // onClick={handleNavItemClick}
                        data-pr-tooltip={link.name.replace(/\b\w/g, (l) => {return l.toUpperCase()})}
                        data-pr-position="right"
                      >
                        
                          <span>{link.icon}</span>
            
                          {isOpen && <p className={`capitalize`}>{link.name}</p>}

                          {/* {link.name.toLowerCase() === "notification" && isOpen && (
                            <div className='px-[6px] bg-red-500 rounded-full text-[8px] text-white'>
                              {notifications?.data.count ?? 0}
                              {10}
                            </div>
                          )}

                          {link.name.toLowerCase() === "orders" && isOpen && (
                            <div className='px-[6px] bg-red-500 rounded-full text-[8px] text-white'>
                              {notifications}
                              {orders?.data.length ?? 0}
                              {10}
                            </div>
                          )}

                          {link.name.toLowerCase() === "return request" && isOpen && (
                            <div className='px-[6px] bg-red-500 rounded-full text-[8px] text-white'>
                              {notifications}
                              {returnRequests?.data.length ?? 0}
                              {10}
                            </div>
                          )} */}
                      </div>
                    </Link>
                );             
              })
          }

          {/* Logout */}
          <div className='cursor-pointer mt-[10px] rounded p-2 flex items-center bg-[#ED770B] hover:bg-white'>
              <div
                onClick={() => logOut()}
                className={`uo-tool-tip py-4 flex gap-4 w-full h-10 items-center duration-500 text-white rounded-md font-medium white hover:text-neutral hover:bg-gray-50
                } ${isOpen ? 'justify-start pl-6' : 'justify-center pl-0'}`}
                data-pr-tooltip="Logout"
                data-pr-position="right"
              >
                <IoIosLogOut />
                {isOpen && <p className='capitalize'>Logout</p>}
              </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
