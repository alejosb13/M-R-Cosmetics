import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'app/shared/models/Role.models';
import { Usuario } from 'app/shared/models/Usuario.model';
import { HelpersService } from 'app/shared/services/helpers.service';
import { RolesService } from 'app/shared/services/roles.service';
import { UsuariosService } from 'app/shared/services/usuarios.service';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  editarUsuarioForm: FormGroup;
  Roles:Role[]
  // Frecuencias:Frecuencia[]
  // daysOfWeek:string[]
  loadInfo:boolean = false;
  
  // @ViewChild('diasCobro') diasCobroInput: ElementRef;
  @Input() Id?:number
  @Output() FormsValues = new EventEmitter<Usuario>();
  
  constructor(
    private fb: FormBuilder,
    private _RolesService: RolesService,
    private _HelpersService: HelpersService,
    private _UsuariosService: UsuariosService,
    
  ) { 
    this._RolesService.getRole().subscribe((roles:Role[]) => this.Roles = [...roles]);
  }

  ngOnInit(): void {
    
    this.definirValidaciones()
    
    if(this.Id) this.setFormValues()
  }
  
  definirValidaciones(){
    this.editarUsuarioForm = this.fb.group(
      {
        role: [
          "",
          Validators.compose([
            Validators.required,

          ]),
        ],
        nombre: [
          '',
          Validators.compose([
            Validators.required,      
            Validators.maxLength(120),
            Validators.minLength(3),  
          ]),
        ],
        apellido: [
          '',
          Validators.compose([
            Validators.required,      
            Validators.maxLength(120),
            Validators.minLength(3),  
          ]),
        ],

        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.Email),    
            Validators.maxLength(150),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,    
            Validators.maxLength(12),
            Validators.minLength(8),  
            // Validators.maxLength(12),
          ]),
        ],
        password_confirmation: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(8),  
            // Validators.maxLength(12),
          ]),
        ],
        cargo: [
          '',
          Validators.compose([
            Validators.required,      
            Validators.maxLength(120),
            Validators.minLength(3),  
          ]),
        ],
        estado: [
          1,
          Validators.compose([
            Validators.required,
          ]),
        ],
      },
      {
        validator: ValidFunctionsValidator.MatchPassword,
      }
    ); 
    
  }
  
  setFormValues(){
    this.loadInfo = true
    this._UsuariosService.getUsuarioById(this.Id).subscribe((usuario:Usuario)=>{
      this.editarUsuarioForm.patchValue({
        // "categoria_id" : usuario.,
        "nombre" : usuario.name,
        "apellido" : usuario.apellido,
        "email" : usuario.email,
        "cargo" : usuario.cargo,
        // "dias_cobro" : [],
        "estado" : usuario.estado,
      });
      
      // let dias_cobro = cliente.dias_cobro.split(",").map((dia)=> this._HelpersService.DaysOfTheWeek.indexOf(dia.toLowerCase())) // obtengo el dia de la semana en numero
      // // console.log(dias_cobro);
      
      // const formArray: FormArray = this.editarClienteForm.get("dias_cobro") as FormArray; // obtengo el campo del formulario angular
      // dias_cobro.map((numberDay:number) => formArray.push(new FormControl(numberDay)) )// ingreso el valor de los dias en el formulario angular
      
      // let arrayInput = Array.from(this.diasCobroInput.nativeElement.querySelectorAll('input[type="checkbox"]'))
      // arrayInput.map((input: any, i: number) => {
      //   if (dias_cobro.some((numberDay) => numberDay == input.value)) {
      //     input.setAttribute('checked', true)
      //   }
      // })
      
      this.loadInfo = false
    })
            

    

  }


  EnviarFormulario(){
    console.log(this.editarUsuarioForm);
    // console.log(this.formularioControls);
    // console.log(this.editarClienteForm.getRawValue());
    
    if(this.editarUsuarioForm.valid){
      let cliente = {} as Usuario
      // cliente.nombre            = this.formularioControls.nombre.value
      // cliente.apellido          = this.formularioControls.apellido.value
      // cliente.categoria_id      = Number(this.formularioControls.categoria_id.value)
      // cliente.cedula            = this.formularioControls.cedula.value
      // cliente.celular           = Number(this.formularioControls.celular.value)
      // cliente.dias_cobro        = this._HelpersService.daysOfTheWeekToString(this.formularioControls.dias_cobro.value)
      // cliente.direccion_casa    = this.formularioControls.direccion_casa.value
      // cliente.direccion_negocio = this.formularioControls.direccion_negocio.value
      // cliente.estado            = Number(this.formularioControls.estado.value)
      // cliente.frecuencia_id     = Number(this.formularioControls.frecuencia_id.value)
      // cliente.telefono          = Number(this.formularioControls.telefono.value)
    
      this.FormsValues.emit(cliente)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }
    
  }
}
