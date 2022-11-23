import { ProductKey } from "../model/product-key";
import { Product } from "./product";

export class ProductDetails {
    id!: number;
    title!: string;
    summary!: string;
    contentRating!: string;
    initialRelease!: Date;
    genres!: string;
    platforms!: string;
    publisher!: string;
    products!: Product[];

    constructor(){
    }
}