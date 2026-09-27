from pathlib import Path
import subprocess
from build_market import scene,poly,line,p
root=Path(__file__).resolve().parent.parent
svg=scene(False)
pitch=poly([(20,20),(52,20),(52,40),(20,40)],'#379d4f','#eef5e4',2)
outline=poly([(17,17),(55,17),(55,43),(17,43)],'none','#f5bf53',3)
routes=line([(4,-2),(68,-2),(68,62),(4,62),(4,-2)],'#58b6ff',3)
walk=line([(11,4),(61,4)],'#ffe777',3)
markers=''.join(f'<circle cx="{p(x,y)[0]:.1f}" cy="{p(x,y)[1]:.1f}" r="5" fill="{colour}"/>' for x,y,colour in [(30,-2,'#58b6ff'),(20,4,'#ffe777')])
legend='<rect x="26" y="18" width="485" height="65" rx="9" fill="#123b38" opacity=".9"/><text x="45" y="44" fill="white" font-size="18" font-family="sans-serif">Gold: stadium envelope · Green: pitch</text><text x="45" y="69" fill="white" font-size="18" font-family="sans-serif">Blue: traffic · Yellow: pavement route</text>'
svg=svg.replace('</svg>',outline+pitch+routes+walk+markers+legend+'</svg>')
name=root/'Market-Town-Aligned-Pilot-Preview.svg';name.write_text(svg)
subprocess.run(['inkscape',str(name),'--export-filename='+str(root/'Market-Town-Aligned-Pilot-Preview.png')],check=True,stdout=subprocess.DEVNULL)
