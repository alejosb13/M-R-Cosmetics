import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommunicationService } from '@app/shared/services/communication.service';
import { Frecuencia } from 'app/shared/models/Frecuencia.model';
import { FrecuenciaService } from 'app/shared/services/frecuencia.service';
import { ValidFunctionsValidator } from 'app/shared/utils/valid-functions.validator';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-frecuencia-form',
  templateUrl: './frecuencia-form.component.html',
  styleUrls: ['./frecuencia-form.component.css']
})
export class FrecuenciaFormComponent implements OnInit {

  FrecuenciaForm: UntypedFormGroup;
  EstadoForm: UntypedFormGroup;

  daysOfWeek:string[]
  loadInfo:boolean = false;
  
  @Input() Id?:number
  @Output() FormsValues = new EventEmitter<Frecuencia>();
  
  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private fb: UntypedFormBuilder,
    public _FrecuenciaService: FrecuenciaService,
  ) {}

  ngOnInit(): void {
    
    this.definirValidaciones()
    this.definirValidacionesEstado()
    
    if(this.Id) this.setFormValues()

      this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }
  
  definirValidaciones(){
    this.FrecuenciaForm = this.fb.group(
      {
        descripcion: [
          '',
          Validators.compose([
            Validators.required,        
            Validators.maxLength(80),
          ]),
        ],
        dias: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.NumberRegEx), 
            Validators.maxLength(11),
            Validators.min(1),
          ]),
        ],
        
      }
    ); 
  }
  
  get formularioStadoControls(){
    return this.EstadoForm.controls
  }

  definirValidacionesEstado(){
    this.EstadoForm = this.fb.group(
      {
        estado: [
          1,
          Validators.compose([
            Validators.required,

          ]),
        ],
      }
    ); 
  }
  
  setEstadoValues(estado:number){
    this.EstadoForm.patchValue({
      "estado" : estado,
    });
  }
  
  
  setFormValues(){
    this.loadInfo = true
    this._FrecuenciaService.getFrecuenciaById(this.Id).subscribe((frecuencia:Frecuencia)=>{
      this.FrecuenciaForm.setValue({
        "descripcion" : frecuencia.descripcion,
        "dias" : frecuencia.dias,
      });
      
      this.setEstadoValues(frecuencia.estado)

      
      this.loadInfo = false
    })
            

    

  }

  get formularioControls(){
    return this.FrecuenciaForm.controls
  }

  EnviarFormulario(){
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());
    
    if(this.FrecuenciaForm.valid){
      let frecuencia = {} as Frecuencia
      
 
      frecuencia.descripcion   = this.formularioControls.descripcion.value
      frecuencia.dias          = Number(this.formularioControls.dias.value)
      frecuencia.estado        = Number(this.formularioStadoControls.estado.value)
      this.FormsValues.emit(frecuencia)
    }else{
      Swal.mixin({
            customClass: {
              container: this.themeSite, // Clase para el modo oscuro
            },
          }).fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }
    
  }
  
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}
