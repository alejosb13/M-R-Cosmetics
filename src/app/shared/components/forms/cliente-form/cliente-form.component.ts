import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Cliente } from "app/shared/models/Cliente.model";
import { Categoria } from "app/shared/models/Categoria.model";
import { Frecuencia } from "app/shared/models/Frecuencia.model";
import { ClientesService } from "app/shared/services/clientes.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { ValidFunctionsValidator } from "app/shared/utils/valid-functions.validator";
import Swal from "sweetalert2";
import { Usuario } from "app/shared/models/Usuario.model";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { AuthService } from "../../../../auth/login/service/auth.service";
import { customValidator } from "./utils/validaciones";
import { CommunicationService } from "@app/shared/services/communication.service";
import { iif, of, Subscription } from "rxjs";
import { Listado } from "@app/shared/services/listados.service";
import { UbicacionesService } from "@app/shared/services/ubicaciones.service";
import { concatMap } from "rxjs/operators";

@Component({
  selector: "app-cliente-form",
  templateUrl: "./cliente-form.component.html",
  styleUrls: ["./cliente-form.component.css"],
})
export class ClienteFormComponent implements OnInit {
  editarClienteForm: UntypedFormGroup;
  ClienteEstadoForm: UntypedFormGroup;
  Categorias: Categoria[] = [];
  Categoria: Categoria;
  Frecuencias: Frecuencia[];
  Usuarios: Usuario[];
  daysOfWeek: string[];
  loadInfo: boolean = false;

  userId: number;
  isAdmin: boolean = false;
  isSupervisor: boolean = false;

  IsVendedor: boolean = false;
  editar: boolean = false;

  Zonas: any[] = [];
  ZonasFiltradas: any[] = [];
  ZonaFiltrada: number = 0;
  Departamentos: any[] = [];
  DepartamentosFiltrados: any[] = [];
  Municipios: any[] = [];
  MunicipiosFiltrados: any[] = [];

  @ViewChild("diasCobro") diasCobroInput: ElementRef;
  @Input() clienteId?: number;
  @Output() FormsValues = new EventEmitter<Cliente>();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private fb: UntypedFormBuilder,
    public _ClientesService: ClientesService,
    private _UsuariosService: UsuariosService,
    private _HelpersService: HelpersService,
    private _AuthService: AuthService,
    private _Listado: Listado,
    private _UbicacionesService: UbicacionesService
  ) {}

  ngOnInit(): void {
    // console.log(this.Categorias);
    this.getDepartamentos();
    this.getZona();
    this.getMunicipios();

    this._Listado
      .CategoriaList({
        estado: 1,
        disablePaginate: 1,
      })
      .subscribe((data: Categoria[]) => {
        this.Categorias = [...data];
        this.Categoria = data.find((categoria) => categoria.id == 3);

        this.setearData();
      });
    // this._FrecuenciaService.getFrecuencia().subscribe((data:Frecuencia[]) => this.Frecuencias = [...data]);

    this.daysOfWeek = this._HelpersService.DaysOfTheWeek;

    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();

    this.definirValidaciones();
    this.definirValidacionesEstado();

    this.setFormValues();

    this.isClienteEditando();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });

    this.validarUbicaciones();
  }

  isClienteEditando() {
    const IsVendedor = !this.isAdmin && !this.isSupervisor;
    const editar = !!this.clienteId;
    console.log([IsVendedor, editar]);

    if (IsVendedor && editar) {
      this.ClienteEstadoForm.get("estado").disable();
    }

    this.IsVendedor = IsVendedor;
    this.editar = editar;
  }

  definirValidaciones() {
    this.editarClienteForm = this.fb.group({
      categoria_id: ["", Validators.compose([Validators.required])],
      // frecuencia_id: [
      //   '',
      //   Validators.compose([
      //     Validators.required,
      //     // Validators.min(2000),
      //     // Validators.max(this.anioActual),

      //   ]),
      // ],
      user_id: [
        "",
        Validators.compose([
          // Validators.min(2000),
          // Validators.max(this.anioActual),
        ]),
      ],
      nombreCompleto: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(80),
          Validators.minLength(3),
        ]),
      ],
      nombreEmpresa: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(80),
          Validators.minLength(3),
        ]),
      ],
      cedula: [
        "",
        Validators.compose([
          // Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          Validators.minLength(14),
          customValidator(),
        ]),
      ],
      celular: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          Validators.maxLength(8),
          Validators.minLength(8),

          // Validators.maxLength(12),
        ]),
      ],
      telefono: [
        "",
        Validators.compose([
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          Validators.maxLength(8),
          Validators.minLength(8),
          // Validators.minLength(10),
        ]),
      ],
      direccion_casa: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(180)]),
      ],
      direccion_negocio: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(180)]),
      ],
      dias_cobro: this.fb.array([], [Validators.required]),
      zona_id: [
        // { value: 0, disabled: true },
        0,
        Validators.compose([
          Validators.required,
          this.diferenteDeCero(),
          Validators.maxLength(180),
        ]),
      ],
      departamento_id: [
        0,
        Validators.compose([
          Validators.required,
          this.diferenteDeCero(),
          Validators.maxLength(180),
        ]),
      ],
      municipio_id: [
        0,
        Validators.compose([
          Validators.required,
          this.diferenteDeCero(),
          Validators.maxLength(180),
        ]),
      ],
    });
  }

  setearData() {
    if (!(this.isAdmin || this.isSupervisor)) {
      this.editarClienteForm.patchValue({
        user_id: this._AuthService.dataStorage.user.userId,
        categoria_id: this.Categoria.id,
      });
    }
  }

  definirValidacionesEstado() {
    this.ClienteEstadoForm = this.fb.group({
      estado: [1, Validators.compose([Validators.required])],
    });
  }

  setEstadoValues(estado: number) {
    this.ClienteEstadoForm.patchValue({
      estado: estado,
    });
  }

  buscarValorZonaUsuario(usuario: number) {
    console.log(usuario);

    return this.Usuarios.find((user) => user.id == usuario);
  }

  setFormValues() {
    this.loadInfo = true;

    this._UsuariosService
      .getUsuario()
      .pipe(
        concatMap((usaurios: Usuario[]) => {
          this.Usuarios = [...usaurios];
          return iif(
            () => !!this.clienteId, // Condición: si `clienteId` es true
            this._ClientesService.getClienteById(this.clienteId), // Observable a ejecutar si es true
            of(null) // Observable vacío si es false
          );
        })
      )
      .subscribe((cliente: Cliente | null) => {
        // Verificamos si `cliente` es null para no continuar con la lógica

        let userId = !cliente ? this.userId : cliente.user_id; // cuando cliente es false quiere decir que esta agregando cliente
        let dataUsuario = this.buscarValorZonaUsuario(userId);
        if (dataUsuario) {
          let zonasId = dataUsuario.zonas.map((zona) => zona.id);
          this.ZonasFiltradas = this.Zonas.filter((zona) =>
            zonasId.includes(zona.id)
          );
        }

        if (!cliente) {
          this.loadInfo = false;
          return;
        }

        this.editarClienteForm.patchValue({
          categoria_id: cliente.categoria_id,
          // "frecuencia_id" : cliente.frecuencia_id,
          user_id: cliente.user_id,
          nombreCompleto: cliente.nombreCompleto,
          nombreEmpresa: cliente.nombreEmpresa,
          cedula: cliente.cedula,
          celular: cliente.celular,
          telefono: cliente.telefono,
          direccion_casa: cliente.direccion_casa,
          direccion_negocio: cliente.direccion_negocio,
          // zona_id: datausuario.zona_id ? datausuario.zona_id : 0,
          // zona_id:0,
          // departamento_id: cliente.departamento_id
          //   ? cliente.departamento_id
          //   : 0,
          // municipio_id: cliente.municipio_id ? cliente.municipio_id : 0,
          // "dias_cobro" : [],
          // "estado" : cliente.estado,
        });

        if (cliente.zona_id && cliente.zona_id != 0) {
          this.editarClienteForm.patchValue({
            zona_id: cliente.zona_id,
            departamento_id: cliente.departamento_id,
            municipio_id: cliente.municipio_id,
          });
        }

        this.setEstadoValues(cliente.estado);

        let dias_cobro = cliente.dias_cobro
          .split(",")
          .map((dia) =>
            this._HelpersService.DaysOfTheWeek.indexOf(dia.toLowerCase())
          ); // obtengo el dia de la semana en numero
        // console.log(dias_cobro);

        const formArray: UntypedFormArray = this.editarClienteForm.get(
          "dias_cobro"
        ) as UntypedFormArray; // obtengo el campo del formulario angular
        dias_cobro.map((numberDay: number) =>
          formArray.push(new UntypedFormControl(numberDay))
        ); // ingreso el valor de los dias en el formulario angular

        let arrayInput = Array.from(
          this.diasCobroInput.nativeElement.querySelectorAll(
            'input[type="checkbox"]'
          )
        );
        arrayInput.map((input: any, i: number) => {
          if (dias_cobro.some((numberDay) => numberDay == input.value)) {
            input.setAttribute("checked", true);
          }
        });

        this.loadInfo = false;
      });
  }

  changeValueFormArray({ name, value, checked }) {
    // console.log({ name, value, checked });

    const formArray: UntypedFormArray = this.editarClienteForm.get(
      name
    ) as UntypedFormArray;

    if (checked) {
      formArray.push(new UntypedFormControl(value));
    } else {
      // console.log(formArray.controls);

      const index = formArray.controls.findIndex((x) => x.value == value);
      // console.log(index);

      // console.log(formArray.controls);
      formArray.removeAt(index);
    }
  }

  get formularioControls() {
    return this.editarClienteForm.controls;
  }

  get formularioStadoControls() {
    return this.ClienteEstadoForm.controls;
  }

  EnviarFormulario() {
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.editarClienteForm.getRawValue());
    // return false
    if (this.editarClienteForm.valid) {
      let cliente = {} as Cliente;
      cliente.nombreCompleto = this.formularioControls.nombreCompleto.value;
      cliente.nombreEmpresa = this.formularioControls.nombreEmpresa.value;
      cliente.user_id = Number(this.formularioControls.user_id.value);
      cliente.categoria_id = Number(this.formularioControls.categoria_id.value);
      cliente.cedula = this.formularioControls.cedula.value;
      cliente.zona_id = this.formularioControls.zona_id.value;
      cliente.departamento_id = this.formularioControls.departamento_id.value;
      cliente.municipio_id = this.formularioControls.municipio_id.value;
      cliente.celular = Number(this.formularioControls.celular.value);
      cliente.dias_cobro = this._HelpersService.daysOfTheWeekToString(
        this.formularioControls.dias_cobro.value
      );
      cliente.direccion_casa = this.formularioControls.direccion_casa.value;
      cliente.direccion_negocio =
        this.formularioControls.direccion_negocio.value;
      cliente.estado = Number(this.formularioStadoControls.estado.value);
      // cliente.frecuencia_id     = Number(this.formularioControls.frecuencia_id.value)
      cliente.telefono = Number(this.formularioControls.telefono.value);
      console.log("[Cliente]", cliente);

      this.FormsValues.emit(cliente);
    } else {
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

  getDepartamentos() {
    this._UbicacionesService
      .departamentos({
        estado: 1,
        disablePaginate: 1,
      })
      .subscribe((data: any) => {
        this.Departamentos = data;
      });
  }

  getZona() {
    this._UbicacionesService
      .zonas({
        estado: 1,
        disablePaginate: 1,
      })
      .subscribe((data: any) => {
        this.Zonas = data;
      });
  }

  getMunicipios() {
    this._UbicacionesService
      .municipios({
        estado: 1,
        disablePaginate: 1,
      })
      .subscribe((data: any) => {
        this.Municipios = data;
      });
  }

  validarUbicaciones() {
    this.editarClienteForm
      .get("zona_id")
      .valueChanges.subscribe((zona_id: number) => {
        console.log("zona_id", zona_id);
        this.DepartamentosFiltrados = this.Departamentos.filter(
          (dep) => dep.zona.id == zona_id
        );
        this.editarClienteForm.patchValue({ departamento_id: 0 });
      });
    this.editarClienteForm
      .get("departamento_id")
      .valueChanges.subscribe((departamento_id: number) => {
        console.log("departamento_id", departamento_id);
        this.MunicipiosFiltrados = this.Municipios.filter(
          (muni) => muni.departamento.id == departamento_id
        );
        this.editarClienteForm.patchValue({ municipio_id: 0 });
      });
  }

  diferenteDeCero() {
    return (control: any) => {
      const value = control.value;
      return value !== 0 ? null : { diferenteDeCero: true };
    };
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
