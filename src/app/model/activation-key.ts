import { User } from "../model/user";
import { Product } from "./product";

export class ActivationKey {
    id!: number;
    keyValue!: string;
    user!: User;
    product!: Product;
}