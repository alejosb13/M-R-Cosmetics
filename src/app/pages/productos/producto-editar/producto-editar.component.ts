import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'app/shared/models/Producto.model';
import { ClientesService } from 'app/shared/services/clientes.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import { ProductosService } from 'app/shared/services/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-editar',
  templateUrl: './producto-editar.component.html',
  styleUrls: ['./producto-editar.component.css']
})
export class ProductoEditarComponent implements OnInit {
 
  productoId:number
  constructor(
    route: ActivatedRoute,
    private _ProductosService: ProductosService,
    // private fb: FormBuilder,
    // private _FrecuenciaService: FrecuenciaService,
    private _HelpersService: HelpersService,
    
  ) { 
    this.productoId = Number(route.snapshot.params.id);
    
  }

  ngOnInit(): void {}
  
  ProductoValuesForm(producto:Producto){
    Swal.fire({
      title: "Modificando producto",
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

    this._ProductosService.updateProducto(this.productoId,producto).subscribe(data =>{
      // console.log(data);
      this._ProductosService.IsLoad = false;

      Swal.fire({
        text: "Producto modificado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) window.location.reload()
      })
    },(HttpErrorResponse :HttpErrorResponse)=>{
      // console.log(HttpErrorResponse );
      let error:string =  this._HelpersService.errorResponse(HttpErrorResponse )
      this._ProductosService.IsLoad = false;

      Swal.fire({
        title: "Error",
        html: error,
        icon: 'error',
      })
    })
  }

}
