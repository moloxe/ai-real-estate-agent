/**
 * Prompt para que el LanguageModel determine si el usuario quiere evaluar un inmueble
 * (y por lo tanto invocar el modelo MLP).
 */
export const MLP_INTENT_DETECTION_PROMPT = `Analiza el siguiente mensaje y determina si el usuario está solicitando evaluar, analizar o predecir características de un inmueble o propiedad de alquiler.

Indicadores de que SÍ quiere usar el modelo:
- Menciona características de una propiedad (baños, camas, precio, habitaciones, capacidad, amenidades, etc.)
- Pide evaluar, analizar o predecir algo sobre un departamento/casa/propiedad
- Pregunta si debería aceptar un inmueble
- Pregunta sobre precios, calificaciones esperadas o disponibilidad
- Menciona un listado de Airbnb o alquiler temporal

Indicadores de que NO quiere usar el modelo:
- Es un saludo o conversación casual
- Pregunta sobre cómo funciona el sistema
- Pide consejos generales sin datos específicos
- Habla de reseñas o atención al cliente sin mencionar datos del inmueble

Responde ÚNICAMENTE con "SI" o "NO". Sin explicaciones.

Mensaje del usuario:
`;
