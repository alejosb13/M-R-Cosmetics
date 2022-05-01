import { Component, OnInit } from '@angular/core';
import { ReciboHistorialContado } from 'app/shared/models/ReciboHistorial.model';
import { ReciboService } from 'app/shared/services/recibo.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-recibos-contado-list',
  templateUrl: './recibos-contado-list.component.html',
  styleUrls: ['./recibos-contado-list.component.css']
})
export class RecibosContadoListComponent implements OnInit {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Recibos: ReciboHistorialContado[];
  isLoad:boolean

  constructor(
    private _ReciboService:ReciboService,
    private _TablasService:TablasService,
  ) {}

  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._ReciboService.getReciboHistorialContado({estado:1}).subscribe((recibos:ReciboHistorialContado[])=> {
      console.log(recibos);
      this.Recibos = [...recibos]
      this._TablasService.datosTablaStorage = [...recibos]
      this._TablasService.total = recibos.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Recibos]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    this._TablasService.buscar(this.Recibos)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }
}
