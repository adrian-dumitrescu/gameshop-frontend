import { OrderDetails } from "./order-details";
import { Product } from "./product";

export class OrderItem{
    id!: number;
    quantity!: number;
    createdAt!: Date;
    modifiedAt!: Date;
    order_details!: OrderDetails;
    product!: Product;
}