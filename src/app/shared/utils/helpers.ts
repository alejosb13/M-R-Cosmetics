export const FormatInDecimalToFixed = (valor: number, decimales: number = 2) =>
  Number((Math.round(valor * 100) / 100).toFixed(decimales));

export function abreviarNombre(nombreCompleto: string): string {
  // 1. Dividimos el nombre en palabras
  let partes = nombreCompleto
    .trim()
    .split(/\s+/) // separa por espacios múltiples
    .filter(
      (p) => !["de", "la", "los", "las", "del"].includes(p.toLowerCase())
    ); // quita conectores comunes

  // 2. Si solo hay dos partes (nombre + apellido)
  if (partes.length === 2) {
    return `${partes[0]} ${partes[1][0].toUpperCase()}.`;
  }

  // 3. Si hay más partes: dejamos el primer nombre y las iniciales de los últimos dos apellidos
  const nombre = partes[0];
  const apellidos = partes
    .slice(-2)
    .map((a) => `${a[0].toUpperCase()}.`)
    .join(" ");

  return `${nombre} ${apellidos}`;
}
