import { Component, OnInit } from '@angular/core';
import { ProductResponse } from 'src/app/shared/interfaces/product';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private productService:ProductService,
    private orderService:OrderService
  ) { }
  ngOnInit(): void {
    this.getAll();
  }
  public productStorage!:ProductResponse[];
  public category!:number;
  activate(info:any){
    this.category=info.target.id
  }
  getAll(){
    this.productService.getAll().subscribe(info=>{
      this.productStorage=info;
    })
  }
  slider(info:any){
    console.log(info)
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
