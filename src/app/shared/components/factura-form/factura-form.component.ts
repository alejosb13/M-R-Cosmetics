import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { FacturaDetalle } from "@app/shared/models/FacturaDetalle.model";
import { Producto } from "@app/shared/models/Producto.model";
import { CommunicationService } from "@app/shared/services/communication.service";
import { ProductosService } from "@app/shared/services/productos.service";
import { ValidFunctionsValidator } from "@app/shared/utils/valid-functions.validator";
import logger from "app/shared/utils/logger";
import { Subscription } from "rxjs";
// import { AuthService } from 'app/auth/login/service/auth.service';
import Swal from "sweetalert2";

type ProductoDetalle = Producto & FacturaDetalle;

@Component({
  selector: "app-factura-editar-form",
  templateUrl: "./factura-form.component.html",
  styleUrls: ["./factura-form.component.css"],
})
export class FacturaEditarFormComponent implements OnInit {
  ProductForm: UntypedFormGroup;
  // Categorias:Categoria[]
  // Frecuencias:Frecuencia[]
  daysOfWeek: string[];
  loadInfo: boolean = false;
  precioTotal: number = 0;
  produ: Producto;
  // isAdmin:boolean

  // @ViewChild('diasCobro') diasCobroInput: ElementRef;
  @Input() producto: ProductoDetalle;
  @Output() FormsValues = new EventEmitter<FacturaDetalle>();
  // @Output() FormsValues = new EventEmitter<Producto>();

  themeSite: string;
  themeSubscription: Subscription;

  constructor(
    private _CommunicationService: CommunicationService,
    private fb: UntypedFormBuilder,
    private _ProductosService: ProductosService
  ) // private _AuthService: AuthService,
  {}

  ngOnInit(): void {
    // console.log(this.producto);

    // this.precio = this.producto.precio
    // this.isAdmin = this._AuthService.isAdmin()

    logger.log("[ModalEdirtar]", this.producto);
    this.definirValidaciones();
    this.setFormValues();
    this.getProducto();

    this.calculatePrice();
    this.changeValues();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  getProducto() {
    this._ProductosService
      .getProductoById(this.producto.producto_id)
      .subscribe((producto) => {
        logger.log(producto.stock);
        logger.log(this.producto.cantidad);
        logger.log(producto.stock + this.producto.cantidad);

        // this.produ = producto
        this.ProductForm.get("stock").setValidators([
          Validators.required,
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          Validators.max(producto.stock + this.producto.cantidad),
          Validators.min(1),
        ]);
      });
  }

  definirValidaciones() {
    this.ProductForm = this.fb.group({
      stock: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(ValidFunctionsValidator.NumberRegEx),
          // Validators.max(this.producto.stock),
          Validators.min(1),
        ]),
      ],
      precio: [
        "",
        Validators.compose([
          Validators.required,
          // Validators.maxLength(80),
          Validators.pattern(ValidFunctionsValidator.DecimalRegEx),
          // Validators.minLength(3),
        ]),
      ],
    });
  }

  setFormValues() {
    this.ProductForm.setValue({
      stock: this.producto.cantidad,
      precio: this.producto.precio_unidad,
    });
  }

  changeValues() {
    this.ProductForm.valueChanges.subscribe((valuesForm) => {
      logger.log(valuesForm);
      this.calculatePrice();
    });
  }

  calculatePrice() {
    this.precioTotal =
      this.formularioControls.precio.value *
      this.formularioControls.stock.value;
  }

  get formularioControls() {
    return this.ProductForm.controls;
  }

  EnviarFormulario() {
    if (this.ProductForm.valid) {
      let producto = { ...this.producto };
      producto.precio = Number(this.precioTotal);
      producto.precio_unidad = Number(this.formularioControls.precio.value);
      producto.cantidad = Number(this.formularioControls.stock.value);
      producto.porcentaje = 0;

      // console.log(producto);

      this.FormsValues.emit(producto);
    } else {
      Swal.mixin({
        customClass: {
          container: this.themeSite, // Clase para el modo oscuro
        },
      }).fire({
        text: "Complete todos los campos obligatorios",
        icon: "warning",
      });
    }
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
