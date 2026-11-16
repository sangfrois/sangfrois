from pathlib import Path
import json,re,math,html
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
R=Path(__file__).resolve().parents[1]
data=json.loads((R/'content/cv.json').read_text());secs={s['title']:s for s in data['sections']}
pdfmetrics.registerFont(TTFont('Goudy',str(R/'public/fonts/GoudyBookletter1911.ttf')))
pdfmetrics.registerFont(TTFont('Fragment',str(R/'public/fonts/FragmentMono-Regular.ttf')))
INK=HexColor('#292c27');MUTED=HexColor('#606257');RULE=HexColor('#c5c4b7');ACCENT=HexColor('#a14c35');PAPER=HexColor('#f4f1e9')
W,H=595.276,841.89
c=canvas.Canvas(str(R/'public/Francois-Lespinasse-CV.pdf'),pagesize=(W,H));c.setTitle('François Lespinasse | Curriculum vitae | November 2026');c.setAuthor('François Lespinasse')
body=ParagraphStyle('body',fontName='Goudy',fontSize=10.5,leading=13,textColor=INK)
title=ParagraphStyle('title',fontName='Goudy',fontSize=12.5,leading=14.5,textColor=INK)
small=ParagraphStyle('small',fontName='Fragment',fontSize=6.8,leading=10,textColor=MUTED)
page=0;y=0

def para(text,x,top,width,style,draw=True):
 p=Paragraph(text,style);_,h=p.wrap(width,1000)
 if draw:p.drawOn(c,x,top-h)
 return h

def mark(x,cy,r=26):
 c.saveState();c.setStrokeColor(ACCENT);c.setLineWidth(.35)
 for j in range(12):
  p=c.beginPath()
  for i in range(181):
   t=i*math.tau/180;rad=r*(1+.15*math.sin(t*3+j*.09));xx=x+rad*math.cos(t);yy=cy+rad*math.sin(t)*(.3+j*.048)
   if i==0:p.moveTo(xx,yy)
   else:p.lineTo(xx,yy)
  c.drawPath(p)
 c.restoreState()

def newpage(label,first=False):
 global page,y
 if page:c.showPage()
 page+=1;c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(MUTED);c.setFont('Fragment',7);c.drawString(43,H-34,'FRANÇOIS LESPINASSE');c.drawRightString(W-43,H-34,'CURRICULUM VITAE / NOV 2026')
 c.setStrokeColor(INK);c.setLineWidth(.45);c.line(43,H-46,W-43,H-46)
 c.setFillColor(INK)
 if first:
  c.setFont('Goudy',43);c.drawString(42,H-103,'François');c.drawString(99,H-143,'Lespinasse');mark(496,H-111,30)
  c.setFont('Fragment',8);c.setFillColor(ACCENT);c.drawString(44,H-169,'RESEARCH / CREATION / COLLECTIVE EXPERIMENT')
  h=para(html.escape(data['intro']),44,H-194,475,body);y=H-194-h-16
  contact='Montréal · Tiohtià:ke | <link href="'+data['contact_url']+'">Contact via website</link><br/><link href="https://github.com/sangfrois">github.com/sangfrois</link> · <link href="https://scholar.google.com/citations?user=VjJntXAAAAAJ">Google Scholar</link> · <link href="https://orcid.org/0000-0002-6897-2119">ORCID 0000-0002-6897-2119</link>'
  y-=para(contact,44,y,500,small)+24
 else:
  c.setFont('Goudy',29);c.drawString(43,H-99,label);mark(510,H-89,19);y=H-130
 c.setStrokeColor(RULE);c.line(43,45,W-43,45);c.setFillColor(MUTED);c.setFont('Fragment',7);c.drawString(43,30,'RESEARCHER / ARTIST');c.drawRightString(W-43,30,f'{page:02d}')

def clean(text):
 text=re.sub(r'\[[^\]]*\]','',text)
 text=re.sub(r'\(\s*\)','',text)
 return re.sub(r'\s+',' ',text).strip().replace('–','-').replace('—','-')

def section(name,label=None):
 global y
 s=secs[name];label=label or name
 if y<145:newpage('Curriculum vitae')
 c.setStrokeColor(RULE);c.line(43,y,W-43,y);y-=20;c.setFont('Fragment',8);c.setFillColor(ACCENT);c.drawString(43,y,label.upper());y-=17
 for e in s['entries']:
  tit=clean(e['title']);txt=clean(e['body']);links=e.get('links',[])
  # Remove old source-link captions from prose while keeping the actual links below.
  txt=re.sub(r'\b(Project website:|Site web du projet:)\s*','',txt)
  tit_html=html.escape(tit)
  if links and tit:tit_html='<link href="'+html.escape(links[0]['url'],quote=True)+'">'+tit_html+'</link>'
  ht=para(tit_html,115,y,437,title,False) if tit else 0
  hb=para(html.escape(txt),115,y,437,body,False)
  need=ht+hb+(4 if tit else 0)+10
  if y-need<65:newpage(label+' / continued')
  year=re.search(r'(20\d{2})(?:\s*[-–]\s*(20\d{2}|present|aujourd’hui))?',txt)
  if year:c.setFillColor(MUTED);c.setFont('Fragment',7.5);c.drawString(43,y-10,year.group(0).replace('aujourd’hui','present').replace(' ','')[:17])
  if tit:y-=para(tit_html,115,y,437,title)+4
  y-=para(html.escape(txt),115,y,437,body)+10
 y-=8

newpage('Research / creation',True)
section('Education','Education')
section('Residencies','Residencies')
newpage('Research & professional practice')
section('Experience','Experience')
section('Fellowships & awards','Fellowships & awards')
newpage('Works & encounters')
section('Research-creation','Research-creation')
newpage('Collective practice')
section('Events & workshops','Events & workshops')
section('Performance & literature','Performance & literature')
newpage('Publications & software')
section('Publications','Publications')
section('Software','Software')
newpage('Public engagement & community')
section('Public engagement','Public engagement')
section('Community work','Community work')
newpage('Scientific communications')
section('Talks, posters & non-refereed contributions','Talks, posters & non-refereed contributions')
c.save();print('PDF pages:',page)
# An accessible full HTML CV uses the same canonical JSON.
esc=html.escape
parts=['<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Curriculum vitae — François Lespinasse</title><link rel="stylesheet" href="style.css"><link rel="icon" href="mark.svg"></head><body><header><a class="brand" href="index.html">f<span>∴</span>l</a><nav><a href="index.html">Back to portfolio</a><a href="Francois-Lespinasse-CV.pdf" download>PDF ↓</a></nav></header><main class="cv-page"><span class="micro">CURRICULUM VITAE / NOVEMBER 2026</span><h1>François Lespinasse</h1><p>'+esc(data['intro'])+'</p><a class="textlink" href="Francois-Lespinasse-CV.pdf" download>Download the typeset CV ↓</a><nav class="cv-filter" aria-label="CV sections">']
for i,s in enumerate(data['sections']):parts.append(f'<a href="#s{i}">{esc(s["title"])}</a>')
parts.append('</nav>')
for i,s in enumerate(data['sections']):
 parts.append(f'<section id="s{i}"><h2>{esc(s["title"])}</h2>')
 for e in s['entries']:
  parts.append('<article class="cv-entry">'+('<h3>'+esc(e['title'])+'</h3>' if e['title'] else '')+'<p>'+esc(clean(e['body']))+'</p><div class="links">')
  for a in e['links']:parts.append('<a href="'+esc(a['url'],quote=True)+'" target="_blank" rel="noreferrer">'+esc(a['label'])+' ↗</a>')
  parts.append('</div></article>')
 parts.append('</section>')
parts.append('<a class="textlink" href="index.html">Return to the portfolio ←</a></main></body></html>')
(R/'public/cv.html').write_text(''.join(parts))
