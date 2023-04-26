import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { ProductComponent } from 'src/app/pages/product/product.component';
import { environment } from 'src/environments/environment';
import { ICategoryRequest, ICategoryResponse } from '../../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private http:HttpClient
  ) { }
  private url = environment.BACKEND_URL;
  private api ={categories:`${this.url}/categories`};
  public categoryName!:string;
  getAll():Observable<ICategoryResponse[]>{
    return this.http.get<ICategoryResponse[]>(this.api.categories);
  }
  add(info:ICategoryRequest):Observable<ICategoryResponse[]>{
    return this.http.post<ICategoryResponse[]>(this.api.categories,info)
  }
  delete(id:number){
    return this.http.delete(`${this.api.categories}/${id}`)
  }
  edit(info:ICategoryRequest,id:number):Observable<ICategoryResponse>{
    return this.http.patch<ICategoryResponse>(`${this.api.categories}/${id}`,info)
  }
}