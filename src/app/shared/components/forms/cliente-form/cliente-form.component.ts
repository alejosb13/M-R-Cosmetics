import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'app/shared/models/Cliente.model';
import { Categoria } from 'app/shared/models/Categoria.model';
import { Frecuencia } from 'app/shared/models/Frecuencia.model';
import { CategoriaService } from 'app/shared/services/categoria.service';
import { ClientesService } from 'app/shared/services/clientes.service';
import { FrecuenciaService } from 'app/shared/services/frecuencia.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';
import { Usuario } from 'app/shared/models/Usuario.model';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import { AuthService } from '../../../../auth/login/service/auth.service';


@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  editarClienteForm: FormGroup;
  ClienteEstadoForm: FormGroup;
  Categorias:Categoria[]
  Categoria:Categoria
  Frecuencias:Frecuencia[]
  Usuarios:Usuario[]
  daysOfWeek:string[]
  loadInfo:boolean = false;

  userId:number ;
  isAdmin:boolean = false;
  isSupervisor:boolean = false;

  @ViewChild('diasCobro') diasCobroInput: ElementRef;
  @Input() clienteId?:number
  @Output() FormsValues = new EventEmitter<Cliente>();

  constructor(
    private fb: FormBuilder,
    private _CategoriaService: CategoriaService,
    public _ClientesService: ClientesService,
    private _FrecuenciaService: FrecuenciaService,
    private _UsuariosService: UsuariosService,
    private _HelpersService: HelpersService,
    private _AuthService: AuthService,

  ) {}

  ngOnInit(): void {
    // console.log(this.Categorias);

    this._CategoriaService.getCategoria().subscribe((data:Categoria[]) => {
      this.Categorias = [...data]
      this.Categoria = data.find(categoria => categoria.id == 3 )

      this.setearData()
    });
    // this._FrecuenciaService.getFrecuencia().subscribe((data:Frecuencia[]) => this.Frecuencias = [...data]);
    this._UsuariosService.getUsuario().subscribe((usaurios:Usuario[]) => this.Usuarios = [...usaurios]);

    this.daysOfWeek = this._HelpersService.DaysOfTheWeek


    this.userId = Number(this._AuthService.dataStorage.user.userId);
    this.isAdmin = this._AuthService.isAdmin();
    this.isSupervisor = this._AuthService.isSupervisor();

    this.definirValidaciones()
    this.definirValidacionesEstado()

    if(this.clienteId) this.setFormValues()
  }

  definirValidaciones(){
    this.editarClienteForm = this.fb.group(
      {
        categoria_id: [
          '',
          Validators.compose([
            Validators.required,

          ]),
        ],
        // frecuencia_id: [
        //   '',
        //   Validators.compose([
        //     Validators.required,
        //     // Validators.min(2000),
        //     // Validators.max(this.anioActual),

        //   ]),
        // ],
        user_id: [
          '',
          Validators.compose([
            // Validators.min(2000),
            // Validators.max(this.anioActual),

          ]),
        ],
        nombreCompleto: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(80),
            Validators.minLength(3),
          ]),
        ],
        nombreEmpresa: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(80),
            Validators.minLength(3),
          ]),
        ],
        cedula: [
          '',
          Validators.compose([
            Validators.required,
            // Validators.pattern(ValidFunctionsValidator.NumberRegEx),
            Validators.maxLength(22),
            // Validators.minLength(14),
          ]),
        ],
        celular: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.NumberRegEx),
            Validators.maxLength(20),
            // Validators.minLength(10),

            // Validators.maxLength(12),
          ]),
        ],
        telefono: [
          '',
          Validators.compose([
            Validators.pattern(ValidFunctionsValidator.NumberRegEx),
            Validators.maxLength(20),
            // Validators.minLength(10),
          ]),
        ],
        direccion_casa: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(180),

          ]),
        ],
        direccion_negocio: [
          '',
          Validators.compose([
            // Validators.required,
            Validators.maxLength(180),
          ]),
        ],
        dias_cobro: this.fb.array(
          [],
          [
            Validators.required
          ]
        )
      }
    );


  }
  
  setearData(){
    if(!(this.isAdmin || this.isSupervisor)){
      this.editarClienteForm.patchValue({
        user_id: this._AuthService.dataStorage.user.userId,
        categoria_id: this.Categoria.id,
      })
    }
  }

  definirValidacionesEstado(){
    this.ClienteEstadoForm = this.fb.group(
      {

        estado: [
          1,
          Validators.compose([
            Validators.required,

          ]),
        ],
      }
    );
  }

  setEstadoValues(estado:number){
    this.ClienteEstadoForm.patchValue({
      "estado" : estado,
    });
  }

  setFormValues(){
    this.loadInfo = true
    this._ClientesService.getClienteById(this.clienteId).subscribe((cliente:Cliente)=>{
      this.editarClienteForm.patchValue({
        "categoria_id" : cliente.categoria_id,
        // "frecuencia_id" : cliente.frecuencia_id,
        "user_id" : cliente.user_id,
        "nombreCompleto" : cliente.nombreCompleto,
        "nombreEmpresa" : cliente.nombreEmpresa,
        "cedula" : cliente.cedula,
        "celular" : cliente.celular,
        "telefono" : cliente.telefono,
        "direccion_casa" : cliente.direccion_casa,
        "direccion_negocio" : cliente.direccion_negocio,
        // "dias_cobro" : [],
        // "estado" : cliente.estado,
      });

      this.setEstadoValues(cliente.estado)

      let dias_cobro = cliente.dias_cobro.split(",").map((dia)=> this._HelpersService.DaysOfTheWeek.indexOf(dia.toLowerCase())) // obtengo el dia de la semana en numero
      // console.log(dias_cobro);

      const formArray: FormArray = this.editarClienteForm.get("dias_cobro") as FormArray; // obtengo el campo del formulario angular
      dias_cobro.map((numberDay:number) => formArray.push(new FormControl(numberDay)) )// ingreso el valor de los dias en el formulario angular

      let arrayInput = Array.from(this.diasCobroInput.nativeElement.querySelectorAll('input[type="checkbox"]'))
      arrayInput.map((input: any, i: number) => {
        if (dias_cobro.some((numberDay) => numberDay == input.value)) {
          input.setAttribute('checked', true)
        }
      })

      this.loadInfo = false
    })
  }

  changeValueFormArray({ name, value, checked }) {
    // console.log({ name, value, checked });
    
    const formArray: FormArray = this.editarClienteForm.get(name) as FormArray;

    if (checked) {
      formArray.push(new FormControl(value));
    } else {
      // console.log(formArray.controls);
      
      const index = formArray.controls.findIndex(x => x.value == value);
      // console.log(index);
      
      // console.log(formArray.controls);
      formArray.removeAt(index);
    }
  }

  get formularioControls(){
    return this.editarClienteForm.controls
  }

  get formularioStadoControls(){
    return this.ClienteEstadoForm.controls
  }


  EnviarFormulario(){
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.editarClienteForm.getRawValue());
    // return false
    if(this.editarClienteForm.valid){
      let cliente = {} as Cliente
      cliente.nombreCompleto    = this.formularioControls.nombreCompleto.value
      cliente.nombreEmpresa     = this.formularioControls.nombreEmpresa.value
      cliente.user_id           = Number(this.formularioControls.user_id.value)
      cliente.categoria_id      = Number(this.formularioControls.categoria_id.value)
      cliente.cedula            = this.formularioControls.cedula.value
      cliente.celular           = Number(this.formularioControls.celular.value)
      cliente.dias_cobro        = this._HelpersService.daysOfTheWeekToString(this.formularioControls.dias_cobro.value)
      cliente.direccion_casa    = this.formularioControls.direccion_casa.value
      cliente.direccion_negocio = this.formularioControls.direccion_negocio.value
      cliente.estado            = Number(this.formularioStadoControls.estado.value)
      // cliente.frecuencia_id     = Number(this.formularioControls.frecuencia_id.value)
      cliente.telefono          = Number(this.formularioControls.telefono.value)
      console.log("[Cliente]",cliente);

      this.FormsValues.emit(cliente)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }

  }
}
