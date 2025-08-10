import { IUser } from "./users";
import { IWallet } from "./wallet";

export default interface IWithdrawalRequest {
    _id: string
    seller: IUser
    amount: number
    createdAt: string
    status: string
    adminNote: string
    wallet: IWallet
}

export type IWithdrawalRequests = IWithdrawalRequest[];

