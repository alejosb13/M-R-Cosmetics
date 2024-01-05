import { Component, Input, Output } from "@angular/core";
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { EventEmitter } from "protractor";
import { ImportacionForm, ImportacionFormBuilder } from "./utils/form";
import { ImportacionErrorMessages } from "./utils/valid-messages";
import { map } from "rxjs/operators";
import { Importacion } from "app/shared/models/Importacion.model";
import Swal from "sweetalert2";

@Component({
  selector: "app-importacion-form",
  templateUrl: "./importacion-form.component.html",
  styleUrls: ["./importacion-form.component.scss"],
})
export class ImportacionFormComponent {
  loadInfo: boolean = false;
  readonly InversionErrorMessages = ImportacionErrorMessages;

  @Input() Id?: number;
  @Output() FormsValues = new EventEmitter();

  FormImportacion: FormGroup<ImportacionForm> = ImportacionFormBuilder();
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // this.FormInversion = new FormGroup({
    //   inversion: new FormArray([]),
    // });

    this.validStatusFromChange();
    // if (this.Id) this.setFormValues();
  }

  validStatusFromChange() {
    this.FormImportacion.statusChanges
      .pipe(
        map((value: string) => {
          return value === "VALID" ? true : false;
        })
      )
      .subscribe((status: boolean) => {
        // console.log("statusForm", status);
        this.isValidForm = status;
      });
  }

  setFormValues() {}

  getControlError(name: string, index: number): ValidationErrors | null {
    const control = this.FormImportacion.controls
      ? this.FormImportacion.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): any {
    // console.log((this.FormInversion.get("inversion") as FormArray).controls);
    let control = this.FormImportacion.get(name) as AbstractControl<Partial<Importacion>>
    console.log('control ',control);
    
    return control;
  }


  EnviarFormulario() {
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());

    if (this.FormImportacion.valid) {
      // let frecuencia = {} as InversionForm;
      // frecuencia.descripcion = this.formularioControls.descripcion.value;
      // frecuencia.dias = Number(this.formularioControls.dias.value);
      // this.FormsValues.emit(frecuencia);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }

}
