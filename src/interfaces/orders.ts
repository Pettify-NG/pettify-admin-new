import { IUser } from "./users";

export default interface IOrder {
  uuid: string;
  _id: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
  selectedLocation: string;
  buyer: IUser;
  seller: IUser;
  totalAmount: number;
  totalPriceAll: number;
  status: "pending" | "paid" | "failed";
  deliveryStatus: string;
  paymentStatus: string;
  currency: string;
  createdAt: string;
  products: IProductItem[];
  totalAmountForSeller: number;
  deliveryOption: string;
  deliveryAddress: string;
  pickupLocation: string;
  updatedAt: string;
  deliveryDate: string;
}

export interface IProductItem {
  product: any;
  quantity: number;
  price: number;
  productType: "pet" | "accessory";
  totalPrice: number
}
  
export interface OrdersResponse {
    orders: IOrder[];
}
  