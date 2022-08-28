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

// Return a random element of the array if it's not equal to previuousValue
function SetupArrayNonRepeatingRandomFunction(){
	Array.prototype.notRepeatingRandom = function (previousValue) {
		var result = this[Math.floor((Math.random()*this.length))];
		if (result != previousValue) return result;
			else {
				result = this[Math.floor((Math.random()*this.length))];
				if (result != previousValue) return result;
			};
		return undefined;
		}
}



/* Converts array of objects to array keys-objects. For.ex.
	[{a,b,c}, {d,e,f}, {g,h,i}] may be transformed to
	[{abc, {a,b,c}}, {ghi, {g,h,i}}, {def, {d,e,f}}
	
	Arguments:
		originalArray : source of elements. Isn't supposed to be changed, may be null/undefined/empty (causing empty array as a result).
		
		keySelector : a function to define a key. In a sample above : (elem) => (elem.first + elem.second + elem.third)
		
		keyFieldName : a key field name. If empty an 'arrayKey' name will be used.
		
	Sample : ToKeyObjectArray(result, (elem) => (elem.Ending), "ending")
*/
function ToKeyObjectArray(originalArray, keySelector, keyFieldName)
{
	if(!originalArray) {return [];}
	
	return originalArray.map((elem) => (KeyExtractor(elem, keySelector, keyFieldName)));
	
	
	
	// Converts an object to {keyFieldName:keySelector(object), value:object}
	// For.ex. KeyExtractor({ending:"as", noun:"baras"}, (elem) => (elem.ending), "ending") gives us
	//		{ending:"as", value:{ending:"as", noun:"baras"}}		
	function KeyExtractor(object, keySelector, keyFieldName)
	{	 
		var result = {value:object};
		result[keyFieldName ?? arrayKey] = keySelector(object);

		return result;	
	}
}



Array.prototype.GroupBy = function (keySelector, keyFieldName)
{
	if(!this) { return []; }
	
	return this.reduce((result, current) => {
		var currentKey = keySelector(current);
		if(!result.find((elem) => (elem[keyFieldName] === currentKey))){
			var elementToAdd = {};
			elementToAdd[keyFieldName] = currentKey;
			elementToAdd["values"] = [];
			
			result.push(elementToAdd);
		}
		
		result
			.find((elem) => (elem[keyFieldName] === currentKey))
			.values
			.push(current);
			
		return result;
	}, []);
}

