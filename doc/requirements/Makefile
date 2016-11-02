DOCUMENT_NAME = requirements

writeup:
	latex $(DOCUMENT_NAME).tex	
	makeindex $(DOCUMENT_NAME).idx
	latex $(DOCUMENT_NAME).tex
	dvips $(DOCUMENT_NAME).dvi
	ps2pdf $(DOCUMENT_NAME).ps

clean:
	rm -f *.out *.log *.dvi *.aux *.ps *.pdf *.toc

