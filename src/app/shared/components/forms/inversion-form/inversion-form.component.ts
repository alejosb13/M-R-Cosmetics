import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from "@angular/forms";
import {
  InversionForm,
  InversionFormBuilder,
  inversionFormStructure,
} from "app/shared/components/forms/inversion-form/utils/form";
import { InversionErrorMessages } from "app/shared/components/forms/inversion-form/utils/valid-messages";
import { Inversion } from "app/shared/models/Inversion";
import logger from "app/shared/utils/logger";
import Swal from "sweetalert2";
import { InversionValidators } from "./utils/validations";

@Component({
  selector: "app-inversion-form",
  templateUrl: "./inversion-form.component.html",
  styleUrls: ["./inversion-form.component.scss"],
})
export class InversionFormComponent {
  loadInfo: boolean = false;
  readonly InversionErrorMessages = InversionErrorMessages;

  @Input() Id?: number;
  @Output() FormsValues = new EventEmitter<InversionForm>();

  // inversion: FormArray;
  FormInversion: FormGroup;
  readOnlyInputsForCalculation: boolean = true;
  readOnlyInputsEditable: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.FormInversion = InversionFormBuilder();
    // this.FormInversion = new FormGroup({
    //   inversion: new FormArray([]),
    // });

    // if (this.Id) this.setFormValues();
  }

  validateProductInversion(event: KeyboardEvent, position: number) {
    const { value, name } = event.target as HTMLInputElement;
    if (!value) return false;
    const controlInversion = this.getControlFormArray();
    
    const FormValue: Partial<Inversion> = controlInversion[position].value; // obtengo los valores del formulario que fue modificado
    const precio_unitario = Number(FormValue.precio_unitario || 0);
    const cantidad = Number(FormValue.cantidad || 0);

    const costo = precio_unitario * cantidad;

    const peso_porcentual = costo * cantidad;
    const peso_absoluto = costo * cantidad;
    const c_u_distribuido = costo * cantidad;
    const costo_total = costo * cantidad;
    const subida_ganancia = costo * cantidad;
    const precio_venta = costo * cantidad;
    const margen_ganancia = costo * cantidad;
    const venta = costo * cantidad;
    const venta_total = costo * cantidad;
    const costo_real = costo * cantidad;
    const ganancia_bruta = costo * cantidad;
    const comision_vendedor = costo * cantidad;

    console.log({ value, name, position, precio_unitario, cantidad, costo });
    controlInversion[position].patchValue({
      costo,
      peso_porcentual,
      peso_absoluto,
      c_u_distribuido,
      costo_total,
      subida_ganancia,
      precio_venta,
      margen_ganancia,
      venta,
      venta_total,
      costo_real,
      ganancia_bruta,
      comision_vendedor,
    });
    console.log();
  }

  setFormValues() {}

  getControlErrorsArray(name: string, index: number): ValidationErrors | null {
    const control = this.FormInversion.controls[index]
      ? this.FormInversion.controls[index].get(name)
      : null;
    // logger.log(
    //   this.FormInversion.controls[index]
    // );
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControlFormArray(): FormGroup<InversionForm>[] {
    // console.log((this.FormInversion.get("inversion") as FormArray).controls);
    let arrayForm: FormArray<FormGroup<InversionForm>> = this.FormInversion.get(
      "inversion"
    ) as FormArray;
    return arrayForm.controls;
  }

  getControlArray(inputName: string, index: number): FormControl {
    const controlInversion = this.getControlFormArray();
    controlInversion[index].get(inputName);

    // console.log(inputName);
    // console.log(controlInversion[index].get(inputName));
    return controlInversion[index].get(inputName) as FormControl;
  }

  addRowItem() {
    console.log(this.FormInversion);
    // this.inversion = this.FormInversion.get("inversion") as FormArray;
    let newInversion: FormArray = this.FormInversion.get(
      "inversion"
    ) as FormArray;
    newInversion.push(new FormGroup<InversionForm>(inversionFormStructure()));
    console.log(newInversion);
  }

  EnviarFormulario() {
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());

    if (this.FormInversion.valid) {
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
