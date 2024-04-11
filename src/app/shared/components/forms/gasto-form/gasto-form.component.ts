import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";

import { map } from "rxjs/operators";
import Swal from "sweetalert2";
import { Listado } from "@app/shared/services/listados.service";
import { FinanzasService } from "@app/shared/services/finanzas.service";
import { HelpersService } from "@app/shared/services/helpers.service";
import { Gasto } from "@app/shared/models/Gasto.model";
import { GastoFormBuilder, GastosForm } from "./utils/form";
import { GastoErrorMessages } from "./utils/valid-messages";

@Component({
  selector: "app-gasto-form",
  templateUrl: "./gasto-form.component.html",
  styleUrls: ["./gasto-form.component.scss"],
})
export class GastoFormComponent {
  loadInfo: boolean = false;
  readonly GastoErrorMessages = GastoErrorMessages;

  @Input() Gasto?: Gasto;
  @Output() FormsValues = new EventEmitter<Gasto>();

  FormGastos: FormGroup<GastosForm>;
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;
  selectValues: string[] = [
    "Empresa",
    "MaRo",
    "Adicional"
  ];

  constructor(
    public _Listado: Listado,
    public _FinanzasService: FinanzasService,
    public _HelpersService: HelpersService
  ) {}

  ngOnInit(): void {
    this.FormGastos = GastoFormBuilder();
    console.log(this.Gasto);
    // console.log(this.producto_id);

    // this.FormGastos.patchValue({producto_id:this.producto_id});
    this.validStatusFromChange();
    if (this.Gasto) this.setFormValues();
  }

  validStatusFromChange() {
    this.FormGastos.statusChanges
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
    this.FormGastos.patchValue({
      ...this.Gasto,
      fecha_comprobante: this._HelpersService.changeformatDate(
        this.Gasto.fecha_comprobante,
        "YYYY-MM-DD HH:mm:ss",
        "YYYY-MM-DD"
      ),
    });
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.FormGastos.controls ? this.FormGastos.get(name) : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.FormGastos.get(name) as FormControl;
  }

  EnviarFormulario() {
    if (this.FormGastos.valid) {
      const DATA_FORM = this.FormGastos.getRawValue();

      let importacion: Gasto = {
        ...DATA_FORM,
        fecha_comprobante: this._HelpersService.changeformatDate(
          DATA_FORM.fecha_comprobante,
          "YYYY-MM-DD",
          "YYYY-MM-DD HH:mm:ss"
        ),
        tipo_desc: this.selectValues[DATA_FORM.tipo]
      };
      if (this.Gasto) importacion.id = this.Gasto.id;
      console.log(importacion);

      this.FormsValues.emit(importacion);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }
}
