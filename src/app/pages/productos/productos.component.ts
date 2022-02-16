import { Component, OnInit } from '@angular/core';
import { Producto } from 'app/shared/models/Producto.model';
import { ProductosService } from 'app/shared/services/productos.service';
import { TablasService } from 'app/shared/services/tablas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  page = 1;
  pageSize = 3;
  collectionSize = 0;
  Productos: Producto[];
  isLoad:boolean
  
  constructor(
    private _ProductosService:ProductosService,
    private _TablasService:TablasService,
  ) {}
  
  ngOnInit(): void {
    this.asignarValores()
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
  
  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Productos]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  
  BuscarValor(){
    this._TablasService.buscar(this.Productos)
    
    if(this._TablasService.busqueda ==""){this.refreshCountries()}
    
  }
  
  eliminar({id}:Producto){
    // console.log(id);
    Swal.fire({
      title: '¿Estas seguro?',
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

}
