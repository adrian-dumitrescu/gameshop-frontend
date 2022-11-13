import { Product } from "./product";
import { ShoppingCart } from "./shopping-cart";

export class CartItem{
    id!: number;
    quantity!: number;
    createdAt!: Date;
    modifiedAt!: Date;
    shopping_cart!: ShoppingCart;
    product!: Product;
}