from pathlib import Path
import json
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from PIL import Image
root=Path(__file__).resolve().parents[2]
out=Path(__file__).resolve().parent
services=json.loads((root/'data/services.json').read_text(encoding='utf-8'))
doc=Document(); sec=doc.sections[0];sec.page_height=Inches(11.7);sec.page_width=Inches(8.3)
sec.top_margin=sec.bottom_margin=Inches(.6);sec.left_margin=sec.right_margin=Inches(.65)
for n in ['Normal','Title','Heading 1','Heading 2']:
 st=doc.styles[n];st.font.name='Arial';st.font.color.rgb=RGBColor(0,0,0);st.paragraph_format.space_after=Pt(6)
doc.styles['Normal'].font.size=Pt(10)
doc.styles['Title'].font.size=Pt(24)
doc.styles['Heading 1'].font.size=Pt(15)
doc.styles['Heading 2'].font.size=Pt(11)
logo=Image.open(root/'images/optimized/logo-master.webp');logo.save(out/'qa/logo.png')
hp=sec.header.paragraphs[0];hp.add_run().add_picture(str(out/'qa/logo.png'),width=Inches(.55));hp.add_run('   GASfITERÍA THE MASTER FERNANDO'.upper()).bold=True
fp=sec.footer.paragraphs[0];fp.text='The Master Fernando  •  +51 936 872 862  •  Nuevo Chimbote';fp.runs[0].font.size=Pt(8)
def p(t,style=None):return doc.add_paragraph(t,style)
def table(headers,rows,widths):
 t=doc.add_table(rows=1,cols=len(headers));t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.autofit=False
 for j,x in enumerate(headers):t.rows[0].cells[j].text=x
 for row in rows:
  cells=t.add_row().cells
  for j,x in enumerate(row):cells[j].text=str(x)
 for i,row in enumerate(t.rows):
  for j,cell in enumerate(row.cells):
   cell.width=Inches(widths[j]);cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
   pr=cell._tc.get_or_add_tcPr();bord=OxmlElement('w:tcBorders')
   for edge in ['top','left','bottom','right']:
    e=OxmlElement('w:'+edge);e.set(qn('w:val'),'single');e.set(qn('w:sz'),'4');e.set(qn('w:color'),'D9D9D9');bord.append(e)
   pr.append(bord);mar=OxmlElement('w:tcMar')
   for side in ['top','left','bottom','right']:
    e=OxmlElement('w:'+side);e.set(qn('w:w'),'90');e.set(qn('w:type'),'dxa');mar.append(e)
   pr.append(mar)
   sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'003669' if i==0 else ('F1F5F8' if i%2 else 'FFFFFF'));pr.append(sh)
   for par in cell.paragraphs:
    par.paragraph_format.space_after=Pt(1)
    for run in par.runs:
     run.font.size=Pt(9)
     if i==0:run.bold=True;run.font.color.rgb=RGBColor(255,255,255)
  trpr=row._tr.get_or_add_trPr();trpr.append(OxmlElement('w:cantSplit'))
 t.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
 return t
p('Cotización de gasfitería','Title')
p('The Master Fernando presenta los servicios y materiales detallados para su aprobación. Complete los campos entre corchetes antes de enviar la cotización.')
p('WhatsApp +51 936 872 862  |  Tel. +51 934 516 400\nfernandomelgarejo1@hotmail.com\nAv. Pacífico S3-23, Urb. Unicreto, Nuevo Chimbote')
p('Cotización N.º [TM-____]     Fecha [dd/mm/aaaa]     Vigencia [____ días]\nCliente [Nombre o razón social]     DNI o RUC [____________]\nDirección del servicio [________________________________________]\nTeléfono [____________]     RUC del emisor [____________]')
p('Detalle de la cotización','Heading 1')
table(['Código y servicio o material','Unidad','Cant.','P. unit. S/','Importe S/'],[['[Servicio del catálogo y alcance]','[unidad]','[ ]','[ ]','[ ]']]+[['[Completar]','[unidad]','[ ]','[ ]','[ ]'] for _ in range(4)],[3.1,.75,.55,1.0,1.1])
p('Precios unitarios antes de impuestos. Moneda PEN — soles. Materiales y movilidad deben figurar como partidas cuando correspondan.')
table(['Subtotal S/','Descuento S/','Base neta S/','Impuesto [__ %] S/','Total S/'],[['[____]','[____]','[____]','[____]','[____]']],[1.3,1.35,1.35,1.6,1.0])
p('Condiciones del servicio','Heading 1')
p('Incluye [Trabajos, materiales y pruebas acordados]\nNo incluye [Trabajos, materiales o acabados excluidos]\nEjecución [Fecha y duración acordadas]     Garantía [Alcance y plazo]\nPago [Medio y condiciones]     Anticipo S/ [____]     Saldo S/ [____]')
p('Cualquier cambio de alcance o trabajo adicional se cotizará y acordará antes de ejecutarse. La programación se confirma según disponibilidad.')
p('Aceptación del cliente [Nombre, firma y fecha]\nResponsable The Master [Nombre, firma y fecha]')
for page,indices in enumerate([range(8),range(8,15)]):
 doc.add_page_break();p('Catálogo para preparar cotizaciones','Title')
 p('Referencia interna para seleccionar servicios. Traslade las partidas elegidas a la primera página y retire este catálogo al enviar la propuesta al cliente. No contiene tarifas.')
 rows=[]
 for i in indices:
  s=services[i];rows.append([f'S{i+1:02d}\n{s["category"]}',s['name']+'\n'+s['summary'],s['duration']+'\n'+s['warranty']])
 table(['Código y categoría','Servicio y alcance de referencia','Duración y verificación'],rows,[1.0,3.9,1.7])
 p('Las duraciones son referenciales. Confirme en la visita el alcance, materiales, precio, plazo y condiciones de garantía de cada trabajo.')
 if page==1:p('Fuente interna: data/services.json y contact.html. Los códigos S01 a S15 se asignaron para este cotizador y coinciden con Excel. La columna de verificación reproduce el compromiso publicado, sin establecer un plazo de garantía.')
for el in list(doc.styles.element.iter(qn('w:pBdr'))):el.getparent().remove(el)
for el in list(doc.element.iter(qn('w:pBdr'))):el.getparent().remove(el)
for par in doc.paragraphs:
 if par._p.getprevious() is not None and par._p.getprevious().tag==qn('w:tbl'):par.paragraph_format.space_before=Pt(6)
doc.save(out/'Cotizador_The_Master.docx')
print('DOCX saved')
