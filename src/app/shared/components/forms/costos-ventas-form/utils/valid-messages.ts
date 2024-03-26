import { FormErrorMessages } from "app/shared/utils/interfaces";

export const CostoVentaErrorMessages: FormErrorMessages = {
  costo: {
    required: "Ingresa el costo para avanzar",
    maxlength: "El costo tiene un limite de 80 caracteres.",
  },
  producto_id: {},
};
