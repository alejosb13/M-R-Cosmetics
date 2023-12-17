import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Categoria } from "app/shared/models/Categoria.model";
import { CategoriaService } from "app/shared/services/categoria.service";
import { ValidFunctionsValidator } from "app/shared/utils/valid-functions.validator";
import Swal from "sweetalert2";

@Component({
  selector: "app-categoria-form",
  templateUrl: "./categoria-form.component.html",
  styleUrls: ["./categoria-form.component.css"],
})
export class CategoriaFormComponent implements OnInit {
  CategoriaForm: UntypedFormGroup;
  EstadoForm: UntypedFormGroup;

  daysOfWeek: string[];
  loadInfo: boolean = false;

  @Input() Id?: number;
  @Output() FormsValues = new EventEmitter<Categoria>();

  constructor(
    private fb: UntypedFormBuilder,
    public _CategoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.definirValidaciones();
    this.definirValidacionesEstado();
    this.changeCondicion();

    if (this.Id) this.setFormValues();
  }

  definirValidaciones() {
    this.CategoriaForm = this.fb.group({
      tipo: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(43)]),
      ],
      descripcion: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(80)]),
      ],
      monto_menor: [
        null,
        Validators.compose([
          // Validators.required,
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          Validators.maxLength(11),
          Validators.min(1),
        ]),
      ],
      monto_maximo: [
        null,
        Validators.compose([
          // Validators.required,
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          Validators.maxLength(11),
          Validators.min(1),
        ]),
      ],
      condicion: [0, Validators.compose([Validators.required])],
    });
  }

  get formularioStadoControls() {
    return this.EstadoForm.controls;
  }

  validInputs(nameInput: string) {
    return !(
      this.formularioControls[nameInput].value == null ||
      this.formularioControls[nameInput].value == undefined
    )
      ? true
      : false;
  }

  changeCondicion() {
    // this.CategoriaForm.get("monto_menor").valueChanges.subscribe((da) => {
    //   console.log("da:", da);
    // });
    this.CategoriaForm.get("condicion").valueChanges.subscribe(
      (valueCondicion) => {
        console.log("condicion:", valueCondicion);
        this.CategoriaForm.patchValue({
          monto_menor: null,
          monto_maximo: null,
        });

        if (valueCondicion == 1) {
          // mayor que
          this.CategoriaForm.patchValue({
            monto_menor: 1,
          });
        }

        if (valueCondicion == 2) {
          // menor que
          this.CategoriaForm.patchValue({
            monto_maximo: 1,
          });
        }

        if (valueCondicion == 3) {
          // mayor o igual que
          this.CategoriaForm.patchValue({
            monto_menor: 1,
          });
        }

        if (valueCondicion == 4) {
          // menor o igual que
          this.CategoriaForm.patchValue({
            monto_maximo: 1,
          });
        }

        if (valueCondicion == 5) {
          // entre
          this.CategoriaForm.patchValue({
            monto_maximo: 1,
            monto_menor: 1,
          });
        }
      }
    );
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

  setFormValues() {
    this.loadInfo = true;
    this._CategoriaService
      .getCategoriaById(this.Id)
      .subscribe((categoria: Categoria) => {
        this.CategoriaForm.setValue(
          {
            descripcion: categoria.descripcion,
            monto_menor:
              categoria.monto_menor == 0 ? null : categoria.monto_menor,
            monto_maximo:
              categoria.monto_maximo == 0 ? null : categoria.monto_maximo,
            condicion: categoria.condicion,
            // monto: categoria.monto,
            tipo: categoria.tipo,
          },
          { emitEvent: false }
        );

        this.setEstadoValues(categoria.estado);

        this.loadInfo = false;
      });
  }

  get formularioControls() {
    return this.CategoriaForm.controls;
  }

  EnviarFormulario() {
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());

    if (this.CategoriaForm.valid) {
      let categoria = {} as Categoria;

      categoria.tipo = String(this.formularioControls.tipo.value);
      categoria.descripcion = this.formularioControls.descripcion.value;
      categoria.monto_menor = Number(this.formularioControls.monto_menor.value);
      categoria.monto_maximo = Number(
        this.formularioControls.monto_maximo.value
      );
      categoria.condicion = Number(this.formularioControls.condicion.value);
      categoria.estado = Number(this.formularioStadoControls.estado.value);
      this.FormsValues.emit(categoria);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }
}
