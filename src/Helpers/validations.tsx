export const validateRut = (rut: string): boolean => {
  const rutRegex = /^[0-9]{1,8}-[0-9kK]{1}$/;
  return rutRegex.test(rut);
};

export const sanitizeRut = (rut: string): string => {

  return rut.replace(/\./g, "");
};

export const restrictRutInput = (text: string): string => {

  return text.replace(/[^0-9kK\-]/g, "");
};

export const validateOnlyText = (text: string): boolean => {
  const textRegex = /^[a-zA-Z\sáéíóúñÁÉÍÓÚÑ]+$/;
  return textRegex.test(text);
};

export const validatecorreo = (correo: string): boolean => {
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return correoRegex.test(correo);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{8,15}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
export const validateRutWithDV = (rut: string): boolean => {
  const [body, dv] = rut.split("-");
  if (!body || !dv) return false;

  let total = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    total += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const calculatedDV = 11 - (total % 11);

  const dvChar = calculatedDV === 11 ? "0" : calculatedDV === 10 ? "K" : calculatedDV.toString();
  return dvChar.toUpperCase() === dv.toUpperCase();
};

export default {}