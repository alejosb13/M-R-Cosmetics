import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationService } from '@app/shared/services/communication.service';
import { Abono } from 'app/shared/models/Abono.model';
import { AbonoService } from 'app/shared/services/abono.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abono-editar',
  templateUrl: './abono-editar.component.html',
  styleUrls: ['./abono-editar.component.css']
})
export class AbonoEditarComponent implements OnInit {
  isLoad:boolean = false
  AbonoId:number= 0
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private _AbonoService: AbonoService,
    private _HelpersService: HelpersService,
    // private router:Router,
    route: ActivatedRoute,
  ) {
    this.AbonoId = Number(route.snapshot.params.id);
  }

  ngOnInit(): void {
    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  FormValuesForm(abono:Abono){
    // console.log(abono);
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
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
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
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
