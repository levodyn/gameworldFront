import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//components
import { HomeComponent } from './components/home/home.component';
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
        component:HomeComponent
    },
    {
        path:"blog",
        component:BlogComponent
    },
    {
        path:"blog/:id",
        component:BlogDetailComponent
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"register",
        component:RegisterComponent
    },
    {
        path:"profile",
        component:HomeComponent
    },
    {
        path:"createblog",
        component:CreateBlogComponent
    },
    {
        path:"editblog/:id",
        component:EditBlogComponent
    },
    {
        path:"games/lingo",
        component:LingoComponent
    },
    {
        path:"games/chess",
        component:ChessComponent
    },
    {
        path:"games/sudoku",
        component:SudokuComponent
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