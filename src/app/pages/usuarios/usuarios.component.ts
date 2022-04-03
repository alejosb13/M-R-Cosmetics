import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'app/auth/login/models/auth.model';
import { Recibo } from 'app/shared/models/Recibo.model';
import { Usuario } from 'app/shared/models/Usuario.model';
import { HelpersService } from 'app/shared/services/helpers.service';
import { ReciboService } from 'app/shared/services/recibo.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Usuarios: Usuario[];

  recibo:Recibo
  idUsuario:number

  isLoad:boolean
  Vendedor = Role.Vendedor

  constructor(
    private _UsuariosService:UsuariosService,
    private _TablasService:TablasService,
    private _ReciboService:ReciboService,
    private _HelpersService:HelpersService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true

    this._UsuariosService.getUsuario().subscribe((usuarios:Usuario[])=> {
      console.log(usuarios);

      this.Usuarios = [...usuarios]
      this._TablasService.datosTablaStorage = [...usuarios]
      this._TablasService.total = usuarios.length
      this._TablasService.busqueda = ""


      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Usuarios]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    this._TablasService.buscar(this.Usuarios)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }



  eliminar({id}:Usuario){
    // console.log(id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este usuario se eliminará y no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._UsuariosService.deleteUsuario(id).subscribe((data)=>{
          this.Usuarios = this.Usuarios.filter(Usuario => Usuario.id != id)
          this.refreshCountries()

          Swal.fire({
            text: data[0],
            icon: 'success',
          })
        })
      }
    })
  }

  modificarRangoRecibo(content:any,recibo:Recibo,userId:number){
    this.recibo    = recibo
    this.idUsuario = userId
    // console.log(this.recibo);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {}, (reason) => {});
  }

  agregarRangoRecibo(content:any,userId:number){
    this.recibo = undefined
    this.idUsuario = userId

    // console.log(this.recibo);

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {}, (reason) => {});

  }

  FormsValues(recibo:Recibo){
    console.log("[reciboForm]",recibo);

    recibo.user_id = this.idUsuario
    if(this.recibo){
      this._ReciboService.updateRecibo(this.recibo.id,recibo).subscribe(userResp =>{
        // console.log(data);
        this._TablasService.datosTablaStorage = this.Usuarios.map((usuario)=>{
          if(usuario.id == userResp.user_id) usuario.recibo = userResp

          return usuario
        })

        Swal.fire({
          text: "Recibo modificado con exito",
          icon: 'success',
        }).then((result) => {
          // if (result.isConfirmed) window.location.reload()
        })
      },(HttpErrorResponse :HttpErrorResponse)=>{
        let error:string =  HttpErrorResponse.error[0]

        Swal.fire({
          title: "Error",
          html: error,
          icon: 'error',
        })
      })
    }else{
      this._ReciboService.insertRecibo(recibo).subscribe(userResp =>{
        this._TablasService.datosTablaStorage = this.Usuarios.map((usuario)=>{
          if(usuario.id == userResp.user_id) usuario.recibo = userResp

          return usuario
        })
        Swal.fire({
          text: "Recibo agregado con exito",
          icon: 'success',
        }).then((result) => {
          // if (result.isConfirmed) window.location.reload()
        })
      },(HttpErrorResponse :HttpErrorResponse)=>{
        // let error:string =  HttpErrorResponse.error[0]
        let error:string =  this._HelpersService.errorResponse(HttpErrorResponse )

        Swal.fire({
          title: "Error",
          html: error,
          icon: 'error',
        })
      })
    }

  }

}
