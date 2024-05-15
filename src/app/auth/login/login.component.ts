import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { RememberFiltersService } from "app/shared/services/remember-filters.service";
import { ValidFunctionsValidator } from "app/shared/utils/valid-functions.validator";
import logger from "app/shared/utils/logger";
import Swal from "sweetalert2";
import { Auth } from "./models/auth.model";
import { AuthService } from "./service/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  editarUsuarioForm: UntypedFormGroup;
  loadInfo: boolean = false;

  @Input() Id?: number;
  @Output() FormsValues: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: UntypedFormBuilder,
    private _AuthService: AuthService,
    private router: Router,
    private _RememberFiltersService: RememberFiltersService
  ) {}

  ngOnInit(): void {
    this.definirValidaciones();
  }

  definirValidaciones() {
    this.editarUsuarioForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidFunctionsValidator.Email),
          Validators.maxLength(150),
        ]),
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(12),
          Validators.minLength(4),
          // Validators.maxLength(12),
        ]),
      ],
    });
  }

  get formularioControls() {
    return this.editarUsuarioForm.controls;
  }

  isValidForm(): boolean {
    let loadInfo = this.loadInfo ? true : false;
    let isInValid = this.editarUsuarioForm.invalid

    return loadInfo || isInValid;
  }

  EnviarFormulario() {
    // console.log(event);

    if (this.editarUsuarioForm.valid) {
      let email = String(this.formularioControls.email.value);
      let password = String(this.formularioControls.password.value);
      this.loadInfo = true;

      this._AuthService.login(email, password).subscribe(
        (data) => {
          
          // console.log(data);
          let Auth: Auth = { ...data };
          this._AuthService.dataStorage = { ...Auth };
          this._RememberFiltersService.deleteAllFilterStorage();
          // this.loadInfo = false;
          this.router.navigateByUrl("/inicio");
        },
        (responseError: any) => {
          logger.log(responseError);
          this.loadInfo = false;

          Swal.fire({
            text: responseError.error.mensaje,
            icon: "warning",
          });
        }
      );
      // this.FormsValues.emit(usuarioService)
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }
}
