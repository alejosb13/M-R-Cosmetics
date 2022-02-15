import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario, UsuarioServ } from 'app/shared/models/Usuario.model';
import { HelpersService } from 'app/shared/services/helpers.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-editar',
  templateUrl: './usuarios-editar.component.html',
  styleUrls: ['./usuarios-editar.component.css']
})
export class UsuariosEditarComponent implements OnInit {
  UsuarioId:number
  
  constructor(
    route: ActivatedRoute,
    private _UsuariosService: UsuariosService,
    // private fb: FormBuilder,
    // private _FrecuenciaService: FrecuenciaService,
    private _HelpersService: HelpersService,
    
  ) { 
    this.UsuarioId = Number(route.snapshot.params.id);
  }

  ngOnInit(): void {}
  
  ValuesForm(usuario:UsuarioServ){
    this._UsuariosService.updateUsuario(this.UsuarioId,usuario).subscribe(data =>{
      // console.log(data);
      Swal.fire({
        text: "Usuario modificado con exito",
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) window.location.reload()
      })
    },(HttpErrorResponse :HttpErrorResponse)=>{
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
