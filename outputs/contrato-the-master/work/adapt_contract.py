from pathlib import Path
from zipfile import ZipFile
from lxml import etree
import json,hashlib
base=Path.cwd(); src=base/'Contrato_Community_Manager_Completo.docx'; out=base/'outputs/contrato-the-master/Contrato_Community_Manager_The_Master.docx'
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}; W='{'+ns['w']+'}'
with ZipFile(src) as z:
 tree=etree.fromstring(z.read('word/document.xml')); pars=tree.findall('.//w:body/w:p',ns)
 for t in tree.findall('.//w:t',ns):
  if t.text:
   for a,b in [('EL/LA PROPIETARIO/A','EL PROPIETARIO'),('el/la PROPIETARIO/A','el PROPIETARIO'),('del/la PROPIETARIO/A','del PROPIETARIO'),('al/la PROPIETARIO/A','al PROPIETARIO'),('$_____','S/ _____')]: t.text=t.text.replace(a,b)
 def replace(i,text):
  p=pars[i]; r=p.find('w:r',ns)
  for node in list(r):
   if node.tag!=W+'rPr': r.remove(node)
  for j,line in enumerate(text.split('\n')):
   if j: etree.SubElement(r,W+'br')
   t=etree.SubElement(r,W+'t'); t.set('{http://www.w3.org/XML/1998/namespace}space','preserve'); t.text=line
 replace(0,'CONTRATO DE PRESTACIÓN DE SERVICIOS DE COMMUNITY MANAGER\nGASFITERÍA THE MASTER')
 replace(1,'Entre:\nFERNANDO TEODORO MELGAREJO CORDOVA, con DNI N° 32928123, quien contrata para el negocio de gasfitería THE MASTER, en adelante “EL PROPIETARIO”.\nDirección comercial: Av. Pacífico S3-23, segundo piso, Nuevo Chimbote, Áncash, Perú.\nTeléfonos: 936 872 862 / 927 164 616.\nCorreo: fernandomelgarejo1@hotmail.com.\ny\n(Nombre completo del community manager): ______________________, con documento de identidad N° __________, en adelante “EL/LA CM”.\nCorreo y teléfono del/de la CM: ______________________________.\n\nLugar y fecha: Nuevo Chimbote, ___ de __________ de 20__.')
 replace(3,'EL/LA CM prestará servicios de gestión y moderación de la(s) página(s) y activo(s) de Facebook del negocio de gasfitería THE MASTER, bajo la titularidad de EL PROPIETARIO y conforme a sus instrucciones y políticas. El contenido se orientará a la promoción de servicios de instalación, reparación y mantenimiento de redes de agua y desagüe.\nPágina(s) o activo(s) comprendido(s), enlace o identificador: ______________________________.')
 replace(9,'4.1. Realizar la moderación, publicación y reporte según la pauta acordada para THE MASTER; atender consultas y derivar las solicitudes de cotización y servicios a los contactos del negocio.\n4.2. Atender solicitudes de EL PROPIETARIO y responder en un plazo máximo de ___ horas.\n4.3. Al recibir la instrucción de retiro o terminación, EL/LA CM procederá a cesar actividades y aceptar la revocación de acceso sin objeción.\n4.4. No puede crear cuentas duplicadas ni realizar acciones que supongan transferencia de la titularidad.')
 replace(25,'12.1. Este contrato se regirá por las leyes del Perú. Para controversias, las partes se someten a los tribunales de ____________________.')
 replace(27,'Firma EL PROPIETARIO: ______________________\nFERNANDO TEODORO MELGAREJO CORDOVA\nDNI N° 32928123 · Gasfitería THE MASTER\nFecha: ____/____/____\n\nFirma EL/LA CM: ________________________________\nNombre: ____________________  Documento N°: ______________\nFecha: ____/____/____')
 with ZipFile(out,'w') as dst:
  for item in z.infolist(): dst.writestr(item,etree.tostring(tree,xml_declaration=True,encoding='UTF-8',standalone=True) if item.filename=='word/document.xml' else z.read(item.filename))
with ZipFile(src) as a,ZipFile(out) as b:
 assert all(a.read(n)==b.read(n) for n in a.namelist() if n!='word/document.xml')
print(out)

