import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

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

  addDaytoDate(days:number,format:string):string{
    let currentDay = moment(moment().format('MM/DD/YYYY'),'MM/DD/YYYY'),
        countDays = 0;

    while (countDays < days) {
      // Si no es sabado ni domingo
      currentDay.add(1, 'days');
      if (currentDay.isoWeekday() !== 6 && currentDay.isoWeekday() !== 7) {
        countDays++
        // console.log(countDays,currentDay.format('MM/DD/YYYY'));
      }
    }

    return currentDay.format(format)
  }

  changeformatDate(date:string,formatIn:string,formatOut:string){
    let currentDay = moment(date,formatIn)

    return currentDay.format(formatOut)
  }

  currentDay():string{
    return moment().format('MM/DD/YYYY')
  }

  downloadFile(data: any,nameFile:string) {
    let dataType = data.type;
    let binaryData = [];
    binaryData.push(data);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    downloadLink.setAttribute('download', nameFile);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  obtenerId(clienteString:string):number {
    let split:string[] = clienteString.split("-")
    let id = Number(split[0].trim())

    console.log("IdCliente",id);
    return id
  }

  siUnaFechaEsIgualOAnterior(inicio:string,fin:string):boolean{
    return moment(inicio).isAfter(fin);
  }

  InicioYFinDeMes(fecha:string):{ date: string; primerDiaDelMes: number; ultimoDiaDelMes: number; }{
    let date:string;

    if(fecha){
      date = fecha
    }else{
      date = this.changeformatDate(this.currentDay(),'MM/DD/YYYY',"YYYY-MM-DD")
    }

    // console.log("currentDate",this.currentDay());

    // moment("1995-12-25") <- año-mes-dia
    let diasDelMes:number[] = Array.from(Array(moment(date).daysInMonth()), (_, i) => i + 1)
    // console.log("diasDelMes",diasDelMes);

    let primerDiaDelMes = 1
    let ultimoDiaDelMes = diasDelMes.length

    return{
      date,
      primerDiaDelMes,
      ultimoDiaDelMes
    }
  }

}
