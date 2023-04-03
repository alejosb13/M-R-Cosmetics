import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Cliente } from 'app/shared/models/Cliente.model';
import { HelpersService } from 'app/shared/services/helpers.service';

import { LogisticaService } from 'app/shared/services/logistica.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class ClienteDetalleComponent implements OnInit {
  isLoad:boolean = false;
  isAdmin:boolean
  ClienteId:number
  Cliente:Cliente

  Data:any
  page = 1;
  // pageSize = 4;
  pageSize = environment.PageSize;
  collectionSize = 0;

  constructor(
    private _LogisticaService: LogisticaService,
    private _AuthService: AuthService,
    private _ActivatedRoute: ActivatedRoute,
    private _HelpersService: HelpersService,
    private _TablasService: TablasService,
  ) { }

  ngOnInit(): void {

    this.isAdmin = this._AuthService.isAdmin()
    this.ClienteId = Number(this._ActivatedRoute.snapshot.params.id)

    this.getEstadoCuenta()
  }

  getEstadoCuenta(){
    this.isLoad = true;
    this._LogisticaService.getEstadoCuentaCliente({cliente_id:this.ClienteId}).subscribe(data=>{
      this.isLoad = false;

      this.Data = [...data.estado_cuenta]
      this.Cliente = {...data.cliente}
      
      this._TablasService.datosTablaStorage = [...data.estado_cuenta]
      this._TablasService.total = data.estado_cuenta.length
      this._TablasService.busqueda = ""
      this.refreshCountries()
      // console.log("[getEstadoCuenta]",data);
    },(error)=>{
      this.isLoad = false
    })
  }

  descargarPDF(){
    Swal.fire({
      title: "Descargando el archivo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      allowEnterKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._LogisticaService.getEstadoCuentaClientePDF(this.ClienteId).subscribe((data)=>{
      // console.log(data);
      this._HelpersService.downloadFile(data,`Estado_Cuenta_${this.ClienteId}_${ this._HelpersService.changeformatDate(this._HelpersService.currentFullDay(),'MM/DD/YYYY HH:mm:ss',"DD-MM-YYYY_HH:mm:ss") }`)
      Swal.fire(
        '',
        'Descarga Completada',
        'success'
      )
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Data]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  // BuscarValor(){
  //   // this._TablasService.buscar(this.Clientes)
  //   let camposPorFiltrar:any[] = [
  //     ['nombreCompleto'],
  //     ['nombreEmpresa'],
  //     ['dias_cobro'],
  //     ['direccion_negocio'],
  //     ['direccion_casa'],
  //     ['id'],
  //   ];

  //   this._TablasService.buscarEnCampos(this.Clientes,camposPorFiltrar)
  //   if(this._TablasService.busqueda ==""){this.refreshCountries()}

  // }
}
