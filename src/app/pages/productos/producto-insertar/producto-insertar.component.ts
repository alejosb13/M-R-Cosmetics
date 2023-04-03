import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'app/shared/models/Producto.model';
import { ClientesService } from 'app/shared/services/clientes.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import { ProductosService } from 'app/shared/services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-insertar',
  templateUrl: './producto-insertar.component.html',
  styleUrls: ['./producto-insertar.component.css']
})
export class ProductoInsertarComponent implements OnInit {

  constructor(
    // private _ClientesService: ClientesService,
    private _ProductosService: ProductosService,
    private router:Router,
    private _HelpersService:HelpersService
  ) { }

  ngOnInit(): void {
  }

  ProductValuesForm(producto:Producto){
    Swal.fire({
      title: "Creando producto",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey:false,
      allowOutsideClick:false,
      allowEnterKey:false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
    
    this._ProductosService.IsLoad = true;

    this._ProductosService.insertProducto(producto).subscribe(ProductoResponse =>{
      this._ProductosService.IsLoad = false;

      console.log(ProductoResponse);
      Swal.fire({
        text: "Producto insertado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate([`producto/editar/${ProductoResponse.id}`]);
        }
      })
    },(HttpErrorResponse:HttpErrorResponse)=>{
      this._ProductosService.IsLoad = false;

      let error:string =  this._HelpersService.errorResponse(HttpErrorResponse)
      console.log(error);
      
      Swal.fire({
        title: "Error",
        html: error,
        icon: 'error',
      })
    })
  }
}
