# **Prueba Banco Guayaquil**

Este proyecto es una aplicación Angular que implementa un sistema de gestión de criptomonedas utilizando una arquitectura de **microfrontends** con **Module Federation**. La aplicación incluye dos módulos principales:

1. **prueba-shell**: La aplicación principal (host) que orquesta los módulos remotos.
2. **prueba-module**: Un módulo remoto que implementa un CRUD para criptomonedas y consume una API externa.

---

## **Tecnologías Utilizadas**

El proyecto utiliza las siguientes tecnologías y versiones:

- **Angular**: 19 (Framework principal para la construcción de la aplicación).
- **Angular CLI**: 10 (Herramienta para la creación y gestión de proyectos Angular).
- **Angular Material**: 19 (Componentes de UI para Angular).
- **Module Federation**: Implementación clásica de Webpack para microfrontends.
- **TypeScript**: 4.8+ (Lenguaje principal para el desarrollo).
- **Node.js**: 18 (Entorno de ejecución para el servidor de desarrollo).
- **npm**: 10 (Gestor de paquetes para instalar dependencias).

---

## **Estructura del Proyecto**

El proyecto está dividido en dos aplicaciones principales:

### **1. prueba-shell**
La aplicación principal (host) que carga y orquesta los módulos remotos.

## **Funcionalidades**

### **1. CRUD en `Criptomonedas/mantenimiento`**
- Permite crear, leer, actualizar y eliminar criptomonedas.
- Los datos se almacenan en el `sessionStorage` del navegador.

### **2. Consumo de API en `Criptomonedas/lista`**
- Consume la API pública de CoinGecko para obtener una lista de criptomonedas.
- Los datos se almacenan en el `sessionStorage` para evitar múltiples llamadas a la API.
- Implementa paginación utilizando los datos almacenados en el `sessionStorage`.

---

## **Requisitos Previos**

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

1. **Node.js** (versión 16 o superior): [Descargar Node.js](https://nodejs.org/)
2. **Angular CLI** (versión 15 o superior): Instálalo globalmente con:
   ```bash
   npm install -g @angular/cli