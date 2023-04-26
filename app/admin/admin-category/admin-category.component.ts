import { Component, OnInit } from '@angular/core';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject,Storage } from '@angular/fire/storage';
import { ICategoryResponse } from 'src/app/shared/interfaces/category';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {
  public addBlock = false;
  public name!: string;
  public description!: string;
  public title!: string;
  public categoryStorage!: ICategoryResponse[];
  public saveButtonCheck = false;
  public itemId!: number;
  public random = 0;
  public categoryForm: any;
  public varify1: any;
  public varify2="q";
  constructor(
    private storage: Storage,
    private CategoryService:CategoryService
  ) { }
  falseCheck() {
    this.addBlock = false;
    this.saveButtonCheck = false;
  }
  clear() {
    this.name = "";
    this.description = "";
    this.title = ""
  }
  AddBlock() {
    this.addBlock = !this.addBlock;
    this.clear();
    this.saveButtonCheck=false;
  }
  addCategory() {
    if (this.varify1 != this.varify2) {
      this.varify2 = this.varify1;
      let info = {
        name: this.name,
        path: this.title,
        imagePath: this.categoryForm
      }
      this.CategoryService.add(info).subscribe(() => {
        this.getAll();
      })
      this.clear();
    }
    else {
      console.log("Потрібно змінити картинку")
    }
  }
  editCategoryBlock(info:ICategoryResponse) {
    this.addBlock = true;
    this.name = info.name;
    this.title = info.path;
    this.saveButtonCheck = !this.saveButtonCheck;
    this.itemId = info.id;
  }
  saveCategoryChanges() {
    let info = {
      name: this.name,
      path: this.title,
      imagePath: this.categoryForm
    }
    this.CategoryService.edit(info, this.itemId).subscribe(() => {
      this.getAll();
    })
    this.clear();
    this.saveButtonCheck = false;
  }
  deleteCategory(info: ICategoryResponse) {
    this.CategoryService.delete(info.id).subscribe(() => {
      this.getAll();
    })
    this.deleteImage(info.imagePath);
  }
  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.CategoryService.getAll().subscribe(data => {
      this.categoryStorage = data;
    })
  }
  upload(event: any) {
    this.random++;
    let file = event.target.files[0];
    this.uploadFile("images", `${file.name}${this.random}`, file)
      .then(data => {
        this.varify1 = `${file.name}${this.random}`
        this.categoryForm = data;
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
  deleteImage(path: string) {
    let task = ref(this.storage, path)
    deleteObject(task);
  }
}
