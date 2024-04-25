import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/login/service/auth.service';
import { ReciboHistorialContado } from 'app/shared/models/ReciboHistorial.model';
import { ReciboService } from 'app/shared/services/recibo.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

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
  isAdmin:boolean

  constructor(
    private _ReciboService:ReciboService,
    private _TablasService:TablasService,
    private _AuthService:AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin()
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._ReciboService.getReciboHistorialContado({estado:1}).subscribe((recibos:ReciboHistorialContado[])=> {
      // console.log(recibos);
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
    let camposPorFiltrar:any[] = [
      ['numero'],
      ['factura','monto'],
      ['factura','cliente','nombreCompleto'],
      ['recibo','user','name'],
      ['recibo','user','apellido'],
    ];

    this._TablasService.buscarEnCampos(this.Recibos,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  eliminar(reciboEliminar:ReciboHistorialContado){
    // console.log(reciboEliminar);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Al eliminar este recibo se eliminará también la factura asociada a él y no podrás recuperarla.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminando el recibo",
          text: "Esto puede demorar un momento.",
          timerProgressBar: true,
          allowEscapeKey: false,
          allowOutsideClick: false,
          allowEnterKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this._ReciboService.deleteReciboHistorialContado(reciboEliminar.id).subscribe((data)=>{
          this.Recibos = this.Recibos.filter(recibo => recibo.id != reciboEliminar.id)
          this.refreshCountries()

          Swal.fire({
            text: data[0],
            icon: 'success',
          })
        })
      }
    })
  }
}
