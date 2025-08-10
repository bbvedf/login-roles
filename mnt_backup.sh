#!/bin/bash

# Archivo de backup como argumento
BACKUP_FILE="$1"
RESTORE_MODE="$2"  # Puede ser "identico" o "incremental"

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Debes pasar el archivo de backup como primer argumento."
  echo "Uso: sudo ./mnt_restore.sh backup_total_20250807_2130.tar.gz [identico|incremental]"
  echo " - identico: borra archivos extra en la carpeta destino (default)"
  echo " - incremental: solo actualiza/agrega archivos, sin borrar extras"
  exit 1
fi

# Por defecto modo identico
if [ -z "$RESTORE_MODE" ]; then
  RESTORE_MODE="identico"
fi

TMP_DIR="restore_tmp"
VOLUME_NAME="login-roles_postgres_data"

echo "📦 Restaurando desde $BACKUP_FILE..."
echo "⚙️ Modo restore: $RESTORE_MODE"

# 1. Extraer backup
mkdir -p $TMP_DIR
tar -xzvf $BACKUP_FILE -C $TMP_DIR

# 2. Restaurar archivos del proyecto
echo "📁 Restaurando archivos del proyecto..."

if [ "$RESTORE_MODE" = "identico" ]; then
  rsync -a --delete $TMP_DIR/*/app/ ./login-roles/
else
  rsync -a $TMP_DIR/*/app/ ./login-roles/
fi

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
