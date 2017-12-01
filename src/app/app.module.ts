import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog/blog.component';
import { BlogDetailComponent } from './components/blog/blog-detail/blog-detail.component';
import { LoginComponent } from './components/user/login/login.component';

import { UserService } from './services/users/user.service';
import { BlogService } from './services/blog/blog.service';
import { CreateBlogComponent } from './components/blog/create-blog/create-blog.component';
import { PaginationComponent } from './components/blog/pagination/pagination.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { RegisterComponent } from './components/user/register/register.component';
import { LingoComponent } from './components/games/lingo/lingo/lingo.component';
import { ChessComponent } from './components/games/chess/chess.component';
import { PromotionComponent } from './components/games/chess/promotion/promotion.component';
import { SudokuComponent } from './components/games/sudoku/sudoku.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    BlogComponent,
    BlogDetailComponent,
    LoginComponent,
    CreateBlogComponent,
    PaginationComponent,
    EditBlogComponent,
    RegisterComponent,
    LingoComponent,
    ChessComponent,
    PromotionComponent,
    SudokuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService, BlogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
