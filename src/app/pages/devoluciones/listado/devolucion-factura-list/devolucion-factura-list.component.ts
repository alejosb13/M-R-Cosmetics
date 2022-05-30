import { Component, OnInit } from '@angular/core';
import { DevolucionFactura } from 'app/shared/models/DevolucionFactura.model';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import { DevolucionFacturaService } from '../../services/devolucion-factura.service';

@Component({
  selector: 'app-devolucion-factura-list',
  templateUrl: './devolucion-factura-list.component.html',
  styleUrls: ['./devolucion-factura-list.component.css']
})
export class DevolucionFacturaListComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  FacturasDevueltas: DevolucionFactura[];
  isLoad:boolean

  constructor(
    private _DevolucionFacturaService:DevolucionFacturaService,
    private _TablasService:TablasService,
  ) {}

  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._DevolucionFacturaService.getFacturaDevueltos({estado:1}).subscribe((FacturasDevueltas:DevolucionFactura[])=> {
      // console.log(FacturasDevueltas);
      this.FacturasDevueltas = [...FacturasDevueltas]
      this._TablasService.datosTablaStorage = [...FacturasDevueltas]
      this._TablasService.total = FacturasDevueltas.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.FacturasDevueltas]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    // this._TablasService.buscar(this.FacturasDevueltas)
    // console.log("sii");

    let camposPorFiltrar:any[] = [
      ['descripcion'],
      ['user','name'],
      ['user','apellido'],
      ['id'],
    ];

    this._TablasService.buscarEnCampos(this.FacturasDevueltas,camposPorFiltrar)
    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  // eliminar(devolucion:DevolucionFactura){
  //   console.log(devolucion);
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: "Esta devolución se eliminará y no podrás recuperarla.",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#51cbce',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Eliminar',
  //     cancelButtonText: 'Cancelar'
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //       this._DevolucionFacturaService.deleteDevolucion(devolucion.id).subscribe((data)=>{
  //         this.DevolucionProducto = this.DevolucionProducto.filter(devolucionProducto => devolucionProducto.id != devolucion.id)
  //         this.refreshCountries()

  //         Swal.fire({
  //           text: data[0],
  //           icon: 'success',
  //         })
  //       })
  //     }
  //   })
  // }
}
