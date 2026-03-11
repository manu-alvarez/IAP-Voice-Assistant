# IAP Voice Assistant

<div align="center">

![IAP Banner](https://img.shields.io/badge/IAP-Voice%20Assistant-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646cff?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Sistema MultiAgéntico con Asistente de Voz IA**

[Demo](#) • [Documentación](#) • [API](#)

</div>

---

## 🚀 Vista Previa

<div align="center">
  <img src="./screenshot.png" alt="IAP Voice Assistant" width="800"/>
</div>

---

## ✨ Características

- **🎙️ Control por Voz Nativo**: Interfaz de voz bidireccional con Web Speech API
- **🔮 Orbe 3D Reactivo**: Visualización espacial interactiva que responde a la voz
- **⚡ Respuestas Instantáneas**: LLM Groq con Llama 3.1 70B (latencia <100ms)
- **🔍 Búsqueda Web en Vivo**: Información actualizada vía Tavily API
- **💬 Chat Dual**: Voz y texto en una interfaz unificada
- **🎨 Diseño Inmersivo**: Glassmorphism + efectos aurora + animaciones espaciales
- **🔧 Sin Configuración Inicial**: API keys configurables desde la UI
- **📱 Mobile First**: Optimizado para dispositivos táctiles

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Framework** | React | 18.2.0 |
| **Lenguaje** | TypeScript | 5.2.2 |
| **Build Tool** | Vite | 5.0.8 |
| **UI Library** | Tailwind CSS | 3.4.0 |
| **Animaciones** | Framer Motion | 10.18.0 |
| **3D Engine** | Three.js | 0.160.0 |
| **3D React** | React Three Fiber | 8.15.12 |
| **3D Helpers** | Drei | 9.92.7 |
| **Estado** | Zustand | 4.4.7 |
| **LLM** | Groq API | - |
| **Búsqueda** | Tavily API | - |

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ ([descargar](https://nodejs.org/))
- npm 9+ o yarn 1.22+

### Pasos

```bash
# Clonar repositorio
git clone https://github.com/YourUsername/IAPVoiceAssistant.git
cd IAPVoiceAssistant

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

---

## 🎮 Uso

### Primera Ejecución

1. Abre la aplicación en `http://localhost:3000`
2. Haz clic en **"Cambiar LLM y Motor de Búsqueda"** (abajo izquierda)
3. Obtén tus API keys gratuitas:
   - **Groq**: [https://console.groq.com/keys](https://console.groq.com/keys)
   - **Tavily**: [https://app.tavily.com/home](https://app.tavily.com/home)
4. Introduce las keys y valida
5. Haz clic en **"Guardar Configuración"**

### Controles

| Acción | Desktop | Móvil |
|--------|---------|-------|
| **Conectar** | Click en el Orb o `C` | Click en el Orb |
| **Hablar** | Mantener botón central o `Espacio` | Mantener botón central |
| **Chat** | Click en 💬 (abajo derecha) | Click en 💬 |
| **Configurar** | Click en "Cambiar LLM" | Click en "Cambiar LLM" |

---

## 🏗️ Estructura del Proyecto

```
IAPVoiceAssistant/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes reutilizables (Shadcn)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── LLMSelector.tsx  # Configuración de APIs
│   │   ├── ChatPanel.tsx    # Panel de chat
│   │   ├── VoiceOrb.tsx     # Orbe 3D interactivo
│   │   ├── AudioVisualizer.tsx
│   │   └── StatusDisplay.tsx
│   ├── services/
│   │   ├── groqService.ts   # Groq API integration
│   │   ├── tavilyService.ts # Tavily search API
│   │   ├── voiceService.ts  # Web Speech API wrapper
│   │   └── configService.ts # Configuration management
│   ├── store/
│   │   └── voiceStore.ts    # Global state (Zustand)
│   ├── types/
│   │   └── speech.ts        # TypeScript definitions
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx
│   ├── App.css
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 📋 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor (http://localhost:3000)
npm run build        # Compilar para producción
npm run preview      # Vista previa del build

# Utilidades
npm run lint         # ESLint check
npm run lint:fix     # Corregir errores
npm run type-check   # TypeScript type check
```

---

## 🚀 Deploy

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Subir carpeta dist/ a Netlify
```

### Docker

```bash
# Construir imagen
docker build -t iap-voice-assistant .

# Ejecutar
docker run -p 3000:3000 iap-voice-assistant
```

---

## 📦 Instalación desde GitHub

```bash
# Clonar repositorio
git clone https://github.com/YourUsername/IAPVoiceAssistant.git
cd IAPVoiceAssistant

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🔑 APIs Utilizadas

| API | Propósito | Plan Gratuito |
|-----|-----------|---------------|
| **Groq** | LLM (Llama 3.1 70B) | ✅ Rate limits generosos |
| **Tavily** | Búsqueda web | ✅ 1000 requests/mes |

### Obtener API Keys

1. **Groq**: [https://console.groq.com/keys](https://console.groq.com/keys)
2. **Tavily**: [https://app.tavily.com/home](https://app.tavily.com/home)

---

## 🎨 Personalización

### Temas de Color

Edita `src/index.css`:

```css
:root {
  --color-accent-primary: #6366f1;  /* Color principal */
  --color-accent-secondary: #8b5cf6; /* Color secundario */
  --color-accent-tertiary: #a855f7;  /* Color terciario */
}
```

### Modelo LLM

Edita `src/services/groqService.ts`:

```typescript
const model = 'llama-3.1-70b-versatile';  // Cambiar modelo
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---

## 📞 Contacto

- **Repositorio**: GitHub
- **Proyecto**: IAP Voice Assistant

---

## 🙏 Agradecimientos

- [Groq](https://groq.com/) por su API ultrarrápida
- [Tavily](https://tavily.com/) por búsqueda web en tiempo real
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) por el ecosistema 3D
- [Shadcn/UI](https://ui.shadcn.com/) por los patrones de diseño

---

<div align="center">

**Hecho con ❤️ y ☕**

⭐ Si te gusta este proyecto, ¡dale una estrella!

</div>
