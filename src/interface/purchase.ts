
export default interface Ipurchase {
    _id?: string;
    userId: string | undefined;
    date: Date;
    customer: string | undefined;
    product: string | undefined;
    price: number;
    quantity: number;
    payment: "Cash" | "Bank";
    createdAt?: Date;
    updatedAt?: Date;
}


export interface Purchase {
    _id: string;
    date: string;
    customer: { _id: string; name: string };
    product: { _id: string; name: string };
    price: number;
    quantity: number;
    payment: string;
}