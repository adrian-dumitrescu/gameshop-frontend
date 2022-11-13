import { CartItem } from "./cart-item";
import { OrderItem } from "./order-item";
import { ProductDetails } from "./product-details";
import { ProductKey } from "./product-key";
import { User } from "./user";

export class Product{
    id!: number;
    pricePerKey!: number;
    discountPercent!: number;
    user!: User;
    productKeys!: ProductKey[];
    productDetails!: ProductDetails;
    cartItems!: CartItem[];
    orderItems!: OrderItem[];

    constructor(){
    }
}