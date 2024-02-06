import { FormErrorMessages } from "app/shared/utils/interfaces";

export const ImportacionErrorMessages: FormErrorMessages = {
  fecha_inversion: {
    required: "Ingresa la fecha inversión para avanzar",
    maxlength: "La fecha de inversión tiene un limite de 80 caracteres.",
  },
  numero_recibo: {
    required: "Ingresa el numero de recibo para avanzar",
    maxlength: "La numero de recibo tiene un limite de 80 caracteres.",
  },
  numero_inversion: {
    required: "Ingresa el numero de inversión para avanzar",
    maxlength: "El numero de inversión tiene un limite de 80 caracteres.",
  },
  monto_compra: {
    required: "Ingresa el monto de compra para avanzar",
    maxlength: "El monto de compra tiene un limite de 80 caracteres.",
  },
  conceptualizacion: {
    required: "Ingresa la conceptualización para avanzar",
    maxlength: "La conceptualización tiene un limite de 80 caracteres.",
  },
  precio_envio: {
    required: "Ingresa el precio de envio para avanzar",
    maxlength: "El precio de envio tiene un limite de 80 caracteres.",
  },

};
