function loadFile(filePath) {
	var result = null;
	var xmlhttp = new XMLHttpRequest();					
	xmlhttp.open("GET", filePath, false);
	xmlhttp.send();
	if (xmlhttp.status==200) {
		result = xmlhttp.responseText;
	}
	return result;
}
		

function uploadToC()
{		
	// On file system CORS will block ToC upload. 
	// Please use docker to test ToC
	if(window.location.href.startsWith('http')){			
		var divToC = document.getElementById('ToC');
		var ToChtml = loadFile('ToC.html');
		divToC.innerHTML = ToChtml;
	}
}


function Test(){
	alert('Ololo');
}

console.log('ToC upload is done');