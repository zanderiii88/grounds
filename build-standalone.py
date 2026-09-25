from pathlib import Path
import base64
root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text()
for asset in sorted((root / 'assets').glob('*.png')):
    html = html.replace('assets/' + asset.name, 'data:image/png;base64,' + base64.b64encode(asset.read_bytes()).decode())
(root / 'START-HERE.html').write_text(html)
print('Built START-HERE.html with embedded district artwork')
