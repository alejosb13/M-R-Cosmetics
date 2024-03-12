export const FormatInDecimalToFixed = (valor: number, decimales: number = 2) =>
  Number((Math.round(valor * 100) / 100).toFixed(decimales));