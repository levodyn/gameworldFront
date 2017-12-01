import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user/user';
import { Login } from '../../../models/user/login';
import { Register } from '../../../models/user/register';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private _user:UserService) {}

  ngOnInit() {
  }

  login(email,password){
    let data:Login = {email,password};
    if(this.validate(data)){
      return false;
    }
    this._user.login(data).subscribe(data=> 
      {
        this._user.setUser(data as User);
        this._user.saveToLocalStorage();
      },
      err => {
        this._user.setError();
        console.log("Error occured.")
      });
    return false;
  }

  validate(data){
    if(!data.email || !data.password){
      return true;
    }
    return false;
  }


}