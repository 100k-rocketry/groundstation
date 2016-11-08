DOCUMENT_NAME = requirements
GANTT_NAME = ganttchart

writeup:
	latex $(DOCUMENT_NAME).tex	
	makeindex $(DOCUMENT_NAME).idx
	latex $(DOCUMENT_NAME).tex
	dvips $(DOCUMENT_NAME).dvi
	ps2pdf $(DOCUMENT_NAME).ps

gantt:
	inkscape -z -D --file=$(GANTT_NAME).svg --export-eps=$(GANTT_NAME).eps

clean:
	rm -f *.out *.log *.dvi *.aux *.ps *.pdf *.toc *.ind *.ilg *.idx

