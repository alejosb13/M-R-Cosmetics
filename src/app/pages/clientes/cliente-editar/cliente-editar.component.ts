import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'app/shared/services/clientes.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';
import { Cliente } from '../../../shared/models/Cliente.model';

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html',
  styleUrls: ['./cliente-editar.component.css']
})
export class ClienteEditarComponent implements OnInit {
  
 
  clienteId:number
  constructor(
    route: ActivatedRoute,
    private _ClientesService: ClientesService,
    // private fb: FormBuilder,
    // private _FrecuenciaService: FrecuenciaService,
    private _HelpersService: HelpersService,
    
  ) { 
    this.clienteId = Number(route.snapshot.params.id);
    
  }

  ngOnInit(): void {}
  
  ClientValuesForm(cliente:Cliente){
    Swal.fire({
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
      Swal.fire({
        text: "Cliente modificado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) window.location.reload()
      })
    },(HttpErrorResponse :HttpErrorResponse)=>{
      this._ClientesService.IsLoad = false;
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
