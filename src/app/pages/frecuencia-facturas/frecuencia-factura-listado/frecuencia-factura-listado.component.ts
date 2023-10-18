import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Frecuencia } from 'app/shared/models/Frecuencia.model';
import { FrecuenciaFactura } from 'app/shared/models/FrecuenciaFactura.model';
import { FrecuenciaService } from 'app/shared/services/frecuencia.service';
import { FrecuenciaFacturaService } from 'app/shared/services/frecuenciaFactura.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-frecuencia-factura-listado',
  templateUrl: './frecuencia-factura-listado.component.html',
  styleUrls: ['./frecuencia-factura-listado.component.css']
})
export class FrecuenciaFacturaListadoComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  FrecuenciasFacturas: FrecuenciaFactura[];
  isLoad:boolean
  isAdmin: boolean;
  isSupervisor: boolean;
  
  constructor(
    private _FrecuenciaFacturaService:FrecuenciaFacturaService,
    private _TablasService:TablasService,
    private _AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();

    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._FrecuenciaFacturaService.getFrecuencia().subscribe((frecuencia:Frecuencia[])=> {
      // console.log(producto);

      this.FrecuenciasFacturas = [...frecuencia]
      this._TablasService.datosTablaStorage = [...frecuencia]
      this._TablasService.total = frecuencia.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.FrecuenciasFacturas]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    this._TablasService.buscar(this.FrecuenciasFacturas)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  eliminar({id}:Frecuencia){
    // console.log(id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta categoria se eliminará y no podrás recuperarla.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._FrecuenciaFacturaService.deleteFrecuencia(id).subscribe((data)=>{
          this.FrecuenciasFacturas = this.FrecuenciasFacturas.filter(categoria => categoria.id != id)
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
