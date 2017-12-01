import { Injectable } from '@angular/core';
import { User } from '../../models/user/user';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const apiUrl = 'http://levodonia.ddns.net/back/public/api/';

@Injectable()
export class UserService{
  private error:boolean = false;
  private user:User;
  constructor(private http:HttpClient){}

  login(request){
    let url = apiUrl+'login';
    let body = request;
    return this.http.post(url, body).catch(this.handleError);
  }

  logout(){
    let url = apiUrl+'logout';
    this.removeLocalStorageUser();
    return this.http.post(url, [],
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this.user.api_token}`)}
    );
  }

  register(request){
    let url = apiUrl+'register';
    let body = request;
    return this.http.post(url, body).catch(this.handleError);
  }
    
  getUser(){
    return this.user;
  }

  setUser(user){
    this.user = user;
  }
  
  getError(){
    return this.error;
  }

  setError(){
    if(this.error){
      this.error = false;
    }else{
      this.error = true;
    }
  }

  saveToLocalStorage(){
    localStorage.setItem('GameWorldsUserName', this.user.name);
    localStorage.setItem('GameWorldsUserId', String(this.user.id));
    localStorage.setItem('GameWorldsUserEmail', this.user.email);
    localStorage.setItem('GameWorldsUserCreatedAt', this.user.created_at);
    localStorage.setItem('GameWorldsUserApiToken', this.user.api_token);
  }

  removeLocalStorageUser(){
    localStorage.removeItem('GameWorldsUser');
    localStorage.removeItem('GameWorldsUserName');
    localStorage.removeItem('GameWorldsUserId');
    localStorage.removeItem('GameWorldsUserEmail');
    localStorage.removeItem('GameWorldsUserCreatedAt');
    localStorage.removeItem('GameWorldsUserApiToken');
  }

  private handleError(error:any, caught:any): any{
    return console.log(error,caught);
  }
}
