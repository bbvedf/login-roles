#!/bin/bash

# Configuración
APP_DIR="compra-venta-app"
VOLUME_NAME="compra-venta-app_postgres_data"
TMP_DIR="restore_tmp"

# Archivo de backup como argumento
BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Debes pasar el archivo de backup como argumento."
  echo "Uso: ./restore-total.sh backups/backup_total_YYYYMMDD_HHMM.tar.gz"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Archivo de backup '$BACKUP_FILE' no encontrado."
  exit 1
fi

echo "📦 Restaurando desde $BACKUP_FILE..."

# 1. Extraer backup
mkdir -p "$TMP_DIR"
tar -xzvf "$BACKUP_FILE" -C "$TMP_DIR"

# 2. Restaurar archivos del proyecto
echo "📁 Restaurando archivos del proyecto..."
rsync -a --delete "$TMP_DIR"/tmp_backup_*/app/ "$APP_DIR"/

# 3. Restaurar volumen Docker
echo "🛢️ Restaurando volumen Docker: $VOLUME_NAME"
docker volume create "$VOLUME_NAME"
docker run --rm \
  -v "$VOLUME_NAME":/volume \
  -v "$(pwd)/$TMP_DIR":/backup \
  alpine \
  tar -xzvf /backup/tmp_backup_*/volume_backup.tar.gz -C /volume

# 4. Limpiar
rm -rf "$TMP_DIR"

echo "✅ Restauración completada"
