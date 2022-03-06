import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  
  Pagado:number = 0
  Diferencia:number = 0
  
  closeResult = '';
  expandedIndex:number = -1 
  
  constructor(
    private _FacturasService:FacturasService,
    private _ActivatedRoute: ActivatedRoute,
    private NgbModal: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.FacturaId = Number(this._ActivatedRoute.snapshot.params.id)
    this.facturaById(this.FacturaId)
  }
  
  facturaById(FacturaId:number){
    this.isLoad = true
    this._FacturasService.getFacturaById(FacturaId).subscribe((factura:Factura)=>{
      console.log(factura);
      
      this.Factura = factura
      
      if(factura.factura_historial.length > 0 && factura.tipo_venta){
        let pagos:number[] =[]
        
        pagos = factura.factura_historial.map(item => item.precio)
        this.Pagado = pagos.reduce((valorAnterior, valor) => valorAnterior + valor)
        this.Diferencia =  factura.monto - this.Pagado 
      }
      
      this.isLoad =false
    },()=> this.isLoad = false)
  }
  
  
  open(content:any) {
    this.NgbModal.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
  Collaps(index: number) {  
    this.expandedIndex = index === this.expandedIndex ? -1 : index;  
 
  } 

}
