"""Урезает шрифты в /vendor/fonts до нужных знаков (кириллица + базовая латиница + типографские знаки).
Запуск после `npm run vendor`: python3 tools/subset-fonts.py  (нужен pip install fonttools brotli)"""
import glob, os
from fontTools import subset

LATIN = "U+0020-007E,U+00A0,U+00AB,U+00B1,U+00B7,U+00BB,U+00D7,U+2010-2014,U+2018-201E,U+2026,U+2190-2193,U+2212"
CYR = "U+0401,U+0410-044F,U+0451,U+2116,U+0020,U+00A0"

for path in sorted(glob.glob('vendor/fonts/*.woff2')):
    before = os.path.getsize(path)
    uni = LATIN if 'latin' in path else CYR
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    font = subset.load_font(path, opts)
    s = subset.Subsetter(opts)
    s.populate(unicodes=subset.parse_unicodes(uni))
    s.subset(font)
    subset.save_font(font, path, opts)
    print(f'{os.path.basename(path):40s} {before//1024:4d} KB -> {os.path.getsize(path)//1024:4d} KB')
