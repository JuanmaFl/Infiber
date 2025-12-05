from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from io import BytesIO
from datetime import datetime

def generar_pdf_factura(factura):
    """
    Genera un PDF profesional de la factura
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Estilo personalizado para título
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#00BCD4'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    # Título
    elements.append(Paragraph("INFIBER ISP", title_style))
    elements.append(Paragraph("Factura de Servicio de Internet", styles['Heading2']))
    elements.append(Spacer(1, 0.3*inch))
    
    # Información de la factura
    data = [
        ['INFORMACIÓN DE FACTURA', ''],
        ['Número de Factura:', factura.numero_factura],
        ['Fecha de Emisión:', factura.fecha_emision.strftime('%d/%m/%Y')],
        ['Fecha de Vencimiento:', factura.fecha_vencimiento.strftime('%d/%m/%Y')],
        ['Período:', factura.periodo],
        ['Estado:', factura.estado.upper()],
        ['', ''],
        ['INFORMACIÓN DEL CLIENTE', ''],
        ['Cliente:', f"{factura.contrato.cliente.first_name} {factura.contrato.cliente.last_name}"],
        ['Dirección:', factura.contrato.direccion_instalacion],
        ['Plan:', factura.contrato.plan.nombre],
        ['', ''],
        ['DETALLE DEL SERVICIO', ''],
        ['Descripción', 'Monto'],
        [f'Servicio de Internet - {factura.contrato.plan.nombre}', f'${factura.monto:,.2f}'],
        ['', ''],
        ['TOTAL A PAGAR', f'${factura.monto:,.2f}'],
    ]
    
    table = Table(data, colWidths=[4*inch, 2.5*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#00BCD4')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 7), (-1, 7), colors.HexColor('#E3F2FD')),
        ('BACKGROUND', (0, 12), (-1, 12), colors.HexColor('#E3F2FD')),
        ('FONTNAME', (0, 7), (-1, 7), 'Helvetica-Bold'),
        ('FONTNAME', (0, 12), (-1, 12), 'Helvetica-Bold'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, -1), (-1, -1), 16),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#FFF3E0')),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#FF9800')),
        ('ALIGN', (1, -1), (1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 0.5*inch))
    
    # Nota de pago
    nota_style = ParagraphStyle(
        'Nota',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#757575'),
        alignment=TA_CENTER
    )
    
    elements.append(Paragraph(
        "<b>NOTA IMPORTANTE:</b> Para pagos en efectivo, debe descargar e imprimir esta factura y presentarla en los puntos de pago autorizados.",
        nota_style
    ))
    
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph(
        "Gracias por confiar en Infiber ISP - Tu conexión confiable",
        nota_style
    ))
    
    # Generar PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer

# ===== FUNCIONES DE EMAIL =====

from django.core.mail import send_mail
from django.conf import settings

def enviar_email_factura_generada(factura):
    """
    Envía email al cliente cuando se genera una nueva factura
    """
    cliente = factura.contrato.cliente
    
    asunto = f'Nueva Factura #{factura.numero_factura} - Infiber ISP'
    
    mensaje = f"""
Hola {cliente.first_name or cliente.username},

Se ha generado una nueva factura para tu servicio de internet.

Detalles de la factura:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Número de factura: {factura.numero_factura}
Plan: {factura.contrato.plan.nombre}
Período: {factura.periodo}
Monto: ${factura.monto:,.0f} COP
Fecha de emisión: {factura.fecha_emision.strftime('%d/%m/%Y')}
Fecha de vencimiento: {factura.fecha_vencimiento.strftime('%d/%m/%Y')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Puedes pagar tu factura ingresando a tu cuenta:
https://infiber.com/dashboard/cliente

¿Necesitas ayuda?
📧 soporte@infiber.com
📱 WhatsApp: +57 123 456 7890

Gracias por confiar en Infiber ISP.

---
Infiber ISP
Internet de Fibra Óptica
Palmitas, San Cristóbal, Robledo
"""
    
    try:
        send_mail(
            asunto,
            mensaje,
            settings.DEFAULT_FROM_EMAIL,
            [cliente.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error al enviar email de factura generada: {e}")
        return False


def enviar_email_pago_confirmado(pago):
    """
    Envía email al cliente cuando se confirma un pago
    """
    factura = pago.factura
    cliente = factura.contrato.cliente
    
    asunto = f'Pago Confirmado - Factura #{factura.numero_factura} - Infiber ISP'
    
    mensaje = f"""
Hola {cliente.first_name or cliente.username},

¡Tu pago ha sido confirmado exitosamente!

Detalles del pago:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Número de factura: {factura.numero_factura}
Monto pagado: ${pago.monto:,.0f} COP
Método de pago: {pago.metodo_pago}
Fecha de pago: {pago.fecha_pago.strftime('%d/%m/%Y %H:%M')}
Referencia: {pago.referencia_transaccion or 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu servicio de internet seguirá activo sin interrupciones.

Puedes ver el recibo de pago en tu cuenta:
https://infiber.com/dashboard/cliente

Gracias por tu pago puntual.

---
Infiber ISP
Internet de Fibra Óptica
Palmitas, San Cristóbal, Robledo
"""
    
    try:
        send_mail(
            asunto,
            mensaje,
            settings.DEFAULT_FROM_EMAIL,
            [cliente.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error al enviar email de pago confirmado: {e}")
        return False


def enviar_recordatorio_factura_proxima_vencer(factura, dias_restantes):
    """
    Envía recordatorio al cliente de factura próxima a vencer
    """
    cliente = factura.contrato.cliente
    
    if dias_restantes <= 0:
        asunto = f'⚠️ Factura Vencida #{factura.numero_factura} - Infiber ISP'
        urgencia = "VENCIDA"
        mensaje_urgencia = "Tu factura está vencida. Para evitar la suspensión del servicio, por favor realiza el pago lo antes posible."
    elif dias_restantes == 1:
        asunto = f'🔔 Factura por Vencer MAÑANA #{factura.numero_factura} - Infiber ISP'
        urgencia = "VENCE MAÑANA"
        mensaje_urgencia = "Tu factura vence mañana. No olvides realizar el pago para mantener tu servicio activo."
    elif dias_restantes <= 3:
        asunto = f'🔔 Recordatorio de Pago - Factura #{factura.numero_factura} - Infiber ISP'
        urgencia = f"VENCE EN {dias_restantes} DÍAS"
        mensaje_urgencia = f"Te recordamos que tu factura vence en {dias_restantes} días."
    else:
        asunto = f'Recordatorio de Pago - Factura #{factura.numero_factura} - Infiber ISP'
        urgencia = f"VENCE EN {dias_restantes} DÍAS"
        mensaje_urgencia = f"Te recordamos que tu factura vence en {dias_restantes} días."
    
    mensaje = f"""
Hola {cliente.first_name or cliente.username},

{mensaje_urgencia}

Detalles de la factura:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estado: {urgencia}
Número de factura: {factura.numero_factura}
Plan: {factura.contrato.plan.nombre}
Período: {factura.periodo}
Monto: ${factura.monto:,.0f} COP
Fecha de vencimiento: {factura.fecha_vencimiento.strftime('%d/%m/%Y')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Realiza tu pago ahora:
https://infiber.com/dashboard/cliente

Métodos de pago disponibles:
💳 Pago en línea (tarjeta de crédito/débito)
🏦 Transferencia bancaria
📱 PSE

¿Necesitas ayuda?
📧 soporte@infiber.com
📱 WhatsApp: +57 123 456 7890

---
Infiber ISP
Internet de Fibra Óptica
Palmitas, San Cristóbal, Robledo
"""
    
    try:
        send_mail(
            asunto,
            mensaje,
            settings.DEFAULT_FROM_EMAIL,
            [cliente.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error al enviar recordatorio de factura: {e}")
        return False
