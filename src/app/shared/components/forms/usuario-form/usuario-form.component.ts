import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Role } from "app/shared/models/Role.model";
import { Usuario, UsuarioServ } from "app/shared/models/Usuario.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { RolesService } from "app/shared/services/roles.service";
import { UsuariosService } from "app/shared/services/usuarios.service";
import { ValidFunctionsValidator } from "app/shared/validations/valid-functions.validator";
import Swal from "sweetalert2";

@Component({
  selector: "app-usuario-form",
  templateUrl: "./usuario-form.component.html",
  styleUrls: ["./usuario-form.component.css"],
})
export class UsuarioFormComponent implements OnInit {
  editarUsuarioForm: FormGroup;
  PasswordGroup: FormGroup;
  EstadoForm: FormGroup;

  Roles: Role[];
  loadInfo: boolean = false;

  @Input() Id?: number;
  @Output() FormsValues = new EventEmitter<UsuarioServ>();

  constructor(
    private fb: FormBuilder,
    private _RolesService: RolesService,
    public _UsuariosService: UsuariosService,
    public _HelpersService: HelpersService
  ) {
    this._RolesService
      .getRole()
      .subscribe((roles: Role[]) => (this.Roles = [...roles]));
  }

  ngOnInit(): void {
    this.definirValidaciones();
    this.definirValidacionesEstado();

    if (this.Id) this.setFormValues();
  }

  definirValidaciones() {
    this.editarUsuarioForm = this.fb.group(
      {
        role: ["", Validators.compose([Validators.required])],
        nombre: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(120),
            Validators.minLength(3),
          ]),
        ],
        apellido: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(120),
            Validators.minLength(3),
          ]),
        ],

        email: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.Email),
            Validators.maxLength(150),
          ]),
        ],
        cargo: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(120),
            Validators.minLength(3),
          ]),
        ],
        cedula: [
          "",
          Validators.compose([
            Validators.required,
            // Validators.pattern(ValidFunctionsValidator.NumberRegEx),
            Validators.maxLength(22),
            // Validators.minLength(14),
          ]),
        ],
        celular: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.NumberRegEx),
            Validators.maxLength(20),
          ]),
        ],
        domicilio: [
          "",
          Validators.compose([Validators.required, Validators.maxLength(180)]),
        ],
        fecha_nacimiento: ["", Validators.compose([Validators.required])],
        fecha_ingreso: ["", Validators.compose([Validators.required])],
      },
      {
        validator: ValidFunctionsValidator.MatchPassword,
      }
    );

    if (!this.Id) {
      this.PasswordGroup = this.fb.group({
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(12),
            Validators.minLength(4),
            // Validators.maxLength(12),
          ]),
        ],
        password_confirmation: [
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
  }

  setFormValues() {
    this.loadInfo = true;
    this._UsuariosService
      .getUsuarioById(this.Id)
      .subscribe((usuario: Usuario) => {
        let role = this.Roles.find((role) => role.id == usuario.role_id);
        // console.log(usuario);
        
        this.editarUsuarioForm.patchValue({
          nombre: usuario.name,
          apellido: usuario.apellido,
          email: usuario.email,
          cargo: usuario.cargo,
          role: String(role.id),
          cedula: usuario.cedula,
          celular: usuario.celular,
          domicilio: usuario.domicilio,
          // "estado" : usuario.estado,
        });

        if (usuario.fecha_nacimiento) {
          this.editarUsuarioForm.patchValue({
            fecha_nacimiento: this._HelpersService.changeformatDate(
              usuario.fecha_nacimiento,
              "YYYY-MM-DD HH:mm:ss",
              "YYYY-MM-DD"
            ),
          });
        }
        if (usuario.fecha_ingreso) {
          this.editarUsuarioForm.patchValue({
            fecha_ingreso: this._HelpersService.changeformatDate(
              usuario.fecha_ingreso,
              "YYYY-MM-DD HH:mm:ss",
              "YYYY-MM-DD"
            ),
          });
        }
        this.setEstadoValues(usuario.estado);

        this.loadInfo = false;
      });
  }

  definirValidacionesEstado() {
    this.EstadoForm = this.fb.group({
      estado: [1, Validators.compose([Validators.required])],
    });
  }

  setEstadoValues(estado: number) {
    this.EstadoForm.patchValue({
      estado: estado,
    });
  }

  get formularioStadoControls() {
    return this.EstadoForm.controls;
  }

  get formularioControls() {
    return this.editarUsuarioForm.controls;
  }

  get formularioPassword() {
    return this.PasswordGroup.controls;
  }

  EnviarFormulario() {
    // console.log(this.PasswordGroup.getRawValue());

    if (this.editarUsuarioForm.valid) {
      let usuarioService = {} as UsuarioServ;
      usuarioService.name = this.formularioControls.nombre.value;
      usuarioService.apellido = this.formularioControls.apellido.value;
      usuarioService.email = this.formularioControls.email.value;
      usuarioService.cargo = this.formularioControls.cargo.value;
      usuarioService.cedula = this.formularioControls.cedula.value;
      usuarioService.celular = this.formularioControls.celular.value;
      usuarioService.domicilio = this.formularioControls.domicilio.value;
      usuarioService.fecha_nacimiento =
        this.formularioControls.fecha_nacimiento.value;
      usuarioService.fecha_ingreso =
        this.formularioControls.fecha_ingreso.value;

      if (!this.Id) {
        usuarioService.password = this.formularioPassword.password.value;
        usuarioService.password_confirmation =
          this.formularioPassword.password_confirmation.value;
      }

      usuarioService.role = Number(this.formularioControls.role.value);
      usuarioService.estado = Number(this.formularioStadoControls.estado.value);

      this.FormsValues.emit(usuarioService);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }
}
