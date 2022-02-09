import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from 'app/shared/services/clientes.service';
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
    // private _HelpersService: HelpersService,
    
  ) { 
    this.clienteId = Number(route.snapshot.params.id);
    
  }

  ngOnInit(): void {}
  
  ClientValuesForm(cliente:Cliente){
    this._ClientesService.updateCliente(this.clienteId,cliente).subscribe(data =>{
      // console.log(data);
      Swal.fire({
        text: "Cliente modificado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
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
