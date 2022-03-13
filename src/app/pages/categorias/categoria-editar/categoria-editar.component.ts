import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'app/shared/models/Categoria.model';
import { CategoriaService } from 'app/shared/services/categoria.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-editar',
  templateUrl: './categoria-editar.component.html',
  styleUrls: ['./categoria-editar.component.css']
})
export class CategoriaEditarComponent implements OnInit {
 
  productoId:number
  constructor(
    route: ActivatedRoute,
    private _CategoriaService: CategoriaService,
    private _HelpersService: HelpersService,
    
  ) { 
    this.productoId = Number(route.snapshot.params.id);
    
  }

  ngOnInit(): void {}
  
  ValuesForm(categoria:Categoria){
    this._CategoriaService.updateCategoria(this.productoId,categoria).subscribe(data =>{
      // console.log(data);
      Swal.fire({
        text: "Producto modificado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) window.location.reload()
      })
    },(HttpErrorResponse :HttpErrorResponse)=>{
      // console.log(HttpErrorResponse );
      let error:string =  this._HelpersService.errorResponse(HttpErrorResponse )

      Swal.fire({
        title: "Error",
        html: error,
        icon: 'error',
      })
    })
  }
}
