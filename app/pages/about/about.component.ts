import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public active=[false,false,false,false];
  check1(){
    this.active[0]=!this.active[0];
    this.active[1]=false;
    this.active[2]=false;
    this.active[3]=false;
    console.log("df")
  }
  check2(){
    this.active[0]=false;
    this.active[1]=!this.active[1];;
    this.active[2]=false;
    this.active[3]=false;
  }
  check3(){
    this.active[0]=false;
    this.active[1]=false;
    this.active[2]=!this.active[2];;
    this.active[3]=false;
  }
  check4(){
    this.active[0]=false;
    this.active[1]=false;
    this.active[2]=false;
    this.active[3]=!this.active[3];;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
