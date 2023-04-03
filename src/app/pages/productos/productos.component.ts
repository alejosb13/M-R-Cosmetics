import { Component, OnInit } from '@angular/core';
import { Producto } from 'app/shared/models/Producto.model';
import { LogisticaService } from 'app/shared/services/logistica.service';
import { ProductosService } from 'app/shared/services/productos.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/login/service/auth.service';
import { HelpersService } from '../../shared/services/helpers.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Productos: Producto[];
  isLoad:boolean

  productos:number = 0
  monto_total:number = 0
  isAdmin:boolean

  constructor(
    private _ProductosService:ProductosService,
    private _TablasService:TablasService,
    private _LogisticaService:LogisticaService,    
    private _AuthService: AuthService,
    private _HelpersService: HelpersService,
  ) {}

  ngOnInit(): void {    
    this.isAdmin = this._AuthService.isAdmin()
    this.asignarValores()
    this.getLogisticaProductos()
  }


  asignarValores(){
    this.isLoad = true

    this._ProductosService.getProducto().subscribe((producto:Producto[])=> {
      // console.log(producto);

      this.Productos = [...producto]
      this._TablasService.datosTablaStorage = [...producto]
      this._TablasService.total = producto.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  getLogisticaProductos(){

    this._LogisticaService.getProductoLogistica().subscribe((data:{"productos": number,"monto_total": number})=> {
      this.productos = data.productos
      this.monto_total = data.monto_total
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Productos]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    let camposPorFiltrar:any[] = [
      ['descripcion'],
      ['marca'],
      ['modelo'],
      ['linea'],
    ];
    this._TablasService.buscarEnCampos(this.Productos,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  eliminar({id}:Producto){
    // console.log(id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este producto se eliminará y no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._ProductosService.deleteProducto(id).subscribe((data)=>{
          this.Productos = this.Productos.filter(producto => producto.id != id)
          this.refreshCountries()

          Swal.fire({
            text: data[0],
            icon: 'success',
          })
        })
      }
    })
  }

  descargarInventario(){
    // console.log(id);
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

    this._ProductosService.inventario().subscribe((data)=>{
      const date = new Date();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // This arrangement can be altered based on how we want the date's format to appear.
      let currentDate = `${day}-${month}-${year}`;
          // console.log(data);
      this._HelpersService.downloadFile(data,`Inventario_${currentDate}`)

      Swal.fire(
        '',
        'Descarga Completada',
        'success'
      )

    })
  }
}
