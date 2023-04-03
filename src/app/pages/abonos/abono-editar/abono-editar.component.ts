import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Abono } from 'app/shared/models/Abono.model';
import { AbonoService } from 'app/shared/services/abono.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abono-editar',
  templateUrl: './abono-editar.component.html',
  styleUrls: ['./abono-editar.component.css']
})
export class AbonoEditarComponent implements OnInit {
  isLoad:boolean = false
  AbonoId:number= 0
  constructor(
    private _AbonoService: AbonoService,
    private _HelpersService: HelpersService,
    // private router:Router,
    route: ActivatedRoute,
  ) {
    this.AbonoId = Number(route.snapshot.params.id);
  }

  ngOnInit(): void {

  }

  FormValuesForm(abono:Abono){
    // console.log(abono);
    Swal.fire({
      title: "Creando recibo",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey:false,
      allowOutsideClick:false,
      allowEnterKey:false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
    this._AbonoService.isLoad = true

    this._AbonoService.updateAbono(this.AbonoId,abono).subscribe(data => {
      this._AbonoService.isLoad = false
      // console.log(ProductoResponse);
      Swal.fire({
        text: "Abono modificado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      })
    },(HttpErrorResponse:HttpErrorResponse)=>{
      this._AbonoService.isLoad = false
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
