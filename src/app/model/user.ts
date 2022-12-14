import { Role } from "../model/role";
import { OrderDetails } from "./order-details";
import { Product } from "./product";
import { ProductKey } from "./product-key";
import { ShoppingCart } from "./shopping-cart";

export class User {
  user: any;
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  joinDate!: Date;
  isNotLocked!: boolean;
  isEnabled!: boolean;
  profileImageUrl!: string;
  nickname!: string;
  country!: string;
  gender!: string;
  age!: number;
  roles!: Role[];
  shoppingCart!: ShoppingCart;
  orderDetails!: OrderDetails[];
  products!: Product[];
  //activationKeys!: ProductKey[];

  constructor() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.isEnabled = false;
    this.isNotLocked = false;
    //this.roles = [];
    this.email = '';
  }
}

// {
//     "id": 2,
//     "firstName": "Richard",
//     "lastName": "Dumitrescu",
//     "email": "dumitrescu.adrian121@gmail.com",
//     "password": "$2a$10$bm.mZD21jqoP2n1okI1IP.W3/8VDjhaDrmGufuBspz7GV/UtIMk86",
//     "roles": [
//         {
//             "id": 2,
//             "role": "ROLE_USER"
//         }
//     ],
//     "profileImageUrl": null,
//     "joinDate": "2022-09-26T19:24:04.194+00:00",
//     "isNotLocked": true,
//     "isEnabled": true
// }