"""Market Town site artwork authored on the game's 2:1 isometric world grid."""
from pathlib import Path
import random
import subprocess
import math

OUT=Path(__file__).resolve().parent.parent/'assets/career-sites'
W,H=1774,887

def p(x,y,z=0):return (887+(x-y-6)*10,443+(x+y-66)*5-z)
def points(coords,z=0):return ' '.join(f'{a:.1f},{b:.1f}' for a,b in [p(x,y,z) for x,y in coords])
def poly(coords,fill,stroke='none',width=1,z=0):return f'<polygon points="{points(coords,z)}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linejoin="round"/>'
def line(coords,stroke,width=1,z=0,dash=''):return f'<polyline points="{points(coords,z)}" fill="none" stroke="{stroke}" stroke-width="{width}" stroke-dasharray="{dash}" stroke-linecap="round" stroke-linejoin="round"/>'
def fmt(x,y,z=0):
    a,b=p(x,y,z);return f'{a:.1f},{b:.1f}'
def circle(x,y,r,fill,opacity=1):return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}" opacity="{opacity}"/>'
def cube(x,y,w,d,h,wall,roof,night):
    a=(x,y);b=(x+w,y);c=(x+w,y+d);e=(x,y+d)
    dark='#253b43' if night else '#a6684d'
    left='#293941' if night else '#d8ab7d'
    right='#21353b' if night else wall
    ink='#efc872' if night else '#253f47'
    # Two visible vertical faces, with the roof plane above them.
    chunks=[f'<polygon points="{fmt(*b)} {fmt(*c)} {fmt(*c,h)} {fmt(*b,h)}" fill="{right}" stroke="#584e48" stroke-width=".7"/>',
            f'<polygon points="{fmt(*e)} {fmt(*c)} {fmt(*c,h)} {fmt(*e,h)}" fill="{left}" stroke="#584e48" stroke-width=".7"/>',
            poly([a,b,c,e],roof,'#34404a' if night else '#5a6061',1,z=h)]
    # Roof skylights read as small simple blocks in the established art style.
    for t in (.3,.65):
        lines=poly([(x+w*t,y+d*.3),(x+w*(t+.1),y+d*.3),(x+w*(t+.1),y+d*.5),(x+w*t,y+d*.5)],'#647982' if night else '#c4d6d2',z=h+.3)
        chunks.append(lines)
    # Small blocky windows sit within the front walls.
    for t in (.22,.52,.82):
        bx=x+w*t
        for height in (h*.34,h*.67):
            q=p(bx,y+d,height)
            chunks.append(f'<rect x="{q[0]-2:.1f}" y="{q[1]-3:.1f}" width="4" height="5" fill="{ink}" opacity=".85"/>')
    return ''.join(chunks)

def scene(night=False):
    rng=random.Random(256)
    ground='#263f42' if night else '#aec2a8'
    grass='#315843' if night else '#84aa6c'
    pavement='#50605a' if night else '#dacdb8'
    street='#263b42' if night else '#647078'
    marking='#a5aaa3' if night else '#e6dfca'
    plaza='#596b68' if night else '#b9b8aa'
    fence='#748c8d' if night else '#715b4e'
    lines=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
           f'<rect width="{W}" height="{H}" fill="{ground}"/>']
    # Green city blocks and avenues are built from world-axis rectangles.
    for x0 in (-22,5,68,89):
        for y0 in (-22,-2,62,84):
            if x0==5 and y0 in (-2,62) or x0==68 and y0 in (-2,62):continue
            lines.append(poly([(x0,y0),(x0+11,y0),(x0+11,y0+11),(x0,y0+11)],grass))
    roads=[('y',-18),('y',-2),('y',62),('y',80),('x',-18),('x',4),('x',68),('x',88)]
    for axis,value in roads:
        if axis=='y':
            a=[(-45,value-5),(115,value-5),(115,value+5),(-45,value+5)]
            side1=[(-45,value-6),(115,value-6),(115,value-5),(-45,value-5)]
            side2=[(-45,value+5),(115,value+5),(115,value+6),(-45,value+6)]
            centre=[(-45,value),(115,value)]
        else:
            a=[(value-5,-50),(value+5,-50),(value+5,110),(value-5,110)]
            side1=[(value-6,-50),(value-5,-50),(value-5,110),(value-6,110)]
            side2=[(value+5,-50),(value+6,-50),(value+6,110),(value+5,110)]
            centre=[(value,-50),(value,110)]
        lines.extend([poly(side1,pavement),poly(side2,pavement),poly(a,street),line(centre,marking,1.4,dash='10 11')])
    # Tight pavement around the market plot and a perfectly registered 50×50 plot.
    lines.append(poly([(9,3),(63,3),(63,57),(9,57)],pavement))
    lines.append(poly([(11,5),(61,5),(61,55),(11,55)],plaza,'#8e938c' if night else '#ded9c9',2))
    for x in range(16,61,5):lines.append(line([(x,5),(x,55)],'#7a8e8c' if night else '#aaa99b',.75))
    for y in range(10,55,5):lines.append(line([(11,y),(61,y)],'#7a8e8c' if night else '#aaa99b',.75))
    # The plot fence occupies its exact world boundary. Gates interrupt two sides.
    for y in range(5,55,5):
        if 30<=y<40:continue
        lines.append(line([(61,y),(61,y+5)],fence,3.2))
    for x in range(11,61,5):
        if 30<=x<40:continue
        lines.append(line([(x,55),(x+5,55)],fence,3.2))
    lines += [line([(11,5),(61,5)],fence,3.2),line([(11,5),(11,55)],fence,3.2)]
    for edge in ('top','right','bottom','left'):
        for k in range(11,62,5):
            x,y={'top':(k,5),'right':(61,k),'bottom':(k,55),'left':(11,k)}[edge]
            if edge=='right' and 30<=k<40 or edge=='bottom' and 30<=k<40:continue
            a,b=p(x,y)
            lines.append(f'<path d="M{a:.1f},{b:.1f} v-13" stroke="{fence}" stroke-width="3.6"/>')
    # The access gates connect directly to the neighbouring pavement and road.
    lines += [poly([(61,30),(68,30),(68,40),(61,40)],pavement),poly([(30,55),(40,55),(40,62),(30,62)],pavement)]
    for x,y in ((61,30),(61,40),(30,55),(40,55)):
        a,b=p(x,y);lines.append(f'<rect x="{a-4:.1f}" y="{b-17:.1f}" width="8" height="17" fill="{fence}"/>')
    # Block-size buildings are placed only beyond the road and pavement strips.
    buildings=[]
    for x in range(-40,111,10):
        for y in range(-42,111,10):
            if not ((x< -3 or x>75 or y< -10 or y>68) and (x+y>-50 and x+y<175) and (-75<x-y<90)):continue
            if any(abs(x-v)<9 for v in (-18,4,68,88)) or any(abs(y-v)<9 for v in (-18,-2,62,80)):continue
            if rng.random()<.13:continue
            h=rng.choice([31,36,41,47,52]);w=rng.choice([6,7,8]);d=rng.choice([6,7,8])
            walls=['#c87b56','#dfbd8d','#d29368','#e1cfa9','#b66b52'];roofs=['#717b7b','#565e68','#9d765e','#70706a']
            buildings.append((x+y,cube(x,y,w,d,h,rng.choice(walls),rng.choice(roofs) if not night else '#48565d',night)))
    lines.extend(item for _,item in sorted(buildings,key=lambda v:v[0]))
    # Block trees and lighting live off the vehicle lanes.
    for x in range(-8,83,10):
        for y in (-10,70):
            if x in (2,72):continue
            a,b=p(x,y)
            if 0<a<W and 0<b<H:
                lines.append(f'<rect x="{a-2:.1f}" y="{b-17:.1f}" width="4" height="17" fill="{fence}"/>')
                lines.append(f'<rect x="{a-12:.1f}" y="{b-35:.1f}" width="24" height="21" fill="{("#2e6952" if night else "#4f975b")}"/>')
    for x,y in ((6,12),(6,48),(66,12),(66,48),(21,1),(51,1),(21,59),(51,59)):
        a,b=p(x,y)
        if night:lines.append(circle(a,b-27,34,'url(#glow)',.8))
        lines.append(f'<path d="M{a:.1f},{b:.1f} v-27" stroke="{fence}" stroke-width="2.2"/>')
        lines.append(circle(a,b-27,3,'#f9d98f' if night else '#eee0ad'))
    if night:lines.append(f'<rect width="{W}" height="{H}" fill="#0c1d35" opacity=".18" pointer-events="none"/>')
    lines.insert(1,'<defs><radialGradient id="glow"><stop stop-color="#ffe8a6" stop-opacity=".65"/><stop offset="1" stop-color="#ffe8a6" stop-opacity="0"/></radialGradient></defs>')
    lines.append('</svg>')
    return '\n'.join(lines)

for night in (False,True):
    name=f'mid-market-town-aligned-{"night" if night else "day"}'
    svg=OUT/f'{name}.svg';svg.write_text(scene(night))
    png=OUT/f'{name}.png'
    subprocess.run(['inkscape',str(svg),'--export-filename='+str(png)],check=True,stdout=subprocess.DEVNULL)
    subprocess.run(['convert',str(png),'-quality','84',str(OUT/f'{name}.webp')],check=True)
    png.unlink()
    print(OUT/f'{name}.webp')
