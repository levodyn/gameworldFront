import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { BlogService } from '../../../services/blog/blog.service';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../models/user/user';
import { Router } from '@angular/router';

@Component({
  selector: 'blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {
  blog:any;
  req: any;
  req2: any;
  id:number;
  private routeSub:any;

  constructor(private route:ActivatedRoute, private _blog:BlogService, private _user:UserService, private router:Router) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params=> {
      this.id = params.id;
       this.req = this._blog.get(this.id).subscribe(data=>{
        this.blog= data;
      });
    });
  }

  ngOnDestroy(){
    this.req.unsubscribe();
    if(this.req2){
      this.req2.unsubscribe();
    }
  }

  delete(){
    this.req2 = this._blog.delete(this.blog.id).subscribe();
    setTimeout((router: Router) => {
      this.router.navigate(['/blog']);
    }, 500);
  }

}
