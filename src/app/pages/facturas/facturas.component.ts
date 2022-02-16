import { Component, OnInit } from '@angular/core';
import { Factura } from 'app/shared/models/Factura.model';
import { FacturasService } from 'app/shared/services/facturas.service';
import { ProductosService } from 'app/shared/services/productos.service';
import { TablasService } from 'app/shared/services/tablas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  page = 1;
  pageSize = 3;
  collectionSize = 0;
  Facturas: Factura[];
  isLoad:boolean
  
  constructor(
    private _FacturasService:FacturasService,
    private _TablasService:TablasService,
  ) {}
  
  ngOnInit(): void {
    this.asignarValores()
  }


  asignarValores(){
    this.isLoad = true
    
    this._FacturasService.getFacturas().subscribe((factura:Factura[])=> {
      console.log(factura);
          
      this.Facturas = [...factura]
      this._TablasService.datosTablaStorage = [...factura]
      this._TablasService.total = factura.length
      this._TablasService.busqueda = "" 
      
      this.refreshCountries() 
      this.isLoad =false
    },(error)=>{
      this.isLoad =false
    }) 
  }
  
  refreshCountries() {
    this._TablasService.datosTablaStorage = [...this.Facturas]
    .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
  
  BuscarValor(){
    this._TablasService.buscar(this.Facturas)
    
    if(this._TablasService.busqueda ==""){this.refreshCountries()}
    
  }
  
  eliminar({id}:Factura){
    // console.log(id);
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Este factura se eliminará y no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._FacturasService.deleteFactura(id).subscribe((data)=>{
          this.Facturas = this.Facturas.filter(factura => factura.id != id)
          this.refreshCountries()

          Swal.fire({
            text: data[0],
            icon: 'success',
          })
        })
      }
    })
  }

}
