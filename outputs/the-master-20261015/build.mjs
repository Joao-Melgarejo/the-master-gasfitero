import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const out=fileURLToPath(new URL('.',import.meta.url));
const services=JSON.parse(await fs.readFile(new URL('../../data/services.json',import.meta.url),'utf8'));
const w=Workbook.create(), q=w.worksheets.add('Cotizador'), c=w.worksheets.add('Servicios');
const navy='#003669', amber='#FFF2CC';
for(const s of [q,c]){s.showGridLines=false;s.getRange('A1:H65').format.font={name:'Arial',size:11};s.getRange('A1:H65').format.rowHeight=23;s.getRange('A1:H65').format.verticalAlignment='center';s.tabColor=navy;}
const v=(s,a,x)=>s.getRange(a).values=[[x]];
const f=(a,x)=>q.getRange(a).formulas=[[x]];
const input=a=>{q.getRange(a).format.fill=amber;q.getRange(a).format.font.color='#174C8A';};
const header=(s,a)=>{s.getRange(a).format.fill=navy;s.getRange(a).format.font={name:'Arial',size:11,bold:true,color:'#FFFFFF'};s.getRange(a).format.wrapText=true;};
for(const [col,width] of Object.entries({A:14,B:59,C:14,D:17,E:18,F:19,G:26,H:3}))q.getRange(`${col}1:${col}65`).format.columnWidth=width;
v(q,'A2','The Master Fernando');q.getRange('A2').format.font={name:'Arial',size:17,bold:true};
v(q,'A3','Cotizador de servicios de gasfitería');
v(q,'A4','WhatsApp +51 936 872 862   ·   Tel. +51 934 516 400');
v(q,'A5','fernandomelgarejo1@hotmail.com');
v(q,'A6','Av. Pacífico S3-23, Urb. Unicreto, Nuevo Chimbote');
v(q,'A8','Cliente');v(q,'D8','N.º cotización');v(q,'A9','DNI / RUC');v(q,'D9','Fecha');v(q,'E9',new Date('2026-10-15T12:00:00Z'));q.getRange('E9').setNumberFormat('dd/mm/yyyy');
v(q,'A10','Dirección');v(q,'D10','Vigencia días');v(q,'A11','Teléfono');v(q,'D11','Moneda');v(q,'E11','PEN / soles');
v(q,'A13','Amarillo = editable. Cantidad 0 = no incluir. Ingrese precios unitarios antes de impuestos.');
v(q,'A14','Los precios no figuran en las fuentes. Complete la tasa de impuesto; use 0 si no aplica.');
q.getRange('A13:G14').format.font.size=10;
q.getRange('A16:G16').values=[['Código','Servicio o material','Unidad','Cantidad','P. unitario S/','Importe S/','Revisión']];header(q,'A16:G16');q.getRange('A16:G16').format.rowHeight=32;
for(let i=0;i<20;i++){const r=17+i,s=services[i];q.getRange(`A${r}:G${r}`).values=[[s?`S${String(i+1).padStart(2,'0')}`:`M${i-14}`,s?.name??'',s?'servicio':'unidad',0,null,null,null]];q.getRange(`B${r}`).format.wrapText=true;q.getRange(`A${r}:G${r}`).format.rowHeight=40;
input(`C${r}:E${r}`);if(!s)input(`B${r}:C${r}`);
f(`G${r}`,`=IF(D${r}=0,"",IF(OR(D${r}<0,E${r}<0),"Revisar valores",IF(OR(B${r}="",C${r}="",NOT(ISNUMBER(E${r}))),"Completar datos","Incluido")))`);
f(`F${r}`,`=IF(D${r}=0,"",IF(G${r}="Incluido",ROUND(D${r}*E${r},2),""))`);
}
q.getRange('D17:D36').dataValidation={rule:{type:'decimal',operator:'greaterThanOrEqual',formula1:0}};
q.getRange('E17:E36').dataValidation={rule:{type:'decimal',operator:'greaterThanOrEqual',formula1:0}};
v(q,'B38','Descuento global');v(q,'D38',0);v(q,'B39','Impuesto aplicable');v(q,'B40','Anticipo');v(q,'D40',0);
for(const r of [38,39,40]){input(`D${r}`);q.getRange(`D${r}`).setNumberFormat('0.0%');q.getRange(`D${r}`).dataValidation={rule:{type:'decimal',operator:'between',formula1:0,formula2:1}};}
v(q,'E38','Subtotal');f('F38','=IF(OR(SUM(D17:D36)=0,COUNTIF(G17:G36,"Completar datos")>0,COUNTIF(G17:G36,"Revisar valores")>0),"",ROUND(SUM(F17:F36),2))');
v(q,'E39','Descuento');f('F39','=IF(OR(NOT(ISNUMBER(F38)),NOT(ISNUMBER(D38)),D38<0,D38>1),"",ROUND(F38*D38,2))');
v(q,'E40','Base neta');f('F40','=IF(OR(NOT(ISNUMBER(F38)),NOT(ISNUMBER(F39))),"",F38-F39)');
v(q,'E41','Impuesto');f('F41','=IF(OR(NOT(ISNUMBER(F40)),NOT(ISNUMBER(D39)),D39<0,D39>1),"",ROUND(F40*D39,2))');
v(q,'E42','TOTAL S/');f('F42','=IF(OR(NOT(ISNUMBER(F40)),NOT(ISNUMBER(F41))),"",F40+F41)');header(q,'E42:F42');
v(q,'E43','Anticipo S/');f('F43','=IF(OR(NOT(ISNUMBER(F42)),NOT(ISNUMBER(D40)),D40<0,D40>1),"",ROUND(F42*D40,2))');
v(q,'E44','Saldo S/');f('F44','=IF(OR(NOT(ISNUMBER(F42)),NOT(ISNUMBER(F43))),"",F42-F43)');
q.getRange('E17:F44').setNumberFormat('#,##0.00');
v(q,'A46','Alcance');v(q,'B46','Completar trabajos incluidos y materiales a utilizar.');
v(q,'A47','Exclusiones');v(q,'B47','Completar trabajos, acabados y materiales no incluidos.');
v(q,'A48','Plazo');v(q,'A49','Pago');v(q,'A50','Garantía');v(q,'A51','RUC emisor');
v(q,'A53','Uso: elija cantidades y complete precios, impuestos, datos del cliente y condiciones.');
v(q,'A54','Cada servicio se cotiza por el alcance acordado. Cambie la unidad si corresponde.');
v(q,'A55','Las filas M1 a M5 permiten agregar materiales, movilidad u otros conceptos.');
for(const a of ['B8:B11','E8','E9:E10','B46:B51'])input(a);
q.getRange('B46:B51').format.wrapText=true;q.getRange('A46:G51').format.rowHeight=38;
q.freezePanes.freezeRows(16);
q.getRange('G17:G36').conditionalFormats.add('containsText',{text:'Completar',format:{fill:'#FCE4D6',font:{color:'#9C0006'}}});
v(c,'A2','Catálogo de servicios');c.getRange('A2').format.font={name:'Arial',size:17,bold:true};
v(c,'A3','Fuente: data/services.json · Contacto: contact.html · Identidad visual: styles/styles.css');
v(c,'A4','Duraciones referenciales del sitio. El alcance y plazo final se acuerdan en cada cotización.');
c.getRange('A6:F6').values=[['Código','Servicio','Categoría','Alcance de referencia','Duración referencial','Verificación publicada']];header(c,'A6:F6');
c.getRange('A7:F21').values=services.map((s,i)=>[`S${String(i+1).padStart(2,'0')}`,s.name,s.category,s.summary,s.duration,s.warranty]);
for(const [col,width]of Object.entries({A:10,B:48,C:20,D:72,E:25,F:36}))c.getRange(`${col}1:${col}25`).format.columnWidth=width;
c.getRange('A6:F21').format.wrapText=true;c.getRange('A7:F21').format.rowHeight=65;c.freezePanes.freezeRows(6);
for(let r=7;r<=21;r++)if(r%2)c.getRange(`A${r}:F${r}`).format.fill='#F0F5F9';
// Exercise real input changes, including missing prices and a zero-priced line.
v(q,'D17',2);v(q,'E17',100);v(q,'D38',.1);v(q,'D39',.18);v(q,'D40',.5);w.recalculate();
if(Math.abs(q.getRange('F42').values[0][0]-212.4)>.001)throw Error('Total test');
if(Math.abs(q.getRange('F44').values[0][0]-106.2)>.001)throw Error('Balance test');
v(q,'D36',1);w.recalculate();if(q.getRange('F42').values[0][0]!=='')throw Error('Missing data test');
v(q,'B36','Prueba gratuita');v(q,'E36',0);w.recalculate();if(Math.abs(q.getRange('F42').values[0][0]-212.4)>.001)throw Error('Zero price test');
v(q,'D17',0);v(q,'E17',null);v(q,'D36',0);v(q,'B36','');v(q,'E36',null);v(q,'D38',0);v(q,'D39',null);v(q,'D40',0);w.recalculate();
console.log((await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:20},summary:'Formula errors'})).ndjson);
await (await SpreadsheetFile.exportXlsx(w)).save(`${out}/Cotizador_The_Master.xlsx`);
for(const [s,range,file] of [['Cotizador','A1:G22','excel-arriba'],['Cotizador','A30:G55','excel-abajo'],['Servicios','A1:F21','catalogo']]){const blob=await w.render({sheetName:s,range,scale:1.3,format:'png'});await fs.writeFile(`${out}/qa/${file}.png`,new Uint8Array(await blob.arrayBuffer()));}
console.log('Workbook exported; calculation tests passed.');


