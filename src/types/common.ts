/** Instante ISO 8601 con offset explícito; los adaptadores emiten UTC con Z. */
export type ISODateTime = string;

/** Identificador IANA, por ejemplo Europe/Madrid. */
export type TimeZone = string;

export type Coordinates = {
  latitude: number;
  longitude: number;
};
