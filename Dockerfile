# Usa una imagen de Node.js como base
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de tu bot al contenedor
COPY . .

# Expone el puerto web o REST, de momento no lo necesito
# EXPOSE 3000

# Define el comando de inicio del bot
CMD ["npm", "start"]
