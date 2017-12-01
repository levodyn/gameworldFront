import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  @Input() color:any;
  @Output() childEvent = new EventEmitter();  
  pieces:number[] = [1,2,3,4];
  constructor() { }

  ngOnInit() {}

  promote(type){
    this.childEvent.emit(type);
  }
}
