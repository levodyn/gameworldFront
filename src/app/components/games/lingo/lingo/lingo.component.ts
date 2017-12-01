import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { LingoService } from '../../../../services/games/lingo/lingo.service';

@Component({
  selector: 'app-lingo',
  templateUrl: './lingo.component.html',
  styleUrls: ['./lingo.component.css'],
  providers: [LingoService]
})
export class LingoComponent implements OnInit {
  rows:number[] = [0,1,2,3,4];
  guess:String[][] = [];
  colors:String[][] = [];
  guessNr:number = 0;
  rForm:FormGroup;
  answer:String;
  answerSplit:String[] = [];
  err:String = '';
  win = false;
  calc = true;

  constructor(private fb:FormBuilder, private _sanitizer: DomSanitizer, private _lingo:LingoService) { 
    this.rForm = fb.group({
    'guess': [null, Validators.compose([Validators.required, Validators.maxLength(5), Validators.minLength(5)])]
    });
  }

  ngOnInit() {
    this.newGame();
  }

  newGame(){
    this.win = false;
    this.guessNr = 0;
    for(var i = 0; i < 5;i++){
      this.guess[i] = [];
      this.colors[i] = [];
      for(var j = 0; j< 5; j++){
        this.guess[i][j] = '.';
        this.colors[i][j] = 'blue';
      }
    }
    this._lingo.randomWord().subscribe(data => {
      this.answer = data['word'].toUpperCase() as String;
      console.log(this.answer);
      this.answerSplit = this.answer.split("");
      this.guess[0][0] = this.answer.substring(0,1);
      this.colors[0][0] = 'red';
    });
  }

  onSubmit(guess){
    this.calc = false;
    guess.guess= guess.guess.toUpperCase();
    this._lingo.checkWord(guess).subscribe(data=>{
      if(data){
        if(guess.guess == this.answer) this.win = true;
        this.err = ''
        for(var i = 0; i<5;i++){
          this.guess[this.guessNr][i] = guess.guess.substring(i,i+1);
        }
        this.updateColors();        
        this.guessNr++;
      }else{
        this.err = 'Not a real word!';
        this.rForm.patchValue({guess:''});
      }
      this.calc = true;
    });
    
    
  }

  sanitizer(input){
    return this._sanitizer.bypassSecurityTrustStyle(input);
  }

  updateColors(){
    var $answerLettersTmp:String[] = [];
    var $splitTmp:String[][] = [];
    for(var i = 0; i < 5; i++){
      $answerLettersTmp[i] = this.answer.substring(i,i+1);
      $splitTmp[i] = [];
      for(var j = 0; j < 5; j++){
        $splitTmp[i][j] = this.guess[i][j]
      }
    }
		var $nextLine:String[] = [$answerLettersTmp[0],'.','.','.','.'];
		
		for(var $i = 0;$i<this.guessNr+1;$i++)
		{
			for(var $j = 0;$j<5;$j++)
			{
				if($answerLettersTmp[$j] === $splitTmp[$i][$j])
				{
					$nextLine[$j] = $answerLettersTmp[$j];
					this.colors[$i][$j] = 'red';
					$answerLettersTmp[$j] = 'AA';
					$splitTmp[$i][$j] = 'BB';
					
				}else{
          this.colors[$i][$j] = 'blue';
        }
      }
      //console.log($answerLettersTmp + ' ' + $splitTmp[$i]);
			for(var $j = 0;$j<5;$j++)
			{
				for(var $k = 0;$k<5;$k++)
				{
					if($splitTmp[$i][$j] === $answerLettersTmp[$k])
					{
						this.colors[$i][$j] = '#D7DF01';
						$answerLettersTmp[$k] = '';
						$splitTmp[$i][$j] = '';
					}
				}
			}
      var $answerLettersTmp:String[] = [];
      for(var i = 0; i < 5;i++){
        $answerLettersTmp[i] = this.answer.substring(i,i+1);        
      }
    }
    
    if(!this.win && this.guessNr < 4){
       this.guess[this.guessNr+1] = $nextLine;
       for(var i = 0; i < 5; i++){
         if(this.guess[this.guessNr+1][i] == $answerLettersTmp[i]){
           this.colors[this.guessNr+1][i] = 'red';
         }
       }
    }
  }
}
