#!/bin/bash

# Script para enviar recordatorios semanales de facturas
# Se ejecuta automáticamente cada semana

cd /var/www/infiber/backend
source /var/www/infiber/venv/bin/activate

# Ejecutar comando y guardar log
echo "=== Ejecución de recordatorios: $(date) ===" >> /var/log/infiber/recordatorios.log
python manage.py enviar_recordatorios_facturas >> /var/log/infiber/recordatorios.log 2>&1
echo "=== Finalizado: $(date) ===" >> /var/log/infiber/recordatorios.log
echo "" >> /var/log/infiber/recordatorios.log
