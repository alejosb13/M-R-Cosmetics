import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Abono } from 'app/shared/models/Abono.model';
import { Cliente } from 'app/shared/models/Cliente.model';
import { Factura } from 'app/shared/models/Factura.model';
import { FacturaHistorial } from 'app/shared/models/FacturaHistorial.model';
import { Recibo } from 'app/shared/models/Recibo.model';
import { ReciboHistorial } from 'app/shared/models/ReciboHistorial.model';
import { ClientesService } from 'app/shared/services/clientes.service';
import { CommunicationService } from 'app/shared/services/communication.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import { ReciboService } from 'app/shared/services/recibo.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type FacturaReciboHistorial = Abono & ReciboHistorial

@Component({
  selector: 'app-abono-form',
  templateUrl: './abono-form.component.html',
  styleUrls: ['./abono-form.component.css']
})
export class AbonoFormComponent implements OnInit {
  @Output() FormsValues:EventEmitter<any> = new EventEmitter();
  // @Input() resetForm:boolean = false;
  // @Output() resetFormChange:EventEmitter<boolean> = new EventEmitter(false);

  loadInfo:boolean = false;
  AbonoForm:FormGroup
  Abono:FacturaHistorial

  diferencia:number = 0
  montoTotal:number = 0
  restante:number   = 0
  abonado:number    = 0
  facturaId:number  = 0
  bloqueo:boolean   = false

  ClientesNames:string[] = []

  userId:number
  clienteId:number
  recibo:Recibo
  // numeroRecibo:number = 0

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private _AuthService:AuthService,
    private _ClientesService:ClientesService,
    private _ReciboService:ReciboService,
    private _UsuariosService:UsuariosService,
    private _HelpersService:HelpersService,
    private _CommunicationService:CommunicationService,
  ) {
    this.userId = Number(this._AuthService.dataStorage.user.userId)
  }

  ngOnInit(): void {
    this.getNumeroRecibo()
    this.definirValidaciones()
    this.getClientes()
    this.getReciboUSer()
    this.changeValues()
    this.changeValueResetForm()
  }

  definirValidaciones(){
    this.AbonoForm = this.fb.group(
      {
        cliente_id: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(30),
          ]),
        ],
        precio: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(43),
            Validators.min(1),
            Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          ]),
        ],
        recibo: [
          {value:"",disabled:true},
          Validators.compose([
            Validators.required,

          ]),
        ],
      }
    );
  }

  changeValueResetForm() {
    this._CommunicationService.ReiniciarInsertarAbonoForm.subscribe((resetForm:boolean)=>{
      console.log(resetForm);

      if(resetForm){
        this.AbonoForm.reset();
        this.resetearValores()
        this.getNumeroRecibo()

        this._CommunicationService.ReiniciarInsertarAbonoForm.emit(false)

      }

    })


  }
  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes);
  //   console.log(this.resetForm);
  //   if(this.resetForm){
  //     this.AbonoForm.reset();
  //     this.resetearValores()
  //     this.getNumeroRecibo()

  //     this.resetFormChange.emit(false)
  //     // this.resetForm = false
  //   }

  // }

  changeValues() {
    this.AbonoForm.get("cliente_id").valueChanges.subscribe((value)=>{
      if(value?.includes("-") ){
        let clienteId:number = this._HelpersService.obtenerId(value)
        if(clienteId){
          this._ClientesService.getClienteById(clienteId).subscribe((cliente)=>{
            // console.log("cliente: ",cliente);
            this.clienteId = cliente.id
            this.generarCalculo(cliente)
          })
        }else{ this.resetearValores()}
      }else{ this.resetearValores()}
    })

    this.AbonoForm.valueChanges.subscribe((values)=>{
    // this.AbonoForm.get("cliente_id").valueChanges.subscribe((value)=>{
      console.log(values);
      if(this.restante >0){
        this.diferencia = this.restante - values.precio

        let maximo:number = this.restante
        this.AbonoForm.get("precio").setValidators([
          Validators.required,
          Validators.maxLength(43),
          Validators.max(maximo),
          Validators.min(1),
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
        ])
      }

    })
  }

  generarCalculo(cliente:Cliente){
    console.log("[cliente]",cliente);

    if(cliente.facturas.length > 0){
      let facturas:Factura[] = [...cliente.facturas]
      let abonos:FacturaHistorial[] =  [...cliente.factura_historial]

      if(abonos.length > 0){
        let totalesAbonos:number[] = abonos.map(abono => abono.precio)
        let totalAbonado:number = totalesAbonos.reduce((previus,current)=> current + previus)

        this.abonado = totalAbonado
      }

      let totalesFacturas:number[] = facturas.map(factura => factura.monto)
      let total:number = totalesFacturas.reduce((previus,current)=> current + previus)
      this.montoTotal = total

      this.restante =  this.montoTotal - this.abonado
      this.diferencia =  this.restante

      if(this.abonado >= total){
        this.bloqueo = true
      }else{
        this.bloqueo = false
      }

      console.log({
        "montoTotal: ":this.montoTotal ,
        "restante: ":this.restante ,
        "abonado: ":this.abonado ,
        "facturaId: ":this.facturaId ,
        "bloqueo: ":this.bloqueo ,
      });

    }else{
      this.resetearValores()
    }
  }

  resetearValores(){
    this.montoTotal = 0
    this.restante   = 0
    this.abonado    = 0
    this.facturaId  = 0
    this.bloqueo    = false
    this.diferencia = 0
  }

  get formularioControls(){
    return this.AbonoForm.controls
  }


  EnviarFormulario(){
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.AbonoForm.getRawValue());

    if(this.bloqueo){
      Swal.fire({
        text: "No puede agregar abonos en una factura que ya esta pagada",
        icon: 'warning',
      })
    }else{
      if(this.AbonoForm.valid && this.AbonoForm.get("recibo").value){

        if(!this.AbonoForm.get("cliente_id").value.includes("-")){
          Swal.fire({
            text: "El Cliente debe ser seleccionado de la lista desplegable.",
            icon: 'warning',
          })

        }else{
          // validar ue tenga recibo
          let abono:FacturaReciboHistorial  = {} as FacturaReciboHistorial

          abono.cliente_id  = this.clienteId
          abono.user_id     = this.userId
          abono.precio      = Number(this.formularioControls.precio.value)

          abono.numero      = Number(this.formularioControls.recibo.value)
          abono.recibo_id   = Number(this.recibo.id)
          abono.rango       = `${this.recibo.min}-${this.recibo.max}`


          this.FormsValues.emit(abono)
        }


      }else{
        Swal.fire({
          text: "Complete todos los campos obligatorios",
          icon: 'warning',
        })
      }
    }
  }

  getClientes(){
    this._ClientesService.getCliente().subscribe((clientes:Cliente[]) => {
      this.ClientesNames = clientes.map(cliente => `${ cliente.id } - ${ cliente.nombreCompleto }`)
    })
  }

  getNumeroRecibo(){
    this._ReciboService.getNumeroRecibo(25).subscribe((data:any) => {
    // this._ReciboService.getNumeroRecibo(this.userId).subscribe((data:any) => {
      console.log("[recibo]: ",data);
      this.AbonoForm.get("recibo").patchValue(data.numero)

    },()=>{
      Swal.fire({
        title: "No posee un numero de recibo.",
        text: "Pide que asignen un talonario de recibos.",
        icon: 'error',
      })
    })
  }

  getReciboUSer(){
    // this._UsuariosService.getUsuarioById(this.userId).subscribe((usuario) => {
    this._UsuariosService.getUsuarioById(25).subscribe((usuario) => {
      console.log("[getReciboUSer]",usuario);

      this.recibo = usuario.recibo

    })
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? [...this.ClientesNames]
        : [...this.ClientesNames].filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }


}
