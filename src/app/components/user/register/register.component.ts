import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/users/user.service';
import { User} from '../../../models/user/user';
import { Login } from '../../../models/user/login';
import { Register } from '../../../models/user/register';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  rForm:FormGroup;
  req:any;
  registering:boolean = false;
  constructor(private _user:UserService, private fb:FormBuilder, private router:Router) { 
    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(5)])],
      'email': [null, Validators.compose([Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(100)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(100)])],
      'password-confirm': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(100)])],
    });

  }

  ngOnInit() {
  }

  onSubmit(user){
    this.registering = true;
    let data:Register = {
      name:user['name'],
      email:user['email'],
      password:user['password'],
      password_confirmation: user['password-confirm']
    };
    this.req = this._user.register(data).subscribe(data => {
      let data2:Login = {email:user.email,password:user.password};
      this._user.login(data2).subscribe(data=> 
        {
          this._user.setUser(data as User);
          this._user.saveToLocalStorage();
          this.router.navigate(['/login']);
        });
    });
    
    
  }

  onDestroy(){
    if(this.req){
      this.req.unsubscribe();
    }
  }

}

