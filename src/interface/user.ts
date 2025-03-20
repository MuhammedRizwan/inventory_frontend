export default interface Iuser{
    _id?:string
    name: string;
    mobile: string;
    email: string;
    password: string;
    confirmPassword?: string;
    is_verified ?: boolean;
    createdAt ?: Date;
    updatedAt ?: Date;
}