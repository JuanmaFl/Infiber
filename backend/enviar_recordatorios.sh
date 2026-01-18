#!/bin/bash

# Script para ejecutar comandos Django de forma programada
cd /var/www/infiber/backend
source ../venv/bin/activate

# Log header
echo "=== Ejecución de recordatorios: $(date) ===" >> /var/log/infiber/recordatorios.log
echo "" >> /var/log/infiber/recordatorios.log

# 1. Generar facturas mensuales (solo día 1 del mes)
python manage.py generar_facturas_mensuales >> /var/log/infiber/recordatorios.log 2>&1

# 2. Enviar recordatorios de pago
python manage.py enviar_recordatorios_facturas >> /var/log/infiber/recordatorios.log 2>&1

# 3. Suspender por mora (facturas vencidas +5 días)
python manage.py suspender_por_mora >> /var/log/infiber/recordatorios.log 2>&1

echo "=== Finalizado: $(date) ===" >> /var/log/infiber/recordatorios.log
echo "" >> /var/log/infiber/recordatorios.log
