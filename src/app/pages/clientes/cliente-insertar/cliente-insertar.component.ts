import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'app/shared/models/Cliente.model';
import { ClientesService } from 'app/shared/services/clientes.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-insertar',
  templateUrl: './cliente-insertar.component.html',
  styleUrls: ['./cliente-insertar.component.css']
})
export class ClienteInsertarComponent implements OnInit {

  constructor(
    private _ClientesService: ClientesService,
    private router:Router,
    private _HelpersService:HelpersService
  ) { }

  ngOnInit(): void {
  }

  ClientValuesForm(cliente:Cliente){
    this._ClientesService.IsLoad = true;
    this._ClientesService.insertCliente(cliente).subscribe(ClienteResponse =>{
      this._ClientesService.IsLoad = false;
      console.log(ClienteResponse);
      Swal.fire({
        text: "Cliente Insertado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate([`cliente/editar/${ClienteResponse.id}`]);
        }
      })
    },(HttpErrorResponse:HttpErrorResponse)=>{
      this._ClientesService.IsLoad = false;
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
