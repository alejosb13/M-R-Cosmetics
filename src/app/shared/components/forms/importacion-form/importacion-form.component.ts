import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { ImportacionForm, ImportacionFormBuilder } from "./utils/form";
import { ImportacionErrorMessages } from "./utils/valid-messages";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  tap,
  switchMap,
  catchError,
} from "rxjs/operators";
import Swal from "sweetalert2";
import { Observable, of, OperatorFunction } from "rxjs";
import { Listado } from "app/shared/services/listados.service";
import { FinanzasService } from "app/shared/services/finanzas.service";
import { FiltrosList } from "app/shared/models/Listados.model";
import { InversionResponse } from "app/shared/models/Inversion.model";
import { HelpersService } from "app/shared/services/helpers.service";
import { Importacion, ImportacionResponse } from "app/shared/models/Importacion.model";

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

  FormImportacion: FormGroup<ImportacionForm>;
  readOnlyInputsForCalculation: boolean = true;
  isValidForm: boolean = false;

  searching: boolean = false;
  searchFailed: boolean = false;

  constructor(
    public _Listado: Listado,
    public _FinanzasService: FinanzasService,
    public _HelpersService: HelpersService
  ) {}

  formatterValue = (
    x: { numero_seguimiento: string; updated_at: string } | string
  ) => (typeof x === "string" ? x : `${x.numero_seguimiento}`);
  // typeof x === "string" ? x : `${x.numero_seguimiento} - ${moment(x.updated_at).format('DD-MM-YYYY h:mm a')}`;

  ngOnInit(): void {
    this.FormImportacion = ImportacionFormBuilder();
    if (this.Id) this.setFormValues();

    this.validStatusFromChange();
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
        // console.log(this.getControl("fecha_inversion"));

        this.isValidForm = status;
      });
  }

  setFormValues() {
    this.loadInfo = true
    this._FinanzasService.getImportacionById(this.Id).subscribe(
      (data: ImportacionResponse) => {
        const patchValue:Partial<Importacion> = {
          conceptualizacion:data.conceptualizacion,
          numero_recibo:data.numero_recibo,
          numero_inversion:data.inversion.numero_seguimiento,
          fecha_inversion:this._HelpersService.changeformatDate(
            data.fecha_inversion,
            "YYYY-MM-DD HH:mm:ss",
            "YYYY-MM-DD"
          ),
          monto_compra:data.monto_compra,
          precio_envio:data.precio_envio,
        };
        this.FormImportacion.patchValue(patchValue);
        this.loadInfo = false;
      },
      () => {
        this.loadInfo = false;
      }
    );
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.FormImportacion.controls
      ? this.FormImportacion.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.FormImportacion.get(name) as FormControl;
  }

  EnviarFormulario() {
    if (this.FormImportacion.valid) {
      console.log(this.FormImportacion.getRawValue());
      const DATA_FORM = this.FormImportacion.getRawValue();

      let importacion: Importacion = {
        conceptualizacion: DATA_FORM.conceptualizacion,
        fecha_inversion: this._HelpersService.changeformatDate(
          DATA_FORM.fecha_inversion,
          "YYYY-MM-DD",
          "YYYY-MM-DD HH:mm:ss"
        ), //"2024-02-09",
        monto_compra: DATA_FORM.monto_compra,
        numero_inversion:
          typeof DATA_FORM.numero_inversion === "string"
            ? DATA_FORM.numero_inversion
            : DATA_FORM.numero_inversion.numero_seguimiento,
        inversion_id:
          typeof DATA_FORM.numero_inversion === "string"
            ? DATA_FORM.numero_inversion
            : DATA_FORM.numero_inversion.id,
        numero_recibo: DATA_FORM.numero_recibo,
        precio_envio: DATA_FORM.precio_envio,
      };
      console.log(importacion);
      // frecuencia.descripcion = this.formularioControls.descripcion.value;
      // frecuencia.dias = Number(this.formularioControls.dias.value);
      this.FormsValues.emit(importacion);
    } else {
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    return text$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) => {
        let listadoFilter: FiltrosList = {
          link: null,
          estado: 1,
          disablePaginate: 1,
          filter: term,
          import: 1,
        };

        return this._FinanzasService
          .getInversionesToImportaciones(listadoFilter)
          .pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          );
      }),
      tap(() => (this.searching = false))
    );
  };

  eventInputTypeHead({ item }: { item: InversionResponse }) {
    console.log(item);
    this.FormImportacion.patchValue({
      fecha_inversion: this._HelpersService.changeformatDate(
        item.updated_at,
        "YYYY-MM-DD HH:mm:ss",
        "YYYY-MM-DD"
      ),
      // numero_recibo:0,
      numero_inversion: item.numero_seguimiento,
      // monto_compra:item.costo,
      monto_compra: item.costo_total,
      // conceptualizacion: "",
      precio_envio: item.envio,
    });
  }
}
