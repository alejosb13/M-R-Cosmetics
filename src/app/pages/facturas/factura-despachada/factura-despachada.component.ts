import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Factura } from 'app/shared/models/Factura.model';
import { FacturasService } from 'app/shared/services/facturas.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factura-despachada',
  templateUrl: './factura-despachada.component.html',
  styleUrls: ['./factura-despachada.component.css']
})
export class FacturaDespachadaComponent implements OnInit {


  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Facturas: Factura[];
  isLoad:boolean
  isAdmin:boolean


  constructor(
    private _FacturasService:FacturasService,
    private _TablasService:TablasService,
    private _AuthService:AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin()
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._FacturasService.getFacturas({estado:1,despachado:0}).subscribe((factura:Factura[])=> {
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

  despachar(id:number){
    // console.log(id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este factura será despachada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Despachar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._FacturasService.despacharFactura(id,{despachado:1}).subscribe((data)=>{
          this.Facturas = this.Facturas.filter(factura => factura.id != id)
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
