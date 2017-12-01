import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { User } from '../../models/user/user';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  req:any;
  constructor(private _user:UserService) { }

  ngOnInit() {
    this.checkLocalStorageForUser();
  }

  logout(){
    this.req = this._user.logout().subscribe();
    this._user.setUser(null);
  }

  ngOnDestroy(){
    this.req.unsubscribe();
  }

  checkLocalStorageForUser(){
    if(localStorage.getItem('GameWorldsUserName') && localStorage.getItem('GameWorldsUserApiToken')){
      var user:User = {
        'id':Number(localStorage.getItem('GameWorldsUserId')),
        'name':localStorage.getItem('GameWorldsUserName'),
        'email':localStorage.getItem('GameWorldsUserEmail'),
        'created_at':localStorage.getItem('GameWorldsUserCreatedAt'),
        'api_token':localStorage.getItem('GameWorldsUserApiToken')
      };
      this._user.setUser(user as User);
    }
  }

}
