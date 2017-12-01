export interface ChessPiece{
    type:pieceType;
    color:String;
    moved:boolean;
}

export enum pieceType{
    pawn = 0,
    castle = 1,
    knight = 2,
    bishop = 3,
    queen = 4,
    king = 5
}