import { Component, OnInit } from '@angular/core';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, Storage } from '@angular/fire/storage';
import { DiscountResponse } from 'src/app/shared/interfaces/discount';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss']
})
export class AdminDiscountComponent implements OnInit {
  public discountCheck = true;
  public addBlock = false;
  public name!: string;
  public description!: string;
  public title!: string;
  public discountStorage!: DiscountResponse[];
  public saveButtonCheck = false;
  public itemId!: number;
  public random = 0;
  public discountForm: any;
  public varify1: any;
  public varify2="q";
  constructor(
    private storage: Storage,
    private Discountservice: DiscountService,
  ) { }
  falseCheck() {
    this.discountCheck = false;
    this.addBlock = false;
    this.saveButtonCheck = false;
  }
  clear() {
    this.name = "";
    this.description = "";
    this.title = ""
  }
  discount() {
    this.falseCheck();
    this.clear();
    this.discountCheck = true;
  }
  AddBlock() {
    this.addBlock = !this.addBlock;
    this.clear();
    this.saveButtonCheck=false;
  }
  addDiscount() {
    if (this.varify1 != this.varify2) {
      this.varify2 = this.varify1;
      let info = {
        name: this.name,
        title: this.title,
        description: this.description,
        path: this.discountForm
      }
      this.Discountservice.add(info).subscribe(() => {
        this.getAll();
      })
      this.clear();
    }
    else {
      console.log("Потрібно змінити картинку")
    }
  }
  editDiscountBlock(info: DiscountResponse) {
    this.addBlock = true;
    this.name = info.name;
    this.title = info.title;
    this.description = info.description;
    this.saveButtonCheck = !this.saveButtonCheck;
    this.itemId = info.id;
  }
  saveDiscountChanges() {
    let info = {
      name: this.name,
      title: this.title,
      description: this.description,
      path: this.discountForm
    }
    this.Discountservice.edit(info, this.itemId).subscribe(() => {
      this.getAll();
    })
    this.clear();
    this.saveButtonCheck = false;
  }
  deleteDiscount(info: DiscountResponse) {
    this.Discountservice.delete(info.id).subscribe(() => {
      this.getAll();
    })
    this.deleteImage(info.path);
  }
  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this.Discountservice.getAll().subscribe(data => {
      this.discountStorage = data;
    })
  }
  upload(event: any) {
    this.random++;
    let file = event.target.files[0];
    this.uploadFile("images", `${file.name}${this.random}`, file)
      .then(data => {
        this.varify1 = `${file.name}${this.random}`
        this.discountForm = data;
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
    return this.discountForm.get(control)?.value;
  }
  deleteImage(path: string) {
    let task = ref(this.storage, path)
    deleteObject(task);
  }

}
