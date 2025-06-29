"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";

import Button from "@/components/Global/Button";
import ENDPOINTS from "@/config/ENDPOINTS";
import HTTPService from "@/services/http";

const deliveryData = {
  "Island 1": {
    price: 5200,
    locations: [
      "Lekki",
      "Ikate",
      "Salem",
      "Ilasan",
      "Jakande",
      "Ologolo",
      "Agungi",
      "Osapa London",
      "Igboefon",
      "Chevron",
      "Eleganza",
      "LCC",
      "Oral Estate",
      "Orchid Road",
      "Lekki County Homes",
      "Ikota",
      "VGC",
      "Ajah",
      "Ilaje",
      "Thomas Estate",
      "Addo Road",
      "Badore",
      "Langbasa",
      "Abraham Adesanya",
      "General Paint",
      "Olokunla",
      "Majek",
      "Sangotedo",
      "Ogidan",
    ],
  },
  "Island 2": {
    price: 5000,
    locations: ["Oniru", "VI", "Ikoyi", "Onikan", "Obalende", "Lagos Island"],
  },
  "Island 3": {
    price: 5500,
    locations: ["Abijo", "Mayfair gardens", "Ologunfe", "Awoyaya", "Eputu", "Oribanwa", "Lakowe", "Bogije"]
  },
  "Mainland 1": {
    price: 4500,
    locations: ["Yaba", "Ojuelegba", "Surulere", "Akoka"],
  },
  "Mainland 2": {
    price: 4000,
    locations: [
        "Jibowu",
        "Shomolu",
        "Fadeyi",
        "Costain",
        "Bariga",
        "Gbagada",
        "Anthony",
        "Ilupeju",
        "Obanikoro",
        "Maryland",
        "Palmgroove",
        "Ebute Metta",
        "Oyingbo",
        'Ogudu/Ojota',
        'Ketu',
        'Ikosi/Ketu',
        'Alapere',
        'Omole 1 & 2',
        'Oworonshoki',
        'Idi Araba/Mushin',
        'Ajao Estate/Cele',
        'Magodo 1 & 2',
        'Magodo Olowora',
        'Magodo Isheri',
        'Ikeja',
        'Dopemu',
        'Mangoro',
        'Agege',
        'Isolo',
        'Ire Akari Isolo',
        'Jakande Oshodi',
        'Ago Palace Okota'
    ],
  },
  "Mainland 3": {
    price: 5000,
    locations: [
        'Airport',
        'Ikeja',
        'Ogba',
        'Iju Ishaga/College Road',
        'Berger (Exclusive Of Ogun State Axis)',
        'Iyana Ipaja',
        'Ipaja Command',
        'Ipaja Baruwa',
        'Egbeda',
        'Ikotun/Ejigbo',
        'Igando',
        'Festac/Amuwo Odofin',
        'Isheri Oshun',
        'Mile 2',
        'Abule Egba',
        'Ahmadiya',
        'Apapa',
        'Mile 12'
    ]
  },
  "Mainland 4": {
    price: 5700,
    locations: ["Satellite town", "Ijegun/ijedodo", "Tradefair", "Alakuko", "Lasu", "Iba", "Ojo", "Owode", "Onirin", "Magidun", "Ikorodu"]
  }
};

type DeliveryKeys = keyof typeof deliveryData;

interface DeliveryPrice {
  name: string;
  price: string;
}

interface DeliveryPriceFormProps {
  initialPrices: DeliveryPrice[];
}

const DeliveryPriceForm: React.FC<DeliveryPriceFormProps> = ({ initialPrices }) => {
    const httpService = new HTTPService();

    const cookies = new Cookies();
    const token = cookies.get("pettify-token");

  const initialValues = initialPrices?.reduce((acc, { name, price }) => {
    acc[name] = price;
    return acc;
  }, {} as Record<string, string>);

  const formik = useFormik({
    // initialValues: Object.keys(deliveryData).reduce((acc, key) => {
    //   acc[key] = deliveryData[key as DeliveryKeys].price; // Initialize prices from deliveryData
    //   return acc;
    // }, {} as Record<string, number>),
    initialValues,

    validationSchema: Yup.object(
      Object.keys(deliveryData).reduce((acc, key) => {
        acc[key] = Yup.number().required(`Price for ${key} is required`);
        return acc;
      }, {} as Record<string, Yup.AnySchema>)
    ),

    onSubmit: async (values) => {
      try {
        const updates = Object.keys(values).map((key) => ({
          name: key,
          newPrice: values[key],
        }));

        const response = await httpService.put(
            `${ENDPOINTS.DELIVERY_PRICES}`,
            { updates },
            `Bearer ${token}`
        );

        if (response.success) {
          toast.success("Delivery prices updated successfully.");
        } else {
          toast.error(response.message || "Failed to update delivery prices.");
        }
      } catch (error: any) {
        toast.error(error.message || "An error occurred.");
      }
    },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Update Delivery Prices</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {initialPrices?.map((axis, index) => (
          <div key={index} className="border-b pb-4">
            <label className="block text-lg font-semibold mb-2">{axis.name}</label>

            <p className="text-gray-500 text-sm italic mb-4">
                {deliveryData[axis.name as DeliveryKeys].locations.join(", ")}
            </p>

            <div>
              <input
                type="string"
                name={axis.name}
                value={formik.values[axis.name]}
                onChange={formik.handleChange}
                placeholder={`Enter price for ${axis.name}`}
                className="border rounded w-full p-2"
              />
              {formik.errors[axis.name] && (
                <p className="text-red-500 text-sm mt-1">{formik.errors[axis.name]}</p>
              )}
            </div>
          </div>
        ))}

        {/* {Object.keys(deliveryData).map((axis) => (
          <div key={axis} className="border-b pb-4">
            <label className="block text-lg font-semibold mb-2">{axis}</label>

            Grayed-out locations
            <p className="text-gray-500 text-sm italic mb-4">
              {deliveryData[axis as DeliveryKeys].locations.join(", ")}
            </p>

            <div>
              <input
                type="number"
                name={axis}
                value={formik.values[axis as DeliveryKeys]}
                onChange={formik.handleChange}
                placeholder={`Enter price for ${axis}`}
                className="border rounded w-full p-2"
              />
              {formik.errors[axis as DeliveryKeys] && (
                <p className="text-red-500 text-sm mt-1">{formik.errors[axis as DeliveryKeys]}</p>
              )}
            </div>
          </div>
        ))} */}

        <Button type="submit" loading={formik.isSubmitting} className="text-white">
          Submit
        </Button>
      </form>
    </>
  );
};

export default DeliveryPriceForm;
