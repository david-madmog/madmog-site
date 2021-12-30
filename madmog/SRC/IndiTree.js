

function DrawTree(ID) {
  var a_canvas = document.getElementById(ID);

	Number = a_canvas.getAttribute("fork") ;

  if (Number == 0)
    a_canvas.style.display = "none" ;
  else
    a_canvas.style.display = "inline" ;

//canvas.width / canvas.height are about the size in pixel of the buffer that will contains the result of drawing commands.
//canvas.style.width / canvas.style.height are about the size used to show the canvas object in the browser window and they can be in any of the units supported by css.
	
//  a_canvas.setAttribute("width", 1);
//	w = a_canvas.parentNode.offsetWidth ;
	w = a_canvas.offsetWidth ;
  a_canvas.setAttribute("width", w);
	h = a_canvas.offsetHeight ;
  a_canvas.setAttribute("height", h);
	
  var cw = w / Number;
//    try {
	var context = a_canvas.getContext("2d");
//    } catch(e){
//        document.write('An error has occurred: '+e.message)
//    }

    context.lineWidth = 1;
    context.strokeStyle="darkblue";
    
    if (Number > 0) {
      hh = ((9 * h)/10) ;
      ht = h/3;
      context.moveTo(cw/2,hh);
      context.lineTo(w - cw/2,hh);
      context.moveTo(w/2,ht + 2);
      context.lineTo(w/2, hh);
      context.moveTo((w/2)-8,ht - 2);
      context.lineTo((w/2)+8,ht - 2);
      context.moveTo((w/2)-8,ht + 2);
      context.lineTo((w/2)+8,ht + 2);

      var cx = cw/2 ;
      for (var i = 1; i <= Number; i++) {
        context.moveTo(cx, hh);
        context.lineTo(cx, h);
        cx = cx + cw ;
      }
        
//      context.moveTo(0,0);
//      context.lineTo(w,h);
//      context.moveTo(w,0);
//      context.lineTo(0,h);

    } else {
      context.moveTo((w/2)-8,(h/2) - 2);
      context.lineTo((w/2)+8,(h/2) - 2);
      context.moveTo((w/2)-8,(h/2) + 2);
      context.lineTo((w/2)+8,(h/2) + 2);
      context.moveTo((w/2),(h/2) + 2);
      context.lineTo((w/2),h);
    }
    
    context.stroke();
    
}

function loadXMLDoc(fname)
{
  var xmlhttp=false;
/*@cc_on @*/
/*@if (@_jscript_version >= 5)
// JScript gives us Conditional compilation, we can cope with old IE versions.
// and security blocked creation of the objects.
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
@end @*/
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      xmlhttp=false;
    }
  }
  if (!xmlhttp && window.createRequest) {
    try {
      xmlhttp = window.createRequest();
    } catch (e) {
      xmlhttp=false;
    }
  }

  try {
    xmlhttp.open("get", fname, false ) ;
    xmlhttp.send() ;
  } catch(e){
    // use sample 
	parser = new DOMParser();
	text = DevSampleXML();
    xmlDoc = parser.parseFromString(text,"text/xml");
	return xmlDoc;
  //    alert('An error has occurred: '+e.message)
  }
  return(xmlhttp.responseXML);
}

function MyGetElementByID(Type, ID)
{
  elems = xml.getElementsByTagName(Type) ;
  for (var i = 0; i < elems.length; i++) 
  {
    elemID = elems[i].getAttribute("ID") ;
    if (elemID == ID) 
    {
      return elems[i] ;
    }
  }
}

function GetElementChildElementTextByID(ElementType, ElementID, ChildType)
{
  elem = MyGetElementByID(ElementType, ElementID) ;
  if (elem == undefined)
  {
    return "";
  }	
  childElems = elem.getElementsByTagName(ChildType) ;

  // now, there should be only one of these, just use the first one  
  var childrenschildren = childElems[0].childNodes; 
  for (var j = 0; j < childrenschildren.length; j++) 
  {
    if (childrenschildren[j].nodeType == 3 ) // text node
    {
      return (childrenschildren[j].nodeValue) ;
    }
  }
}

function GetElementChildElementAttributeByID(ElementType, ElementID, AttribType, Index)
{
  elem = MyGetElementByID(ElementType, ElementID) ;
  if (elem == undefined)
  {
    return "";
  }	
  childElems = elem.getElementsByTagName(AttribType) ;

  if(Index === undefined) { 
    Index = 0
  }

  if (childElems.length > Index)
    return childElems[Index].getAttribute("REF") ;
  else
    return "";
}

function ShowName(Name)
{
  if (Name.includes("//"))
  {
     Name = Name.replace("//", "");
  } else {
    Name = Name.replace("/", "<b>");
    Name = Name.replace("/", "</b>");
  }
	return Name ;
}

function GetSortKey(Name)
{
  var n = Name.indexOf("<b>");
  if (n == -1) {
    Name = "_" + Name ;
  } else {
    Name = Name.substr(n) + Name ;
  }
	return Name ;
}

function CreateChildInfo(fragElem, elem, ExtraText) 
{
  var str = "" ;

  newElement = document.createElement("P");
  newElement.setAttribute("class", "subtext") ;
  var AnotherNewElem ;

  childElems = elem.getElementsByTagName("DATE") ;
  // now, there should be only one of these, just use the first one  
  if (childElems.length > 0)
  {
    str = str + childElems[0].innerHTML ;
  }
  
  childElems = elem.getElementsByTagName("PLAC") ;
  // now, there should be only one of these, just use the first one  
  if (childElems.length > 0)
  {
    str = str + " " + childElems[0].innerHTML ;
  }
  
  childElems = elem.getElementsByTagName("NOTE") ;
  // now, there should be only one of these, just use the first one  
  if (childElems.length > 0)
  {
    newElement.setAttribute("class", "tooltip") ;
    AnotherNewElem = document.createElement("SPAN");
    AnotherNewElem.setAttribute("class", "tooltiptext") ;
    AnotherNewElem.innerHTML = childElems[0].innerHTML ;
    if (str == "")
    {
      str == "Note" ;
    }
  }
  
  if (str != "")
  {
    newElement.innerHTML = ExtraText + " " + str ;
    fragElem.appendChild(newElement);
    if (AnotherNewElem != undefined)
    {
      newElement.appendChild(AnotherNewElem) ;
    }
  }
}

function PopulateFocusIndi(IndiID, fragment)
{
  fragElem = document.getElementById(fragment) ;
  fragElem.innerHTML = "" ;

  elem = MyGetElementByID("INDI", IndiID) ;
  if (elem == undefined)
  {
    return "";
  }	
  
  // We want NAME first, then Image, rest can just follow
  childElems = elem.getElementsByTagName("NAME") ;
  // now, there should be only one of these, just use the first one  
  if (childElems.length > 0)
  {
    newElement = document.createElement("P");
    newElement.innerHTML = ShowName(childElems[0].innerHTML) ;
    fragElem.appendChild(newElement);
  }

  childElems = elem.getElementsByTagName("IMG") ;
  // now, there should be only one of these, just use the first one  
  if (childElems.length > 0)
  {
    newElement = document.createElement("P");
    fragElem.appendChild(newElement);
    AnotherNewElem = document.createElement("IMG");
    AnotherNewElem.setAttribute("src", ImagePath + childElems[0].innerHTML);
    newElement.appendChild(AnotherNewElem);
  }  
  
  for (var j = 0; j < elem.childNodes.length; j++) 
  {
    if (elem.childNodes[j].nodeType == 1 ) // element node
    {
      switch(elem.childNodes[j].nodeName) 
      {
        case "BIRT":
          CreateChildInfo(fragElem, elem.childNodes[j], "b.") ;
          break;
        case "DEAT":
          CreateChildInfo(fragElem, elem.childNodes[j], "d.") ;
          break;
        case "EMIG":
          CreateChildInfo(fragElem, elem.childNodes[j], "") ;
          break;
        case "BURI":
          CreateChildInfo(fragElem, elem.childNodes[j], "Buried") ;
          break;
        case "BAPM":
          CreateChildInfo(fragElem, elem.childNodes[j], "Baptism") ;
          break;
        case "MARR":
          CreateChildInfo(fragElem, elem.childNodes[j], "Marriage") ;
          break;
        case "SOUR":
          CreateChildInfo(fragElem, elem.childNodes[j], "Source") ;
          break;
        case "EVEN":
          var EvenText = "" ;
          for (var i = elem.childNodes[j].childNodes.length - 1; i >= 0; i--) 
          {
            var LE = elem.childNodes[j].childNodes[i] ;
            if (LE.nodeType == 3 ) 
            {
              EvenText = EvenText + LE.nodeValue ;
            }
            if (LE.nodeName == "TYPE")
            {
              EvenText = EvenText + LE.innerHTML + ": " ;
            }
            if (LE.nodeName == "PLAC")
            {
              EvenText = EvenText + " At " + LE.innerHTML ;
            }
          }
          newElement = document.createElement("P");
          newElement.setAttribute("class", "subtext") ;
          newElement.innerHTML = EvenText;
          fragElem.appendChild(newElement);
          break ;
        case "OCCU":
          var EvenText = "" ;
          for (var i = 0; i < elem.childNodes[j].childNodes.length ; i++) 
          {
            var LE = elem.childNodes[j].childNodes[i] ;
            if (LE.nodeType == 3 ) 
            {
              EvenText = EvenText + LE.nodeValue ;
            }
            if (LE.nodeName == "PLAC")
            {
              EvenText = EvenText + " At " + LE.innerHTML ;
            }
          }
          newElement = document.createElement("P");
          newElement.setAttribute("class", "subtext") ;
          newElement.innerHTML = EvenText;
          fragElem.appendChild(newElement);
          break;
        case "NOTE":
          newElement = document.createElement("P");
          newElement.setAttribute("class", "tooltip") ;
          newElement.innerHTML = "Note" ;
          fragElem.appendChild(newElement);
          AnotherNewElem = document.createElement("SPAN");
          AnotherNewElem.setAttribute("class", "tooltiptext") ;
          AnotherNewElem.innerHTML = elem.childNodes[j].innerHTML ;
          newElement.appendChild(AnotherNewElem) ;
          break ;
        case "NAME":
        case "IMG":
        case "SEX":
        case "FAMS":
        case "FAMC":
          // ignore
          break;
        default:
          newElement = document.createElement("P");
          newElement.innerHTML = elem.childNodes[j].nodeName ;
          fragElem.appendChild(newElement);
          break;
      }
    }
  }  

  // Now, if multiple FAMS, add tag/link for each one
  fams = elem.getElementsByTagName("FAMS") ;
  if (fams.length > 1) 
  {
    for (var j = 0; j < fams.length; j++) 
    {
      newElement = document.createElement("P");
      newElement.setAttribute("onClick", "loadIndividual('" + IndiID + "', " + j + ");");
      newElement.setAttribute("class", "pseudolink") ;
      newElement.innerHTML = "Marriage #" + (j+1) ;
      newElement.style.fontSize = "8pt" ;
      fragElem.appendChild(newElement);
    }
  }
  
}

function PopulateNonFocusIndi(IndiID, fragment)
{
  Name = GetElementChildElementTextByID("INDI", IndiID, "NAME");
  if (Name == "")
  {  
    Name = "?" ;
    document.getElementById(fragment).setAttribute("onClick", "");
    document.getElementById(fragment).setAttribute("class", "") ;
  } else {
    document.getElementById(fragment).setAttribute("onClick", "loadIndividual('" + IndiID + "');");
    document.getElementById(fragment).setAttribute("class", "pseudolink") ;
  }
  document.getElementById(fragment).innerHTML = ShowName(Name) ;
}

function loadIndividual(IndiID, MarriageNumber) 
{
  // first, set the title 
  Name = GetElementChildElementTextByID("INDI", IndiID, "NAME");

  var Title=document.getElementById("Title") ;
  Title.innerHTML = ShowName(Name) ;

  if(MarriageNumber === undefined) { 
        MarriageNumber = 0 ;
  }

  famsID = GetElementChildElementAttributeByID("INDI", IndiID, "FAMS", MarriageNumber) ;
  
  // If individual is never married, we can't quite proceed like this...
  if (famsID == "") 
  {
     var sex = GetElementChildElementTextByID("INDI", IndiID, "SEX") ;
     if ( sex == "M")
     {
       husbID = IndiID ;
       wifeID = "" ;
     } else {
       husbID = "";
       wifeID = IndiID ;
     }
  } else {
    // Populate husband
    husbID = GetElementChildElementAttributeByID("FAM", famsID, "HUSB");
    wifeID = GetElementChildElementAttributeByID("FAM", famsID, "WIFE");
  }
    
  PopulateFocusIndi(husbID, "fH") ;
  
  // Husband's parents
  famcID = GetElementChildElementAttributeByID("INDI", husbID, "FAMC") ;
  fatherID = GetElementChildElementAttributeByID("FAM", famcID, "HUSB");
  PopulateNonFocusIndi(fatherID, "pHF") ;
  motherID = GetElementChildElementAttributeByID("FAM", famcID, "WIFE");
  PopulateNonFocusIndi(motherID, "pHM") ;

  // Husb's GP's
  gpFamID = GetElementChildElementAttributeByID("INDI", fatherID, "FAMC") ;
  gpID = GetElementChildElementAttributeByID("FAM", gpFamID, "HUSB");
  PopulateNonFocusIndi(gpID, "gHFF") ;
  gpID = GetElementChildElementAttributeByID("FAM", gpFamID, "WIFE");
  PopulateNonFocusIndi(gpID, "gHFM") ;

  gpFamID = GetElementChildElementAttributeByID("INDI", motherID, "FAMC") ;
  gpID = GetElementChildElementAttributeByID("FAM", gpFamID, "HUSB");
  PopulateNonFocusIndi(gpID, "gHMF") ;
  gpID = GetElementChildElementAttributeByID("FAM", gpFamID, "WIFE");
  PopulateNonFocusIndi(gpID, "gHMM") ;


  // ... and wife
  PopulateFocusIndi(wifeID, "fW") ;

  // Wife's parents
  famcID = GetElementChildElementAttributeByID("INDI", wifeID, "FAMC") ;
  fatherID = GetElementChildElementAttributeByID("FAM", famcID, "HUSB");
  PopulateNonFocusIndi(fatherID, "pWF") ;
  motherID = GetElementChildElementAttributeByID("FAM", famcID, "WIFE");
  PopulateNonFocusIndi(motherID, "pWM") ;

  // Wife's GP's
  gpFamID = GetElementChildElementAttributeByID("INDI", fatherID, "FAMC") ;
  gpID = GetElementChildElementAttributeByID("FAM", gpFamID, "HUSB");
  PopulateNonFocusIndi(gpID, "gWFF") ;
  gpID = GetElementChildElementAttributeByID("FAM", gpFamID, "WIFE");
  PopulateNonFocusIndi(gpID, "gWFM") ;

  gpFamID = GetElementChildElementAttributeByID("INDI", motherID, "FAMC") ;
  gpID = GetElementChildElementAttributeByID("FAM", gpFamID, "HUSB");
  PopulateNonFocusIndi(gpID, "gWMF") ;
  gpID = GetElementChildElementAttributeByID("FAM", gpFamID, "WIFE");
  PopulateNonFocusIndi(gpID, "gWMM") ;

  // And Children...
  ChildrenLocation = document.getElementById("children") ;
  var CTElem = document.getElementById("CT") ;
  
  FamsElem = MyGetElementByID("FAM", famsID) ;
  if (FamsElem != undefined) 
  {
    ChildrenLocation.style.display = "table-row";
    CTElem.style.display = "inline";
    document.getElementById("CTI").style.display = "inline";
    
    while (ChildrenLocation.hasChildNodes()) {   
        ChildrenLocation.removeChild(ChildrenLocation.firstChild);
    }
    children = FamsElem.getElementsByTagName("CHIL") ; 

      //DrawTree("CT", children.length, 600, 50) ; 
    CTElem.setAttribute("fork", children.length) ;      
    DrawTree("CT") ;                      

    for (var i = 0; i < children.length; i++) 
    {
      // Get child's ID...
      ChildID = children[i].getAttribute("REF") ;

      // create a table cell for it
      newElement = document.createElement("TD");
      newElement.setAttribute("id", ChildID);
      ChildrenLocation.appendChild(newElement);

      // And populate it
      PopulateNonFocusIndi(ChildID, ChildID) ;
    }
  } else {
    ChildrenLocation.style.display = "none";
    CTElem.style.display = "none";
    document.getElementById("CTI").style.display = "none";
  }
}

function SortChildren(list) 
{
  var items = list.childNodes;
  var itemsArr = [];
  for (var i in items) {
      if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
          itemsArr.push(items[i]);
      }
  }

  itemsArr.sort(function(a, b) {
    return a.getAttribute("sortKey") == b.getAttribute("sortKey")
            ? 0
            : (a.getAttribute("sortKey") > b.getAttribute("sortKey") ? 1 : -1);
  });

  for (i = 0; i < itemsArr.length; ++i) {
    list.appendChild(itemsArr[i]);
  }
}

function LoadIndiIndex(fragElem) 
{
  Indis = xml.getElementsByTagName("INDI") ;
  ChildrenLocation = document.getElementById(fragElem) ;
  
  for (var i = 0; i < Indis.length; i++) 
  {
    // Get child's ID...
    ChildID = Indis[i].getAttribute("ID") ;    

    // create a P for it
    newElement = document.createElement("P");
    newElement.setAttribute("id", "X" + ChildID);
    ChildrenLocation.appendChild(newElement);

    // And populate it
    PopulateNonFocusIndi(ChildID, "X" + ChildID) ;
    newElement.setAttribute("class", "IndexEntry") ;
    newElement.setAttribute("sortKey", GetSortKey(newElement.innerHTML));
  }
  SortChildren(ChildrenLocation) ;
}



