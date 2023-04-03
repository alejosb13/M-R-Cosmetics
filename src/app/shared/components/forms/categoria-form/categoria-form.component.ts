import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'app/shared/models/Categoria.model';
import { CategoriaService } from 'app/shared/services/categoria.service';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {
  CategoriaForm: FormGroup;
  EstadoForm: FormGroup;

  daysOfWeek:string[]
  loadInfo:boolean = false;
  
  @Input() Id?:number
  @Output() FormsValues = new EventEmitter<Categoria>();
  
  constructor(
    private fb: FormBuilder,
    public _CategoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    
    this.definirValidaciones()
    this.definirValidacionesEstado()
    
    if(this.Id) this.setFormValues()
  }
  
  definirValidaciones(){
    this.CategoriaForm = this.fb.group(
      {
        tipo: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(43),
          ]),
        ],
        descripcion: [
          '',
          Validators.compose([
            Validators.required,        
            Validators.maxLength(80),
          ]),
        ],
        valor_dias: [
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
    this._CategoriaService.getCategoriaById(this.Id).subscribe((categoria:Categoria)=>{
      this.CategoriaForm.setValue({
        "descripcion" : categoria.descripcion,
        "valor_dias" : categoria.valor_dias,
        "tipo" : categoria.tipo,

      });
      
      this.setEstadoValues(categoria.estado)

      
      this.loadInfo = false
    })
            

    

  }

  get formularioControls(){
    return this.CategoriaForm.controls
  }


  EnviarFormulario(){
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.ProductForm.getRawValue());
    
    if(this.CategoriaForm.valid){
      let categoria = {} as Categoria
      
      categoria.tipo          = String(this.formularioControls.tipo.value)
      categoria.descripcion   = this.formularioControls.descripcion.value
      categoria.valor_dias    = Number(this.formularioControls.valor_dias.value)
      categoria.estado        = Number(this.formularioStadoControls.estado.value)
      this.FormsValues.emit(categoria)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }
    
  }
}
