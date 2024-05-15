import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";

import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Listado } from "@app/shared/services/listados.service";
import { FinanzasService } from "@app/shared/services/finanzas.service";
import { HelpersService } from "@app/shared/services/helpers.service";
import { Gasto } from "@app/shared/models/Gasto.model";
import { GastoErrorMessages } from "./utils/valid-messages";
import { TalonarioForm, TalonarioFormBuilder } from "./utils/form";
import { Talonario } from "@app/shared/models/Talonario.model";

@Component({
  selector: "app-talonario-form",
  templateUrl: "./talonario-form.component.html",
  styleUrls: ["./talonario-form.component.scss"],
})
export class TalonarioFormComponent {
  loadInfo: boolean = false;
  readonly GastoErrorMessages = GastoErrorMessages;

  @Input() Gasto?: Gasto;
  @Output() FormsValues = new EventEmitter<Talonario>();

  FormTalonario: FormGroup<TalonarioForm>;
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;
  
  constructor(
    public _Listado: Listado,
    public _FinanzasService: FinanzasService,
    public _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.FormTalonario = TalonarioFormBuilder();
    console.log(this.Gasto);
    // console.log(this.producto_id);

    // this.FormGastos.patchValue({producto_id:this.producto_id});
    this.validStatusFromChange();
    if (this.Gasto) this.setFormValues();
  }

  validStatusFromChange() {
    this.FormTalonario.statusChanges
      .pipe(
        map((value: string) => {
          return value === "VALID" ? true : false;
        })
      )
      .subscribe((status: boolean) => {
        this.isValidForm = status;
      });
  }

  setFormValues() {
    // this.FormTalonario.patchValue({
    //   ...this.Gasto,
    // });
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.FormTalonario.controls
      ? this.FormTalonario.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.FormTalonario.get(name) as FormControl;
  }

  EnviarFormulario() {
    if (this.FormTalonario.valid) {
      const DATA_FORM = this.FormTalonario.getRawValue();

      let talonario: Talonario = {
        ...DATA_FORM,
        user_id: null,
        asignado: 0,
      };
      // if (this.Gasto) importacion.id = this.Gasto.id;
      console.log(talonario);

      this.FormsValues.emit(talonario);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }
}
