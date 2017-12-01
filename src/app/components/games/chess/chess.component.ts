import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChessPiece, pieceType } from '../../../models/games/chessPiece';
import { ChessService } from '../../../services/games/chess/chess.service';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css'],
  providers: [ChessService]
})
export class ChessComponent implements OnInit {
  rows:number[] = [0,1,2,3,4,5,6,7];
  rowsInv:number[] = [7,6,5,4,3,2,1,0];
  letters:String[] = ['A','B','C','D','E','F','G','H'];
  background:String[][] = [];
  pieces:any[][] = [];
  turn:String;
  turnNr:number;
  fullMoveNr:number;
  halfMoveNr:number;
  enpassant:any = {x:-1,y:-1,turnNr:-1}
  selected:selected = {x:-1,y:-1, active: false};
  promotion:any = {value:false,x:-1,y:-1};
  gameOver:boolean = false;
  gameOverMess:String;
  req:any;
  computerTurn:boolean = false;
  constructor(private _chess:ChessService) { }

  ngOnInit() {
    this.newGame();
  }

  newGame(){
    this.turn = 'white';
    var back = 'white;'
    this.turnNr = 1;
    this.fullMoveNr = 1; 
    this.halfMoveNr = 0;
    this.promotion = {value:false,x:-1,y:-1};
    this.gameOver = false;
    this.computerTurn = false;
    //get all the chess pieces on the board
    for(var i = 0; i < 8; i++)
    {
      this.pieces[i] = []
      this.background[i] = [];
      for(var j = 0; j < 8; j++)
      {
        //backgroundcolor
        if(j != 0 || i == 0)
        {
          back === 'white' ? back = 'grey' : back = 'white';
        }
        this.background[i][j] = back;
        //chesspieces
        if(i == 1 || i == 6)
        {
          i == 6 ? this.pieces[i][j] = {type:pieceType.pawn,color:"white",moved:false} : this.pieces[i][j] = {type:pieceType.pawn,color:"black",moved:false} 
        }else if (i == 0 || i == 7)
        {
          if(j == 0 || j == 7)
          {
            i == 7 ? this.pieces[i][j] = {type:pieceType.castle,color:"white",moved:false} : this.pieces[i][j] = {type:pieceType.castle,color:"black",moved:false}
          }else if(j == 1 || j == 6)
          {
            i == 7 ? this.pieces[i][j] = {type:pieceType.knight,color:"white",moved:false} : this.pieces[i][j] = {type:pieceType.knight,color:"black",moved:false}
          }else if(j == 2 || j == 5)
          {
            i == 7 ? this.pieces[i][j] = {type:pieceType.bishop,color:"white",moved:false} : this.pieces[i][j] = {type:pieceType.bishop,color:"black",moved:false}            
          }else if(j == 3)
          {
            i == 7 ? this.pieces[i][j] = {type:pieceType.queen,color:"white",moved:false} : this.pieces[i][j] = {type:pieceType.queen,color:"black",moved:false}            
          }else
          {
            i == 7 ? this.pieces[i][j] = {type:pieceType.king,color:"white",moved:false} : this.pieces[i][j] = {type:pieceType.king,color:"black",moved:false}            
          }
        }else{
          this.pieces[i][j] = 'x';
        }
      }
    }
  }

  select(x,y){
    if(!this.gameOver){
      if((this.selected.active && this.selected.x == x && this.selected.y == y) && !this.computerTurn){
        this.selected.active = false;
        this.selected.x = -1;
        this.selected.y = -1;
      }else if(this.turn == this.pieces[x][y].color && !this.computerTurn){
        this.selected.active = true;
        this.selected.x = x;
        this.selected.y = y;
      }else if(this.selected.active && this.validMove(x,y) && (this.selected.x != x || this.selected.y != y))
      {      
        //remove enpassented piece
        if(this.pieces[this.selected.x][this.selected.y].type == pieceType.pawn && x == this.enpassant.x && y == this.enpassant.y){ //remove piece that is getting en passanted
          this.turn=='white' ? this.pieces[x+1][y] = 'x' : this.pieces[x-1][y] = 'x';
        }
          //set potential enpassant
        if(this.selected.x == x -2 && this.pieces[this.selected.x][this.selected.y].type == pieceType.pawn)
          {this.enpassant.x = x-1; this.enpassant.y = y; this.enpassant.turnNr=this.turnNr;}
        else if(this.selected.x == x + 2 && this.pieces[this.selected.x][this.selected.y].type == pieceType.pawn)
          {this.enpassant.x = x+1; this.enpassant.y = y; this.enpassant.turnNr=this.turnNr;}
        //reset enpassent
        this.turnNr == this.enpassant.turnNr  + 1  ? this.enpassant = {x:-1,y:-1,turnNr:-1} : null;
        //castling
        if(this.pieces[this.selected.x][this.selected.y].type == pieceType.king && !this.pieces[this.selected.x][this.selected.y].moved){
          if(y==2){
            this.pieces[x][3] = this.pieces[x][0];
            this.pieces[x][3].moved = true;
            this.pieces[x][0] = 'x';
          }else if(y == 6){
            this.pieces[x][5] = this.pieces[x][7];
            this.pieces[x][5].moved = true;
            this.pieces[x][7] = 'x';
          }
        }

        //calc halfmovenr
        if(this.pieces[x][y] != 'x' || this.pieces[this.selected.x][this.selected.y].type==pieceType.pawn){
          this.halfMoveNr = 0;
        }else{
          this.halfMoveNr++;
        }
        //move piece
        this.pieces[x][y] = this.pieces[this.selected.x][this.selected.y];
        this.pieces[x][y].moved = true;
        this.pieces[this.selected.x][this.selected.y] = 'x';
        //deactivate
        this.selected.active = false;
        this.selected.x = -1;
        this.selected.y = -1;
        
        this.turnNr++;

        if((x == 0 || x == 7) && this.pieces[x][y].type == pieceType.pawn){
          this.promotion.value=true;
          this.promotion.x = x;
          this.promotion.y = y;
        }
        !this.promotion.value ? this.nextTurn() : null;
      }
    }  
  }

  nextTurn(){
    this.turn == 'black' ? this.fullMoveNr+=1 : null;
    this.turn == 'black' ? this.turn = 'white' : this.turn = 'black';
    //check for checkmate or tie
    //find king
    var king = {x:-1,y:-1};
    for(let i = 0;i<8;i++)
    {
      for(let j = 0;j<8;j++)
      {
        if(this.pieces[i][j] != 'x' && this.pieces[i][j].type == pieceType.king && this.pieces[i][j].color == this.turn){
          king.x = i; king.y = j;
        } 
      }
    } 
    var validMoves = this.anyValidMoves(this.turn,this.pieces);
    if(!validMoves && this.inCheck(king.x,king.y,this.turn,this.pieces))
    {
      this.turn == 'white' ? this.gameOverMess = "Black wins" : this.gameOverMess = 'White wins'; 
      this.gameOver = true;
    }else if(!validMoves || this.halfMoveNr >= 50){
      this.gameOverMess = "Tie";
      this.gameOver = true;
    }
    //computer moves
    if(this.turn == 'black'){//computer is black
      this.computerMove();
    }
  }

  computerMove(){
    this.computerTurn = true;
    this.req = this._chess.stockfish(this.fenNot()).subscribe(
      data => {
      let move = String(data['move']);
      console.log(move[0]+move[1]+move[2]+move[3]);
      this.selected.x = this.rowsInv[Number(move[1])-1];
      let x = this.rowsInv[Number(move[3])-1];
      
      let y;
      for(let i = 0; i < 8; i++){  
        move[0].toUpperCase() == this.letters[i] ? this.selected.y = i : null;
        move[2].toUpperCase() == this.letters[i] ? y = i : null;
      }
      console.log('selected x: ' + this.selected.x + ' x: ' + x + 'selected y: ' + this.selected.y + ' y: ' + y);
      this.selected.active = true;
      this.computerTurn = false;
      this.select(x,y);
    },
    err =>{
      console.log('Error occured: '+ this.fenNot());
      this.computerMove();
    });
  }

  validMove(x,y){
    let rules = false;
    if(this.pieces[this.selected.x][this.selected.y].type == pieceType.pawn)
    {
      rules = this.pawnMove(x,y);
    }else if(this.pieces[this.selected.x][this.selected.y].type == pieceType.castle)
    {
      rules = this.castleMove(x,y);
    }else if(this.pieces[this.selected.x][this.selected.y].type == pieceType.knight)
    {
      rules = this.knightMove(x,y);
    }else if(this.pieces[this.selected.x][this.selected.y].type == pieceType.bishop)
    {
      rules = this.bishopMove(x,y);
    }else if(this.pieces[this.selected.x][this.selected.y].type == pieceType.queen)
    {
      rules = this.queenMove(x,y);
    }else if(this.pieces[this.selected.x][this.selected.y].type == pieceType.king)
    {
      rules = this.kingMove(x,y);
    }
    if(rules)
    {
      let piecesTemp = [];
      let king = {x:-1,y:-1};
      //copy this.pieces and do the move
      for(let i = 0;i<8;i++){
        piecesTemp[i] = [];
        for(let j=0;j<8;j++){
          piecesTemp[i][j] = this.pieces[i][j]; 
        }
      } 
      if(this.pieces[this.selected.x][this.selected.y].type == pieceType.pawn && x == this.enpassant.x && y == this.enpassant.y){ //remove piece that is getting en passanted
        this.turn=='white' ? piecesTemp[x+1][y] = 'x' : piecesTemp[x-1][y] = 'x';
      }
      piecesTemp[x][y] = this.pieces[this.selected.x][this.selected.y];
      piecesTemp[this.selected.x][this.selected.y] = 'x';

      //find the king
      for(let i = 0;i<8;i++)
      {
        for(let j = 0;j<8;j++)
        {
          if(piecesTemp[i][j] != 'x' && piecesTemp[i][j].type == pieceType.king && piecesTemp[i][j].color == this.turn){
            king.x = i; king.y = j;
          } 
        }
      } 
      //see if the king is in check
      if(!this.inCheck(king.x,king.y,this.turn,piecesTemp))
      {
        return true;
      }
    }
    return false;
  }

  pawnMove(x,y){
    //1/2 tile forward
    //console.log('move selected x: ' + this.selected.x + ' selected y: ' + this.selected.y + ' x: ' + x + ' y: ' + y);
    if(
      (this.turn == 'white' && y == this.selected.y && (x == this.selected.x - 1 || (x == this.selected.x -2 && this.selected.x == 6 && this.pieces[this.selected.x-2][y] == 'x')) && this.pieces[this.selected.x-1][y] == 'x') 
    ||(this.turn == 'black' && y == this.selected.y && (x == this.selected.x + 1 || (x == this.selected.x +2 && this.selected.x == 1 && this.pieces[this.selected.x+2][y] == 'x')) && this.pieces[this.selected.x+1][y] == 'x')
    )
    {
     return true;
    //taking other pieces
    }else if(
             (this.turn == 'white' && ((this.pieces[x][y] != 'x' && this.pieces[x][y].color!=this.turn) || (x == this.enpassant.x && y == this.enpassant.y)) && (x == this.selected.x - 1) && (y == this.selected.y + 1 || y == this.selected.y - 1))
          || (this.turn == 'black' && ((this.pieces[x][y] != 'x' && this.pieces[x][y].color!=this.turn) || (x == this.enpassant.x && y == this.enpassant.y)) && (x == this.selected.x + 1) && (y == this.selected.y + 1 || y == this.selected.y - 1))) 
    {
      //console.log('enpassente x: ' + x + ' y: ' + y);
      return true;
    }else
    {
      return false;
    }
  }

  promote(type){
    this.promotion.value = false;
    this.pieces[this.promotion.x][this.promotion.y].type = type;
    this.nextTurn();
  }

  castleMove(x,y){
    if(x == this.selected.x || y == this.selected.y){
      if(x != this.selected.x){
        var direction;
        var flip = true;
        this.selected.x - x > 0 ? direction = -1 : direction = 1;
        var i = this.selected.x + direction; 
        while(i+direction*-1 != x){
          if(this.pieces[i][y] == 'x' && flip){
            i = i + direction;
          }else if(this.pieces[i][y].color != this.turn && flip){
            flip = false;
            i = i + direction;
          }else{
            return false;
          }
        }
        return true;
      }else if(y != this.selected.y){
        var direction;
        var flip = true;
        this.selected.y - y > 0 ? direction = -1 : direction = 1;
        var i = this.selected.y + direction; 
        while(i+direction*-1 != y){
          if(this.pieces[x][i] == 'x' && flip){
            i = i + direction;
          }else if(this.pieces[x][i].color != this.turn && flip){
            flip = false;
            i = i + direction;
          }else{
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  knightMove(x,y){
    var xdiff = Math.abs(x - this.selected.x); 
    var ydiff = Math.abs(y - this.selected.y);
    if(((xdiff == 2 && ydiff == 1) || (xdiff == 1 && ydiff == 2)) && this.pieces[x][y].color != this.turn)
    {
      return true;
    }else
    {
      return false;
    }
  }

  bishopMove(x,y){
    if((y - x == this.selected.y - this.selected.x) || (y + x == this.selected.y + this.selected.x)){
      var flip = true;
      var xdirect;
      var ydirect; 
      x-this.selected.x > 0 ? xdirect = -1 : xdirect = 1;
      y-this.selected.y > 0 ? ydirect = -1 : ydirect = 1;
      for(var i = 0; i < Math.abs(x-this.selected.x); i++){
        var piece = this.pieces[x+(i*xdirect)][y+(i*ydirect)]; 
        console.log('x:' + x + ' y: ' + y + ' x+i: ' +  (x+(i*xdirect)) + ' y+i: ' +  (y+(i*ydirect)));
        if(piece != "x"){
          console.log(piece);
          if(i > 0 || this.pieces[x][y].color == this.turn){
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  queenMove(x,y){
    if(this.castleMove(x,y) || this.bishopMove(x,y)){
      return true;
    }
  }

  kingMove(x,y){
    if(Math.abs(x-this.selected.x) <= 1 && Math.abs(y-this.selected.y) <= 1 && this.pieces[x][y].color != this.turn){
      return true;
    }else if(!this.pieces[this.selected.x][this.selected.y].moved && this.castling(x,y)){
      return true;
    }
    return false;
  }

  castling(x,y){
    if(this.turn == 'white')
    {
      if(this.inCheck(7,4,this.turn,this.pieces)){ return false; }
      if(x == 7 && y == 2 && !this.pieces[7][0].moved)
      {
        for(var i = 1; i < 4;i++)
        {
          if(this.pieces[7][i] != 'x')
          {
            return false;
          }
          if(i > 1 && this.inCheck(7,i,this.turn,this.pieces)){
            return false;
          }
        }
        return true;
      }else if(x==7 && y == 6 && !this.pieces[7][7].moved)
      {
        for(var i = 6; i > 4;i--)
        {
          if(this.pieces[7][i] != 'x')
          {
            return false;
          }
          if(this.inCheck(7,i,this.turn,this.pieces))
          {
            return false;
          }
        }
        return true;
      }
    }else if(this.turn == 'black')
    {
      if(this.inCheck(0,4,this.turn,this.pieces)){ return false; }
      if(x == 0 && y == 2 && !this.pieces[0][0].moved)
      {
        for(var i = 1; i < 4;i++)
        {
          if(this.pieces[0][i] != 'x')
          {
            return false;
          }
          if(i > 1 && this.inCheck(0,i,this.turn,this.pieces))
          {
            return false;
          }
        }
        return true;
      }else if(x==0 && y == 6 && !this.pieces[0][7].moved)
      {
        for(var i = 6; i > 4;i--)
        {
          if(this.pieces[0][i] != 'x')
          {
            return false;
          }
          if(this.inCheck(0,i,this.turn,this.pieces))
          {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  inCheck(x,y,color,pieces){
    
    //check vertical
    for(let i = x+1; i<8;i++){
      if(pieces[i][y] != 'x') {
        if(pieces[i][y].color != this.turn && (pieces[i][y].type == pieceType.castle || pieces[i][y].type == pieceType.queen || (pieces[i][y].type == pieceType.king && i-x==1) )){
          return true;
        }else{
          break;
        }
      }
    }
    for(let i = x-1; i>-1;i--){
      if(pieces[i][y] != 'x') {
        if(pieces[i][y].color != this.turn && (pieces[i][y].type == pieceType.castle || pieces[i][y].type == pieceType.queen || (pieces[i][y].type == pieceType.king && x-i==1) )){
          return true;
        }else{
          break;
        }
      }
    }
    //check for horizontal
    for(let i = y+1; i<8;i++){
      if(pieces[x][i] != 'x') {
        if(pieces[x][i].color != this.turn && (pieces[x][i].type == pieceType.castle || pieces[x][i].type == pieceType.queen || (pieces[x][i].type == pieceType.king && i-y==1) )){
          return true;
        }else{
          break;
        }
      }
    }
    for(let i = y-1; i>-1;i--){
      if(pieces[x][i] != 'x') {
        if(pieces[x][i].color != this.turn && (pieces[x][i].type == pieceType.castle || pieces[x][i].type == pieceType.queen || (pieces[x][i].type == pieceType.king && y-i==1) )){
          return true;
        }else{
          break;
        }
      }
    }
    //check for knight
    let knightPos = [-2,-1,1,2];    
    for(let pos of knightPos){
      for(let pos2 of knightPos){
        if(Math.abs(pos) != Math.abs(pos2) && x+pos >= 0 && x+pos < 8 && y+pos2 >=0 && y+pos2 < 8 && pieces[x+pos][y+pos2] != 'x' && pieces[x+pos][y+pos2].type == pieceType.knight && pieces[x+pos][y+pos2].color != this.turn){
          return true;
        }
      }
    }
    //diagonal
    let up = true;
    let down = true;
    for(let i = 1; i+y < 8 ;i++){
      if(x+i < 8 && pieces[x+i][y+i] != 'x' && up){
        if(pieces[x+i][y+i].color != this.turn && (pieces[x+i][y+i].type == pieceType.bishop || pieces[x+i][y+i].type == pieceType.queen || (i == 1 && this.turn == 'black' && pieces[x+i][y+i].type == pieceType.pawn))){
          return true;
        }else{
          up = false;
        }
      }
      if(x-i >= 0 && pieces[x-i][y+i] != 'x' && down){
        if(pieces[x-i][y+i].color != this.turn && (pieces[x-i][y+i].type == pieceType.bishop || pieces[x-i][y+i].type == pieceType.queen || (i == 1 && this.turn == 'white' && pieces[x-i][y+i].type == pieceType.pawn))){
          return true;
        }else{
          down = false;
        }
      } 
    }
    up = true;
    down = true;
    for(let i = 1; y-i >= 0 ;i++){
      if(x+i < 8 && pieces[x+i][y-i] != 'x' && up){
        if(pieces[x+i][y-i].color != this.turn && (pieces[x+i][y-i].type == pieceType.bishop || pieces[x+i][y-i].type == pieceType.queen || (i == 1 && this.turn == 'black' && pieces[x+i][y-i].type == pieceType.pawn))){
          return true;
        }else{
          up = false;
        }
      }
      if(x-i >= 0 && pieces[x-i][y-i] != 'x' && down){
        if(pieces[x-i][y-i].color != this.turn && (pieces[x-i][y-i].type == pieceType.bishop || pieces[x-i][y-i].type == pieceType.queen || (i == 1 && this.turn == 'white' && pieces[x-i][y-i].type == pieceType.pawn))){
          return true;
        }else{
          down = false;
        }
      } 
    }
    return false;
  }

  anyValidMoves(color, pieces){
    for(let i = 0; i < 8; i++){
      for(let j =0; j < 8; j++){
        if(pieces[i][j] != 'x'&& pieces[i][j].color == color){
          this.selected.x = i; this.selected.y = j;
          for(let o = 0; o < 8; o++){
            for(let k = 0; k < 8; k++){
              if(this.validMove(o,k)){
                this.selected.x = -1; this.selected.y = -1;
                return true;
              }
            }
          }
        }
      }
    }
    this.selected.x = -1; this.selected.y = -1;
    return false;
  }

  fenNot(){
    let fen = '';
    let pieceletter = ['p','r','n','b','q','k'];
    for(let i = 0; i < 8; i++){
      var count = 0;
      for(let j = 0; j < 8;j++){
        if(this.pieces[i][j] == 'x'){
          count++;
        }else{
          count>0 ? fen+=count : null ;
          this.pieces[i][j].color == 'white' ? fen+= pieceletter[this.pieces[i][j].type].toUpperCase() : fen+= pieceletter[this.pieces[i][j].type];
          count = 0;
        }
      }
      count>0 ? fen+=count : null ;
      i != 7 ? fen+='/' : null;
    }
    fen += ' ' + this.turn.substring(0,1) + ' ';
    var cast = '';
    if(this.pieces[7][4].moved == false){
      this.pieces[7][7].moved == false ? cast+='K' : null;
      this.pieces[7][0].moved == false ? cast+='Q' : null;
    }
    if(this.pieces[0][4].moved == false ){
      this.pieces[0][7].moved == false ? cast+='k' : null;
      this.pieces[0][0].moved == false ? cast+='q' : null;
    }
    cast == '' ? cast = '-' : null;
    fen+=cast+' ';
    this.enpassant.x != -1 ? fen= fen + this.letters[this.enpassant.y].toLowerCase() + (this.rowsInv[this.enpassant.x] + 1) + ' ' : fen += '- ';
    fen+= this.halfMoveNr + ' ' + this.fullMoveNr;
    return fen;
  }

  printPieces(){
    this.promotion == false;
    console.log(this.pieces);
  }

  colorize(x,y){
   // console.log('x: ' + x+ ' y: ' +y)
    if(x==this.selected.x && y==this.selected.y)
    {
      return "activate";
    }else if(this.selected.active && this.validMove(x,y))
    {
      return "validMove";
    }else if(this.pieces[x][y].type == pieceType.king && this.pieces[x][y].color == this.turn && this.inCheck(x,y,this.turn,this.pieces))
    {
      return "check";
    }else
    {
      return this.background[x][y];
    }
  }

  OnDestroy(){
    this.req.unsubscribe();
  }
}

interface selected{
  x:number;
  y:number;
  active:boolean;
}