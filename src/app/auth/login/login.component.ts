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
import { CommunicationService } from "@app/shared/services/communication.service";

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
    private _RememberFiltersService: RememberFiltersService,
    private _CommunicationService: CommunicationService,
  ) {}

  ngOnInit(): void {
    this.definirValidaciones();
    // Suscribirse a cambios en el campo línea para actualizar favicon e imagen
    this.editarUsuarioForm.get('linea').valueChanges.subscribe(linea => {
      this.updateFavicon(linea);
    });
    // Establecer favicon inicial
    this.updateFavicon('linea1');
  }

  getLogoImage(): string {
    const linea = this.editarUsuarioForm?.get('linea')?.value;
    if (linea === 'linea2') {
      return 'assets/img/logos/kshe_logo.png';
    }
    return 'assets/img/logos/logo-t.png';
  }

  updateFavicon(linea: string): void {
    const isLinea2 = linea === 'linea2';
    const favicon = isLinea2 ? 'assets/img/logos/kshe_logo.png' : 'assets/img/logos/logo-t.png';
    const title = isLinea2 ? 'K She' : 'M&R Profesional';
    
    // Actualizar título
    document.title = title;
    
    // Remover todos los iconos existentes
    const oldIcons = document.querySelectorAll("link[rel*='icon']");
    oldIcons.forEach(icon => icon.remove());
    
    const oldApple = document.querySelectorAll("link[rel='apple-touch-icon']");
    oldApple.forEach(icon => icon.remove());
    
    // Crear nuevo favicon con timestamp para forzar recarga
    const linkIcon = document.createElement('link');
    linkIcon.rel = 'icon';
    linkIcon.type = 'image/png';
    linkIcon.setAttribute('sizes', '96x96');
    linkIcon.href = favicon + '?v=' + new Date().getTime();
    document.getElementsByTagName('head')[0].appendChild(linkIcon);
    
    // Crear nuevo apple-touch-icon
    const linkApple = document.createElement('link');
    linkApple.rel = 'apple-touch-icon';
    linkApple.setAttribute('sizes', '76x76');
    linkApple.href = favicon + '?v=' + new Date().getTime();
    document.getElementsByTagName('head')[0].appendChild(linkApple);
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
      linea: [
        "linea1",
        Validators.compose([
          Validators.required,
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
      let linea = String(this.formularioControls.linea.value);
      this.loadInfo = true;

      this._AuthService.login(email, password, linea).subscribe(
        (data) => {
          
          // console.log(data);
          let Auth: Auth = { ...data };
          this._AuthService.dataStorage = { ...Auth };
          this._RememberFiltersService.deleteAllFilterStorage();

          this._CommunicationService.removeTheme() // Elimino localstore 
          this._CommunicationService.setTheme("white") // agrego localstore 
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
