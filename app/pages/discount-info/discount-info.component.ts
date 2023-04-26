import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscountResponse } from 'src/app/shared/interfaces/discount';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-discount-info',
  templateUrl: './discount-info.component.html',
  styleUrls: ['./discount-info.component.scss']
})
export class DiscountInfoComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,
  ) {  }
  public discountInfo!:DiscountResponse;
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(info=>{
      this.discountInfo=info["discountInfo"]
    })
  }

}
