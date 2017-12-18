import { NgModule }             from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';

//components
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { CvComponent } from './components/about/cv/cv.component';
//blog
import { BlogComponent } from './components/blog/blog/blog.component';
import { BlogDetailComponent } from './components/blog/blog-detail/blog-detail.component';
import { CreateBlogComponent } from './components/blog/create-blog/create-blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
//user
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
//games
import { LingoComponent } from './components/games/lingo/lingo/lingo.component';
import { ChessComponent } from './components/games/chess/chess.component';
import { SudokuComponent } from './components/games/sudoku/sudoku.component';

const appRoutes:Routes = [
    {
        path:"",
        component:HomeComponent, 
        pathMatch: 'full'
    },
    {
        path:"about",
        component:AboutComponent, 
        pathMatch: 'full'
    },
    {
        path:"cv",
        component:CvComponent, 
        pathMatch: 'full'
    },
    {
        path:"blog",
        component:BlogComponent, 
        pathMatch: 'full'
    },
    {
        path:"blog/:id",
        component:BlogDetailComponent,
        pathMatch: 'full'
    },
    {
        path:"login",
        component:LoginComponent, 
        pathMatch: 'full'
    },
    {
        path:"register",
        component:RegisterComponent, 
        pathMatch: 'full'
    },
    {
        path:"profile",
        component:HomeComponent, 
        pathMatch: 'full'
    },
    {
        path:"createblog",
        component:CreateBlogComponent, 
        pathMatch: 'full'
    },
    {
        path:"editblog/:id",
        component:EditBlogComponent
    },
    {
        path:"games/lingo",
        component:LingoComponent, 
        pathMatch: 'full'
    },
    {
        path:"games/chess",
        component:ChessComponent, 
        pathMatch: 'full'
    },
    {
        path:"games/sudoku",
        component:SudokuComponent, 
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes
        )
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule{}