import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Frecuencia } from 'app/shared/models/Frecuencia.model';
import { CategoriaService } from 'app/shared/services/categoria.service';
import { FrecuenciaService } from 'app/shared/services/frecuencia.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-frecuencia-editar',
  templateUrl: './frecuencia-editar.component.html',
  styleUrls: ['./frecuencia-editar.component.css']
})
export class FrecuenciaEditarComponent implements OnInit {

 
  frecuenciaId:number
  constructor(
    route: ActivatedRoute,
    private _FrecuenciaService: FrecuenciaService,
    private _HelpersService: HelpersService,
    
  ) { 
    this.frecuenciaId = Number(route.snapshot.params.id);
    
  }

  ngOnInit(): void {}
  
  ValuesForm(frecuencia:Frecuencia){
    this._FrecuenciaService.updateFrecuencia(this.frecuenciaId,frecuencia).subscribe(data =>{
      // console.log(data);
      Swal.fire({
        text: "Frecuencia modificada con exito",
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
