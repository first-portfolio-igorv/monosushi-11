import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductResponse } from 'src/app/shared/interfaces/product';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit,OnDestroy {
  constructor(
    private categoryService:CategoryService,
    private productService:ProductService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private orderService:OrderService
  ) { 
  this.subscribe=this.router.events.subscribe(event =>{
    if(event instanceof NavigationEnd){
      this.loadProduct()
    }
  })
  }
  ngOnInit(): void {
    this.loadProduct()
  }
  ngOnDestroy(): void {
    this.subscribe.unsubscribe()
  }
  public subscribe!:Subscription;
  public categoryName!:string;
  public productStorage!:ProductResponse[];
  public category!:number;
  activate(info:any){
    this.category=info.target.id;
  }
  loadProduct(){
    let categoryName=this.activatedRoute.snapshot.paramMap.get("category") as string;
    this.categoryName=categoryName
    this.productService.getAllByCategory(categoryName).subscribe(info=>{
      this.productStorage=info;
    })
  }
  fCount(info: ProductResponse, check: boolean) {
    if (check) {
      info.count++;
    }
    else if (!check && info.count > 1) {
      info.count--;
    }
  }
  addToBasket(product: ProductResponse) {
    let basket = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string)
      if (basket.some((prod:ProductResponse) => prod.id === product.id)) {
        let index = basket.findIndex((prod:ProductResponse) => prod.id === product.id);
        basket[index].count += product.count
      }
      else {
        basket.push(product)
      }
    }
    else {
      basket.push(product)
    }
    localStorage.setItem('basket', JSON.stringify(basket))
    product.count = 1;
    this.orderService.changeBasket.next(true)
  }
}
