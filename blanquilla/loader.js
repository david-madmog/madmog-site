

// Makes request for XML doc and fires callback 1 when done
function loadAndTransformXMLDoc(XMLDoc, XSLDoc, FragmentID, fileSeq)
{
  try {
    console.log ('XML GO:' + FragmentID + ' XML:' + XMLDoc + ' XSL:' + XSLDoc);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("get", XMLDoc, true ) ;
		
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			loadXSLDoc(xmlhttp.responseXML, XSLDoc, FragmentID, fileSeq) ;
		}
	};
    xmlhttp.send() ;
  } catch(e) {
//    alert('An error has occurred: '+e.message)
	LoadFilesInSeq(fileSeq + 1);
  }
}
	
// Callback 1: 
// Makes request for XSL doc and fires callback 2 when done
function loadXSLDoc(XMLDocXML, XSLDoc, FragmentID, fileSeq)
{
  try {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("get", XSLDoc, true ) ;
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			TransformXMLDoc(XMLDocXML,  xmlhttp.responseXML, FragmentID, fileSeq)
		}
	};
    xmlhttp.send() ;
  } catch(e) {
//    alert('An error has occurred: '+e.message)
	LoadFilesInSeq(fileSeq + 1);
  }
}

// Callback 2
// Got two docs, so transform them and inject  
function TransformXMLDoc(XMLDocXML, XSLDocXML, FragmentID, fileSeq)
{
  try {	 
	if (window.ActiveXObject) {
	  ex=XMLDocXML.transformNode(XSLDocXML);
	  document.getElementById(FragmentID).innerHTML=ex;
	} else if (document.implementation && document.implementation.createDocument) {
	  xsltProcessor=new XSLTProcessor();
	  xsltProcessor.importStylesheet(XSLDocXML);
	  resultDocument = xsltProcessor.transformToFragment(XMLDocXML,document);
	  document.getElementById(FragmentID).appendChild(resultDocument);
	}
	// And call for next file
	LoadFilesInSeq(fileSeq + 1); 
	
  } catch(e) {
//    alert('An error has occurred: ' + FragmentID + ': '+e.message) ;
	LoadFilesInSeq(fileSeq + 1);
  }
}

function loadHTMLDoc(HTMLDoc, FragmentID, fileSeq)
{	
  try {
    console.log ('HTML GO:' + FragmentID + ' HTML:' + HTMLDoc);

	// Don't forget, HTML IS also XML
    var xmlhttp = new XMLHttpRequest();

//		xmlhttp.onloadend = function() {
	xmlhttp.onreadystatechange = function() {
		document.getElementById(FragmentID).innerHTML=xmlhttp.responseText;
		// Scan new document for twitter stuff
//		twttr.widgets.load(document.getElementById(FragmentID));
		LoadFilesInSeq(fileSeq + 1);
	};

    xmlhttp.open("GET", HTMLDoc, true);
    xmlhttp.send();

  } catch(e) {
//    alert('An error has occurred: '+e.message)
	LoadFilesInSeq(fileSeq + 1);
  }
}


function LoadFilesInSeq(fileSeq) 
{
  console.log("Loading seq: " + fileSeq)   	
  switch(fileSeq) 
  {
	case 0:
		loadHTMLDoc("home.htm", "home", fileSeq);
		break;
    case 1:
		loadAndTransformXMLDoc("news.xml", "news.xsl", "news", fileSeq);
		break;
    case 2:
		loadHTMLDoc("aboutus.htm", "aboutus", fileSeq);
		break;
    case 3:
		loadHTMLDoc("contact.htm", "contact", fileSeq);
		break;
		
	default:
		break; //Do nothing - should now finish
  }
}	

