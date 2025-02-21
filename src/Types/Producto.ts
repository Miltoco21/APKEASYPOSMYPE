export default interface Producto {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precioVenta?: number;
  codigoBarras?: string;
  precioCosto?: number;
  // Agrega otras propiedades necesarias según tu API
}