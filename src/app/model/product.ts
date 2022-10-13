import { ActivationKey } from "../model/activation-key";

export class Product {
    id!: number;
    name!: string;
    publisher!: string;
    activationKeys!: ActivationKey[];
}