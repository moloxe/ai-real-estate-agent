# LimaHost AI - Agente Inmobiliario

## Contexto del Proyecto
**LimaHost AI** es un asistente virtual inteligente para el sector de bienes raíces. Esta aplicación web ofrece una interfaz de chat interactiva (`LocalChatbot`) que permite a los usuarios no solo comunicarse mediante texto, sino también adjuntar y enviar imágenes (como fotos de propiedades o planos). 

El frontend está diseñado para conectarse con un backend de modelos de Machine Learning (denominado `ModelsNB`), el cual expone distintos modelos como:
- **MLP (Multilayer Perceptron)**
- **CNN (Convolutional Neural Network)** - Utilizado para analizar y clasificar las imágenes de inmuebles enviadas desde el chat.
- **LSTM (Long Short-Term Memory)**

## Tecnologías Principales
- **Frontend Framework**: [Astro](https://astro.build/)
- **UI & Componentes**: React
- **Estilos**: Tailwind CSS 4
- **Gestión del Estado**: Nano Stores (`@nanostores/react`)

## Requisitos Previos
- Node.js (>= 22.12.0)
- Gestor de paquetes: `bun` (recomendado), `npm` o `yarn`
- Python (si vas a levantar el servidor de modelos localmente)

## Instalación

1. Navega al directorio del proyecto en tu terminal:
   ```bash
   cd ai-real-estate-agent
   ```
2. Instala las dependencias del frontend:
   ```bash
   bun install
   ```

## Cómo hacerlo funcionar localmente

### 1. Iniciar la Interfaz Web (Frontend)
Ejecuta el servidor de desarrollo de Astro. Por defecto, esto levantará el proyecto de forma local:
```bash
bun run dev
```
Abre tu navegador en la URL que indique la consola (generalmente `http://localhost:4321`).

### 2. Iniciar el Backend de Modelos (Requerido para el Chat)
Para que las peticiones del chatbot y la subida de imágenes funcionen, necesitas el backend de Python corriendo. Si lo tienes en la carpeta `models-nb` (ej. `~/Downloads/models-nb`):

```bash
cd ruta/a/models-nb
# Activa el entorno virtual si es necesario
source venv/bin/activate
# Instala los requisitos si aún no lo has hecho
pip install -r requirements.txt
# Inicia el servidor de FastAPI/Flask
python server.py
```

### 3. Conexión y Uso
1. Una vez abierto el frontend de **LimaHost AI** en el navegador, verás un campo para configurar la URL base de los modelos (`ModelsNBBaseUrlInput`).
2. Ingresa la URL de tu servidor backend de Python (por ejemplo, `http://localhost:8000`).
3. ¡Listo! Ahora puedes escribir en el chat o hacer clic en el ícono de imagen para adjuntar una foto y poner a prueba los modelos.
