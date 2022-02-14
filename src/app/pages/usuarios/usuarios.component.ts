import { Component, OnInit } from '@angular/core';
import { Usuario } from 'app/shared/models/Usuario.model';
import { TablasService } from 'app/shared/services/tablas.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  page = 1;
  pageSize = 3;
  collectionSize = 0;
  Usuarios: Usuario[];
  isLoad:boolean
  
  constructor(
    private _UsuariosService:UsuariosService,
    private _TablasService:TablasService,
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
      title: '¿Estas seguro?',
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
}
