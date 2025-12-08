

async function loadAndTransformJSON(JSONDoc, FragmentID, fileSeq)
{
    console.log ('JSON GO:' + FragmentID + ' JSON:' + JSONDoc );
    
	const response = await fetch(JSONDoc);
	const JSONResponse = await response.json();
    console.log ('JSON GOT:' + FragmentID + '...');
	console.log ('1-' + JSONResponse);
	console.log ('2-' + JSONResponse.news);

    injectRoot = document.getElementById(FragmentID);
	
	console.log ('3-' + JSONResponse.news.length);
	for (i = 0; i < JSONResponse.news.length; i++) {
		console.log("E" + i + ": " + JSONResponse.news[i].title );
		const head = document.createElement("h2");
		const headnode = document.createTextNode(JSONResponse.news[i].title);
		head.appendChild(headnode);
		injectRoot.appendChild(head);

		const date = document.createElement("h3");
		const datenode = document.createTextNode(JSONResponse.news[i].date);
		date.appendChild(datenode);
		injectRoot.appendChild(date);
		
	}
}

async function loadHTMLDoc(HTMLDoc, FragmentID, fileSeq)
{	
    console.log ('HTML GO:' + FragmentID + ' HTML:' + HTMLDoc);

	const response = await fetch(HTMLDoc);
	const HTMLResponse = await response.text();

//    console.log ('HTML GOT:' + FragmentID + ' HTML:' + HTMLResponse);
	document.getElementById(FragmentID).innerHTML=HTMLResponse;
}


async function LoadFilesInSeq(fileSeq) 
{
	loadHTMLDoc("home.htm", "home", fileSeq);
	loadAndTransformJSON("news.json", "news", fileSeq);
	loadHTMLDoc("aboutus.htm", "aboutus", fileSeq);
	loadHTMLDoc("contact.htm", "contact", fileSeq);

}	

