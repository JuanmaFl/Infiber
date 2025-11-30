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
