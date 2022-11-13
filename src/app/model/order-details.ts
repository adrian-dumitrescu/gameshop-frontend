import { OrderItem } from "./order-item";
import { User } from "./user";

export class OrderDetails{
    id!: number;
    total!: number;
    createdAt!: Date;
    modifiedAt!: Date;
    user!: User;
    orderItems!: OrderItem[];
}