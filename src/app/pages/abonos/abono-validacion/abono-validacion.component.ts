import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AbonoService } from "app/shared/services/abono.service";
import { Listado } from "app/shared/services/listados.service";
import { HelpersService } from "app/shared/services/helpers.service";
import { CommunicationService } from "@app/shared/services/communication.service";
import { Link, ListadoModel } from "app/shared/models/Listados.model";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

@Component({
  selector: "app-abono-validacion",
  templateUrl: "./abono-validacion.component.html",
  styleUrls: ["./abono-validacion.component.css"],
})
export class AbonoValidacionComponent implements OnInit {
  // Listado
  resumenBancarios: any[] = [];
  listadoData: ListadoModel<any>;
  isLoad: boolean = false;

  // Filtros
  dateIni: string = "";
  dateFin: string = "";
  allDates: boolean = false;
  monedaFiltro: string = "";
  estadoConciliacion: string = "";
  filter: string = "";
  disablePaginate: number = 0;

  // Tema
  themeSite: string;
  private themeSubscription: Subscription;

  // --- Modal Agregar (Excel → cargarResumenBancario) ---
  excelData: any[] = [];
  excelColumns: string[] = [];
  excelFileName: string = "";
  excelError: string = "";
  isCargando: boolean = false;
  cargarResultado: any = null;

  // --- Modal Validar (fecha + moneda → validarExcelAutorizacionesAbonos) ---
  validarFechaInicio: string = "";
  validarFechaFin: string = "";
  validarMoneda: string = "Cordoba";
  isValidando: boolean = false;
  validarResultado: any = null;

  // --- Modal Reiniciar (fecha + moneda → reiniciarResumenBancario) ---
  reiniciarFechaInicio: string = "";
  reiniciarFechaFin: string = "";
  reiniciarMoneda: string = "Cordoba";
  isReiniciando: boolean = false;

  // --- Modal Desestimar (estado error genérico / otro recibo) ---
  selectedItem: any = null;
  esPendienteSinMatch: boolean = false;
  desestimando_relacionar: boolean = false;
  pendiente_relacionar: boolean = false;
  pendiente_validar_sin_relacion: boolean = false;
  numero_recibo: number | null = null;
  desestimar_motivo: string = "";
  isDesestimando: boolean = false;

  // --- Modal Resolver diferencia Fase A (excede | menor) ---
  resolver_comentario: string = "";
  isResolviendo: boolean = false;

  constructor(
    private _Listado: Listado,
    private _AbonoService: AbonoService,
    private _HelpersService: HelpersService,
    private _CommunicationService: CommunicationService,
    private NgbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.setCurrentDate();
    this.asignarValores();

    this.themeSubscription = this._CommunicationService
      .getTheme()
      .subscribe((color: string) => {
        this.themeSite = color === "black" ? "dark-mode" : "light-mode";
      });
  }

  setCurrentDate() {
    const current = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY-MM-DD"
    );
    const month = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "MM"
    );
    const year = this._HelpersService.changeformatDate(
      this._HelpersService.currentDay(),
      "MM/DD/YYYY",
      "YYYY"
    );
    const rangoMonth = this._HelpersService.InicioYFinDeMes(current);

    this.dateIni = `${year}-${month}-01`;
    this.dateFin = `${year}-${month}-${rangoMonth.ultimoDiaDelMes}`;
    this.validarFechaInicio = this.dateIni;
    this.validarFechaFin = this.dateFin;
    this.reiniciarFechaInicio = this.dateIni;
    this.reiniciarFechaFin = this.dateFin;
  }

  asignarValores() {
    this.isLoad = true;
    const options: any = { disablePaginate: this.disablePaginate, allDates: this.allDates ? 1 : 0 };
    if (!this.allDates && this.dateIni) options.dateIni = this.dateIni;
    if (!this.allDates && this.dateFin) options.dateFin = this.dateFin;
    if (this.monedaFiltro) options.moneda = this.monedaFiltro;
    if (this.estadoConciliacion) options.estado_conciliacion = this.estadoConciliacion;
    if (this.filter) options.filter = this.filter;

    this._Listado.resumenBancarioList(options).subscribe(
      (data) => {
        this.listadoData = data;
        this.resumenBancarios = data.data ?? data;
        this.isLoad = false;
      },
      () => { this.isLoad = false; }
    );
  }

  BuscarValor() {
    this.asignarValores();
  }

  aplicarFiltros() {
    this.asignarValores();
    this.NgbModal.dismissAll();
  }

  limpiarFiltros() {
    this.setCurrentDate();
    this.allDates = false;
    this.monedaFiltro = "";
    this.estadoConciliacion = "";
    this.filter = "";
    this.asignarValores();
  }

  newPage(link: Link) {
    if (!link.url) return;
    const options: any = { disablePaginate: this.disablePaginate, allDates: this.allDates ? 1 : 0 };
    if (!this.allDates && this.dateIni) options.dateIni = this.dateIni;
    if (!this.allDates && this.dateFin) options.dateFin = this.dateFin;
    if (this.monedaFiltro) options.moneda = this.monedaFiltro;
    if (this.estadoConciliacion) options.estado_conciliacion = this.estadoConciliacion;
    if (this.filter) options.filter = this.filter;

    this.isLoad = true;

    // Construir URL paginada
    let URL = link.url + "&";
    for (const key in options) { URL += `${key}=${options[key]}&`; }

    this._Listado.resumenBancarioList({ link: link.url, ...options }).subscribe(
      (data) => {
        this.listadoData = data;
        this.resumenBancarios = data.data ?? data;
        this.isLoad = false;
      },
      () => { this.isLoad = false; }
    );
  }

  // ──────────────────────────────────────────────────────
  // Modal Filtros
  // ──────────────────────────────────────────────────────
  openFiltros(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-filtros-title",
      windowClass: this.themeSite === "dark-mode" ? "dark-modal" : "white-modal",
    });
  }

  // ──────────────────────────────────────────────────────
  // Modal Agregar (cargar Excel → resumen_bancarios)
  // ──────────────────────────────────────────────────────
  openAgregar(content: any) {
    this.resetAgregarModal();
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-agregar-title",
      size: "lg",
      windowClass: this.themeSite === "dark-mode" ? "dark-modal" : "white-modal",
    });
  }

  onExcelFileChange(event: any) {
    this.excelError = "";
    this.excelData = [];
    this.excelColumns = [];

    const file: File = event.target.files[0];
    if (!file) return;

    const allowedExtensions = [".xlsx", ".xls"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      this.excelError = "Solo se aceptan archivos .xlsx o .xls";
      this.excelFileName = "";
      event.target.value = "";
      return;
    }

    this.excelFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array", cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
        this.excelError = "El archivo Excel está vacío.";
        return;
      }

      const formattedData = jsonData.map((row: any) => {
        const newRow: any = {};
        for (const key of Object.keys(row)) {
          const val = row[key];
          if (val instanceof Date) {
            const dd = String(val.getDate()).padStart(2, "0");
            const mm = String(val.getMonth() + 1).padStart(2, "0");
            const yyyy = val.getFullYear();
            newRow[key] = `${dd}-${mm}-${yyyy}`;
          } else {
            newRow[key] = val;
          }
        }
        return newRow;
      });

      this.excelColumns = Object.keys(formattedData[0]);
      this.excelData = formattedData;
    };
    reader.readAsArrayBuffer(file);
  }

  confirmarAgregar(modal: any) {
    if (this.excelData.length === 0) return;

    this.isCargando = true;
    this._AbonoService.cargarResumenBancario(this.excelData).subscribe(
      (res) => {
        this.isCargando = false;
        this.cargarResultado = res;
        modal.close("confirm");
        this.resetAgregarModal();
        this.asignarValores();
        Swal.mixin({ customClass: { container: this.themeSite } }).fire({
          icon: "success",
          title: "Carga completada",
          html: `<b>${res.nuevos}</b> registros nuevos. <b>${res.existentes}</b> ya existían.`,
        });
      },
      (err) => {
        this.isCargando = false;
        Swal.fire({
          icon: "error",
          title: "Error al cargar",
          text: err?.error?.message || "Ocurrió un error al enviar los datos.",
        });
      }
    );
  }

  resetAgregarModal() {
    this.excelData = [];
    this.excelColumns = [];
    this.excelFileName = "";
    this.excelError = "";
    this.isCargando = false;
  }

  // ──────────────────────────────────────────────────────
  // Modal Validar (fechaInicio + fechaFin + moneda)
  // ──────────────────────────────────────────────────────
  openValidar(content: any) {
    this.validarResultado = null;
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-validar-title",
      size: "lg",
      windowClass: this.themeSite === "dark-mode" ? "dark-modal" : "white-modal",
    });
  }

  confirmarValidar(modal: any) {
    if (!this.validarFechaInicio || !this.validarFechaFin || !this.validarMoneda) return;

    this.isValidando = true;
    this._AbonoService
      .validarResumenBancario({
        fechaInicio: this.validarFechaInicio,
        fechaFin: this.validarFechaFin,
        moneda: this.validarMoneda,
      })
      .subscribe(
        (res) => {
          this.isValidando = false;
          this.validarResultado = res;
          modal.close("confirm");
          this.asignarValores();
          Swal.mixin({ customClass: { container: this.themeSite } }).fire({
            icon: "success",
            title: "Validación completada",
            text: `${res.total_procesados} registros procesados.`,
          });
        },
        (err) => {
          this.isValidando = false;
          Swal.fire({
            icon: "error",
            title: "Error al validar",
            text: err?.error?.mensaje || err?.error?.message || "Ocurrió un error.",
          });
        }
      );
  }

  // ──────────────────────────────────────────────────────
  // Modal Reiniciar (fechaInicio + fechaFin + moneda)
  // ──────────────────────────────────────────────────────
  openReiniciar(content: any) {
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-reiniciar-title",
      size: "lg",
      windowClass: this.themeSite === "dark-mode" ? "dark-modal" : "white-modal",
    });
  }

  confirmarReiniciar(modal: any) {
    if (!this.reiniciarFechaInicio || !this.reiniciarFechaFin || !this.reiniciarMoneda) return;

    Swal.mixin({ customClass: { container: this.themeSite } })
      .fire({
        title: "¿Reiniciar abonos validados?",
        html: `Se eliminarán las validaciones y los registros del rango volverán a <strong>pendiente</strong> como recién cargados.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#51cbce",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, reiniciar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (!result.isConfirmed) return;

        this.isReiniciando = true;
        this._AbonoService
          .reiniciarResumenBancario({
            fechaInicio: this.reiniciarFechaInicio,
            fechaFin: this.reiniciarFechaFin,
            moneda: this.reiniciarMoneda,
          })
          .subscribe(
            (res) => {
              this.isReiniciando = false;
              modal.close("confirm");
              this.asignarValores();
              Swal.mixin({ customClass: { container: this.themeSite } }).fire({
                icon: "success",
                title: "Reinicio completado",
                text: `${res.total_reiniciados ?? 0} registros reiniciados.`,
              });
            },
            (err) => {
              this.isReiniciando = false;
              Swal.fire({
                icon: "error",
                title: "Error al reiniciar",
                text: err?.error?.mensaje || err?.error?.message || "Ocurrió un error.",
              });
            }
          );
      });
  }

  // ──────────────────────────────────────────────────────
  // Modal Desestimar (estado error)
  // ──────────────────────────────────────────────────────
  openDesestimar(item: any, content: any) {
    this.selectedItem = item;
    this.esPendienteSinMatch = this.requiereResolucionPendiente(item);
    this.desestimando_relacionar = false;
    this.pendiente_relacionar = false;
    this.pendiente_validar_sin_relacion = false;
    this.numero_recibo = null;
    this.desestimar_motivo = "";
    this.isDesestimando = false;
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-desestimar-title",
      size: "md",
      windowClass: this.themeSite === "dark-mode" ? "dark-modal" : "white-modal",
    });
  }

  confirmarDesestimar(modal: any) {
    const payload: any = {
      id: this.selectedItem?.id,
      numero_recibo: null,
      motivo: this.desestimar_motivo?.trim() || null,
    };

    this.isDesestimando = true;
    this._AbonoService.desestimiarResumenBancario(payload).subscribe(
      (res) => {
        this.isDesestimando = false;
        modal.close("confirm");
        this.asignarValores();
        Swal.mixin({ customClass: { container: this.themeSite } }).fire({
          icon: "success",
          title: "Abono desestimado",
          text: res?.mensaje || res?.message || "El abono fue procesado correctamente.",
        });
      },
      (err) => {
        this.isDesestimando = false;
        Swal.fire({
          icon: "error",
          title: "Error al desestimar",
          text: err?.error?.message || err?.error?.mensaje || "Ocurrió un error al procesar la solicitud.",
        });
      }
    );
  }

  onPendienteRelacionarChange(activo: boolean) {
    if (activo) {
      this.pendiente_validar_sin_relacion = false;
      return;
    }
    this.numero_recibo = null;
  }

  onPendienteValidarSinRelacionChange(activo: boolean) {
    if (activo) {
      this.pendiente_relacionar = false;
      this.numero_recibo = null;
    }
  }

  confirmarValidarPendiente(modal: any) {
    if (!this.puedeValidarPendiente()) return;

    const payload: {
      id: number;
      numero_recibo?: number | null;
      motivo: string;
      accion?: 'validar_sin_relacion';
    } = {
      id: this.selectedItem?.id,
      motivo: this.desestimar_motivo.trim(),
    };

    if (this.pendiente_validar_sin_relacion) {
      payload.accion = 'validar_sin_relacion';
      payload.numero_recibo = null;
    } else {
      payload.numero_recibo = this.numero_recibo;
    }

    this.isDesestimando = true;
    this._AbonoService.desestimiarResumenBancario(payload).subscribe(
      (res) => {
        this.isDesestimando = false;
        modal.close("confirm");
        this.asignarValores();
        Swal.mixin({ customClass: { container: this.themeSite } }).fire({
          icon: "success",
          title: "Abono validado",
          text: res?.mensaje || res?.message || "El abono fue validado correctamente.",
        });
      },
      (err) => {
        this.isDesestimando = false;
        Swal.fire({
          icon: "error",
          title: "Error al validar",
          text: err?.error?.message || err?.error?.mensaje || "Ocurrió un error al procesar la solicitud.",
        });
      }
    );
  }

  confirmarDesestimarError(modal: any) {
    const payload: any = {
      id: this.selectedItem?.id,
      numero_recibo: this.desestimando_relacionar ? this.numero_recibo : null,
      motivo: this.desestimando_relacionar
        ? (this.desestimar_motivo?.trim() || null)
        : this.desestimar_motivo,
    };

    this.isDesestimando = true;
    this._AbonoService.desestimiarResumenBancario(payload).subscribe(
      (res) => {
        this.isDesestimando = false;
        modal.close("confirm");
        this.asignarValores();
        Swal.mixin({ customClass: { container: this.themeSite } }).fire({
          icon: "success",
          title: this.desestimando_relacionar ? "Abono validado" : "Abono desestimado",
          text: res?.mensaje || res?.message || "El abono fue procesado correctamente.",
        });
      },
      (err) => {
        this.isDesestimando = false;
        Swal.fire({
          icon: "error",
          title: "Error al procesar",
          text: err?.error?.message || err?.error?.mensaje || "Ocurrió un error al procesar la solicitud.",
        });
      }
    );
  }

  requiereResolucionDiferencia(item: any): boolean {
    return (
      item?.estado_conciliacion === "error" &&
      (item?.estado_validacion === "excede" || item?.estado_validacion === "menor")
    );
  }

  requiereResolucionPendiente(item: any): boolean {
    return (
      item?.estado_conciliacion === "pendiente" &&
      item?.estado_validacion === "no_encontrado"
    );
  }

  /** Validación creada desde listado abonos — sin acciones en resumen bancario. */
  esErrorManualDesdeAbonos(item: any): boolean {
    if (item?.estado_validacion === "error_manual") return true;

    const mensaje = String(item?.mensaje ?? "");
    return (
      item?.estado_conciliacion === "error" &&
      mensaje.includes("[Creado desde Abonos - Manual]")
    );
  }

  muestraBotonDesestimarError(item: any): boolean {
    return (
      item?.estado_conciliacion === "error" &&
      !this.requiereResolucionDiferencia(item) &&
      !this.esErrorManualDesdeAbonos(item)
    );
  }

  puedeConfirmarDesestimar(): boolean {
    if (this.isDesestimando) return false;
    return !!this.desestimar_motivo?.trim();
  }

  puedeValidarPendiente(): boolean {
    if (this.isDesestimando || !this.desestimar_motivo?.trim()) return false;

    if (this.pendiente_validar_sin_relacion) return true;

    return this.pendiente_relacionar && !!this.numero_recibo;
  }

  openResolverDiferencia(item: any, content: any) {
    this.selectedItem = item;
    this.resolver_comentario = "";
    this.isResolviendo = false;
    this.NgbModal.open(content, {
      ariaLabelledBy: "modal-resolver-diferencia-title",
      size: "md",
      windowClass: this.themeSite === "dark-mode" ? "dark-modal" : "white-modal",
    });
  }

  confirmarAprobarDiferencia(modal: any) {
    if (!this.selectedItem?.id) return;

    this.isResolviendo = true;
    this._AbonoService
      .aprobarResumenBancario({
        id: this.selectedItem.id,
        comentario: this.resolver_comentario?.trim() || null,
      })
      .subscribe(
        (res) => {
          this.isResolviendo = false;
          modal.close("confirm");
          this.asignarValores();
          Swal.mixin({ customClass: { container: this.themeSite } }).fire({
            icon: "success",
            title: "Abono aprobado",
            text: res?.mensaje || "El abono quedó en estado validado.",
          });
        },
        (err) => {
          this.isResolviendo = false;
          Swal.fire({
            icon: "error",
            title: "Error al aprobar",
            text: err?.error?.mensaje || err?.error?.message || "Ocurrió un error.",
          });
        }
      );
  }

  confirmarNoAplicaDiferencia(modal: any) {
    if (!this.resolver_comentario?.trim() || !this.selectedItem?.id) return;

    this.isResolviendo = true;
    this._AbonoService
      .desestimiarResumenBancario({
        id: this.selectedItem.id,
        numero_recibo: null,
        motivo: this.resolver_comentario.trim(),
      })
      .subscribe(
        (res) => {
          this.isResolviendo = false;
          modal.close("confirm");
          this.asignarValores();
          Swal.mixin({ customClass: { container: this.themeSite } }).fire({
            icon: "success",
            title: "Marcado como no aplica",
            text: res?.mensaje || "El registro fue actualizado.",
          });
        },
        (err) => {
          this.isResolviendo = false;
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err?.error?.mensaje || err?.error?.message || "Ocurrió un error.",
          });
        }
      );
  }

  getRowClass(estado: string, estadoValidacion?: string): string {
    if (estado === "validado") return "table-success";
    if (estado === "no_aplica") return "table-secondary";
    if (estado === "error") return "table-danger";
    if (estadoValidacion === "excede" || estadoValidacion === "menor" || estadoValidacion === "error_manual") return "table-danger";
    if (estado === "pendiente" && estadoValidacion === "no_encontrado") return "table-pendiente-revisado";
    return "table-warning";
  }

  getEstadoValidacionLabel(estado: string): string {
    const labels: Record<string, string> = {
      ok: "Coincide",
      excede: "Monto mayor",
      menor: "Monto menor",
      no_encontrado: "No encontrado",
      no_aplica: "No aplica",
      error_manual: "Error manual",
    };
    return labels[estado] ?? estado ?? "-";
  }

  /** Monto de diferencia en USD para la columna Validación (valor absoluto). */
  formatDiferenciaUsd(valor: number | null | undefined): string {
    if (valor == null || isNaN(Number(valor))) {
      return "—";
    }
    return `${Math.abs(Number(valor)).toFixed(2)} USD`;
  }

  muestraIndicadorDiferencia(estadoValidacion: string | null | undefined): boolean {
    return estadoValidacion === "ok" || estadoValidacion === "excede" || estadoValidacion === "menor";
  }

  ngOnDestroy() {
    if (this.themeSubscription) this.themeSubscription.unsubscribe();
  }
}
