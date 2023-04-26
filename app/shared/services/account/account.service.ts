import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { observable, Observable, Subject } from 'rxjs';
import { AccountRequest, AccountResponse } from '../../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public checkUser$=new Subject<boolean>()
  constructor(
    private http:HttpClient
  ) { }
  public url=environment.BACKEND_URL;
  public api={account:`${this.url}/account`};
  getAll():Observable<AccountResponse[]>{
    return this.http.get<AccountResponse[]>(this.api.account);
  }
  create(info:AccountRequest):Observable<AccountResponse>{
    return this.http.post<AccountResponse>(this.api.account,info);
  }
}
