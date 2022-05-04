import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Factura } from 'app/shared/models/Factura.model';
import { FacturasService } from 'app/shared/services/facturas.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DevolucionFacturaService } from '../devoluciones/services/devolucion-factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit, OnDestroy {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Facturas: Factura[];
  isLoad:boolean
  isAdmin:boolean
  status_pagado:number
  Factura: Factura;

  private Subscription = new Subscription();

  constructor(
    private _FacturasService:FacturasService,
    private _TablasService:TablasService,
    private _DevolucionFacturaService:DevolucionFacturaService,
    private _AuthService:AuthService,
    private route: ActivatedRoute,
    private NgbModal: NgbModal,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin()
    this.route.paramMap.subscribe((params: ParamMap) => {
      // console.log(params.get('status_pagado'));
      this.status_pagado = params.get('status_pagado') == 'pagadas' ? 1 : 0
      this.asignarValores()
    })
  }



  asignarValores(){
    this.isLoad = true

    let Subscription = this._FacturasService.getFacturas({estado:1,status_pagado:this.status_pagado}).subscribe((factura:Factura[])=> {
      // console.log(factura);

      this.Facturas = [...factura]
      this._TablasService.datosTablaStorage = [...factura]
      this._TablasService.total = factura.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
    this.Subscription.add(Subscription)
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Facturas]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    let camposPorFiltrar:any[] = [
      ['cliente','nombreCompleto'],
      ['id',],
    ];

    this._TablasService.buscarEnCampos(this.Facturas,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  // eliminar({id}:Factura){
  //   // console.log(id);
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: "Este factura se eliminará y no podrás recuperarlo.",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#51cbce',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Eliminar',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //       let Subscription = this._FacturasService.deleteFactura(id).subscribe((data)=>{
  //         this.Facturas = this.Facturas.filter(factura => factura.id != id)
  //         this.refreshCountries()

  //         Swal.fire({
  //           text: data[0],
  //           icon: 'success',
  //         })
  //       },(HttpErrorResponse :HttpErrorResponse)=>{
  //         // console.log(HttpErrorResponse );

  //         Swal.fire({
  //           title: "Error",
  //           html: HttpErrorResponse.error[0] ,
  //           icon: 'error',
  //         })
  //       })

  //       this.Subscription.add(Subscription)
  //     }
  //   })
  // }

  openDevolverFactura(content:any,Factura:Factura){
    this.Factura = Factura
    this.NgbModal.open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result
        .then((result) => {})
        .catch(err => {})
  }

  FormsValuesDevolucion(DevolucionProducto:any){
    console.log("[DevolucionFacturaForm]",DevolucionProducto);

    this._DevolucionFacturaService.insertDevolucion(DevolucionProducto).subscribe((data)=>{
      console.log("[response]",data);

      Swal.fire({
        text: "La devolución fue realizada con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload()
        }
      })
    })
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

}
