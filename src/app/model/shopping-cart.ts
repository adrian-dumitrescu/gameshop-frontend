import { CartItem } from "./cart-item";
import { User } from "./user";

export class ShoppingCart {
    id!: number;
    total!: number;
    createdAt!: Date;
    modifiedAt!: Date;
    user!: User;
    cartItems!: CartItem[];

    constructor(){
    }
}