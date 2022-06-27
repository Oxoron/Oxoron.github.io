////////////////////////////////////////////////////////////////////////////////////////////
// Focus on the Next button
function FocusNextButtonOnPageLoad()
{
	if (window.addEventListener) 
	{ // Mozilla, Netscape, Firefox
		window.addEventListener('load', WindowLoad, false);
	} else if (window.attachEvent) { // IE
		window.attachEvent('onload', WindowLoad);
	}
}

function WindowLoad(event) {
	document.getElementById("NextActionButton").focus();
}





////////////////////////////////////////////////////////////////////////////////////////////
// Array functions
function SetupArrayRandomFunction(){	
	Array.prototype.random = function () {
			return this[Math.floor((Math.random()*this.length))];
			}
}