var Results = [
["b", "b", "aa", "a", "sa", "s"],
["d", "s", "s", "ss", "a", "a", "sa", "aa"],
["c", "s", "s", "ss", "ss", "a", "sa", "sa", "sa", "aa", "aa", "x"],
["b", "b", "f", "f", "t", "t"],
["d", "f", "ff", "t", "t", "t", "tt", "ft"],
["c", "f", "f", "ff", "ff", "t", "t", "ft", "ft", "tt", "tt", "y"],
["z", "z", "z", "z", "z", "z", "zz", "Z", "Z", "ZZ", "ZZ", "ZZ"],
]

////////////////////////////////////////////////////////////////////////
// Main rolling section


function NumDiceChanged(RowTag) {
  var elements = document.getElementById(RowTag).children;
  var inp = elements.item(2).children.item(0);
  console.log (RowTag + " " + inp.value);
  
  elements.item(3).innerHTML = "";
  var i;
  var text = "";
  for (i = 0; i < inp.value; i++) {
    text += elements.item(1).innerHTML + " ";
  }

  elements.item(3).innerHTML = text;
  elements.item(3).style.cssText = elements.item(1).style.cssText;
}

function Roll() {
	var Rows = document.getElementById("table").children.item(0).children;
	var AllText = "";
	
	for (var row of Rows) {
		AllText += RollRow(row);
	}
	
	totalRows(AllText);
}

function RollRow(row) {
	var cells = row.children;

	var text = ""
	var numDice = cells.item(2).children.item(0);
	for (i = 0; i < numDice.value; i++) {
		var ttext = RollSingleDice(row.rowIndex) + " ";
		console.log ("Row:" + row.id + " die:" + i + " roll:" + ttext);
		text += ttext;
	}
	
	cells.item(3).innerHTML = text;
	cells.item(3).style.cssText = cells.item(1).style.cssText;
	return text;
}

function RollSingleDice(index)
{
	var sides = Results[index].length;
	var result = Math.floor(Math.random() * sides);
	console.log("Result: " + result);
	return Results[index][result];
}

function totalRows(result)
{
    var totalsRow = document.getElementById("total").children;
    var text = "";

  	var success = CountSymbols(result, "s") + CountSymbols(result, "x") - CountSymbols(result, "f") - CountSymbols(result, "y") ;
	console.log ("Success: " + success);
    for (i = 0; i < success; i++) {
		text += "s" ;
	}
    for (i = 0; i > success; i--) {
		text += "f" ;
	}

	text += " ";
  	var success = CountSymbols(result, "a") + CountSymbols(result, "x") - CountSymbols(result, "t") - CountSymbols(result, "y") ;
	console.log ("Advantage: " + success);
    for (i = 0; i < success; i++) {
		text += "a" ;
	}
    for (i = 0; i > success; i--) {
		text += "t" ;
	}

	text += " ";
    for (i = 0; i < CountSymbols(result, "z") ; i++) {
		text += "z" ;
	}
    for (i = 0; i < CountSymbols(result, "Z") ; i++) {
		text += "Z" ;
	}

	if ( CountSymbols(result, "x") > 0 ) {
		text += ' <div class="totalExtra">x</div>'
	}
	if ( CountSymbols(result, "y") > 0 ) {
		text += ' <div class="totalExtra">y</div>'
	}

	if ( text == "  ") {
		text = "-";
	}

    totalsRow.item(3).innerHTML = text;
	
	AddHistory(text);
}


function CountSymbols(str, symbol)
{
	var count = 0;
	var start = 0;
	
	while (start >= 0) {
		start = str.indexOf(symbol, start) ;
		if (start >= 0) {
			count++;
			start++;
		}
	}
	console.log ("Found " + count + " " + symbol);
	return (count);
}

////////////////////////////////////////////////////////////////////////
// Quick Pick buttons

function QuickPick(type, num, parm2)
{
	var elements ;
	var inp ;

	switch (type) {
	case "P": 
		if (parm2 == "a") {
			QPSet("ability", num);
			QPSet("proficiency", 0);
			QPSet("boost", 0);
		} else {
			QPSet("difficulty", num);
			QPSet("challenge", 0);
			QPSet("setback", 0);
		}
		break;
	case "A":
		QPAdj(parm2, num);
		break;
	case "D":
		QPSet("ability", num);
		QPSet("proficiency", parm2);
		QPSet("boost", 0);
		break;
	case "U": 
		if (parm2 == "a") {
			E1 = "ability";
			E2 = "proficiency";
		} else {
			E1 = "difficulty";
			E2 = "challenge";
		}
		
		NumDone = QPAdj(E1, -num);
		NumDone2 = QPAdj(E2, -NumDone);
		if (NumDone != -num) {
			QPAdj(E1, num - NumDone);
		}
		if (NumDone2 != -NumDone) {
			QPAdj(E1, -2 * NumDone) ;
		}
		break;
	case "C": 
		var Rows = document.getElementById("table").children.item(0).children;
		for (var row of Rows) {
			QPSet(row.id, 0)
		}
	}
}
	
function QPAdj(Elem, num)
{
	elements = document.getElementById(Elem).children;
	inp = elements.item(2).children.item(0);
	OldVal = parseInt(inp.value, 10) ;
	
	while (OldVal + num < 0) {
//		num1 += 2;
		num ++ ;
	}
	
	QPSet(Elem, OldVal + num);
	return num;
}

function QPSet(Elem, num) {
	elements = document.getElementById(Elem).children;
	inp = elements.item(2).children.item(0);
	console.log (Elem + inp.value + " to " + num);
	inp.value = num ;
	NumDiceChanged(Elem)
}


////////////////////////////////////////////////////////////////////////
// History and history buttons

function AddHistory(result) {
	HTable = document.getElementById("history")
	
	while (document.getElementById("history").children[0].children.length > 9) {
		document.getElementById("history").deleteRow(9)
	}
	
	newRow = HTable.insertRow(0);
	FirstCell = newRow.insertCell();
	NewButton = document.createElement("button");
	NewButton.setAttribute("class", "QuickPick");
	FirstCell.appendChild(NewButton);
	
	var HistoryString = "";
	var Rows = document.getElementById("table").children.item(0).children;
	for (var row of Rows) {
		var numDice = row.children.item(2).children.item(0).value;
		HistoryString += numDice ;
		if (numDice > 0) {
			NewDiv = document.createElement("div");
			
			var newContText = row.children.item(1).innerHTML;
			var newContent = document.createTextNode(newContText.repeat(numDice) + " ");
			NewDiv.appendChild(newContent);
			
			NewDiv.setAttribute("class", "QPsymbol");
			var style = row.children.item(1).getAttribute("style");
			style += "; float:left";
			NewDiv.setAttribute("style", style);
			
			NewButton.appendChild(NewDiv);
		}
	}
	NewButton.setAttribute("onclick", "HistoryPick('"+HistoryString+"')");
	
	SecondCell = newRow.insertCell();
	SecondCell.setAttribute("class", "symbol");
	SecondCell.innerHTML = result;
}

function HistoryPick(HistoryString) {
	console.log ("History: " + HistoryString);
	var Rows = document.getElementById("table").children.item(0).children;
	for (i = 0; i < Rows.length; i++) {
		console.log(i + ": " + HistoryString.substring(i, i+1));
		QPSet(Rows[i].id, parseInt(HistoryString.substring(i, i+1)));
	}

}