import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }
  
  DaysOfTheWeek:string[] = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];
  
  daysOfTheWeekToNumber(daysOfTheWeek:string[]){
    
  }
  
  daysOfTheWeekToString(daysOfTheWeek:number[]):string{
    let days:string[] =  daysOfTheWeek.map((day:number) => this.DaysOfTheWeek[day])
    
    return String(days)
  }
}
