"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
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
    ],
  },
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

  const initialValues = initialPrices.reduce((acc, { name, price }) => {
    acc[name] = price;
    return acc;
  }, {} as Record<string, string>);

  const formik = useFormik({
    // initialValues: Object.keys(deliveryData).reduce((acc, key) => {
    //   acc[key] = deliveryData[key as DeliveryKeys].price; // Initialize prices from deliveryData
    //   return acc;
    // }, {} as Record<string, number>)
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
          { updates }
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
        {initialPrices.map((axis, index) => (
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

        <Button type="submit" loading={formik.isSubmitting} className="mt-6">
          Submit
        </Button>
      </form>
    </>
  );
};

export default DeliveryPriceForm;
