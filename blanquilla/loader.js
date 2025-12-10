

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
		let article = JSONResponse.news[i]
		console.log("E" + i + ": " + article.title + "-" + article.body.length );
		const div = document.createElement("div")
		var divnode = document.createAttribute("class");
		divnode.value = "aboutSection"
		div.setAttributeNode(divnode);
		injectRoot.appendChild(div);
				
		const head = document.createElement("h2");
		const headnode = document.createTextNode(article.title);
		head.appendChild(headnode);
		div.appendChild(head);

		const date = document.createElement("h3");
		const datenode = document.createTextNode(article.date);
		date.appendChild(datenode);
		div.appendChild(date);
		
		
		for (j=0; j < article.body.length; j++) {
			for ( var prop in article.body[j] ) {
				console.log("B" + j + ": " + prop + "-" + article.body[j][prop])
				var elm ;
				var elmnode ;
				switch (prop) {
					case "text":
						elm = document.createElement("p");
						elmnode = document.createTextNode(article.body[j][prop]);
						elm.appendChild(elmnode);
						break;
					case "link":
						elm = document.createElement("a");
						elmnode = document.createAttribute("href");
						elmnode.value = article.body[j][prop]
						elm.setAttributeNode(elmnode);
						elmnode = document.createAttribute("target");
						elmnode.value = "_blank"
						elm.setAttributeNode(elmnode);
						elmnode = document.createTextNode(article.body[j][prop]);
						elm.appendChild(elmnode);
						break;
					case "pic":
						elm = document.createElement("img");
						elmnode = document.createAttribute("src");
						elmnode.value = article.body[j][prop]
						elm.setAttributeNode(elmnode);
						break;
				}
				div.appendChild(elm);
			}
		}
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

