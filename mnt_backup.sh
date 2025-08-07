#!/bin/bash

# CONFIGURACIÓN
APP_DIR="compra-venta-app"
VOLUME_NAME="compra-venta-app_postgres_data"
DATE=$(date +"%Y%m%d_%H%M")
TMP_BACKUP_DIR="tmp_backup_$DATE"
FINAL_BACKUP_FILE="backup_total_${DATE}.tar.gz"

echo "📦 Iniciando backup completo..."

# 1. Crear carpeta temporal
mkdir $TMP_BACKUP_DIR

# 2. Copiar archivos del proyecto (excluyendo node_modules, .git, etc.)
echo "📁 Copiando archivos del proyecto..."
rsync -a --exclude=node_modules --exclude=.git --exclude=$TMP_BACKUP_DIR $APP_DIR $TMP_BACKUP_DIR/app

# 3. Backup del volumen de Docker
echo "🛢️ Haciendo backup del volumen Docker: $VOLUME_NAME"
docker run --rm \
  -v $VOLUME_NAME:/volume \
  -v $(pwd)/$TMP_BACKUP_DIR:/backup \
  alpine \
  tar -czvf /backup/volume_backup.tar.gz -C /volume .

# 4. Comprimir todo en un único archivo
echo "📦 Empaquetando todo en $FINAL_BACKUP_FILE"
tar -czvf $FINAL_BACKUP_FILE $TMP_BACKUP_DIR

# 5. Limpiar
rm -rf $TMP_BACKUP_DIR

echo "✅ Backup completado: $(pwd)/$FINAL_BACKUP_FILE"
