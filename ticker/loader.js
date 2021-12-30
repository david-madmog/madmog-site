// Global Variables
var ReadyToLoadData;
var CurrentGame;
var JSONData;
var FirstLoad;

// Called on initialisation
function OnBodyLoad() {
	FirstLoad = true;

	// Switch loading depending on local or web mode
	document.getElementById('input').style.display = config.Local ? "block" : "none" ;
	if (! config.Local) {
		LoadContent();
	}
	
	document.getElementById('debug').style.display = config.Debug ? "block" : "none" ;	
	CurrentGame = 0;
	
	// Set animation speed
	document.getElementById("Table1").setAttribute("style", "--looptime: " + config.LoopTime) ;
	document.getElementById("Table2").setAttribute("style", "--looptime: " + config.LoopTime) ;
		
	// set animation event handlers
	var element = document.getElementById("Table1");
	element.addEventListener("animationiteration", AniLoop, false);
  	element.addEventListener("webkitAnimationIteration", AniLoop, false);
}

// Called each time an entry has finished scrolling
function AniLoop(event) {
	// Switch Over Animation Direction Horizontal <--> vertical
	document.getElementById("Table1").classList.toggle("tickerTable1h") ;
	document.getElementById("Table1").classList.toggle("tickerTable1v") ;
	document.getElementById("Table2").classList.toggle("tickerTable2h") ;
	document.getElementById("Table2").classList.toggle("tickerTable2v") ;	
	
	// So, if we're in web mode or have entered filename, refresh our data
	if (ReadyToLoadData) {
		if (document.getElementById("Table1").classList.contains("tickerTable1v") ) {
			// We've just finished a horizontal scroll, about to start a vertical one
			// Refresh data and move on to the next event - load new event into bottom row so it can scroll into view
			LoadContent();
			document.getElementById("debug").innerText = "Showing " + CurrentGame ;
			CurrentGame += 2;
		} else {
			// We've just finished a vertical scroll, about to start a horizontal one
			// Copy data in bottom row to top one - the horizontal scroll will flip back to show the 
			// 		top row.
			CopyEvent34to12();
		}
	} else {
		// heartbeat
		document.getElementById("debug").innerText = document.getElementById("debug").innerText == "DEBUG" ? "debug" : "DEBUG" ;
	}
  }

// Called from two places: 
//	1. the first time we're ready to load - varies depending on mode
//	2. When we reach the end of the scroll, if we've been called before (ReadyToLoadData = true)
function LoadContent() {
	if (config.Local) {
		loadFile();
	} else {
		NetLoadFile();
	}
	ReadyToLoadData = true;
  }
    
// Loads a LOCAL file (used in debug mode)
function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
      alert("The file API isn't supported on this browser yet.");
      return;
	}

    input = document.getElementById('fileinput');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
		ShowLoading(true);
		file = input.files[0];
		fr = new FileReader();
		fr.onload = function(e) {
			var lines = e.target.result;
			JSONData = JSON.parse(lines); 
			ShowLoading(false);
		}
		fr.readAsText(file);
		if (JSONData != null) {
			ExtractJsonData(0);
			ExtractJsonData(1);
		}
	}
  }
  
// Loads the data file - production (network) version
function NetLoadFile() {
	ShowLoading(true);
	var JSONDoc = config.RemoteServer + config.RemotePath;
	xmlhttp = new XMLHttpRequest();
    xmlhttp.open("get", JSONDoc, true ) ;
	
	// Approach is as follows:
	// If we've never loaded the doc at all, then extract the data as soon as we've done the load.
	// If we have previously loaded the doc, then this is a refresh, so no need to wait for doc to load, 
	// 	   just update from the most recent one received. This synchronises the update with scrolling and
	//     prevents updates mid-scroll.
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) { // State 4 = DONE - operation complete
			JSONData = JSON.parse(xmlhttp.response); 
			ShowLoading(false);
			if (FirstLoad) {
				FirstLoad = false;
				ExtractJsonData(0);
				ExtractJsonData(1);
			}
		}
	};
    xmlhttp.send() ;
	if (JSONData != null) {
		ExtractJsonData(0);
		ExtractJsonData(1);
	}
  }
  
// Parse the JSON data file, find the Event to display
// Parameter is which line (Section) to display to
function ExtractJsonData(Sec) {
	var MarketsWithGames = 0;

	// Go through finding events with some markets
	for (i = 0; i < JSONData.events.length; i++) {
		if ( config.Debug ) {
			console.log("E" + i + ": " + JSONData.events[i].participantnameaway + " @ " + JSONData.events[i].participantnamehome);
		}
		if ( JSONData.events[i].markets != null) {
			
			// see if this is the "n"th market with games, where "n" is the current one to display
			if ( MarketsWithGames == (CurrentGame + Sec)) {
				if (Sec == 1) {
					ExtractEvent(0, JSONData.events[i]);
				} else {
					ExtractEvent(1, JSONData.events[i]);
				}
				
				// Now found one, no need to continue
				return;
			} else {
				// we have games, but this is not yet the one we need
				MarketsWithGames += 1;
			}
		}
	}
	
	// If we got here, we have insuffient events to reach the counter. 
	// If we have ANY events with markets, reset counter and have another go
	if (MarketsWithGames > 0) {
		CurrentGame = 0;
		ExtractJsonData(Sec);
	}
		
}

// Extract a single event's data into display grid
// Line indicates which line of the grid to extract to: 0/1
// Event is a node in the parsed JSON indicating the current event to extract from 
function ExtractEvent(Line, Event) {
	
	// Prefixes for element ID's to locate which output grid cell to put data into 
	var IDR1 = ((Line == 0) ? "L3" : "L7");
	var IDR2 = ((Line == 0) ? "L4" : "L8");
	
	// Set the team names
	document.getElementById(IDR1 + 'T').innerText = Event.participantnameaway;
	document.getElementById(IDR2 + 'T').innerText = Event.participantnamehome;
	document.getElementById(IDR1 + 'T2').innerText = Event.participantnameaway;
	document.getElementById(IDR2 + 'T2').innerText = Event.participantnamehome;
	
	// Now find the Points, Moneyline and totals markets
	for (j = 0; j < Event.markets.length; j++) {
		var Market = Event.markets[j]
		if ( config.Debug ) {
			console.log("M" + j + ": " + Market.name);
		}
		if ( Market.gameperiod == "1+") {
			if ( Market.big3markettype == "ML") {
				// Money line
				document.getElementById(IDR1 + 'M').innerText =  Market.selections[0].priceus;
				document.getElementById(IDR2 + 'M').innerText =  Market.selections[1].priceus;
				document.getElementById(IDR1 + 'M2').innerText =  Market.selections[0].priceus;
				document.getElementById(IDR2 + 'M2').innerText =  Market.selections[1].priceus;
			} else if ( Market.big3markettype == "PS") {
				// Points spread
				CMH = Market.selections[0].currentmatchhandicap;
				if ( CMH > 0 ) {
					document.getElementById(IDR1 + 'P').innerText = "+" + Market.selections[0].currentmatchhandicap;
					document.getElementById(IDR2 + 'P').innerText = "-" + Market.selections[1].currentmatchhandicap;
					document.getElementById(IDR1 + 'P2').innerText = "+" + Market.selections[0].currentmatchhandicap;
					document.getElementById(IDR2 + 'P2').innerText = "-" + Market.selections[1].currentmatchhandicap;
				} else {
					document.getElementById(IDR1 + 'P').innerText = "" + Market.selections[0].currentmatchhandicap;
					document.getElementById(IDR2 + 'P').innerText = "+" + -Market.selections[1].currentmatchhandicap;
					document.getElementById(IDR1 + 'P2').innerText = "" + Market.selections[0].currentmatchhandicap;
					document.getElementById(IDR2 + 'P2').innerText = "+" + -Market.selections[1].currentmatchhandicap;
				}
			} else if ( Market.big3markettype == "TP") {
				// Total Points
				document.getElementById(IDR1 + 'OU').innerText = "O/U " + Market.selections[0].currentmatchhandicap;
				document.getElementById(IDR1 + 'OU2').innerText = "O/U " + Market.selections[0].currentmatchhandicap;
			}
		}
	}
}

function CopyEvent34to12() {
	// There might be a more elegant way of doing this, but is it worth it?
	
	// name
	document.getElementById('L1T').innerText = document.getElementById('L3T').innerText ;
	document.getElementById('L2T').innerText = document.getElementById('L4T').innerText ; 
	document.getElementById('L1T2').innerText = document.getElementById('L3T2').innerText ;
	document.getElementById('L2T2').innerText = document.getElementById('L4T2').innerText ; 
	document.getElementById('L5T').innerText = document.getElementById('L7T').innerText ;
	document.getElementById('L6T').innerText = document.getElementById('L8T').innerText ; 
	document.getElementById('L5T2').innerText = document.getElementById('L7T2').innerText ;
	document.getElementById('L6T2').innerText = document.getElementById('L8T2').innerText ; 
	// Money line
	document.getElementById('L1M').innerText = document.getElementById('L3M').innerText ; 
	document.getElementById('L2M').innerText = document.getElementById('L4M').innerText ; 
	document.getElementById('L1M2').innerText = document.getElementById('L3M2').innerText ; 
	document.getElementById('L2M2').innerText = document.getElementById('L4M2').innerText ; 
	document.getElementById('L5M').innerText = document.getElementById('L7M').innerText ; 
	document.getElementById('L6M').innerText = document.getElementById('L8M').innerText ; 
	document.getElementById('L5M2').innerText = document.getElementById('L7M2').innerText ; 
	document.getElementById('L6M2').innerText = document.getElementById('L8M2').innerText ; 
	// Points spread
	document.getElementById('L1P').innerText = document.getElementById('L3P').innerText ; 
	document.getElementById('L2P').innerText = document.getElementById('L4P').innerText ; 
	document.getElementById('L1P2').innerText = document.getElementById('L3P2').innerText ; 
	document.getElementById('L2P2').innerText = document.getElementById('L4P2').innerText ; 
	document.getElementById('L5P').innerText = document.getElementById('L7P').innerText ; 
	document.getElementById('L6P').innerText = document.getElementById('L8P').innerText ; 
	document.getElementById('L5P2').innerText = document.getElementById('L7P2').innerText ; 
	document.getElementById('L6P2').innerText = document.getElementById('L8P2').innerText ; 
	// Total Points
	document.getElementById('L1OU').innerText =	document.getElementById('L3OU').innerText ; 
	document.getElementById('L1OU2').innerText = document.getElementById('L3OU2').innerText ; 
	document.getElementById('L5OU').innerText =	document.getElementById('L7OU').innerText ; 
	document.getElementById('L5OU2').innerText = document.getElementById('L7OU2').innerText ; 
}


// Display little symbol to show we're working  
function ShowLoading(Show) {
	document.getElementById('loading').style.display = Show ? "block" : "none" ;
  }
  
