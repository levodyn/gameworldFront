import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const apiUrl = 'http://levodonia.ddns.net/back/public/api/';

@Injectable()


export class LingoService {

  constructor(private http:HttpClient) { }

  randomWord(){
    let url = apiUrl+'lingo/randomword';
    return this.http.get(url).catch(this.handleError);
  }

  checkWord(word){
    let url = apiUrl+'lingo/checkword';
    return this.http.post(url,word).catch(this.handleError);
  }

  private handleError(error:any, caught:any): any{
    return console.log(error,caught);
  }

}
