import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductResponse } from 'src/app/shared/interfaces/product';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private orderService:OrderService
  ) { }
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(info => {
      this.productInfo = info['productInfo'];
      this.price = Number(this.productInfo.price);
    })
  }
  public productInfo!: ProductResponse;
  public price!: number
  fCount(info: ProductResponse, check: boolean) {
    if (check) {
      this.productInfo.count++;
    }
    else if (!check && this.productInfo.count > 1) {
      this.productInfo.count--;
    }
  }
  countChange() {
    if (this.productInfo.count < 1 || this.price == 0) {
      this.productInfo.count = 1;
    }
  }
  addToBasket(product: ProductResponse) {
    let basket = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string)
      if (basket.some((prod:ProductResponse) => prod.id === product.id)) {
        let index = basket.findIndex((prod:ProductResponse) => prod.id === product.id);
        basket[index].count += this.productInfo.count
      }
      else {
        basket.push(product)
      }
    }
    else {
      basket.push(product)
    }
    localStorage.setItem('basket', JSON.stringify(basket))
    this.productInfo.count = 1;
    this.orderService.changeBasket.next(true)
  }
}
