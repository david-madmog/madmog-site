MSXSL DAVID.XML GedMLToHTML.xsl -o TreePage.htm 
MSXSL DAVID.XML GedMLToHTML_Index.xsl -o TreeIndex.htm 

MSXSL DAVID.XML GedMLToHTMLIndiBase.xsl -o TreeIndi.htm 


copy treePage.htm ..
copy treeIndex.htm ..


pause