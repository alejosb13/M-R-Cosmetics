import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent implements OnInit {


  editarUsuarioForm: FormGroup;
  loadInfo:boolean = false;
  
  @Input() Id?:number
  @Output() FormsValues:EventEmitter<any> = new EventEmitter();
  
  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    
    this.definirValidaciones()
  }
  
  definirValidaciones(){
    this.editarUsuarioForm = this.fb.group(
      {
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
      },
      {
        validator: ValidFunctionsValidator.MatchPassword,
      }
    ); 
  }

  get formularioControls(){
    return this.editarUsuarioForm.controls
  }
  
  
  EnviarFormulario(){
    if(this.editarUsuarioForm.valid){
      let usuarioService:any = {} 
      usuarioService.password              = this.formularioControls.password.value
      usuarioService.password_confirmation = this.formularioControls.password_confirmation.value      
    
      this.FormsValues.emit(usuarioService)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }
    
  }

}
