#!/bin/bash

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "DATABASE_URL=\"postgres://movie_assistent_user:Gy2KLMRvXPFnEkBp4WQx@dpg-cngts0eg1b2c73c91670-a.oregon-postgres.render.com/movie_assistent\"" > .env
  echo "NEXTAUTH_URL=\"http://${REPL_SLUG}.repl.co\"" >> .env
  echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env
fi

# Build the application
npm run build

# Start the development server
npm run dev 