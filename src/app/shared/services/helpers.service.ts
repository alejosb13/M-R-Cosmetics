import { HttpErrorResponse } from '@angular/common/http';
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
  
  errorResponse(HttpErrorResponse:HttpErrorResponse):string{
    let ListErrorStr:string =""
    
    if(HttpErrorResponse.error.length > 0){
      let listError:any[] =[]
      ListErrorStr += "<ul class='error-list'>"
      
      HttpErrorResponse.error.map((value:any)=> listError.push(Object.values(value)[0]))
      listError.map((msjError)=> ListErrorStr += `<li>${msjError}</li>`)
      
      ListErrorStr += "</ul>"
    }else{
      ListErrorStr += HttpErrorResponse.error
    }
    return ListErrorStr
  }
}
