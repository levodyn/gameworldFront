import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user/user';
import { UserService } from '../../services/users/user.service';
import { fade } from './../../animation';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    fade
  ],
})
export class HomeComponent implements OnInit {

  constructor(private _user:UserService) { }

  ngOnInit() {
  }

}
