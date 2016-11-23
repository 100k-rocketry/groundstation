export PATH := /usr/local/apps/tex_live/current/bin/x86_64-linux:$(PATH)
DOCUMENT_NAME = design

writeup:
	latex $(DOCUMENT_NAME).tex	
	latex $(DOCUMENT_NAME).tex	
	makeindex $(DOCUMENT_NAME).idx
	bibtex $(DOCUMENT_NAME).aux
	latex $(DOCUMENT_NAME).tex
	latex $(DOCUMENT_NAME).tex
	dvips $(DOCUMENT_NAME).dvi
	ps2pdf $(DOCUMENT_NAME).ps


clean:
	rm -f *.out *.log *.dvi *.aux *.ps *.toc *.ind *.ilg *.idx *.bbl *.blg

