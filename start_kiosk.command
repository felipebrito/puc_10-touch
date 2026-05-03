#!/bin/bash

# Entra na pasta do script e depois na pasta do app
cd "$(dirname "$0")/app"

# Inicia o servidor Vite
npm run dev &

# Aguarda o servidor iniciar
sleep 3

# Abre o Google Chrome em modo Kiosk
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --app="http://localhost:5173" \
  --kiosk \
  --disable-infobars \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --incognito
