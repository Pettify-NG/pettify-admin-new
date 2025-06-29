import { IUser } from "./users";

export default interface IAccessory {
    description: string
    quantity: string
    createdAt: string
    accessoryImages: string[]
    price: number
    name: string
    _id: string
    category: string
    location: {
        state: string
        lga: string
        address: string
    }
    seller: IUser
}