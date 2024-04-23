import { FormErrorMessages } from "app/shared/utils/interfaces";

export const GastoErrorMessages: FormErrorMessages = {
  tipo: {
    required: "Ingresa el tipo para avanzar"
  },
  conceptualizacion: {
    required: "Ingresa la conceptualización  para avanzar",
    maxlength: "La conceptualización tiene un limite de 160 caracteres.",
  },
  numero: {
    required: "Ingresa el número para avanzar",
    maxlength: "El número tiene un limite de 80 caracteres.",
  },
  monto: {
    required: "Ingresa el monto para avanzar",
    maxlength: "El monto tiene un limite de 16 caracteres.",
  },
  fecha_comprobante: {
    required: "Ingresa la fecha de comprobante para avanzar"
  },
  tipo_pago: {
    required: "Ingresa el método de pago para avanzar"
  },
  pago_desc: {
    required: "Ingresa la descripción del pago para avanzar",
    maxlength: "La descripción del pago tiene un limite de 160 caracteres.",
  },
};
