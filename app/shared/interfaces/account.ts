export interface AccountRequest {
    email:string,
    password:string,
    name:string,
    surname:string,
    role:string,
}
export interface AccountResponse extends AccountRequest{
    id:number
}
