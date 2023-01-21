import { ObjectId } from "mongodb";

export type ErrorRes = {
    error: string
}

export type User = {
    _id?: string;
    username: string,
    password?: string,
    email: string,
    phone?: string,
    token?: string
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