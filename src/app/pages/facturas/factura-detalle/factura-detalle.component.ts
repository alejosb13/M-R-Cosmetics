import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'app/auth/login/service/auth.service';
import { Factura } from 'app/shared/models/Factura.model';
import { FacturaDetalle } from 'app/shared/models/FacturaDetalle.model';
import { Producto } from 'app/shared/models/Producto.model';
import { FacturaDetalleService } from 'app/shared/services/facturaDetalle.service';
import { FacturasService } from 'app/shared/services/facturas.service';
import { HelpersService } from 'app/shared/services/helpers.service';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

type ProductoDetalle = Producto & FacturaDetalle

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

  ProductoDetalle:Producto

  isAdmin:boolean

  constructor(
    private _FacturasService:FacturasService,
    private _ActivatedRoute: ActivatedRoute,
    private _HelpersService: HelpersService,
    private _FacturaDetalleService: FacturaDetalleService,
    private _AuthService: AuthService,
    private NgbModal: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.isAdmin = this._AuthService.isAdmin()
    this.FacturaId = Number(this._ActivatedRoute.snapshot.params.id)
    this.facturaById(this.FacturaId)
  }

  facturaById(FacturaId:number){
    this.isLoad = true
    this._FacturasService.getFacturaById(FacturaId)
    // .pipe(
    //   map((factura : Factura) => {
    //     factura.factura_historial = factura.factura_historial.filter( abono => abono.estado == 1)
    //     return factura
    //   })
    // )
    .subscribe((factura:Factura)=>{
      console.log(factura);

      this.Factura = factura

      // if(factura.factura_historial.length > 0 && factura.tipo_venta == 1){
      //   let abonos:any =  factura.factura_historial.map(itemHistorial =>{ if(itemHistorial.estado == 1) return itemHistorial.precio   })
      //   let abonosStatusActive = abonos.filter((abono:any) => abono != undefined );

      //   this.Pagado = abonosStatusActive.reduce((valorAnterior:number, valor:number) => valorAnterior + valor)
      //   this.Diferencia =  factura.monto - this.Pagado
      // }else{
      //   this.Diferencia =  factura.monto
      // }

      this.isLoad = false
    },()=> this.isLoad = false)
  }

  descargarPDF(){
    // let data = {
    //   factura: this.Factura,
    //   abonado:this.Pagado,
    //   diferencia:this.Diferencia
    // }
    this._FacturasService.FacturaPDF(this.FacturaId).subscribe((data)=>{
      console.log(data);
      this._HelpersService.downloadFile(data,`Detalle_Factura_${this.FacturaId}`)

    })
  }


  open(content:any) {
    this.NgbModal.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditFactura(content:any,producto:Producto) {

    this.ProductoDetalle = producto
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

  FormsValues(productoDetalle:ProductoDetalle){
    console.log(productoDetalle);

    this._FacturaDetalleService.updateFacturaDetalle(Number(productoDetalle?.id),productoDetalle).subscribe((data)=>{
      // console.log(data);

      this.facturaById(this.FacturaId)

      Swal.fire({
        text: data[0],
        icon: 'success',
      })
    })
  }

  despachar(id:number){
    // console.log(id);
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este factura será regresada a la seccion de facturas despachadas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51cbce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Realizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this._FacturasService.despacharFactura(id,{despachado:0}).subscribe((data)=>{
          this.facturaById(this.FacturaId)
          Swal.fire({
            text: data[0],
            icon: 'success',
          })
        })
      }
    })
  }
}
