import { User } from "./user";
import { ProductDetails } from "./product-details";
import { Product } from "./product";

export class ProductKey {
    id!: number;
    activationKey!: string;
    product!: Product;
}