import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Factura } from 'app/shared/models/Factura.model';
import { FacturasService } from 'app/shared/services/facturas.service';

@Component({
  selector: 'app-factura-detalle',
  templateUrl: './factura-detalle.component.html',
  styleUrls: ['./factura-detalle.component.css']
})
export class FacturaDetalleComponent implements OnInit {
  isLoad:boolean = false;
  FacturaId:number
  Factura:Factura
  
  constructor(
    private _FacturasService:FacturasService,
    private _ActivatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.FacturaId = Number(this._ActivatedRoute.snapshot.params.id)
    this.clienteById(this.FacturaId)
  }
  
  clienteById(FacturaId:number){
    this.isLoad = true
    this._FacturasService.getFacturaById(FacturaId).subscribe((factura:Factura)=>{
      console.log(factura);
      this.isLoad =false
      this.Factura = factura
    },()=> this.isLoad = false)
  }

}
