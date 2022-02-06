import { Component, OnInit, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from './models/Cliente.model';
import { ClientesService } from './servicios/clientes.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  page = 1;
  pageSize = 9;
  collectionSize = 0;
  Clientes: Cliente[];
  isLoad:boolean
  
  constructor(
    private _ClientesService:ClientesService
  ) {}
  
  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true
    
    this._ClientesService.getCliente().subscribe((clientes:Cliente[])=> {
      console.log(clientes);
          
      this.Clientes = [...clientes]
      this._ClientesService.datosTablaStorage = [...clientes]
      this._ClientesService.total = clientes.length
      
      this.refreshCountries() 
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    }) 
  }
  
  refreshCountries() {
    this._ClientesService.datosTablaStorage = [...this.Clientes]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  
  BuscarValor(){
    this._ClientesService.buscar(this.Clientes)
    
    if(this._ClientesService.busqueda ==""){this.refreshCountries()}
    
  }
}
