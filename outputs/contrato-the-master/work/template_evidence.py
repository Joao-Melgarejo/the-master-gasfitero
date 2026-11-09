from pathlib import Path
from zipfile import ZipFile
from lxml import etree
import hashlib,json
root=Path.cwd(); src=root/'Contrato_Community_Manager_Completo.docx'; work=root/'outputs/contrato-the-master/work'
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
with ZipFile(src) as z:
 tree=etree.fromstring(z.read('word/document.xml'))
 inventory={n:hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist()}
 sect=tree.find('.//w:sectPr',ns)
 styles=z.read('word/styles.xml').decode()
(work/'inventory.json').write_text(json.dumps(inventory,indent=2))
(work/'artifact.md').write_text('''# Reference contract
Reference: '''+str(src)+'''\nSHA256: '''+hashlib.sha256(src.read_bytes()).hexdigest()+'''\nThree reference pages inspected. One portrait US Letter section; top/bottom margins 1 inch; left/right 1.25 inches. Source Heading 1 title and appendix headings; Heading 2 clauses; Normal body with line breaks inside single runs. Preserve all paragraph/run properties and styles, including source blue headings, as template authority. No tables or illustrations. All package parts preserve-only except word/document.xml text nodes. Stable editable slots: body paragraphs 0 title, 1 parties, 3 subject, 9 operational obligations, 21 currency, 25 country, 27 signatures, 31 optional penalty currency; global owner designation adjusted to masculine singular. Other terms, unknown amounts/dates/deadlines and optional status retained. Contact data from 2026 quotations; identity from municipal permit. Pagination may grow due to complete identity and contact details. Renderer unavailable because bundled LibreOffice missing; Word PDF export and PDFium page rendering used instead.\nSection XML:\n'''+etree.tostring(sect).decode(),encoding='utf-8')
