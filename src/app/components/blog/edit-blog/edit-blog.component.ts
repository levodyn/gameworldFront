import { Component, OnInit } from '@angular/core';
import { Blog } from '../../../models/blog';
import { UserService } from '../../../services/users/user.service';
import { BlogService } from '../../../services/blog/blog.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute }    from '@angular/router';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  title:string;
  message:string;
  req:any;
  img:File;
  private routeSub:any;
  blog:Blog;
  blogId:number;
  rForm:FormGroup;
  post:any;

  constructor(private route:ActivatedRoute, private _user:UserService, private _blog:BlogService, private router:Router, private fb:FormBuilder) { 
    this.rForm = fb.group({
      'title': [null, Validators.required],
      'message': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(500)])]
    });
  }

  ngOnInit() { 
    this.checkLogin();

    this.routeSub = this.route.params.subscribe(params=> {
      this.blogId = params.id;
       this.req = this._blog.get(this.blogId).subscribe(data=>{
        this.blog= data as Blog;
        this.checkUser();
        this.rForm.patchValue({'title':this.blog.title,'message':this.blog.body});
      });
    });

  }

  checkLogin(){
    if(! this._user.getUser()){
      this.router.navigate(['/login']);
    }
  }

  checkUser(){
    if(this._user.getUser().id != this.blog.user_id){
      this.blog = null;
      this.router.navigate(['/']);
    }
  }

  storeImage(event){
    console.log(event);
    //var files = event.srcElement.files;
    var files = event.target.files;
    console.log(files);
    this.img = files[0];
  }

  onSubmit(post){
    this.checkLogin();
    this.checkUser();
    var fileName = this.blog.image;
    if(this.img){
      fileName = this.randomString(10) + '_' + Date.now() + '.jpg';
    }
    let blog:Blog = {title:post.title,body:post.message,image:fileName,user_id:this._user.getUser().id};
    this.req = this._blog.updatePost(blog,this.blogId).subscribe();
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
