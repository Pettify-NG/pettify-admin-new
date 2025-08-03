"use client";

import { IoMdSettings } from "react-icons/io";
import { IoMdHome } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { MdOutlinePets } from "react-icons/md";
import { FaWallet } from "react-icons/fa6";
import { FaBone } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { FaRegImage } from "react-icons/fa6";
import { PiHandWithdrawFill } from "react-icons/pi";

export const adminLinks: ISidebarLink[] = [
  { name: 'home', icon: <IoMdHome />, page: '/dashboard' },
  {
    name: 'pets',
    icon: <MdOutlinePets />,
    page: '/dashboard/pets',
  },
  {
    name: 'accessories',
    icon: <FaBone />,
    page: '/dashboard/accessories'
  },
  {
    name: 'orders',
    icon: <FaShoppingCart />,
    page: '/dashboard/orders',
  },
  {
    name: 'users',
    icon: <IoMdPerson />,
    page: '/dashboard/users',
  },
  {
    name: 'merchants',
    icon: <IoMdPerson />,
    page: `/dashboard/merchants`
  },
  {
    name: 'customers',
    icon: <IoMdPerson />,
    page: `/dashboard/customers`
  },
  {
    name: 'slider images',
    icon: <FaRegImage />,
    page: `/dashboard/slider-images`
  },
  {
    name: "notifications",
    icon: <IoIosNotifications />,
    page: `/dashboard/notifications`
  },
  { name: 'delivery-prices', icon: <IoMdSettings />, page: '/dashboard/delivery-prices' },
  // { name: 'withdrawal requests', icon: <PiHandWithdrawFill />, page: "/dashboard/withdrawal-requests" }
  // { name: 'notification', icon: <LuMail />, page: '/admin/dashboard/notifications' },
];

export type ISidebarLink = {
  name: string;
  page: string;
  icon: React.ReactNode;
  // children?: ILink[];
}

// type ILink = {
//   name: string;
//   page: string;
//   children?: {
//     name: string;
//     page: string;
//   }[];
// };

// export type RootLink = {
//   title: string;
//   root: string;
//   icon: React.ReactNode;
//   children: ILink[];
// };
