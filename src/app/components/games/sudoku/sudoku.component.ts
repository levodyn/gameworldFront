import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
})
export class SudokuComponent implements OnInit {
  sudoku:number[][] = [];
  solvedSudoku:number[][] = [];
  guessSudoku:number[][] = [];
  hidden:boolean[][] = [];
  rows: number[] = [0,1,2,3,4,5,6,7,8];
  nrCells:number;
  validSquares:number[];
  options:number[] = [0,1,2,3,4,5,6,7,8,9];
  text:string;
  constructor() { }

  ngOnInit() {
    this.newGame();
  }

  newGame(){
    this.validSquares = Array.from(Array(81).keys());  
    this.nrCells = 0;  
    this.text = "Click for answering a cell, double click to make the answer box dissapear again."
    //intitialize sudoku variables
    for(var i = 0; i < 9; i++){
      this.sudoku[i] = []; 
      this.solvedSudoku[i] = []; 
      this.guessSudoku[i] = []; 
      this.hidden[i] = [];
      for(var j = 0; j < 9; j++){ 
        this.sudoku[i][j] = -1; 
        this.solvedSudoku[i][j] = -1;
        this.guessSudoku[i][j] = -1;
        this.hidden[i][j] = false;
      }
    } //set all sudoku squares to -1 (off)

    //generate puzzle
    while((!this.puzzleValid() && this.validSquares.length > 0) && this.nrCells < 81){
        let pickedSquare = Math.floor(Math.random() * this.validSquares.length);
        let randomSquare = this.validSquares[pickedSquare];
        let x= (randomSquare-randomSquare%9)/9; let y = randomSquare%9;
        let validNrs:number[] = this.calcValidNr(this.solvedSudoku,x,y);
        this.sudoku[x][y] = validNrs[Math.floor(Math.random() * validNrs.length)];
        this.solvedSudoku[x][y] = this.sudoku[x][y];
        this.guessSudoku[x][y] = this.sudoku[x][y];
        this.validSquares.splice(pickedSquare,1);
        let solvable = this.solve();
        !solvable ? this.newGame() : false;
        //console.log(pickedSquare);
        //console.log(this.validSquares); 
        this.nrCells++;
        //console.log(this.nrCells);   
    }
    //if(!this.puzzleValid){this.newGame()}
    
    //this.sudoku[i][j] = this.validSquares[i*9+j];
        //this.sudoku[i][j] = Math.floor(Math.random() * 9) + 1  ;
  }

  colorize(x,y){
    if(((y < 3 || y > 5) && x > 2 && x < 6) ||
       (y >2 && y < 6 && (x < 3 || x > 5) )
    ) {
      return 'grey';
    }else if(y >2 && y < 6 && x > 2 && x < 6){
      return 'brown';
    } 
  }

  puzzleValid(){
    for(var i = 0; i < 9; i++){
      for(var j = 0; j < 9; j++){ 
        if(this.solvedSudoku[i][j] < 1) return false;
      }
    }
    return true;
  }

  calcValidNr(sudoku,x,y){
    //console.log(x + ' ' + y )
    let validNrs:number[] = [];
    let notvalidNrs: number[] = [];

    //horizontal vertical
    for(var i = 0; i < 9; i++){
      if(sudoku[i][y] > 0 ){
        notvalidNrs.push(sudoku[i][y]);
      }
      if(sudoku[x][i] > 0){
        notvalidNrs.push(sudoku[x][i]);
      }
    }
    //3*3 square check
    let xGreat = x < 3 ? 0 : x < 6 ? 3 : 6;
    let yGreat = y < 3 ? 0 : y < 6 ? 3 : 6;
    for(let i = xGreat; i < xGreat + 3; i++){
      for(let j = yGreat; j < yGreat + 3; j++){
        if(sudoku[i][j] > 0 ){
          notvalidNrs.push(sudoku[i][j]);
        }
      }
    }
    notvalidNrs = this.unique(notvalidNrs);
    
    //which numbers are valid
    //console.log(notvalidNrs);
    for(var i = 1; i < 10; i++){
      let bool:boolean = true;
      for(var j = 0; j < notvalidNrs.length; j++){
        //console.log('hai');
        if(i - notvalidNrs[j] == 0){
          bool = false;
          break;
        }
      }
      if(bool) validNrs.push(i)
    }
    //console.log(validNrs);
    if(validNrs.length < 1) return [-2];
    return validNrs;
  }

  solve(){
    let change = 1;
    while(change == 1){
      change = 0;
      for(let i = 0; i < 9;i++){
        for(let j = 0; j < 9;j++){
          if(this.solvedSudoku[i][j] < 1 ){
            let validNrs = this.calcValidNr(this.solvedSudoku,i,j);
            if(validNrs.length == 1 && validNrs[0] > 0){
              //console.log(validNrs);
              this.solvedSudoku[i][j] = validNrs[0];
              change = 1;
            }else if(validNrs.length == 1 && validNrs[0] < 0){
              return false;
            }
          }
        }
      }
      //console.log('hai');
    }
    return true;
  } 

  correct(){
    console.log(this.solvedSudoku);
    for(let i = 0; i < 9;i++){
      for(let j = 0; j < 9;j++){
        if(this.solvedSudoku[i][j] != this.guessSudoku[i][j]){
          this.text = "Wrong Answer!!!"
          setTimeout(() =>  this.text = "Click for answering a cell, double click to make the answer box dissapear again.", 3000);
          return false;
        }     
      }
    }
    this.text = "Correct Answer!!!"

  }

  show(x,y){
    this.hidden[x][y] = true;
  }

  hide(x,y){
    this.hidden[x][y] = false
  }

  unique(input){
    let arr:number[] = [];
    for(var i = 0; i < input.length; i++) {
        if(!arr.includes(input[i])) {
            arr.push(input[i]);
        }
    }
    return arr; 
  }

}
