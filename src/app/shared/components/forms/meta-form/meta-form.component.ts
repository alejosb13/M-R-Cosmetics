import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Meta } from "app/shared/models/meta.model";
import { Recibo } from "app/shared/models/Recibo.model";
import { ValidFunctionsValidator } from "app/shared/validations/valid-functions.validator";
import Swal from "sweetalert2";

@Component({
  selector: "app-meta-form",
  templateUrl: "./meta-form.component.html",
  styleUrls: ["./meta-form.component.css"],
})
export class MetaFormComponent implements OnInit {
  @Input() meta: Meta;
  @Output() submitForm = new EventEmitter<Meta>();

  MetaForm: UntypedFormGroup;
  loadInfo: boolean = false;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.definirValidaciones();

    if (this.meta) this.setFormValues();
  }

  definirValidaciones() {
    this.MetaForm = this.fb.group({
      monto: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(20),
          Validators.min(1),
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
        ]),
      ],
    });
  }

  setFormValues() {
    this.MetaForm.setValue({
      monto: this.meta.monto,
    });
  }

  get formularioControls() {
    return this.MetaForm.controls;
  }

  EnviarFormulario() {
    if (this.MetaForm.valid) {
      let meta = {
        ...this.meta
      } as Meta;
      meta.monto = Number(this.formularioControls.monto.value);

      console.log("Form",meta);
    
      this.submitForm.emit(meta);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }
}
