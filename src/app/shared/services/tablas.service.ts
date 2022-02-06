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
      if(valorFilaDatatableObject.toString().toLowerCase().includes(busquedaMinuscula)) tieneCoincidencia = true
    })
    
    return tieneCoincidencia
  }
  
}
