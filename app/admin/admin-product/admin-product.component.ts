import { Component, OnInit } from '@angular/core';
import { ICategoryResponse } from 'src/app/shared/interfaces/category';
import { ProductResponse } from 'src/app/shared/interfaces/product';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {
  constructor(
    private ProductService:ProductService,
    private CategoryService:CategoryService,
    private storage: Storage

  ) { }
  ngOnInit(): void {
    this.getAll()
  }

  public addBlockCheck=false;
  public saveCheck=false;
  public name!:string;
  public components!:string;
  public category="Роли";
  public path!:string;
  public price!:string;
  public weight!:string;
  public count=1;
  public id!:number;
  public productStorage!:ProductResponse[];
  public categoryStorage!:ICategoryResponse[];
  public random = 0;
  public productForm: any;
  public varify1: any;
  public varify2="q";
  changeCategory(category:any){
    this.category=category.value;
  }
  addBlock(){
    this.addBlockCheck=!this.addBlockCheck;
  }
  clear(){
    this.name="";
    this.components="";
    this.category="";
    this.path="";
    this.price="";
    this.weight="";
  }
  getAll(){
    this.ProductService.getAll().subscribe(info=>{
      this.productStorage=info;
    })
    this.CategoryService.getAll().subscribe(info=>{
      this.categoryStorage=info;
    })
  }
  add(){
    let info={
      name:this.name,
      components:this.components,
      path:this.path,
      price:this.price,
      category:this.category,
      weight:this.weight,
      count:this.count,
      img:this.productForm
    }
    this.ProductService.add(info).subscribe(()=>{
      this.getAll()
      this.clear()
    });
  }
  edit(info:ProductResponse){
    this.saveCheck=true;
    this.addBlockCheck=true;
    this.name=info.name;
    this.components=info.components;
    this.category=info.category;
    this.path=info.path;
    this.price=info.price;
    this.weight=info.weight;
    this.id=info.id;
    this.category="роли"
  }
  save(){
    let info={
      name:this.name,
      components:this.components,
      path:this.path,
      price:this.price,
      category:this.category,
      weight:this.weight,
      count:this.count,
      img:this.productForm
    }
    this.ProductService.edit(info,this.id).subscribe(()=>{
      this.getAll();
      this.clear();
      this.saveCheck=false;
    })
  }
  delete(info:ProductResponse){
    this.ProductService.delete(info.id).subscribe(()=>{
      this.getAll();
      this.deleteImage(info.img)
    })
  }
  upload(event: any) {
    this.random++;
    let file = event.target.files[0];
    this.uploadFile("product-images", `${file.name}${this.random}`, file)
      .then(data => {
        this.varify1 = `${file.name}${this.random}`
        this.productForm = data;
      })
      .catch(err => {
        console.log(err)
      })
  }
  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    let path = `${folder}/${name}`;
    let url = ""
    if (file) {
      try {
        let storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.log(e)
      }
    }
    else {
      console.log("Something went wrong")
    }
    return Promise.resolve(url);
  }
  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }
  deleteImage(path: string) {
    let task = ref(this.storage, path)
    deleteObject(task);
  }
}
