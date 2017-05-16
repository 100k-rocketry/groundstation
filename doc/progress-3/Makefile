export PATH := /usr/local/apps/tex_live/current/bin/x86_64-linux:$(PATH)
DOCUMENT_NAME = progress-3

writeup:
	latex $(DOCUMENT_NAME).tex	
	latex $(DOCUMENT_NAME).tex	
	dvips $(DOCUMENT_NAME).dvi
	ps2pdf $(DOCUMENT_NAME).ps


clean:
	rm -f *.out *.log *.dvi *.aux *.ps *.toc *.ind *.ilg *.idx *.bbl *.blg

