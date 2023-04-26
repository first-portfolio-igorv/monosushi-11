import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { getDownloadURL, ref, Storage, uploadBytesResumable } from '@angular/fire/storage'
import { ICategoryResponse } from 'src/app/shared/interfaces/category';
import { ProductResponse } from 'src/app/shared/interfaces/product';
import { of, reduce } from 'rxjs';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public categoryForm: any;
  public categoryList!: Array<ICategoryResponse>;
  public smalCategoryList: any = []
  public basketCheck = false;
  public menuLaptop = false;
  public menuMobile = false;
  public rotateLine = false;
  public basket!: Array<ProductResponse>;
  public totalprice = 0;
  public totalcount = 0;
  public price!: number;
  public count!: number;
  public userCheck = false;
  public adminCheck = false;
  public guestCheck = true;
  public authBlockActive = false;
  public email!: string;
  public password="";
  public name="";
  public surname="";
  public signInCheck=true;
  public testCheck=false;
  public fail=false;
  constructor(
    private categoryServise: CategoryService,
    private storage: Storage,
    private orderService: OrderService,
    private accountService: AccountService
  ) { }
  categoryNameExport(info: any) {
    this.categoryServise.categoryName = info.textContent;
    console.log(info.textContent)
  }
  basketActive() {
    this.basketCheck = !this.basketCheck;
  }
  menuActive() {
    this.menuMobile = !this.menuMobile;
    this.rotateLine = !this.rotateLine;
  }
  menuToggle() {
    this.menuLaptop = !this.menuLaptop;
    this.rotateLine = !this.rotateLine;
  }
  authActive() {
    this.authBlockActive = !this.authBlockActive;
    this.signInCheck=true;
  }
  async uploadFile(folder: string, name: string, file: File): Promise<string> {
    const path = `${folder}/${name}`;
    let storageRef = ref(this.storage, path);
    let task = uploadBytesResumable(storageRef, file);
    await task;
    let url = getDownloadURL(storageRef);
    console.log(url)
    return Promise.resolve(url);
  }
  upload(event: any) {
    let file = event.target.files[0];
    this.uploadFile('category-images', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
          imagePath: data
        });
      })
      .catch(err => {
        console.log(err);
      })
  }
  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }
  loadCategory() {
    this.categoryServise.getAll().subscribe(data => {
      this.categoryList = data;
      let i = 0;
      for (let info of this.categoryList) {
        if (i < 4) {
          i++;
          this.smalCategoryList.push(info)
        }
      }
    })
  }
  loadBasket() {
    if (localStorage.length > 0 && localStorage.getItem("basket")) {
      this.basket = JSON.parse(localStorage.getItem("basket") as string)
    }
    this.totalPrice();
    this.totalCount();
  }
  totalPrice() {
    if (this.basket) {
      this.totalprice = this.basket.reduce((total: number, product: ProductResponse) => total + product.count * Number(product.price), 0)
    }
  }
  totalCount() {
    if (this.basket) {
      this.totalcount = this.basket.reduce((total: number, product: ProductResponse) => total + product.count, 0)
    }
  }
  updateBasket() {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket();
    })
  }
  fCount(info: ProductResponse, check: boolean) {
    if (check) {
      info.count++;
      this.changeBasket(info, check)
    }
    else if (!check && info.count > 1) {
      info.count--;
      this.changeBasket(info, check)
    }
  }
  changeBasket(product: ProductResponse, check: boolean) {
    let basket = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string)
      if (basket.some((prod: ProductResponse) => prod.id === product.id)) {
        let index = basket.findIndex((prod: ProductResponse) => prod.id === product.id);
        if (check) {
          basket[index].count++;
        }
        else {
          basket[index].count--;
        }
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
  signInIcon(){
    this.signInCheck=true;
    this.clearInput();
  }
  signUpIcon(){
    this.signInCheck=false;
    this.clearInput();
  }
  clearInput(){
    this.name="";
    this.surname="";
    this.email="";
    this.password="";
    this.fail=false;
  }
  test(){
    let count=0;
    let test=[];
    test[0]=/^[А-Яа-яA-Za-z]{3,15}$/.test(this.name);
    test[1]=/^[А-Яа-яA-Za-z]{3,15}$/.test(this.surname);
    test[2]=/^[A-Za-z0-9,.,-]+@[A-Za-z0-9,.,-]+$/.test(this.email);
    test[3]=/^\w{5,20}$/.test(this.password);
    
    for (const check of test) {
      count++;
      if(check==false){
        this.testCheck=false;
        this.fail=true;
        break;
      }
      else if(count==test.length){
        let users=JSON.parse(localStorage.getItem("users") as string);
        for (const info of users) {
          if(info.email==this.email){
            this.testCheck=false;
            this.fail=true;
            break
          }
          this.testCheck=true;
        }
        
      }
    }
  }
  signIn() {
    let users=[];
    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users") as string);
      let count=0;
      for (const info of users) {
        if (info.email == this.email && info.password == this.password) {
          if(info.email == "admin@gmail.com" && this.password=="qwer1234"){
            this.adminCheck=true;
            this.userCheck=false;
            this.guestCheck=false;
            this.authBlockActive=false;
          }
          else{
            this.adminCheck=false
            this.userCheck=true;
            this.guestCheck=false;
            this.authBlockActive=false;
          }
            
          let user={
            email:this.email,
            password:this.password,
            role:info.role
          }
          localStorage.setItem("currentUser", JSON.stringify(user));
          break;
        }
        count++;
        if(count==users.length){
          this.fail=true;
        }
      }
    }
    else{
      this.fail=true;
    }
  }
  signUp(){
    let users=[];
    let info={
      email:this.email,
      password:this.password,
      name:this.name,
      surname:this.surname,
      role:"user"
    }
    this.test();
    if(this.testCheck){
    this.authBlockActive=false;
    this.guestCheck=false;
    this.userCheck=true;
    users=JSON.parse(localStorage.getItem("users") as string);
    users.push(info);
    localStorage.setItem("users",JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(info));
    this.accountService.create(info).subscribe(()=>{
      this.loadAccount()
    })
    }
    else{
      this.fail=true;
    }
  }
  loadAccount(){
    this.accountService.getAll().subscribe(info=>{
      localStorage.setItem("users",JSON.stringify(info))
    })
  }
  UserCheck(){
    if(localStorage.getItem("currentUser")){
    let user=JSON.parse(localStorage.getItem("currentUser") as string);
    if(user.role=="admin"){
      this.adminCheck=true;
      this.guestCheck=false;
    }
    else{
      this.guestCheck=false;
      this.userCheck=true;
    }
    }
    else{
      this.adminCheck=false;
      this.userCheck=false;
      this.guestCheck=true;
    }
  }
  userUpdate(){
    this.accountService.checkUser$.subscribe(()=>{
      this.UserCheck();
      console.log("work")
    })
  }
  ngOnInit(): void {
    this.loadCategory();
    this.loadBasket();
    this.updateBasket();
    this.loadAccount();
    this.UserCheck();
    this.userUpdate();
  }
}
