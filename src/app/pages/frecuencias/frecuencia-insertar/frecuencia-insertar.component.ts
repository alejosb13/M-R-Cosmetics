import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Frecuencia } from 'app/shared/models/Frecuencia.model';
import { FrecuenciaService } from 'app/shared/services/frecuencia.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-frecuencia-insertar',
  templateUrl: './frecuencia-insertar.component.html',
  styleUrls: ['./frecuencia-insertar.component.css']
})
export class FrecuenciaInsertarComponent implements OnInit {

  constructor(
    // private _ClientesService: ClientesService,
    private _FrecuenciaService:FrecuenciaService,
    private router:Router,
    private _HelpersService:HelpersService
  ) { }

  ngOnInit(): void {
  }

  ValuesForm(frecuencia:Frecuencia){
    this._FrecuenciaService.insertFrecuencia(frecuencia).subscribe(data =>{
      console.log(data);
      Swal.fire({
        text: "Categoria insertada con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate([`frecuencia/editar/${data.id}`]);
        }
      })
    },(HttpErrorResponse:HttpErrorResponse)=>{
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
