#!/bin/bash

# Archivo de backup como argumento
BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Debes pasar el archivo de backup como argumento."
  echo "Uso: ./restore-total.sh backup_total_20250807_2130.tar.gz"
  exit 1
fi

TMP_DIR="restore_tmp"
VOLUME_NAME="compra-venta-app_postgres_data"

echo "📦 Restaurando desde $BACKUP_FILE..."

# 1. Extraer backup
mkdir -p $TMP_DIR
tar -xzvf $BACKUP_FILE -C $TMP_DIR

# 2. Restaurar archivos del proyecto
echo "📁 Restaurando archivos del proyecto..."
rsync -a $TMP_DIR/*/app/ ./compra-venta-app/

# 3. Restaurar volumen Docker
echo "🛢️ Restaurando volumen Docker: $VOLUME_NAME"
docker volume create $VOLUME_NAME
docker run --rm \
  -v $VOLUME_NAME:/volume \
  -v $(pwd)/$TMP_DIR:/backup \
  alpine \
  tar -xzvf /backup/volume_backup.tar.gz -C /volume

# 4. Limpiar
rm -rf $TMP_DIR

echo "✅ Restauración completada"
