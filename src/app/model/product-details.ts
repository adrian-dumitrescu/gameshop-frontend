import { ProductKey } from "../model/product-key";
import { Product } from "./product";

export class ProductDetails {
    id!: number;
    title!: string;
    publisher!: string;
    products!: Product[];
}