import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Usuario } from 'app/shared/models/Usuario.model';
import { HelpersService } from 'app/shared/services/helpers.service';
import { LogisticaService } from 'app/shared/services/logistica.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import { environment } from 'environments/environment';
type Recuperacion = {
  facturasTotal: number,
  abonosTotal: number,
  abonosTotalLastMount: number,
  recuperacionPorcentaje: number,
  recuperacionTotal: number,
  user_id: number,
  user: Usuario
}
 

@Component({
  selector: 'app-recuperacion85',
  templateUrl: './recuperacion85.component.html',
  styleUrls: ['./recuperacion85.component.css']
})
export class Recuperacion85Component implements OnInit {
  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;

  isLoad:boolean = false 
  Data:Recuperacion[]


  constructor(
    private _TablasService:TablasService,
    private _AuthService:AuthService,
    private _LogisticaService: LogisticaService,
    private NgbModal: NgbModal,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService,
  ) { }

  ngOnInit(): void {
    this.isLoad =true
    this._LogisticaService.getRecuperacion({userId:26}).subscribe((recuperacion) => {
      console.log(recuperacion);
      // this.recuperacionPorcentaje = recuperacion.recuperacionPorcentaje;
      // this.total = data.length
      
      this.Data = recuperacion
      this._TablasService.datosTablaStorage = recuperacion
      this._TablasService.total = 0
      this._TablasService.busqueda = ""
      
      
      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })

  }

  BuscarValor(){
    let camposPorFiltrar:any[] = [
      ['user_id'],
      ['user',"apellido"],
      ['user',"apellido"],

      // ['user','name'],
      // ['user','apellido'],
    ];

    this._TablasService.buscarEnCampos(this.Data,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Data]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }


}
