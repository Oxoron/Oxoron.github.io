///////////////////// Cross-page navigation ////////////////////////
// Redirects to the next exercise page
function GoToNextPage(){	
	var currentUrl = this.document.URL;
		
	var urls = [...document.getElementById('ToC').children]
		.filter(elem => elem.tagName == 'A')
		.map(href => {return href.href;});

	var currentUrlIndex = urls.lastIndexOf(currentUrl) + 1;
	if(currentUrlIndex == urls.length) {currentUrlIndex = currentUrlIndex - 1;}

	window.location.href = urls[currentUrlIndex];
}

// Redirects to the previous exercise page
function GoToPreviousPage(){	
	var currentUrl = this.document.URL;
		
	var urls = [...document.getElementById('ToC').children]
		.filter(elem => elem.tagName == 'A')
		.map(href => {return href.href;});

	var currentUrlIndex = urls.lastIndexOf(currentUrl) - 1;
	if(currentUrlIndex < 0) {currentUrlIndex = 0;}

	window.location.href = urls[currentUrlIndex];
}

function OnNextButtonKeyDown(event)
{
	event.preventDefault();
	if(event.key == "ArrowDown"){
		GoToNextPage();
	}
	else if(event.key == "ArrowUp"){
		GoToPreviousPage();
	}
}

////////////////////////////////////////////////////////////////////////////////////////////
// Focus on the Next button
function FocusNextButtonOnPageLoad()
{
	if (window.addEventListener) 
	{ // Mozilla, Netscape, Firefox
		window.addEventListener('load', FocusButtonNext, false);
	} else if (window.attachEvent) { // IE
		window.attachEvent('onload', FocusButtonNext);
	}
}

function FocusButtonNext() {
	var button = document.getElementById("NextActionButton");
	
	button.focus();
	button.addEventListener('keydown', OnNextButtonKeyDown);
}




/////////////////////////////////////////////////////////////////////////////////////////////////
// Notify admin about an issue on the page
var notificationCollectorUrl = 'https://neblogas.bsite.net/notification/post'; 
//notificationCollectorUrl = 'https://localhost:44384/notification/post';

// Notify admin about an issue on the page
function notify(param1, param2)
{
	// Prepare params
	var currentUrl = window.location.href;	
	let notificationToSend = {
		"resource": currentUrl
	};
	if(!!param1){
		notificationToSend.param1 = param1;
	}
	if(!!param2){
		notificationToSend.param2 = param2;
	}

	// Build request payload
	let data = JSON.stringify(
		notificationToSend		  
	);


	// Execute request
	fetch(notificationCollectorUrl, {
		method: "POST",
		headers: {'Content-Type': 'application/json', 'Accept':'application/json'}, 
		body: data 
	  });
}
////////////////////////////////////////////////////////////////////////////////////////////


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
		var revisedKeyFieldName = keyFieldName;
		if(!!!keyFieldName){revisedKeyFieldName = 'arrayKey';}
		result[revisedKeyFieldName] = keySelector(object);

		return result;	
	}
}

// .Random() and .GroupBy(keySelector, keyFieldName)
function SetupArrayFunctions(){

	// Setup Random
	Array.prototype.random = function () {
		return this[Math.floor((Math.random()*this.length))];
		};

	// Return a random element of the array if it's not equal to previuousValue
	// Sample 1: return arr.notRepeatingRandom('prev')
	// Sample 2: return arr.notRepeatingRandom('prevMascForm', (elem) => (elem.MascForm))
	// A call [1,2,3].notRepeatingRandom(4, (elem) => (elem*2)) will return you 1 or 3 in 99% of the cases	
	Array.prototype.notRepeatingRandom = function (previousValue, transform) {
		// If a calling array is empty/null - return null
		if (this == null || this == undefined || this.lenght == 0) {
			console.log('Error: Array is null or empty');
			return null;
		}

		// If transform is null/under -- make it self-to-self function
		if(!transform){transform = (a) => (a);}
		
		// Make 10 attempts to call a .random, comparing transformed result with a previousValue
		var result = this[Math.floor((Math.random()*this.length))];			
		var i = 0;
		do {
			if (transform(result) != previousValue) {
				return result;
			}
			else {
				result = this[Math.floor((Math.random()*this.length))];					
				i++;
			}
		} while (i<10)
		console.log('Error: Can not find a different value');
		return result;
	}


	// Setup GroupBy
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
	};
};


////////////////////////////////////////////////////////////////////////////////////////////



/* Leveller is a JS object to filter array elements according to their level.

It's purpose to simplify learning, splitting elements by groups, and allowing to add them to the question pool one by one. As a result, instead of learning 70 new AType verbs, you can learn 10 today, additional 10 tomorrow, etc.*/



/* arr : array of elements to be levelled

functionToLevel - function calculating a level based on the element. 
	Sample : (elem) => 1 + Math.floor(source.indexOf(elem) / 2)

Returns : a leveller object containing original array of elements grouped by level.

How to use : 4 functions enough to use the object.
	var leveller = CreateLevelledArray(yourArray, (elem) => 1 + Math.floor(source.indexOf(elem) / 10));
	var content = leveller.GetContent();
	var levelButtonsHtml = leveller.RegenerateButtons(functionToCallOnClick_Name);
	leveller.SetupLevel(2);
*/	
function CreateLevelledArray(arr, functionToLevel){
	
	SetupArrayFunctions();
	
	let levelledArray = {};		
	levelledArray.Elements = arr.GroupBy(elem => functionToLevel(elem), "Level");
	levelledArray.CurrentLevel = Math.min(...levelledArray.Elements.map(elem => elem.Level));
	

	// Build button object
	levelledArray.GenerateLevelButton = function(level, isActive){
		return {
			level,
			isActive
		};
	};

	// Returns button's html
	levelledArray.GenerateButtonHtml = function(buttonObject, onClickFunctionName){
		let className = buttonObject.isActive ? "levelButtonActive" : "levelButtonNotActive";
		let level = buttonObject.level;		

		var result = '<button class="' + className +'" onclick="' + onClickFunctionName + '(this);FocusButtonNext();" value="' + level + '">' + level + '</button>'

		return result;
	}

	// Function returns the full html for the buttonsDiv element
	levelledArray.RegenerateButtons = function(functionToCallOnClick_Name){
		var result = '<div>';

		let buttonHtmls = this.Elements
			.map((elem) => this.GenerateLevelButton(elem.Level, elem.Level == this.CurrentLevel))
			.map(button => this.GenerateButtonHtml(button, functionToCallOnClick_Name));

		result += buttonHtmls
			.reduce((total, current) => total + current, '');

		result += '</div>';

		return result;
	}			
	
	// Setup current level
	levelledArray.SetupLevel = function(newLevelToSetup){
		this.CurrentLevel = newLevelToSetup;												
	}			

	// Get content according to the level
	levelledArray.GetContent = function(){
		return this.Elements
			.filter(elem => elem.Level <= this.CurrentLevel)
			.reduce((total, current) => [...total, ...current.values], []);
	}

	return levelledArray;
}
