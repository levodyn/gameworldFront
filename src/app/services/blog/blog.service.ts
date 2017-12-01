import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, ResponseContentType, Response } from '@angular/http';
import { Blog } from '../../models/blog';
import { UserService } from '../../services/users/user.service';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map'

const apiUrl = 'http://levodonia.ddns.net/back/public/api/';

@Injectable()

export class BlogService {

  private blogs:Blog[];
  private imageUrl:String = "http://levodonia.ddns.net/back/public/storage/uploads/articles/";
  
  constructor(private http: HttpClient, private _user:UserService) { }

  getAll(){
    let url = apiUrl+'articles';
    return this.http.get(url);
  }

  get(id){
    let url = apiUrl+'articles/'+id;
    return this.http.get(url);
  }

  delete(id){
    let url = apiUrl+'articles/'+id;
    return this.http.delete(url,  
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this._user.getUser().api_token}`)}
    );
  }

  createPost(blog:Blog){
    let url = apiUrl+'articles';
    return this.http.post(url, blog,
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this._user.getUser().api_token}`)}
    );
  }

  updatePost(blog:Blog, id:number){
    let url = apiUrl+'articles/' + id;
    return this.http.patch(url, blog,
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this._user.getUser().api_token}`)}
    );
  }

  storeImage(image:File, fileName){
    let url = apiUrl + 'articles/image';
    let formData:FormData = new FormData();
    formData.append('image', image, image.name);
    formData.append('fileName', fileName);
    return this.http.post(url, formData, 
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this._user.getUser().api_token}`)}
    );
  }

  getBlog(){
    return this.blogs;
  }

  setBlog(blogs){
    this.blogs = blogs;
  }

  getImageUrl(){
    return this.imageUrl;
  }

 

}
