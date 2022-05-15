import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TablasService {

  constructor() { }

  total:number = 0
  busqueda:string = ""
  datosTablaStorage:any[] = []

  buscar(datosTabla:any[]){
    let busqueda = this.busqueda

    // filter
    let result = datosTabla.filter(valoresFila => this.filtrarBusqueda(valoresFila, busqueda));

    this.datosTablaStorage = result
    this.total = result.length;
  }

  filtrarBusqueda(valoresFila:any,busqueda:string):boolean {
    let busquedaMinuscula = busqueda.toLowerCase()
    let tieneCoincidencia = false

    // console.log(valoresFila);
    let valores = Object.values(valoresFila)
    // let valores = valoresFila

    // debugger
    valores.map((valorFilaDatatableObject:any)=>{
      if(String(valorFilaDatatableObject).toLowerCase().includes(busquedaMinuscula)) tieneCoincidencia = true
    })

    return tieneCoincidencia
  }

  buscarEnCampos(datosTabla:any[],campos:any[]){
    let busqueda = this.busqueda

    // filter
    let result = datosTabla.filter(valoresFila => this.filtrarBusquedaEnCampos(valoresFila, busqueda,campos));

    this.datosTablaStorage = result
    this.total = result.length;
  }

  filtrarBusquedaEnCampos(valoresFila:any,busqueda:string,campos:string[]):boolean {
    let busquedaMinuscula = busqueda.toLowerCase()
    let tieneCoincidencia = false
    console.log("[valoresFila]",valoresFila);
    console.log("[campos]",campos);

    let valuesSelect:any[] = campos.map((campo:string)=>{
      let valor = ""

      if(campo.length == 1)
      if(valoresFila[campo[0]]){
        valor = valoresFila[campo[0]]
      }

      if(campo.length == 2)
      if(valoresFila[campo[0]][campo[1]]){
        valor = valoresFila[campo[0]][campo[1]]
      }

      if(campo.length == 3)
      if(valoresFila.hasOwnProperty(campo[0])  && valoresFila[campo[0]].hasOwnProperty(campo[1]) && valoresFila[campo[0]][campo[1]].hasOwnProperty(campo[2])){
        valor = valoresFila[campo[0]][campo[1]][campo[2]]
      }

      if(campo.length == 4)
      if(valoresFila[campo[0]][campo[1]][campo[2]][campo[3]]){
        valor = valoresFila[campo[0]][campo[1]][campo[2]][campo[3]]
      }

      if(campo.length == 5)
      if(valoresFila[campo[0]][campo[1]][campo[2]][campo[3]][campo[4]]){
        valor = valoresFila[campo[0]][campo[1]][campo[2]][campo[3]][campo[4]]
      }

      return String(valor).toLowerCase()
    })

    // console.log("valor",valuesSelect);

    valuesSelect.map((valorFilaDatatableObject:any)=>{
      if(String(valorFilaDatatableObject).toLowerCase().includes(busquedaMinuscula)) tieneCoincidencia = true
    })

    return tieneCoincidencia
  }

}
