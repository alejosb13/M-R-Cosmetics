export const FormatInDecimalToFixed = (valor: number, decimales: number = 2) =>
  Number((Math.round(valor * 100) / 100).toFixed(decimales));

/**
 * Formatea un monto numérico a notación abreviada (K para miles, M para millones)
 * Ejemplos: 5000 -> "5K", 5400 -> "5.4K", 1200000 -> "1.2M"
 */
export function formatearMonto(value: number): string {
  if (value === 0) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1000000) {
    // Millones
    const millones = absValue / 1000000;
    return sign + (millones % 1 === 0 ? millones.toFixed(0) : millones.toFixed(1)) + 'M';
  } else if (absValue >= 1000) {
    // Miles
    const miles = absValue / 1000;
    return sign + (miles % 1 === 0 ? miles.toFixed(0) : miles.toFixed(1)) + 'K';
  } else {
    // Menor a 1000
    return sign + absValue.toFixed(0);
  }
}

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
