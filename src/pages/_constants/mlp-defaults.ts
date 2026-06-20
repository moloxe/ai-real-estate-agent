import type { MlpRequest } from "../_types/types";

/**
 * Valores por defecto "optimistas" para cada campo del MLP.
 * Usados cuando el usuario no menciona un parámetro en su mensaje.
 */
export const MLP_DEFAULTS: MlpRequest = {
  Capacidad: 4,
  Baños: 1,
  Camas: 2,
  "Precio por noche": 150,
  "Tipo de habitación": "Entire home/apt",
  "Política de cancelación": "flexible",
  "Número de cuartos o habitaciones": 2,
  "Tiempo como host en años": 3,
  "Instant bookable": "t",
  "Disponibilidad mayor a 90 días": "t",
  "Ubicación exacta": "t",
  "Número de servicios o amenidades": 15,
  "Tipo de alojamiento": "Apartment",
  "¿Identidad verificada del host?": "t",
  "Tipo de cama": "Real Bed",
  "Promedio de reviews o calificaión": 90,
  "Número de reviews o reseñas": 20,
  "¿Host tiene foto de perfil?": "t",
  "Verificar teléfono de huésped": "t",
  "¿Es superhost?": "t",
};

/**
 * Descripción legible de cada campo (para que el agente reporte qué asumió).
 */
export const MLP_FIELD_LABELS: Record<keyof MlpRequest, string> = {
  Capacidad: "Capacidad de huéspedes",
  Baños: "Número de baños",
  Camas: "Número de camas",
  "Precio por noche": "Precio por noche (USD)",
  "Tipo de habitación": "Tipo de habitación",
  "Política de cancelación": "Política de cancelación",
  "Número de cuartos o habitaciones": "Número de cuartos",
  "Tiempo como host en años": "Tiempo como host (años)",
  "Instant bookable": "Reserva instantánea",
  "Disponibilidad mayor a 90 días": "Disponibilidad >90 días",
  "Ubicación exacta": "Ubicación exacta disponible",
  "Número de servicios o amenidades": "Número de amenidades",
  "Tipo de alojamiento": "Tipo de alojamiento",
  "¿Identidad verificada del host?": "Identidad verificada",
  "Tipo de cama": "Tipo de cama",
  "Promedio de reviews o calificaión": "Promedio de reviews",
  "Número de reviews o reseñas": "Número de reseñas",
  "¿Host tiene foto de perfil?": "Foto de perfil del host",
  "Verificar teléfono de huésped": "Verificación telefónica",
  "¿Es superhost?": "¿Es superhost?",
};

/**
 * Prompt que se inyecta al LanguageModel para extraer parámetros del mensaje del usuario.
 * El modelo debe responder SOLO con JSON válido.
 */
export const MLP_EXTRACTION_PROMPT = `Eres un extractor de datos. Analiza el siguiente mensaje del usuario y extrae SOLO los parámetros de un inmueble que se mencionan explícitamente.

Los campos posibles son:
- Capacidad (número de huéspedes)
- Baños (número de baños)
- Camas (número de camas)
- "Precio por noche" (número en USD)
- "Tipo de habitación" (opciones: "Entire home/apt", "Private room", "Shared room")
- "Política de cancelación" (opciones: "flexible", "moderate", "strict")
- "Número de cuartos o habitaciones" (número)
- "Tiempo como host en años" (número)
- "Instant bookable" (opciones: "t" o "f")
- "Disponibilidad mayor a 90 días" (opciones: "t" o "f")
- "Ubicación exacta" (opciones: "t" o "f")
- "Número de servicios o amenidades" (número)
- "Tipo de alojamiento" (opciones: "Apartment", "House", "Condominium", "Loft", etc.)
- "¿Identidad verificada del host?" (opciones: "t" o "f")
- "Tipo de cama" (opciones: "Real Bed", "Futon", "Pull-out Sofa", "Airbed", "Couch")
- "Promedio de reviews o calificaión" (número de 0 a 100)
- "Número de reviews o reseñas" (número)
- "¿Host tiene foto de perfil?" (opciones: "t" o "f")
- "Verificar teléfono de huésped" (opciones: "t" o "f")
- "¿Es superhost?" (opciones: "t" o "f")

REGLAS:
1. Extrae SOLO los valores mencionados EXPLÍCITAMENTE en el mensaje.
2. NO inventes ni asumas valores no mencionados.
3. Si el usuario dice "2 baños", extrae {"Baños": 2}.
4. Si el usuario dice "departamento entero", extrae {"Tipo de habitación": "Entire home/apt"}.
5. Responde ÚNICAMENTE con un objeto JSON. Sin explicaciones ni texto adicional.
6. Si no se menciona ningún parámetro de inmueble, responde con {}.

Mensaje del usuario:
`;
