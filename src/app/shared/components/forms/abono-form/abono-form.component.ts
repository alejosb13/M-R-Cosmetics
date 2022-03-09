import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Abono } from 'app/shared/models/Abono.model';
import { Factura } from 'app/shared/models/Factura.model';
import { AbonoService } from 'app/shared/services/abono.service';
import { FacturasService } from 'app/shared/services/facturas.service';
import { ValidFunctionsValidator } from 'app/shared/validations/valid-functions.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abono-form',
  templateUrl: './abono-form.component.html',
  styleUrls: ['./abono-form.component.css']
})
export class AbonoFormComponent implements OnInit {
  @Output() FormsValues:EventEmitter<any> = new EventEmitter();
  @Input() Id?:number;
  
  loadInfo:boolean = false;
  AbonoForm:FormGroup
  facturas:Factura[]
  
  montoTotal:number=0
  restante:number=0
  abonado:number=0
  facturaId:number=0
  // estado:number=1
  
  constructor(
    private fb: FormBuilder,
    private _FacturasService:FacturasService ,
    private _AuthService:AuthService ,
    private _AbonoService:AbonoService,
  ) {}

  ngOnInit(): void {
    this.getFacturasTipoCredito()
    this.definirValidaciones()
    this.changeValues()
    
    if(this.Id) this.setFormValues()
  }
  
  getFacturasTipoCredito(){
    this._FacturasService.getFacturas({tipo_venta:1}).subscribe((facturas:Factura[]) => this.facturas = facturas )
  }
  
  definirValidaciones(){
    this.AbonoForm = this.fb.group(
      {
        factura_id: [
          '',
          Validators.compose([
            Validators.required,        
            Validators.maxLength(30),
          ]),
        ],
        precio: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(43),
            Validators.pattern(ValidFunctionsValidator.NumberRegEx), 
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
    this._AbonoService.getAbonoById(this.Id).subscribe((abono:Abono)=>{
      this.AbonoForm.setValue({
        "factura_id" : abono.factura_id,
        "precio" : abono.precio,
        "estado" : String(abono.estado),
      });
      
      this.generarCalculo(abono.factura_id)
      this.loadInfo = false            
    });
  }
  
  changeValues() {
    this.AbonoForm.valueChanges.subscribe((values)=>{
      console.log(values);
      if(values.factura_id > 0){
        this.generarCalculo(values.factura_id)
      }
    })
  }
  
  generarCalculo(facturaId:number){
    let factura:Factura = this.facturas.find(factura => factura.id == facturaId)
    
    if(factura.factura_historial.length > 0){
      let abonos:number[] =  factura.factura_historial.map(itemHistorial =>{ if(itemHistorial.estado == 1) return itemHistorial.precio   })
      let abonosActive = abonos.filter((abono) => abono != undefined );
      
      this.abonado    =  abonosActive.reduce((acum, precio) => acum + precio)
      this.restante   =  this.montoTotal - this.abonado
      
      console.log(factura,abonos,abonosActive);
    }else{
      this.abonado    = 0
      this.restante   = 0
    }
    
    this.facturaId  = factura.id
    this.montoTotal = factura.monto
    
  }
  
  get formularioControls(){
    return this.AbonoForm.controls
  }


  EnviarFormulario(){
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.AbonoForm.getRawValue());
    
    if(this.AbonoForm.valid){
      let abono:Abono  = {} as Abono 
      abono.precio     = Number(this.formularioControls.precio.value)
      abono.factura_id = Number(this.formularioControls.factura_id.value)
      abono.user_id    = Number(this._AuthService.dataStorage.user.userId)
      abono.estado     = Number(this.formularioControls.estado.value)
      

      this.FormsValues.emit(abono)
    }else{
      Swal.fire({
        text: "Complete todos los campos obligatorios",
        icon: 'warning',
      })
    }
    
  }
  
}
