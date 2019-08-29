﻿

// MOVE CHILDREN UPSTAIRS
// Moves child groups from a parent group, usually to a content layer
function moveChildrenUpstairs(source, target) {
  var gCount = source.groupItems.length;
	for (var gNo = gCount - 1; gNo >= 0; gNo--) {
    var aGroup = source.groupItems[gNo];
		aGroup.move(target, ElementPlacement.PLACEATBEGINNING);
	}
	try {
    source.remove();
	}
	catch(e) {};
}
// MOVE CHILDREN UPSTAIRS ends

// LOOK FOR ELEMENT
// Args are a parent group,
// the collection type (groupItems, pathItems...) of the sought element,
// and the name of an element
// Returns the element, or undefined
function lookForElement(parent, eType, eName) {
  var theElement;
  try {
    theElement = parent[eType][eName];
  }
  catch (e) {};
  return theElement;
}
// LOOK FOR ELEMENT ends




// MAKE DEFAULT METADATA OBJECT
// Called from getMetadata, returns an object with default values
// (in case anything is missing from an incoming SVG element's metadata)
function makeDefaultMetadataObject(isText) {
	var metaObj = {
		name: 'No name found',
		note: '',
		// NOTE: that failsafe colours are strings here... I think!!
		// fill: 'c_failsafeColour',
		// stroke: 'c_failsafeColour',
	}
	// If text, append additional props
	if (isText) {
		metaObj.justification = 'start';
		metaObj.font = c_failsafeFont;
		metaObj.size = 8;
		metaObj.leading = 9;
		metaObj.contents = '';
	}
	return metaObj;
}
// MAKE DEFAULT METADATA OBJECT ends

// GET METADATA
// Passed an elemen's id, separates out the actual name from
// the SVG metadata, and returns an object containing all properties
function getMetadata(id, isText) {
	// I think I need a default object, with all properties...
	var myObj = makeDefaultMetadataObject(isText);
	if (id.search(c_metaDataSep) > -1) {
		// Separate element name and id
		firstSplit = id.split(c_metaDataSep);
		myObj.name = firstSplit[0];
		// If there's metadata, process it...
		var props = firstSplit[1];
		if (props.length > 0) {
			// Split svg metadata into individual properties
			// Anything can have fill and/or
			// stroke; text can also have justification and original xpos
			var mArray = props.split(c_metaItemSep);
			for (i = 0; i < mArray.length; i++) {
				var oneProp = mArray[i];
				// oneProp is a string: property:value
				// So split (again!) and triage
				var pArray = oneProp.split(c_metaPropSep);
				// This is a property name:value pair
				var prop = myTrim(pArray[0]);
				var val = myTrim(pArray[1]);
				myObj[prop] = val;
			}
		}
	} else {
			// No metadata; return name
			myObj.name = id;
	}
	return myObj;
}
// GET METADATA ends

// MAKE CMYK COLOUR OBJECT
// Utility: looks up a colour name and returns a CMYK colour object
function makeCmykColourObject(cName) {
    var myCol = new CMYKColor();
    var def = c_colourLookup[cName];
		if (typeof def === 'undefined') {
			def = c_failsafeColour;
		}
    myCol.black = def.k;
    myCol.cyan = def.c;
    myCol.magenta = def.m;
    myCol.yellow = def.y;
    return myCol;
}
// MAKE CMYK COLOUR OBJECT ends

// MAKE RGB COLOUR OBJECT
// Utility: looks up a colour name and returns a RGB colour object
function makeRgbColourObject(cName) {
    var myCol = new RGBColor();
    var def = c_layerColourLookup[cName];
		if (typeof def === 'undefined') {
			def = c_failsafeRgbColour;
		}
    myCol.red = def.r;
    myCol.green = def.g;
    myCol.blue = def.b;
    return myCol;
}
// MAKE RGB COLOUR OBJECT ends

// ***** INDIVIDUAL ATTRIBUTE SETTERS *****

// FILL ELEMENT
// Args are the element and the name of the colour
function fillElement(myE, cName) {
  var myCol = makeCmykColourObject(cName);
  var overprint = c_textOverprint.search(cName) >= 0;
  if (myE.typename == 'PathItem') {
    myE.fillColor = myCol;
        myE.overprintFill = overprint;
  } else if (myE.typename == 'TextFrame') {
        myE.textRange.characterAttributes.fillColor = myCol;
        myE.overprintFill = overprint;
  } else {
    alert('Sorry, failed to fill object ' + myE.name + ' with ' + cName);
  }
}
// FILL ELEMENT ends

// STROKE ELEMENT
// Args are the element and the name of the colour
// Also does overprinting
function strokeElement(myE, cName) {
  var myCol = makeCmykColourObject(cName);
  if (myE.typename == 'PathItem') {
    myE.strokeColor = myCol;
        var overprint = c_textOverprint.search(cName) >= 0;
        myE.strokeOverprint = overprint;
  } else {
    alert('Object ' + myE.name + ' is not a pathItem, so cannot apply colour ' + cName);
  }
}
// STROKE ELEMENT ends

// ********** PATH CONVERSIONS

// SET PATH ATTRIBUTES
// Called from recolourGroup to recolour a single path element
function setPathAttributes(myE) {
	// Function returns an object with simple element name and other
	// optional svg-related properties
	// Is there a name?
	var id = myTrim(myE.name);
	if (id.length < 1) {
		return;
	}
	// Still here? Get path metadata props
	var eProps = getMetadata(myE.name, false);
	for (var pName in eProps) {
		if (eProps.hasOwnProperty(pName)) {
			var val = eProps[pName];
			switch (pName) {
				case 'name':
					myE.name = val;
					break;
				case 'note':
					myE.note = val;
					break;
				case 'fill':
					fillElement(myE, val);
					break;
				case 'stroke':
					strokeElement(myE, val);
					break;
			}
		}
	}
}
// SET PATH ATTRIBUTES ends

// RESET ALL PATH ATTRIBUTES
function resetAllPathAttributes(grp) {
	var pathCount = grp.pathItems.length;
	// If I just loop on the paths and reset attributes, Illy scrambles them.
	// So get array of original IDs...
	var pArray = [];
	for (var i = 0; i < pathCount; i++) {
		pArray.push(grp.pathItems[i].name);
	}
	// Then loop on original IDs
	for (var j = 0; j < pArray.length; j++) {
		var onePath = grp.pathItems[pArray[j]];
		setPathAttributes(onePath);
	}
	return true;
}

// RESET ALL PATH ATTRIBUTES ends


// ********** PATH CONVERSIONS end



// DELETE MARKED GROUP
function deleteMarkedGroups(grps) {
  var len = grps.length - 1;
	for (var i = len; i >= 0; i--) {
    var g = grps[i];
		if (g.name === c_deleteme) {
      g.remove();
		}
	}
}
// DELETE MARKED GROUP ends

// REMOVE ORIGINAL GROUP
// Called from rationaliseText. Deletes all elements in a group
// Possible duplicate of deleteMarkedGroups; and probably better!
// So FIXME:
function removeOriginalGrp(grp) {
    var len = grp.pageItems.length - 1;
	for (var i = len; i >= 0; i--) {
		var item = grp.pageItems[i];
		item.remove();
	}
}
// REMOVE ORIGINAL GROUP ends