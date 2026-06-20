export interface Message {
  role: "user" | "assistant" | "system";
  text: string;
  image?: string; // data URL for attached images
  thinking?: string; // status message while agent is processing
}

export interface MlpRequest {
  Capacidad: number;
  Baños: number;
  Camas: number;
  "Precio por noche": number;
  "Tipo de habitación": string;
  "Política de cancelación": string;
  "Número de cuartos o habitaciones": number;
  "Tiempo como host en años": number;
  "Instant bookable": string;
  "Disponibilidad mayor a 90 días": string;
  "Ubicación exacta": string;
  "Número de servicios o amenidades": number;
  "Tipo de alojamiento": string;
  "¿Identidad verificada del host?": string;
  "Tipo de cama": string;
  "Promedio de reviews o calificaión": number;
  "Número de reviews o reseñas": number;
  "¿Host tiene foto de perfil?": string;
  "Verificar teléfono de huésped": string;
  "¿Es superhost?": string;
  [key: string]: string | number;
}

export interface PredictionDetail {
  prediccion: string | number;
  score: number | null;
}

export interface MlpResponse {
  ans: {
    superhost: PredictionDetail;
    instant: PredictionDetail;
    disp90: PredictionDetail;
    precio: PredictionDetail;
    calificacion: PredictionDetail;
  };
  error?: string;
}

export interface LstmRequest {
  input: string;
}

export interface ModelsResponse {
  ans: number;
}
