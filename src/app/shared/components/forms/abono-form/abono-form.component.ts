import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal, NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "app/auth/login/service/auth.service";
import { Abono } from "app/shared/models/Abono.model";
import { Cliente } from "app/shared/models/Cliente.model";
import { Factura } from "app/shared/models/Factura.model";
import { FacturaHistorial } from "app/shared/models/FacturaHistorial.model";
import { TiposMetodos } from "app/shared/models/MetodoPago.model";
import { Recibo } from "app/shared/models/Recibo.model";
import { ReciboHistorial } from "app/shared/models/ReciboHistorial.model";
import { ClientesService } from "app/shared/services/clientes.service";
import { CommunicationService } from "app/shared/services/communication.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { ReciboService } from "app/shared/services/recibo.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { ValidFunctionsValidator } from "app/shared/utils/valid-functions.validator";
import logger from "app/shared/utils/logger";
import {
  merge,
  Observable,
  of,
  OperatorFunction,
  Subject,
  Subscription,
} from "rxjs";
import { switchMap } from "rxjs/operators";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from "rxjs/operators";
import Swal from "sweetalert2";
import { AbonoService } from "../../../services/abono.service";
import { Listado } from "app/shared/services/listados.service";
import { FiltrosList } from "app/shared/models/Listados.model";
import { catchError, tap } from "rxjs/operators";
import { LogisticaService } from "@app/shared/services/logistica.service";

type FacturaReciboHistorial = Abono & ReciboHistorial;

@Component({
  selector: "app-abono-form",
  templateUrl: "./abono-form.component.html",
  styleUrls: ["./abono-form.component.css"],
})
export class AbonoFormComponent implements OnInit {
  @Output() FormsValues: EventEmitter<any> = new EventEmitter();
  // @Input() resetForm:boolean = false;
  // @Output() resetFormChange:EventEmitter<boolean> = new EventEmitter(false);
  TiposMetodos = TiposMetodos;

  model: any;
  searching = false;
  searchFailed = false;
  showDelete = false;

  loadInfo: boolean = false;
  AbonoForm: UntypedFormGroup;
  Abono: FacturaHistorial;

  diferencia: number = 0;
  montoTotal: number = 0;
  restante: number = 0;
  abonado: number = 0;
  facturaId: number = 0;
  bloqueo: boolean = false;
  disableBoton: boolean = false;

  ClientesNames: string[] = [];

  informacionCliente: Factura[] = [];
  LoadingInformacionCliente: boolean = false;

  clienteId: number;
  userId: number;
  recibo: Recibo;
  // numeroRecibo:number = 0

  isAdmin: boolean;
  isSupervisor: boolean;
  roleName: string;

  @ViewChild("instance", { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private fb: UntypedFormBuilder,
    private _AuthService: AuthService,
    private _ClientesService: ClientesService,
    private _ReciboService: ReciboService,
    private _UsuariosService: UsuariosService,
    private _HelpersService: HelpersService,
    public _AbonoService: AbonoService,
    public NgbModal: NgbModal,
    private _CommunicationService: CommunicationService,
    private _LogisticaService: LogisticaService,
    private _Listado: Listado
  ) {}

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();
    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.roleName = String(this._AuthService.dataStorage.user.roleName);

    this.ValidacionBotonAgregar();
    this.getNumeroRecibo();
    this.definirValidaciones();
    // this.getClientes();
    this.getReciboUSer();
    this.changeValues();
    this.changeValueResetForm();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });

    this.changeMetodoPago();
  }

  ValidacionBotonAgregar() {
    this._CommunicationService.BottonAgregarAbonoActive.subscribe(
      (active: boolean) => {
        console.log("disableBoton", active);
        this.disableBoton = active;
      }
    );
    // this._CommunicationService.BottonAgregarAbonoActive.emit(false)
  }

  definirValidaciones() {
    this.AbonoForm = this.fb.group({
      cliente_id: [
        "",
        Validators.compose([
          Validators.required,
          // Validators.maxLength(30),
        ]),
      ],
      precio: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(43),
          // Validators.min(1),
          Validators.pattern(ValidFunctionsValidator.DecimaValidCerolRegEx),
        ]),
      ],
      metodo_pago: ["", Validators.compose([Validators.required])],
      detalle_pago: ["", Validators.compose([Validators.maxLength(120)])],
      autorizacion: ["", Validators.compose([Validators.required])],
      recibo: [
        { value: "", disabled: true },
        Validators.compose([Validators.required]),
      ],
    });
  }

  changeValueResetForm() {
    this._CommunicationService.ReiniciarInsertarAbonoForm.subscribe(
      (resetForm: boolean) => {
        // console.log(resetForm);

        if (resetForm) {
          this.AbonoForm.reset({
            cliente_id: this.formularioControls.cliente_id.value,
          });
          this.resetearValores();

          setTimeout(() => {
            this.getNumeroRecibo();
            this.getClientesObserbable();
          }, 450);

          // this._CommunicationService.ReiniciarInsertarAbonoForm.emit(false)
        }
      }
    );
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
    this.AbonoForm.get("cliente_id").valueChanges.subscribe((value) => {
      if (value?.includes("-")) {
        let clienteId: number = this._HelpersService.obtenerId(value);
        if (clienteId && clienteId != this.clienteId) {
          this.clienteId = clienteId;
          this.getClientesObserbable();
        } else {
          this.resetearValores();
        }
      } else {
        this.resetearValores();
      }
    });

    this.AbonoForm.valueChanges.subscribe((values) => {
      // this.AbonoForm.get("cliente_id").valueChanges.subscribe((value)=>{
      // console.log(this.AbonoForm.get("precio"));
      if (this.restante >= 0) {
        this.diferencia = this.restante - values.precio;

        let maximo: number = this.restante;
        this.AbonoForm.get("precio").setValidators([
          Validators.required,
          Validators.maxLength(43),
          Validators.max(maximo),
          // Validators.min(1),
          // Validators.min(1),
          Validators.pattern(ValidFunctionsValidator.DecimaValidCerolRegEx),
        ]);
      }
    });
  }

  getClientesObserbable() {
    this.LoadingInformacionCliente = false;
    this._ClientesService
      .getClienteCalculoAbono(this.clienteId)
      .subscribe((dataAbono) => {
        logger.log("cliente: ", dataAbono);

        // this.abonado    =  dataAbono.totalAbono
        this.montoTotal = dataAbono.totalFactura;
        this.restante = dataAbono.saldo_restante;
        this.diferencia = this.restante;

        // if(dataAbono.totalAbono >= dataAbono.totalFactura){
        //   this.bloqueo = true
        // }else{
        //   this.bloqueo = false
        // }
      });

    this._Listado
      .getFacturas({
        link: null,
        disablePaginate: "1",
        clienteId: this.clienteId,
        status_pagado: 0,
        estado: 1,
      })
      .subscribe((data: any) => {
        this.LoadingInformacionCliente = true;
        this.informacionCliente = data;
      });

    // this._LogisticaService
    //   .getEstadoCuentaCliente({ cliente_id: this.clienteId })
    //   .subscribe((data) => {
    //     this.LoadingInformacionCliente = true;
    //     this.informacionCliente = data;

    //   });
  }

  generarCalculo(cliente: Cliente) {
    // console.log("[cliente]",cliente);

    if (cliente.facturas.length > 0) {
      let facturas: Factura[] = [...cliente.facturas];
      let abonos: FacturaHistorial[] = [...cliente.factura_historial];

      if (abonos.length > 0) {
        let totalesAbonos: number[] = abonos.map((abono) => abono.precio);
        let totalAbonado: number = totalesAbonos.reduce(
          (previus, current) => current + previus
        );

        this.abonado = totalAbonado;
      }

      let totalesFacturas: number[] = facturas.map((factura) => factura.monto);
      let total: number = totalesFacturas.reduce(
        (previus, current) => current + previus
      );
      this.montoTotal = total;

      this.restante = this.montoTotal - this.abonado;
      this.diferencia = this.restante;

      if (this.abonado >= total) {
        this.bloqueo = true;
      } else {
        this.bloqueo = false;
      }

      // console.log({
      //   "montoTotal: ":this.montoTotal ,
      //   "restante: ":this.restante ,
      //   // "abonado: ":this.abonado ,
      //   "facturaId: ":this.facturaId ,
      //   "bloqueo: ":this.bloqueo ,
      // });
    } else {
      this.resetearValores();
    }
  }

  resetearValores() {
    this.montoTotal = 0;
    this.restante = 0;
    // this.abonado    = 0
    this.facturaId = 0;
    this.bloqueo = false;
    this.diferencia = 0;

    this.LoadingInformacionCliente = false;
  }

  get formularioControls() {
    return this.AbonoForm.controls;
  }

  EnviarFormulario() {
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    console.log(this.AbonoForm.getRawValue());

    if (this.bloqueo) {
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        text: "No puede agregar abonos en una factura que ya esta pagada",
        icon: "warning",
      });
    } else {
      if (this.AbonoForm.valid && this.AbonoForm.get("recibo").value != "") {
        if (!this.AbonoForm.get("cliente_id").value.includes("-")) {
          Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
            text: "El Cliente debe ser seleccionado de la lista desplegable.",
            icon: "warning",
          });
        } else {
          // validar ue tenga recibo
          let abono: any = {} as any;

          abono.cliente_id = this.clienteId;
          abono.user_id = this.userId;
          abono.precio = Number(this.formularioControls.precio.value);

          abono.numero = Number(this.formularioControls.recibo.value);
          abono.recibo_id = Number(this.recibo.id);
          abono.rango = `${this.recibo.min}-${this.recibo.max}`;
          abono.metodo_pago = Number(this.formularioControls.metodo_pago.value);
          abono.detalle_pago = this.formularioControls.detalle_pago.value;
          abono.autorizacion = this.formularioControls.autorizacion.value;

          // console.log(abono);

          this.FormsValues.emit(abono);
          this._CommunicationService.BottonAgregarAbonoActive.emit(true);
        }
      } else {
        // console.log("[form]",this.AbonoForm);
        // console.log(this.AbonoForm.valid);
        // console.log("[recibo]",this.AbonoForm.get("recibo").value);

        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          text: "Complete todos los campos obligatorios",
          icon: "warning",
        });
      }
    }
  }

  getClientes() {
    let listadoFilter: FiltrosList = {
      userId: this.isAdmin || this.isSupervisor ? 0 : this.userId,
      categoriaId: 0, // todas las categorias
      allDates: true, // todos los dias
      roleName: this.roleName,
      link: null,
      disablePaginate: 1,
    };

    this._Listado
      .clienteList(listadoFilter)
      .subscribe((Paginacion: Cliente[]) => {
        this.ClientesNames = Paginacion.map(
          (cliente) => `${cliente.id} - ${cliente.nombreCompleto}`
        );
      });
  }

  getNumeroRecibo() {
    // this._ReciboService.getNumeroRecibo(25).subscribe((data:any) => {
    this._ReciboService.getNumeroRecibo(this.userId).subscribe(
      (data: any) => {
        // console.log("[recibo]: ",data);
        this.AbonoForm.get("recibo").patchValue(data.numero);
      },
      () => {
        Swal.mixin({
          customClass: {
            container: this.themeSite, // Clase para el modo oscuro
          },
        }).fire({
          title: "No posee un numero de recibo.",
          text: "Pide que asignen un talonario de recibos.",
          icon: "error",
        });
      }
    );
  }

  getReciboUSer() {
    this._UsuariosService.getUsuarioById(this.userId).subscribe((usuario) => {
      // this._UsuariosService.getUsuarioById(25).subscribe((usuario) => {
      // console.log("[getReciboUSer]",usuario);

      this.recibo = usuario.recibo;
    });
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === ""
          ? [...this.ClientesNames]
          : [...this.ClientesNames].filter(
              (v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1
            )
        ).slice(0, 10)
      )
    );
  };

  search2: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        let listadoFilter: FiltrosList = {
          userId: this.isAdmin || this.isSupervisor ? 0 : this.userId,
          categoriaId: 0, // todas las categorias
          allDates: true, // todos los dias
          roleName: this.roleName,
          link: null,
          filter: term,
          saldo: true,
        };

        return this._Listado.clienteListCarrito(listadoFilter).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        );
      }),
      map((value) => {
        // console.log(value);

        // this.clientes = [...value];
        let ClientesNames = value.map(
          (cliente) => `${cliente.id} - ${cliente.nombreCompleto}`
        );

        return ClientesNames;
      }),
      tap(() => (this.searching = false))
    );
  };

  eventInputTypeHead(event: { item: string }) {
    // console.log("test ~ event:", event)
    this.showDelete = true;
  }

  changeMetodoPago() {
    this.AbonoForm.get("metodo_pago").valueChanges.subscribe((value) => {
      console.log(value);
      let campo = this.AbonoForm.get("autorizacion");
      campo.patchValue("");

      if (value == 2) {
        campo.setValidators([
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(8),
        ]);
      }

      if (value == 3) {
        campo.setValidators([
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(7),
        ]);
      }

      if (value != 3 && value != 2) {
        campo.setValidators([]);
      }
      campo.updateValueAndValidity();
    });
  }

  eliminarCliente() {
    // this.model = ""
    this.AbonoForm.get("cliente_id").setValue("");
    this.showDelete = false;
  }

  openModal(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-basic-title",
      windowClass: this.themeSite == "dark-mode" ? "dark-modal" : "white-modal",
      size: "xl",
    }).result.then(
      (result) => {},
      (reason) => {}
    );
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
