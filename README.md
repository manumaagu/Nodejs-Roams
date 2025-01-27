# Guia de instalacion

## Requisitos previos

Asegúrate de tener los siguientes programas instalados antes de empezar:
- **Node.js**
- **Git**

## Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

1. **Clona el repositorio**
```bash
git clone https://github.com/manumaagu/Nodejs-Roams
cd Nodejs-Roams
```
2. **Instala las dependencias**
```bash
npm install
```
3. **Crea el archivo .env y añade:**

`PORT=3000`

4. **Inicia la aplicación**
```bash
npm run start
```

Esto iniciará la aplicación en el puerto especificado en el archivo `.env`

## Uso
1. Accede a la documentación de la api:
```bash
http://localhost:PORT/api-docs
```

2. Usa herramientas como Postman para probar los endpoints:

Usa **Postman** para probar los diferentes endpoints de la API. Aquí te mostramos cómo probar la creación de un nuevo cliente.

#### Crear un nuevo cliente

1. Abre postman y configura la solicitud:
    - **Método HTTP**: `POST`
    - **URL**: `http://localhost:PORT/api/client`

2. En la pestaña **Body** selecciona el tipo `raw` y luego `JSON` como formato. Añade el siguiente JSON:
```JSON
{
  "name": "John Doe",
  "email": "johndoe@email.com",
  "capital": "5000",
  "dni": "36300558A"
}
```

3. Si todo está configurado correctamente, deberías recibir una respuesta con el siguiente formato:
```JSON
{
  "name": "John Doe",
  "dni": "36300558A",
  "email": "johndoe@email.com",
  "capital": 5000,
}
```
**Codigo de respuesta:** `201` - Creación exitosa