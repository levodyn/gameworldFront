import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../models/blog';
import { UserService } from '../../../services/users/user.service';
import { BlogService } from '../../../services/blog/blog.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {
  title:string;
  message:string;
  req:any;
  img:File;

  rForm:FormGroup;
  post:any;


  constructor(private _user:UserService, private _blog:BlogService, private router:Router, private fb:FormBuilder) { 
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'message': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])]
    });
  }
  
  ngOnInit() { 
    this.checkLogin();
  }

  checkLogin(){
    if(! this._user.getUser()){
      //this.router.navigate(['/login']);
    }
  }

  storeImage(event){
    var files = event.srcElement.files;
    this.img = files[0];
  }

  onSubmit(post){
    this.checkLogin();
    var fileName = 'noimage.jpg';
    if(this.img){
      fileName = this.randomString(10) + '_' + Date.now() + '.jpg';
    }
    let blog:Blog = {title:post.title,body:post.message,image:fileName,user_id:this._user.getUser().id};
    this.req = this._blog.createPost(blog).subscribe();
    if(this.img){
      this._blog.storeImage(this.img, fileName).subscribe();
    }
    setTimeout((router: Router) => {
      this.router.navigate(['/blog']);
    }, 500);
    return false;
  }
  onDestroy(){
    this.req.unsubsribe();
  }

  randomString(size) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < size; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
}
