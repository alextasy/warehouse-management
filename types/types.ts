import { ObjectId } from "mongodb";

export type account = {
    username: string,
    password?: string,
    email: string,
    phoneNumber?: string,
}

export type ProductCategory = 'Food goods' | 'Building materials' | 'Chancery materials';

export type Product = {
    _id: string|ObjectId|undefined,
    code: string,
    name: string,
    description?: string,
    buyAt: string,
    sellAt: string,
    category: ProductCategory,
    stock: number,
}