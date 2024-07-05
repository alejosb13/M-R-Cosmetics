import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationService } from '@app/shared/services/communication.service';
import { ClientesService } from 'app/shared/services/clientes.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Cliente } from '../../../shared/models/Cliente.model';

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html',
  styleUrls: ['./cliente-editar.component.css']
})
export class ClienteEditarComponent implements OnInit {
  
 
  clienteId:number
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    route: ActivatedRoute,
    private _ClientesService: ClientesService,
    // private fb: FormBuilder,
    // private _FrecuenciaService: FrecuenciaService,
    private _HelpersService: HelpersService,
    
  ) { 
    this.clienteId = Number(route.snapshot.params.id);
    
  }

  ngOnInit(): void {
    this.themeSubscription = this._CommunicationService
    .getTheme()
    .subscribe((color: string) => {
      this.themeSite = color === "black" ? "dark-mode" : "light-mode";
    });
  }
  
  ClientValuesForm(cliente:Cliente){
    Swal.mixin({
      customClass: {
        container: this.themeSite, // Clase para el modo oscuro
      },
    }).fire({
      title: "Editando cliente",
      text: "Esto puede demorar un momento.",
      timerProgressBar: true,
      allowEscapeKey:false,
      allowOutsideClick:false,
      allowEnterKey:false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
    
    this._ClientesService.IsLoad = true;
    this._ClientesService.updateCliente(this.clienteId,cliente).subscribe(data =>{
      this._ClientesService.IsLoad = false;
      // console.log(data);
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        text: "Cliente modificado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) window.location.reload()
      })
    },(HttpErrorResponse :HttpErrorResponse)=>{
      this._ClientesService.IsLoad = false;
      // console.log(HttpErrorResponse );
      let error:string =  this._HelpersService.errorResponse(HttpErrorResponse )

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
