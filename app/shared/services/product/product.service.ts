import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductRequest, ProductResponse } from '../../interfaces/product';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements Resolve<ProductResponse[]>{
  public url=environment.BACKEND_URL;
  public api={product:`${this.url}/product`}
  getAll():Observable<ProductResponse[]>{
    return this.http.get<ProductResponse[]>(this.api.product)
  }
  getAllByCategory(name:string):Observable<ProductResponse[]>{
    return this.http.get<ProductResponse[]>(`${this.api.product}?category=${name}`)
  }
  getOne(id:number):Observable<ProductResponse>{
    return this.http.get<ProductResponse>(`${this.api.product}/${id}`)
  }
  add(info:ProductRequest):Observable<ProductResponse>{
    return this.http.post<ProductResponse>(this.api.product,info)
  }
  delete(id:number){
    return this.http.delete(`${this.api.product}/${id}`)
  }
  edit(info:ProductRequest, id:number):Observable<ProductResponse[]>{
    return this.http.patch<ProductResponse[]>(`${this.api.product}/${id}`,info)
  }
  resolve(route:ActivatedRouteSnapshot):Observable<ProductResponse[]>{
    return this.http.get<ProductResponse[]>(`${this.api.product}/${route.paramMap.get("id")}`)
  }
  constructor(
    public http:HttpClient
  ) { }
}
