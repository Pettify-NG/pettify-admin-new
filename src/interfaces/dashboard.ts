import { IWallet } from "./wallet";
import IOrder from "./orders";

export interface IDashboardData {
    wallet?: IWallet
    orders: IOrder[]
    totalOrders: number
    totalPets: number
    totalAccessories: number
    totalBalance: number
    pendingWalletBalance?: number
    totalSellers?: number
    totalBuyers?: number
}