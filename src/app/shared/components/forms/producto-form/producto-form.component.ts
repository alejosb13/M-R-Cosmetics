import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'app/shared/models/Producto.models';
import { HelpersService } from 'app/shared/services/helpers.service';
import { ProductosService } from 'app/shared/services/productos.service';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {

  ProductForm: FormGroup;
  // Categorias:Categoria[]
  // Frecuencias:Frecuencia[]
  daysOfWeek:string[]
  loadInfo:boolean = false;
  
  @ViewChild('diasCobro') diasCobroInput: ElementRef;
  @Input() Id?:number
  @Output() FormsValues = new EventEmitter<Producto>();
  
  constructor(
    private fb: FormBuilder,
    // private _CategoriaService: CategoriaService,
    // private _ClientesService: ClientesService,
    // private _FrecuenciaService: FrecuenciaService,
        private _ProductosService: ProductosService,
    private _HelpersService: HelpersService,
    
  ) {}

  ngOnInit(): void {
    
    this.definirValidaciones()
    
    if(this.Id) this.setFormValues()
  }
  
  definirValidaciones(){
    this.ProductForm = this.fb.group(
      {
        marca: [
          '',
          Validators.compose([
            Validators.required,        
            Validators.maxLength(30),
          ]),
        ],
        modelo: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(43),
          ]),
        ],
        stock: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.NumberRegEx), 
            Validators.maxLength(11),
          ]),
        ],
        precio: [
          '',
          Validators.compose([
            Validators.required,
            // Validators.maxLength(80),
            Validators.pattern(ValidFunctionsValidator.DecimalRegEx),
            // Validators.minLength(3),
          ]),
        ],
        comision: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(ValidFunctionsValidator.NumberRegEx),    
            Validators.maxLength(11),
          ]),
        ],
        linea: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            
            // Validators.maxLength(12),
          ]),
        ],
        descripcion: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(200),
            
            // Validators.maxLength(12),
          ]),
        ],
        estado: [
          1,
          Validators.compose([
            Validators.required,
          ]),
        ],
        
      }
    ); 
  }
  
  setFormValues(){
    this.loadInfo = true
    this._ProductosService.getProductoById(this.Id).subscribe((producto:Producto)=>{
      this.ProductForm.setValue({
        "marca" : producto.marca,
        "modelo" : producto.modelo,
        "stock" : producto.stock,
        "precio" : producto.precio,
        "comision" : producto.comision,
        "linea" : producto.linea,
        "descripcion" : producto.descripcion,
        "estado" : producto.estado,
      });
      
      // let dias_cobro = cliente.dias_cobro.split(",").map((dia)=> this._HelpersService.DaysOfTheWeek.indexOf(dia.toLowerCase())) // obtengo el dia de la semana en numero
      // console.log(dias_cobro);
      
      // const formArray: FormArray = this.editarClienteForm.get("dias_cobro") as FormArray; // obtengo el campo del formulario angular
      // dias_cobro.map((numberDay:number) => formArray.push(new FormControl(numberDay)) )// ingreso el valor de los dias en el formulario angular
      
      // let arrayInput = Array.from(this.diasCobroInput.nativeElement.querySelectorAll('input[type="checkbox"]'))
      // arrayInput.map((input: any, i: number) => {
      //   if (dias_cobro.some((numberDay) => numberDay == input.value)) {
      //     input.setAttribute('checked', true)
      //   }
      // })
      
      this.loadInfo = false
    })
            

    

  }
  
  changeValueFormArray({ name, value, checked }) {
    // const formArray: FormArray = this.editarClienteForm.get(name) as FormArray;

    // if (checked) {
    //   formArray.push(new FormControl(value));
    // } else {
    //   const index = formArray.controls.findIndex(x => x.value === value);
    //   formArray.removeAt(index);
    // }
  }
  
  get formularioControls(){
    return this.ProductForm.controls
  }


  EnviarFormulario(){
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    console.log(this.ProductForm.getRawValue());
    
    if(this.ProductForm.valid){
      let producto = {} as Producto
      
      producto.comision =  Number(this.formularioControls.comision.value)
      producto.estado = Number(this.formularioControls.estado.value)
      producto.linea =  this.formularioControls.linea.value
      producto.marca =  this.formularioControls.marca.value
      producto.modelo = this.formularioControls.modelo.value
      producto.precio = Number(this.formularioControls.precio.value)
      producto.stock = Number(this.formularioControls.stock.value)
      producto.descripcion = String(this.formularioControls.stock.value)
 
      console.log(producto);
      
      this.FormsValues.emit(producto)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }
    
  }
}
