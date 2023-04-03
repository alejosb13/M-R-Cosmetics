import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/login/service/auth.service';
import { ReciboHistorial } from 'app/shared/models/ReciboHistorial.model';
import { Usuario } from 'app/shared/models/Usuario.model';
import { HelpersService } from 'app/shared/services/helpers.service';
import { ReciboService } from 'app/shared/services/recibo.service';
import { TablasService } from 'app/shared/services/tablas.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import { environment } from 'environments/environment';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recibos-credito-list',
  templateUrl: './recibos-credito-list.component.html',
  styleUrls: ['./recibos-credito-list.component.css']
})
export class RecibosCreditoListComponent implements OnInit {

  page = 1;
  pageSize = environment.PageSize;
  collectionSize = 0;
  Recibos: ReciboHistorial[];
  isLoad:boolean
  isAdmin:boolean
  isSupervisor:boolean

  filtros: any = {};
  dateIni: string;
  dateFin: string;

  allDates:boolean = true

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  USersNames:string[] = []
  userId: number;
  userIdString: string;
  userStore: Usuario[];

  @ViewChild('instanceRecibo', {static: true}) instanceRecibo: NgbTypeahead;
  focusRecibo$ = new Subject<string>();
  clickRecibo$ = new Subject<string>();
  ReciboNames:string[] = []
  ReciboId: number;
  ReciboString: string;


  constructor(
    private _ReciboService:ReciboService,
    private _TablasService:TablasService,
    private _AuthService:AuthService,
    private NgbModal: NgbModal,
    private _UsuariosService: UsuariosService,
    private _HelpersService: HelpersService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin()
    this.isSupervisor = this._AuthService.isSupervisor()

    this.getUsers()
    this.asignarValores()
    this.setCurrentDate()
  }


  asignarValores(filtros:any= {estado:1}){
    this.isLoad = true
    console.log(filtros);

    this._ReciboService.getReciboHistorialCredito(filtros)
    .pipe(
      map((recibos)=>{
        // console.log(this.userId);
        
        if (this.isAdmin || this.isSupervisor) return recibos;

        return recibos.filter((recibo) => recibo.recibo.user_id == this.userId);
        
      })
    )
    .subscribe((recibos:ReciboHistorial[])=> {

      if(!filtros.hasOwnProperty('filtrarRecivosList')){
        this.ReciboNames = recibos.map(recibos => `${ recibos.numero } - ${ recibos.recibo.user.name } ${ recibos.recibo.user.apellido }`)
      }

      // console.log(recibos);
      this.Recibos = [...recibos]
      this._TablasService.datosTablaStorage = [...recibos]
      this._TablasService.total = recibos.length
      this._TablasService.busqueda = ""

      this.refreshCountries()
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    })
  }

  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Recibos]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  BuscarValor(){
    let camposPorFiltrar:any[] = [
      ['numero'],
      ['factura_historial_id'],
      ['factura_historial','precio'],
      ['factura_historial','cliente','nombreCompleto'],
      ['recibo','user','name'],
      ['recibo','user','apellido'],
    ];

    this._TablasService.buscarEnCampos(this.Recibos,camposPorFiltrar)

    if(this._TablasService.busqueda ==""){this.refreshCountries()}

  }

  openFiltros(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  getUsers(){
    this._UsuariosService.getUsuario().subscribe((usuarios:Usuario[]) => {
      this.userStore = usuarios
      this.USersNames = usuarios.map(usuario => `${ usuario.id } - ${ usuario.name } ${ usuario.apellido }`)

      // this.resetUser()
    })
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    // const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$).pipe(
      map(term => (term === '' ? [...this.USersNames]
        : [...this.USersNames].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  searchRecibo: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    // const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focusRecibo$;

    return merge(debouncedText$, inputFocus$).pipe(
      map(term => (term === '' ? [...this.ReciboNames]
        : [...this.ReciboNames].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  dataChangedList(element:string,name:string) {
    // console.log(element);
    if(element.includes("-")){
      let split:string[] = element.split("-")
      let id = Number(split[0].trim())

      console.log("IdUsuario",id);
      if(name == "user"){
        this.userId = id
      }

      if(name == "recibo"){
        this.ReciboId = id
      }
      // this.userIdString = element
      // console.log(this.cliente);


    }
  }

  setCurrentDate() {
    let current    = this._HelpersService.changeformatDate(this._HelpersService.currentDay(),'MM/DD/YYYY',"YYYY-MM-DD")
    let month      = this._HelpersService.changeformatDate(this._HelpersService.currentDay(),'MM/DD/YYYY',"MM")
    let year       = this._HelpersService.changeformatDate(this._HelpersService.currentDay(),'MM/DD/YYYY',"YYYY")
    let rangoMonth = this._HelpersService.InicioYFinDeMes(current)

    this.dateIni = `${year}-${month}-01`;
    this.dateFin = `${year}-${month}-${rangoMonth.ultimoDiaDelMes}`;

    this.filtros = {
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      estado:1
    };
  }


  limpiarFiltros() {
    // this.setCurrentDate();
    // this.tipoVenta = 1
    // this.status_pagado = 0 // por pagar

    // if(this.isAdmin) this.resetUser();

    // console.log(this.filtros);

    this.filtros = {
      estado:1 ,
    };

    this.asignarValores(this.filtros)
  }

  aplicarFiltros() {

    if(!this.dateIni || !this.dateFin) this.setCurrentDate() // si las fechas estan vacias, se setean las fechas men actual

    if(this._HelpersService.siUnaFechaEsIgualOAnterior(this.dateIni,this.dateFin)) this.setCurrentDate() // si las fecha inicial es mayor a la final, se setean las fechas mes actual

    this.filtros = {
      dateIni: this.dateIni,
      dateFin: this.dateFin,
      // userId : this.userId,
      numeroRecibo : this.ReciboString ? this.ReciboId : '' ,
      estado:1 ,
      filtrarRecivosList:true,
      allDates:this.allDates
    };

    this.asignarValores(this.filtros)
  }


  eliminar(reciboEliminar:ReciboHistorial){
    // console.log(devolucion);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Al eliminar este recibo se eliminará también el abono asociado a él y no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._ReciboService.deleteReciboHistorialCredito(reciboEliminar.id).subscribe((data)=>{
          this.Recibos = this.Recibos.filter(recibo => recibo.id != reciboEliminar.id)
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
