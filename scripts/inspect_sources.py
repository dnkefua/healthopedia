"""Local-only inspection of the supplied WHO manual. Does not publish source text."""
import sys
import fitz

sys.stdout.reconfigure(encoding="utf-8")
doc = fitz.open("sources/who-manual.pdf")
starts = [1,7,13,17,23,31,37,43,49,55,61,67,71,79,85,91,97,105,111,117,125,129,135,141,147,151,157,163,170]
first = int(sys.argv[1]) if len(sys.argv) > 1 else 1
last = int(sys.argv[2]) if len(sys.argv) > 2 else 28
for chapter in range(first - 1, last):
    begin, end = starts[chapter], starts[chapter+1]
    print(f"\nCHAPTER {chapter+1}; printed {begin}-{end-1}; PDF {begin+12}-{end+11}")
    for i in range(begin+11, min(end+11, len(doc))):
        t = doc[i].get_text()
        if any(k.lower() in t.lower() for k in ["Composition", "chemical constituents", "Method of preparation", "Precautions and safety"]):
            print(f"\nPDF PAGE {i+1}\n{t.split('References')[0]}")
