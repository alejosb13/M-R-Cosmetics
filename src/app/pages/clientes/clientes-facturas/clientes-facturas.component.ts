import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Factura } from 'app/shared/models/Factura.model';
import { ClientesService } from 'app/shared/services/clientes.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-clientes-facturas',
  templateUrl: './clientes-facturas.component.html',
  styleUrls: ['./clientes-facturas.component.css']
})
export class ClientesFacturasComponent implements OnInit {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Facturas: Factura[];
  isLoad:boolean
  ClienteId:number
  constructor(
    private _ClientesService:ClientesService,
    // private _FacturasService:FacturasService,
    private _TablasService:TablasService,
    route: ActivatedRoute,
  ) {
    this.ClienteId = Number(route.snapshot.params.id);
  }

  ngOnInit(): void {

    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._ClientesService.getClientexFactura(this.ClienteId).subscribe((facturas:Factura[])=> {
      // console.log(facturas);

      this.Facturas = [...facturas]
      this._TablasService.datosTablaStorage = [...facturas]
      this._TablasService.total = facturas.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Facturas]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    let camposPorFiltrar:any[] = [
      ['cliente','nombreCompleto'],
      ['cliente','nombreEmpresa'],
      ['id'],
    ];

    this._TablasService.buscarEnCampos(this.Facturas,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }


}
