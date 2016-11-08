DOCUMENT_NAME = technology-review

writeup:
	latex $(DOCUMENT_NAME).tex	
	# makeindex $(DOCUMENT_NAME).idxw
	bibtex $(DOCUMENT_NAME).aux
	latex $(DOCUMENT_NAME).tex
	latex $(DOCUMENT_NAME).tex
	dvips $(DOCUMENT_NAME).dvi
	ps2pdf $(DOCUMENT_NAME).ps


clean:
	rm -f *.out *.log *.dvi *.aux *.ps *.pdf *.toc *.ind *.ilg *.idx *.bbl *.blg

