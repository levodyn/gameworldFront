import { trigger, state, transition, style, animate } from '@angular/animations';

export let fade = trigger('fade', [
    state('void',style({fontSize:'100px', opacity:0.1})),
    transition(':enter, :leave', [
      animate(2000)//, style({backgroundColor:'brown',fontSize:'300px'}))
    ]),
  ]);