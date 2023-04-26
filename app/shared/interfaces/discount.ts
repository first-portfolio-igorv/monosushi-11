export interface DiscountRequest {
    name:string,
    title:string,
    description:string,
    path:string
}
export interface DiscountResponse extends DiscountRequest{
    id:number
}