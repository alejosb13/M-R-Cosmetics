import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Abono } from 'app/shared/models/Abono.model';
import { Factura } from 'app/shared/models/Factura.model';
import { FacturaHistorial } from 'app/shared/models/FacturaHistorial.model';
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
  facturasCredito:Factura[]
  factura:Factura
  Abono:FacturaHistorial
  
  montoTotal:number = 0
  restante:number   = 0
  abonado:number    = 0
  facturaId:number  = 0
  bloqueo:boolean   = false
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
    this._FacturasService.getFacturas({tipo_venta:1,status_pagado:0}).subscribe((facturas:Factura[]) => this.facturas = facturas )
    this._FacturasService.getFacturas({tipo_venta:1}).subscribe((facturas:Factura[]) => this.facturasCredito = facturas )
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
            Validators.min(1),
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
      this.Abono = abono
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
      // console.log(values);
      if(values.factura_id > 0){
        this.generarCalculo(values.factura_id)
        let maximo:number = this.restante
        // console.log(maximo);
        
        if(this.Id) maximo += this.Abono.precio
        // console.log(maximo);
        
        this.AbonoForm.get("precio").setValidators([
          Validators.required,
          Validators.maxLength(43),
          Validators.max(maximo),
          Validators.min(1),
          Validators.pattern(ValidFunctionsValidator.NumberRegEx), 
        ])
        
        // console.log(this.AbonoForm.get("precio"));
        // if(values.precio = this.restante){
          
        // }
      }
    })
  }
  
  generarCalculo(facturaId:number){
    let abonado:number       = 0
    let diferencia:number    = 0
    let total:number         = 0
    let bloqueoAbono:boolean = false
    // let factura:Factura      = this.facturas.find(factura => factura.id == facturaId)
    this.factura      = this.facturasCredito.find(factura => factura.id == facturaId)
    total = this.factura.monto
    
    if(this.factura.factura_historial.length > 0){
      let abonos:number[] =  this.factura.factura_historial.map(itemHistorial =>{ if(itemHistorial.estado == 1) return itemHistorial.precio   })
      let abonosActive = abonos.filter((abono) => abono != undefined );
      
      abonado    =  abonosActive.reduce((acum, precio) => acum + precio)
      console.log(abonado);
      
      if(abonado >= total){
        bloqueoAbono = true 
      }
      
      diferencia =  this.factura.monto - abonado
      
      // console.log(factura,abonos,abonosActive);
    }
    
    this.facturaId  = this.factura.id
    
    this.bloqueo    = bloqueoAbono
    this.abonado    = abonado
    this.restante   = diferencia
    this.montoTotal = total
    
  }
  
  get formularioControls(){
    return this.AbonoForm.controls
  }


  EnviarFormulario(){
    // console.log(this.editarClienteForm);
    // console.log(this.formularioControls);
    // console.log(this.AbonoForm.getRawValue());
    
    if(this.bloqueo && !this.Id){
      Swal.fire({
        text: "No puede agregar abonos en una factura que ya esta pagada",
        icon: 'warning',
      })
    }else{
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
  
}
