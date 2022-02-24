import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  editarUsuarioForm: FormGroup;
  loadInfo:boolean = false;
  
  @Input() Id?:number
  @Output() FormsValues:EventEmitter<any> = new EventEmitter();
  
  constructor(
    private fb: FormBuilder,
    private _AuthService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    
    this.definirValidaciones()
  }
  
  definirValidaciones(){
    this.editarUsuarioForm = this.fb.group(
      {
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
      },
    ); 
  }

  get formularioControls(){
    return this.editarUsuarioForm.controls
  }
  
  
  EnviarFormulario(){
    // console.log(event);
    
    if(this.editarUsuarioForm.valid){

      let email              = String(this.formularioControls.email.value)
      let password              = String(this.formularioControls.password.value)

      this._AuthService.login(email,password).subscribe(data => {
        console.log(data);
        this._AuthService.dataStorage= {token:data.token}
        this.router.navigateByUrl("/inicio");
      },error=> {
        Swal.fire({
          text: "Usuario o contraseña incorrectos",
          icon: 'warning',
        })
      })
      // this.FormsValues.emit(usuarioService)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }
    
  }

}
