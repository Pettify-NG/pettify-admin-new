export interface IUser {
    _id: string
    username: string
    firstname: string
    lastname: string
    email: string
    phonenumber: number
    profileImage: string
    totalPurchases: number
    totalAmountSpent: number
    totalTransactions: number
    deliveryAddress: string
    createdAt: string
    updatedAt: string
    totalPets: number
    totalAccessories: number
}

export type IUsers = IUser[];