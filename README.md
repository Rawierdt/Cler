![imageTitle](./title.jpg)

# Cler

## Cler Discord multipurpose bot using Node.js, PostgreSQL and Endpoint (API)

**Cler** es una bot de Discord para administrar tu servidor, cuenta con multiples comandos como de administración, utilidad y de diversión.

> [!NOTE]
> Disclaimer: Any extended use of this tool to companies will incur charges.

[Cler's Monitor](https://bit.ly/cler-bot)

[Invite Cler on your server](https://discord.com/oauth2/authorize?client_id=774150617546883073&permissions=8&scope=bot)

* |Warning| Spanish discord bot, code in node.js / discord.js, but it is easy to learn each command.
* Slash Commands Avaliable
Please report any issue or bug.

* |Advertencia| Bot para discord en español escrito en node.js / discord.js.
* Soporta Slash Commands
Informa cualquier problema o error.

## Lastest Version and What's New

**v4.8.20**

#### *Spanish language only from here*

# Lo que puede hacer en ATM

### (Asynchronous Transfer Mode)

* Usa el prefix. `c!` o el Slash `/` Para comandos de moderación
* Ahora con mas secretos (｢• ω •)｢ (⌒ω⌒`)
* Bot en Discord.js v14.16.2

# Planes a futuro

* Comandos personalizados por servidor.
* Sistema de mascota y economia.
* Comandos para el aprendizaje de la ciberseguridad.
* Comer bayas azules

Postdata: Si abandoné este proyecto es porque me aburrí o hice una mejor versión.

## 📦 Requirements

- **1 GB disk space**
- **256 MB RAM**

## 💻 Installation

Para instalar y ejecutar Cler localmente, sigue estos pasos:

1. **Clona el repositorio**:

    ```bash
    git clone git@github.com:Rawierdt/Cler.git
    ```

2. **Navega al directorio del proyecto**:

    ```bash
    cd Cler
    ```

3. **Crea un archivo de configuración .env dentro del directorio**:

    ```bash
    BOT_TOKEN=YOUR_BOT_TOKEN
    CLIENT_ID=YOUR_CLIENT_ID
    GUILD_ID=YOUR_GUILD_ID
    PREFIX='YOUR_PREFIX'
    COLOR=0x5e10f8
    OWNER=YOUR_DISCORD_ID
    PG_USER=YOUR_POSTGRES_USER
    PG_PASSWORD=YOUR_POSTGRES_PASSWORD
    PG_HOST=localhost
    PG_DATABASE=YOUR_POSTGRES_DATABASE
    PG_PORT=5432

    ```

4. **Instala las dependencias**:

    ```bash
    npm install
    ```

5. **Ejecuta el comando de carga global**:

    ```bash
    npm deploy-commands.js
    ```

6. **Ejecuta el comando de inicio**:

    ```bash
    npm index.js
    ```

    Dirigete a tu servidor de discord al que invitaste a tu bot y ejecuta el comando de /help.

# Comandos

Lista completa de comandos en [Documentación](https://rawier.gitbook.io/cler)

Estructura y Diagramación en Repositorio de [Github](https://github.com/Rawierdt/Cler)

### Admin / Mod

* `c!mute  <@member> <reason>` Silencia al miembro etiquetado.
* `c!unmute  <@member> <reason>` Quita el Silenco del miembro etiquetado.
* `c!set_mute  <@rol>` Define el rol de Mute en el servidor **Importante**.
* `c!ban <@member> <reason>` Expulsa del servidor de manera difinitiva al miembro etiquetado.
* `c!unban <@member>` Revoca la prohibición del comando anterior.
* `c!kick <@member> <reason>` Expulsa del servidor al miembro etiquetado.
* `c!softban <@member> <reason>` Expulsa del servidor al miembro etiquetado de manera temporal por 7 dias.
* `c!warn <@member> <reason>` Notifica al miembro seleccionado

Lista completa de comandos en [Documentación](https://rawier.gitbook.io/cler)

### Acción

* `c!hug  <@member>` Envia un Gif de Abrazo / Imagen.
* `c!kiss <@member>` Envia un Gif de Beso / Imagen.
* `c!pat <@member>` Envia un Gif de Caricia / Imagen.
* `c!slap <@member>` Envia un Gif de Golpe / Imagen.
* `c!cry` Envia un Gif de Llorar / Imagen.
* `c!angry` Envia un Gif de Enojo / Imagen.
* `c!sleep` Envia un Gif de Dormir / Imagen.
* `c!bored` Envia un Gif de Aburrido / Imagen.

Lista completa de comandos en [Documentación](https://rawier.gitbook.io/cler)

### Diversión

* `c!8ball  <@member>` Da respuesta aleatoria a un apregunta de tu interes.
* `c!ascii <@member>` envia un texto en ascii.
* `c!say <args>` repite el texto dicho.
* `c!say embed <args>` repite lo que hayas dicho pero en texto embebido.
* `c!love <@member>` Mide tu compatibilidad de amor con el usuario mencionado.
* `c!chiste` Envia una imagen con chiste / Imagen.

Lista completa de comandos en [Documentación](https://rawier.gitbook.io/cler)

### Utileria

* `c!avatar  <@member>` Envia el avatar de un usuario Gif / Imagen.

Lista completa de comandos en [Documentación](https://rawier.gitbook.io/cler)

### Comandos contextuales

* `Ver Avatar` Envia el avatar de un usuario Gif / Imagen.

Lista completa de comandos en [Documentación](https://rawier.gitbook.io/cler)

### Libraries and frameworks used

* [dotenv](https://github.com/motdotla/dotenv#readme) and [express-js](http://expressjs.com/)
* [typescript](https://www.typescriptlang.org/)
* [discord.js](https://github.com/discordjs/discord.js/) and [@discordjs/opus](https://www.npmjs.com/package/@discordjs/opus)
* [megadb](https://github.com/sergiom19/guia-megadb)
* [node-fetch](https://github.com/node-fetch/node-fetch)
* [os](https://github.com/DiegoRBaquero/node-os)
* [figlet](https://github.com/patorjk/figlet.js#readme)
* [discord-tts](https://www.npmjs.com/package/discord-tts)
* [postgresql](https://www.npmjs.com/package/pg)

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check issues page.

1. **Haz un Fork del Repositorio**: Crea una copia del repositorio en tu cuenta de GitHub.
2. **Crea una Rama**: 

    ```bash
    git checkout -b nombre-de-tu-rama
    ```

3. **Haz tus Cambios**: Realiza las modificaciones que deseas agregar.
4. **Commit y Push**:

    ```bash
    git add .
    git commit -m "Descripción de los cambios"
    git push origin nombre-de-tu-rama
    ```

5. **Crea un Pull Request**: Abre un Pull Request desde tu rama a la rama principal del repositorio.

### ❤️ Show your support

Give a ⭐️ if this _project helped you!_ 

### 💜 License

Copyright © 2024 [Rawier](https://rawier.vercel.app). This project is [AGPL](/LICENSE) licensed.
