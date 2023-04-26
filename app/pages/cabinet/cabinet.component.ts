import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account/account.service';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {

  constructor(
    private router:Router,
    private accountService:AccountService
  ) { }
  logout(){
    localStorage.removeItem("currentUser");
    this.router.navigate(['']);
    this.accountService.checkUser$.next(true);
  }
  ngOnInit(): void {
  }

}
