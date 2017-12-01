import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService } from '../../../services/blog/blog.service';
import { UserService } from '../../../services/users/user.service';
import { Blog } from '../../../models/blog';
import { PaginationComponent } from '../pagination/pagination.component';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogs:Blog[];
  req: any;

  //pagination
  page:number = 1;
  blogStart:number = 0;
  postPerPage:number = 3;
  total:number = 0;
  lastBlog:number;
  lastPage:number;
  loading:boolean = false;
  extraPage:number = 4;
  pages:number[]= new Array();

  constructor(private _blog:BlogService, private _user:UserService) { }

  ngOnInit() {
    this.req =  this._blog.getAll().subscribe(data => {
      console.log(data);
      this.total = data['length'];
      this.lastBlog = (this.total-1) - (this.total-1)%this.postPerPage;
      this._blog.setBlog(data);
      this.getBlogs();
      this.loading = true;
    });
  }

  ngOnDestroy(){
    this.req.unsubscribe();
  }
  
  //pagination methods
  getBlogs(): void {
    this.blogs = [];
    var limit = this.blogStart + this.postPerPage <= this.total ? this.blogStart+this.postPerPage : this.total; 
    var start = this.page-this.extraPage < 1 ? 1 : this.page-this.extraPage;
    this.lastPage = Math.ceil(this.total/this.postPerPage);
    var end = this.page+this.extraPage > this.lastPage ? this.lastPage : this.page+this.extraPage;
    this.pages = [];
    console.log(this.lastBlog);
    for(let i = start; i <= end;i++){this.pages.push(i);}
    for(var i = this.blogStart;i<limit;i++){
      this.blogs.push(this._blog.getBlog()[i]);
    }
  }

  goToPage(n: number, page:number): void {
    this.blogStart = n;
    this.page = page;
    this.getBlogs();
  }

  onNext(): void {
    this.blogStart+=this.postPerPage;
    this.page++;
    this.getBlogs();
  }

  onPrev(): void {
    this.blogStart-=this.postPerPage;
    this.page--;
    this.getBlogs();
  }

}
