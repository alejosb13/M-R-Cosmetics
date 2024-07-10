import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Abono } from 'app/shared/models/Abono.model';
import { ReciboHistorial } from 'app/shared/models/ReciboHistorial.model';
import { AbonoService } from 'app/shared/services/abono.service';
import { CommunicationService } from 'app/shared/services/communication.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

type FacturaReciboHistorial = Abono & ReciboHistorial

@Component({
  selector: 'app-abono-insertar',
  templateUrl: './abono-insertar.component.html',
  styleUrls: ['./abono-insertar.component.css']
})
export class AbonoInsertarComponent implements OnInit {

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _AbonoService: AbonoService,
    private _HelpersService: HelpersService,
    private router:Router,
    private _CommunicationService:CommunicationService,

  ) { }

  ngOnInit(): void {
    this.themeSubscription = this._CommunicationService
    .getTheme()
    .subscribe((color: string) => {
      this.themeSite = color === "black" ? "dark-mode" : "light-mode";
    });
  }

  FormValuesForm(abono:any){
    // console.log(abono);

    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Creando el recibo",
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

    this._AbonoService.insertAbono(abono).subscribe(data =>{
      this._AbonoService.isLoad = false

      // console.log(data);
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
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
      this._AbonoService.isLoad = false

      let error:string =  this._HelpersService.errorResponse(HttpErrorResponse)
      console.log(error);

      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        title: "Error",
        html: error,
        icon: 'error',
      })
    })
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
