"""Validate the static release and create a publication ZIP using only public assets."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, parse_qs
import json
import re
import zipfile

ROOT = Path(__file__).resolve().parent.parent
PAGES = ['index.html', 'services.html', 'contact.html', 'form-action.html']
PUBLIC = PAGES + ['styles/styles.css', 'scripts/site.js', 'scripts/data.js', 'scripts/services.js', 'scripts/contact.js', 'data/services.json', 'robots.txt', 'sitemap.xml']
services = json.loads((ROOT / 'data/services.json').read_text(encoding='utf-8-sig'))
ids = {service['id'] for service in services}
assets = set()

class Page(HTMLParser):
    def __init__(self, name):
        super().__init__()
        self.name, self.ids, self.links, self.h1 = name, set(), [], 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate ID in {self.name}: {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'img': assert 'alt' in attrs, f'Missing alt in {self.name}'
        for key in ('href', 'src'):
            value = attrs.get(key)
            if not value: continue
            url = urlsplit(value)
            if url.scheme or url.netloc: continue
            target = unquote(url.path) or self.name
            assert (ROOT / target).is_file(), f'Broken link: {self.name} -> {value}'
            if target.startswith('images/'): assets.add(target)
            if url.fragment: self.links.append((target, url.fragment))
            if 'service' in parse_qs(url.query):
                assert parse_qs(url.query)['service'][0] in ids, f'Unknown service: {value}'

pages = {}
for name in PAGES:
    source = (ROOT/name).read_text(encoding='utf-8-sig')
    assert not re.search(r'TU-DOMINIO|video-demo|siteplan|attributions|lastmodified', source), name
    parser = Page(name)
    parser.feed(source)
    pages[name] = parser
    if name != 'form-action.html':
        assert parser.h1 == 1, name
        assert 'https://themastergasfitero.com/' in source, name
for page in pages.values():
    for target, fragment in page.links:
        assert target in pages and fragment in pages[target].ids, f'Broken anchor: {target}#{fragment}'
for service in services:
    assets.add(service['image'])
    assert f'value="{service["id"]}"' in (ROOT/'contact.html').read_text(encoding='utf-8'), service['id']
    assert f'id="service-{service["id"]}"' in (ROOT/'services.html').read_text(encoding='utf-8'), service['id']
css = (ROOT/'styles/styles.css').read_text(encoding='utf-8')
for path in re.findall(r'url\([\'"]?([^\)\'\"]+)', css):
    assets.add((ROOT/'styles'/path).resolve().relative_to(ROOT).as_posix())
assets.add('images/optimized/og-image.webp')
for path in assets:
    assert (ROOT/path).is_file(), f'Missing asset: {path}'
output = ROOT/'release'
output.mkdir(exist_ok=True)
archive = output/'themastergasfitero.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as bundle:
    for path in sorted(set(PUBLIC) | assets): bundle.write(ROOT/path, path)
print(f'Validated {len(PAGES)} pages and {len(assets)} image assets. {len(ids)} services with valid destinations.')
print(f'Release: {archive} ({archive.stat().st_size / 1024 / 1024:.2f} MB)')
