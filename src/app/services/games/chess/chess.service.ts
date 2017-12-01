import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const apiUrl = 'http://levodonia.ddns.net/back/public/api/';

@Injectable()
export class ChessService {

  constructor(private http:HttpClient) { }

  stockfish(fen){
    console.log('service: ' + fen)    
    let url = apiUrl+'chess/stockfish';
    console.log(url);
    let body = {fen:fen}
    let data;
    return this.http.post(url,body)
    .catch(this.handleError);
  }

  private handleError(error:any, caught:any): any{
    return console.log(error,caught);
  }

}
