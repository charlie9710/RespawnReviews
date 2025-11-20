## RESPAWN REVIEWS

Respawn Reviews es un proyecto diseñado como una red social en la cual los usuarios pueden ver noticias de videojuegos y crear distintas publicaciones de videojuegos como reseñas, guías y curiosidades,
además de distintas funcionalidades como ratings para cada videojuego creado por los usuarios o comentarios para cada publicación.

Version: 1.0
## Objetivo del proyecto:
* Tener una plataforma de videojuegos democrática en la cuál los usuarios den puntuación y publiquen contenido de videojuegos sin la influencia de compañias ni de terceros.

## Características principales:
* Noticias de videojuegos
* Reseñas de videojuegos
* Curiosidades de videojuegos
* Guías de videojuegos
* Sistema de Rating de videojuegos
  

## Tecnologías principales utilizadas

Back end:
* Java
* Spring boot
* Spring test
* Spring security
* H2 database
* Spring dotenv
* Jason Web Token (JWT)
* Google api client
* Lombok
* Maven
* Entre otros

Front end:
* HTML
* CSS
* TypeScript
* React.js
* Tailwind/css
* TipTap

## Arquitectura de la Base de Datos

A continuación se muestra el modelo entidad-relación de la base de datos:

<img width="1181" height="702" alt="image" src="https://github.com/user-attachments/assets/6aab5ca4-a446-41fd-ac8b-f0e7d0730874" />

```
## Estructura del proyecto
respawnReviews/
├── src/
│   └── main/java/com/rr/respawnReviews
│       ├── Auth          (Módulo de autenticación)
│       ├── config        (Módulo de configuración)
│       ├── controller    (Módulo de controladores)
│       ├── dto           (Módulo de Data Transfer Objects)
│       ├── exceptions    (Módulo de excepciones)
│       ├── model         (Módulo de modelos)
│       ├── repository    (Módulo de repositorio)
│       └── service       (Módulo de servicios)

game-reviews/
├── src/
│   ├── api        (Módulo de llamadas a APIs)
│   ├── assets     (Módulo de assets)
│   ├── components (Módulo de componentes)
│   ├── context    (Módulo de contexto)
│   ├── pages      (Módulo de páginas)
│   ├── static     (Módulo de archivos estáticos)
│   └── style      (Módulo de estilos CSS)

```

## Endpoints de la API
Los endpoints de la API están documentados automáticamente usando Swagger.
Puedes acceder a la documentación completa en tiempo real aquí:

http://localhost:8080/swagger-ui/index.html

## Requisitos previos

* Tener instalado maven
* Tener instalado node.js (24.1.11) LTS.
* Tener instalado JDK version 21.
* Tener instalado git.


## Instalación

* Trae el proyecto abriendo la terminal con el comando git clone https://github.com/charlie9710/RespawnReviews.git y el proyecto se va a descargar en la carpeta en la cuál estes posicionado.
* Abre en una terminal el proyecto game-reviews , instala las dependencias con npm install y luego ejecuta el proyecto con npm run dev.
* Abre en una terminal el proyecto respawnReviews, entra a respawnReviews, instala las dependencias con mvn clean install y luego ejecuta el proyecto con mvn spring-boot:run.
* Ve a http://localhost:5173/ para usar la plataforma.

## Variables de entorno necesarias
Crea un archivo env y utiliza las variables de entorno de .env.template:


Back End:
* **GOOGLE_CLIENT_ID**: ID de cliente de Google OAuth 2.0 para permitir el inicio de sesión con Google. Obtén esta clave desde [Google Cloud Console](https://console.cloud.google.com/).
* **SECRET_KEY_JWT**: Clave secreta para firmar y verificar los tokens JWT de autenticación. Genera una cadena aleatoria segura de al menos 32 caracteres.

 Front End:
* **VITE_APP_RAWG_API_KEY**: API key de [RAWG Video Games Database](https://rawg.io/apidocs) para obtener información y datos de videojuegos.
* **VITE_NEWS_API_KEY**: API key de [News API](https://newsapi.org/) para mostrar noticias actualizadas sobre videojuegos.
* **VITE_GOOGLE_CLIENT_ID**: ID de cliente de Google OAuth 2.0 (el mismo que en el backend) para la autenticación desde el frontend.


## Uso básico

* Entras a la plataforma :<img width="1300" height="886" alt="image" src="https://github.com/user-attachments/assets/e9d44b99-c4ca-4547-aaf0-f17981fc43dd" />
* Puedes ir al registro tradicional o ingresar con google: <img width="1300" height="875" alt="image" src="https://github.com/user-attachments/assets/f854f6bc-bd82-403f-8282-eae5f1be875c" />
* Una vez adentro puedes editar tus datos de tu perfil: <img width="1300" height="869" alt="image" src="https://github.com/user-attachments/assets/7a209e93-566d-4438-aae2-5479383228dd" />
* Puedes hacer publicaciones del videojuego que quieras!:<img width="1300" height="891" alt="image" src="https://github.com/user-attachments/assets/bcccb97d-05c1-4ad4-b5a2-bc60de24feb9" /> <img width="1300" height="875" alt="image" src="https://github.com/user-attachments/assets/75257a82-e9f5-493c-ab82-90c476cc48bc" />

* Puedes ver los analisis creados: <img width="1300" height="800" alt="image" src="https://github.com/user-attachments/assets/b9ba6ed1-e27e-4eb2-bccf-4487406d8d4d" /> <img width="1300" height="768" alt="image" src="https://github.com/user-attachments/assets/79e8f6f2-88d6-486a-8ba5-e504c3d9d609" />

* Puedes revisar la publicacion: <img width="1300" height="800" alt="image" src="https://github.com/user-attachments/assets/ce54d45d-d4ae-4b6d-a5b1-972ba2a2e00f" /> <img width="1300" height="909" alt="image" src="https://github.com/user-attachments/assets/0963eb4c-12ed-4867-8660-e8f9c0f225c7" />
* También puedes dejar comentarios a las publicaciones: <img width="1000" height="260" alt="image" src="https://github.com/user-attachments/assets/677836cc-f718-4a75-9883-9a9a60e4edb1" />

## Estado del Proyecto

🚧 **En desarrollo activo**
- ✅ Funcionalidades core implementadas
- 🔄 Tests en progreso
  
## Próximas Características
- 💬 Chats entre usuarios
- ⭐ Mejoras en el sistema de ratings a los comentarios
- 👥 Seguimiento de usuarios (followers)


Licencia: MIT








