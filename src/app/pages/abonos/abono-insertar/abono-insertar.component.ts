import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Abono } from 'app/shared/models/Abono.model';
import { ReciboHistorial } from 'app/shared/models/ReciboHistorial.model';
import { AbonoService } from 'app/shared/services/abono.service';
import { CommunicationService } from 'app/shared/services/communication.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';

type FacturaReciboHistorial = Abono & ReciboHistorial

@Component({
  selector: 'app-abono-insertar',
  templateUrl: './abono-insertar.component.html',
  styleUrls: ['./abono-insertar.component.css']
})
export class AbonoInsertarComponent implements OnInit {

  constructor(
    private _AbonoService: AbonoService,
    private _HelpersService: HelpersService,
    private router:Router,
    private _CommunicationService:CommunicationService,

  ) { }

  ngOnInit(): void {}

  FormValuesForm(abono:any){
    console.log(abono);

    this._AbonoService.insertAbono(abono).subscribe(data =>{
      console.log(data);
      Swal.fire({
        text: "Abono insertado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          this._CommunicationService.ReiniciarInsertarAbonoForm.emit(true)
          // this.router.navigate([`abono/editar/${data.id}`]);
          // this.router.navigate([`abono`]);
        }
      })
      this._CommunicationService.BottonAgregarAbonoActive.emit(false)
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
