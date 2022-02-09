import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'app/shared/models/Cliente.model';
import { ClientesService } from 'app/shared/services/clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-insertar',
  templateUrl: './cliente-insertar.component.html',
  styleUrls: ['./cliente-insertar.component.css']
})
export class ClienteInsertarComponent implements OnInit {

  constructor(
    private _ClientesService: ClientesService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  ClientValuesForm(cliente:Cliente){
    this._ClientesService.insertCliente(cliente).subscribe(ClienteResponse =>{
      console.log(ClienteResponse);
      Swal.fire({
        text: "Cliente Insertado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate([`cliente/editar/${ClienteResponse.id}`]);
        }
      })
    },(error)=>{
      // console.log(error);
      Swal.fire({
        text: "Error",
        icon: 'error',
      })
    })
  }
}
