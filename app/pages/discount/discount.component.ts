import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DiscountResponse } from 'src/app/shared/interfaces/discount';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
  constructor(
    private discountService:DiscountService,
    private activatedRoute:ActivatedRoute

  ) { }
  ngOnInit(): void {
    this.getAll()
  }
  public discountStorage!:DiscountResponse[];
  getAll(){
    this.discountService.getAll().subscribe(info=>{
      this.discountStorage=info;
    })
  }
}
