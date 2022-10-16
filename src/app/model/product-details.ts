import { ActivationKey } from "../model/activation-key";

export class ProductDetails {
    id!: number;
    prooductName!: string;
    publisher!: string;
    activationKeys!: ActivationKey[];
}