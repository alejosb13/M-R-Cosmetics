import { Component, OnInit, PipeTransform } from '@angular/core';
import { Cliente } from './models/Cliente.model';
import { ClientesService } from './servicios/clientes.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  page = 1;
  pageSize = 3;
  collectionSize = 0;
  Clientes: Cliente[];
  
  constructor(
    private _ClientesService:ClientesService
  ) {
    this.asignarValores()
  }
  
  ngOnInit(): void {}


  asignarValores(){
    this._ClientesService.getCliente().subscribe((clientes:Cliente[])=> {
      this.Clientes = [...clientes]
      this._ClientesService.datosTablaStorage = [...clientes]
      this._ClientesService.total = clientes.length
      
      this.refreshCountries() 
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
