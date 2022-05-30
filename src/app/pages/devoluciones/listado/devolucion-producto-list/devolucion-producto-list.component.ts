import { Component, OnInit } from '@angular/core';
import { DevolucionProducto } from 'app/shared/models/DevolucionProducto.model';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { DevolucionProductoService } from '../../services/devolucion-producto.service';

@Component({
  selector: 'app-devolucion-producto-list',
  templateUrl: './devolucion-producto-list.component.html',
  styleUrls: ['./devolucion-producto-list.component.css']
})
export class DevolucionProductoListComponent implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  DevolucionProducto: DevolucionProducto[];
  isLoad:boolean

  constructor(
    private _DevolucionProductoService:DevolucionProductoService,
    private _TablasService:TablasService,
  ) {}

  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._DevolucionProductoService.getProductosDevueltos({estado:1}).subscribe((DevolucionProducto:DevolucionProducto[])=> {
      console.log(DevolucionProducto);
      this.DevolucionProducto = [...DevolucionProducto]
      this._TablasService.datosTablaStorage = [...DevolucionProducto]
      this._TablasService.total = DevolucionProducto.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.DevolucionProducto]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    // this._TablasService.buscar(this.DevolucionProducto)
    let camposPorFiltrar:any[] = [
      ['descripcion'],
      ['user','name'],
      ['user','apellido'],
      ['factura_detalle','producto','descripcion'],
      ['id'],
    ];

    this._TablasService.buscarEnCampos(this.DevolucionProducto,camposPorFiltrar)
    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  // eliminar(devolucion:DevolucionProducto){
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

  //       this._DevolucionProductoService.deleteDevolucion(devolucion.id).subscribe((data)=>{
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
