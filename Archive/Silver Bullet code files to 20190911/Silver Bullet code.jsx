﻿// This version of the main 'Joxer' / Silver Bullet code file dated 25 Sept 2017
// Last update: 24 July 2019

// The following are set in the stub file
//		test flag (will display filtered text in red)

// CONSTANTS
var c_contactNotice = " Donald Hounam: mobile 07825 994445; email donaldhounam@economist.com; slack donaldhounam ";
// In- and out-boxes. These remain the same when this code is uploaded to server.
// Data files are always local.
// Default folder for SVGs
var c_svgFolder = "~/downloads";
// Save to:
var c_outbox = '~/desktop/_Silver Bullet/outbox/';

// Lookup of colours. This is a duplicate of colours in Sibyl's colours.json...
var c_colourLookup = {
  "black25": {"c": 0, "m":0, "y": 0, "k": 25},
  "black50": {"c": 0, "m":0, "y": 0, "k": 50},
  "black75": {"c": 0, "m":0, "y": 0, "k": 75},
  "black100": {"c": 0, "m":0, "y": 0, "k": 100},
  "blue1": {"c": 90, "m":50, "y": 15, "k": 5},
  "blue2": {"c": 67, "m":0, "y": 18, "k": 0},
  "bluetext": {"c": 82, "m":0, "y": 18, "k": 8},
  "bluedark": {"c": 85, "m":10, "y": 0, "k": 58},
  "econred": {"c": 0, "m": 100, "y": 100, "k": 0},
  "green1": {"c": 85, "m":0, "y": 30, "k": 20},
  "green2": {"c": 53, "m":0, "y": 26, "k": 0},
  "greybox": {"c": 30, "m":0, "y": 0, "k": 50},
  "greytext": {"c": 20, "m":0, "y": 0, "k": 80},
  "gridlines": {"c": 10, "m":0, "y": 0, "k": 25},
  "highlight": {"c": 15, "m":0, "y": 0, "k": 10},
  "numberbox": {"c": 24, "m":0, "y": 0, "k": 16},
  "printbkgd": {"c": 9, "m":0, "y": 0, "k": 6},
  "purple1": {"c": 0, "m":75, "y": 35, "k": 45},
  "purple2": {"c": 27, "m":42, "y": 25, "k": 10},
  "red1": {"c": 12, "m":80, "y": 60, "k": 0},
  "redtext": {"c": 12, "m":80, "y": 60, "k": 0},
  "socmedbkgd": {"c": 0, "m":0, "y": 0, "k": 7.5},
  "white": {"c": 0, "m":0, "y": 0, "k": 0},
  "yellow": {"c": 12, "m":30, "y": 70, "k": 0}
}
// Colours for which text overprints:
var c_textOverprint = 'black100,black75,greytext';
// Failsafe values (defaults in case metadata lacks property)
var c_failsafeColour = {c:10, m:0, y:10, k:0};
var c_testColour = {"c":0, "m":100, "y":100, "k":0};
var c_failsafeFont = "EconSansCndReg";
// Separators for metadata
// Between itam name (id) and ALL metadata
var c_metaDataSep = '~~~';
// Individual metadata items
var c_metaItemSep = ',';
// Metadata prop:value
var c_metaPropSep = ':';
// Newline (text wrap) tag
var c_newline = '\r';
// String to use for groups that get deleted
var c_deleteme = 'Group to be deleted';
// Element ids 'its' (incoming) and 'my'
var c_itsLayer1 = 'Layer 1';
var c_itsMainGroup = 'main-group';
var c_itsBackGroup = 'background-group';
var c_itsContentGroup = 'content-group';
var c_myBackLayer = 'background-layer';
var c_myContentLayer = 'content-layer';
var c_myBackStringsGroup = 'strings-group';
var c_myBackShapesGroup = 'shapes-group';
var c_myPanelHeadersGroup = 'panels-group';
// Some subgroups are indexed by panel/content...
var c_myContentGroup = 'content-group-';
var c_myXaxisGroup = 'xaxis-group-';
var c_myYaxisGroup = 'yaxis-group-';
var c_left = '-left';
var c_right = '-right';
// 
var c_myTicksGroup = 'axis-ticks-group-';
var c_myLabelsGroup = 'axis-labels-group-';
var c_mySecondaryGroup = 'axis-secondary-group-';
// Legends:
// Overall group
var c_legendsGroup = 'legends-group';
// Individual legendsets are indexed
var c_legendSet = 'legendset-group-';
// Zeroline group and element
var c_zeroLineGroup = 'zeroline-group-'
var c_zeroLine = 'axis-zero-line';
// Blobs -- maybe not all used...
var c_blobsMainGroup = 'blob-group-';
var c_blobSeriesGroup = 'blob-series-group-';
var c_blobPairGroup = 'blob-pair-group';
var c_blobShape = 'blob-shape';
var c_blobText = 'blob-text';
var c_blobHeaderGroup = 'blob-header-group-';
var c_blobHeaderSubGroup = 'blob-header-subgroup';
var c_blobHeaderRect = 'blob-header-rect';
var c_blobHeaderText = 'blob-header-text';
var c_indexDot = 'index-dot-';
var c_breakSymbol = 'broken-scale-symbol';
var c_breakBaseline = 'broken-scale-baseline';

// GLOBALS
var zeroLineBehind = true;

// Next needs more work, as reference:
/*  Terminology:
    layers
    groupItems
		PathItem
		GroupItem
		TextFrame
		TextRange
		CharacterAttributes
		etc.
*/


// CODE STARTS ===============================================================================================

// ***** UTILITIES *****

// CHECK OPEN DOCUMENT
// Utility: returns true if there's at least 1 document already open...
function checkOpenDocument() {
	var od = true;
	if (app.documents.length > 0) {
		var docA = app.activeDocument;
	} else {
		var msg = "Annoyingly, Illustrator won't set the colour space of an SVG ";
		msg += "to CMYK unless there's already a file open! I'm going to open a new document, ";
		msg += "but you'll have to invoke the script again...";
		alert(msg);
		jdocA = app.documents.add();
		od = false;
	}
		// Did this contribute anything?
		// app.documents.arrange(DocumentLayoutStyle.FLOATALL);
		return od;
}
// CHECK OPEN DOCUMENT ends

// UNGROUP -- not called, maybe not useable...
// Utility: passed a target location and group, moves everything
// from the group to the target. Do I have to explicitly removes
// the group, though?
function ungroup(target, group) {
	for (i=group.pageItems.length-1; i>=0; i--) {
		group.pageItems[i].move(target, ElementPlacement.PLACEATBEGINNING);
  }
}
// UNGROUP ends

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

// MAKE COLOUR OBJECT
// Utility: looks up a colour name and returns a CMYK colour object
function makeColourObject(cName) {
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
// MAKE COLOUR OBJECT ends


// *** UTILITIES ***

// MY TRIM
// Since we've no built-in trim...
function myTrim(str) {
	return str.replace(/^\s+|\s+$/g,'');
}
// MY TRIM ends

// DO PROPORTIONAL TEXT
// Called from makeText to set Proportional OldStyle or Lining on numbers in
// title, subtitle or sub-subtitle
function doProportionalText(tRange, isTitle) {
    var result;
    var str = tRange.contents;
    var patt = /\d+/g;
    var hasNumbers = true;
    while (hasNumbers) {
        result = patt.exec(str);
        if (result === null) {
            // Numbers not found; reset flag to break
            hasNumbers = false;
        } else {
            // Get the actual string
            var numbers = result[0];
            var start = result.index;
            var end = start + numbers.length;
            var numberRange = tRange.characters[start]
            numberRange.length = numbers.length;
            if (isTitle) {
                numberRange.characterAttributes.figureStyle = FigureStyleType.PROPORTIONALOLDSTYLE;
            } else {
                numberRange.characterAttributes.figureStyle = FigureStyleType.PROPORTIONAL;
            }
        }
    }
//~   var str = "First12345then 456 and more";
//~   var patt = /\d+/g;
//~   var res = patt.exec(str);
//~   var myStr = res[0];
//~   var len = myStr.length;
//~   var start = res.index;
//~   var end = res.index + len;
//~   document.getElementById("demo").innerHTML = myStr + ' ' + start + ':' + end;

    // var regex = /\d+/g;
}
// DO PROPORTIONAL TEXT ends

// MAKE TEXT
// Major utility: passed a text object definition, creates it with all attributes
function makeText(tObj) {
	try {
		// Point text at point of origin
		var myText = tObj.context.textFrames.pointText([tObj.anchor[0], tObj.anchor[1]]);
		// Dummy contents so that I can set other attributes
		// myText.contents = tObj.contents;
		var cArray = tObj.contentsArray;
		myText.contents = '';
		var tRange = myText.textRange;
		// Append tspan contents, setting font on each textRange as we go...
		for (var iii = 0; iii < cArray.length; iii++) {
			var newRange = tRange.characters.add(cArray[iii].contents);
			newRange.characterAttributes.textFont = cArray[iii].textFont;
		}
		with (myText) {
			name = tObj.name;
			note = tObj.name;
			// Justification -- 0=left, 1=centre, 2=right
			// Has to be on all paragraphs (lines)
			var pLen = paragraphs.length;
			var just = Justification.CENTER;
			switch (tObj.justification) {
				case 'start' :
					just=Justification.LEFT;
					break;
				case 'end' :
					just=Justification.RIGHT;
					break;
				default :
					just=Justification.CENTER;
			}
			for (pNo = 0; pNo < pLen; pNo++) {
				paragraphs[pNo].paragraphAttributes.justification = just;
			}
			// Embedding following in a WITH{} causes Illustrator runtime error, so:
			textRange.characterAttributes.fillColor = tObj.fill;
			// textRange.characterAttributes.textFont = tObj.font;
			textRange.characterAttributes.size = tObj.size;
			textRange.characterAttributes.autoLeading=false;
			textRange.characterAttributes.leading = tObj.leading;
			textRange.characterAttributes.tracking = tObj.tracking;
             // Overprinting
             var overprint = c_textOverprint.search(tObj.fill) >= 0;
             textRange.characterAttributes.overprintFill = overprint;
		}
         // Proportional text for numbers...
         if (tObj.name === 'title-string') {
             doProportionalText(myText, true);
         } else if (tObj.name.search('subtitle') >= 0) {
             doProportionalText(myText, false);
         }
		return myText;
		// Do I need to wrap the text? Apparently not...
		// if (tObj.contents.search(c_newline) > -1) {
		// 	if (!wrapText(myText)) {
		// 		alert('Failed to wrap ' + tObj.name + ' Please adjust manually');
		// 	}
		// }
	}
	catch (err) {};
}
// MAKE TEXT ends


// ***** INDIVIDUAL ATTRIBUTE SETTERS *****

// FILL ELEMENT
// Args are the element and the name of the colour
function fillElement(myE, cName) {
    var myCol = makeColourObject(cName);
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
	var myCol = makeColourObject(cName);
	if (myE.typename == 'PathItem') {
		myE.strokeColor = myCol;
        var overprint = c_textOverprint.search(cName) >= 0;
        myE.strokeOverprint = overprint;
	} else {
		alert('Object ' + myE.name + ' is not a pathItem, so cannot apply colour ' + cName);
	}
}
// STROKE ELEMENT ends


// ***** PATH AND TEXT TOP-LEVEL PROCESSORS *****

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


// ***** GROUP PROCESSING *****


// PROCESS GROUP
// Called from processSibyl. Passed a group it loops through its constituent elements
// 	If it finds a sub-group...:
//			If that group contains text-frames (i.e. is a collection of tspans), it
//					calls setTextFrameAttributes on the group to reassemble tspans into a single text element
//			If that group is a real group, recurses
// 	If it finds a PageItem, it calls setPathAttributes to colour it
function processGroup(grp) {
	var name = grp.name;
	var len = grp.pageItems.length;
	if (len === 0) {
		grp.remove();
		return;
	}
	for (var i = 0; i < len; i++) {
		var element = grp.pageItems[i];
		if (element.typename === 'GroupItem') {
			// The problem is that a block of text comes through as a GroupItem
      // So I need to check if this is a textblock
			// Set a flag (forced to false if empty group, which will recurse and get zapped)
			var isText = (element.pageItems.length > 0);
      // I iterate through the group. If every child is a TextFrame, this is text...
			for (var j = 0; j < element.pageItems.length; j++) {
				if (element.pageItems[j].typename !== 'TextFrame') {
					isText = false;
					break;
				}
      }
			// Did the group contain any only textframes?
			if (isText) {
        // All children are text, so treat as such
				// We need a new group, to append new text
				// NOTE: that's a to-come
				alert('Set ***text*** attributes for ' + element.name);
  			var textFrame = setTextFrameAttributes(element);
			} else {
        // Whatever we've got, it isn't just text, or it's an empty group.
				// Recurse, anyway
				alert('Recurse with group ' + element.name)
				processGroup(element);
			}
		} else {
      // Not a groupitem so ought to be a path...
      if (element.typename === 'PathItem') {
        alert('Processing path ' + element.name);
        setPathAttributes(element);
      } else {
        alert('Unknown element ' + element.name);
      }
    }
	}
}
// PROCESS GROUP ends


// **************************************************

// CONVERT TEXT TO FRAME
// Called from rationaliseText. Converts passed group of textFrames
// into a single textFrame...
function convertTextGroupToFrames(tGrp) {
	var contents = '';
	var len = tGrp.textFrames.length - 1;
	// Use group xpos:
	var anchorX = tGrp.position[0];
	// yPos from text object anchor (this will be applied to the emergent textFrame)
	var anchorY = tGrp.textFrames[len].anchor[1];
	// But I also need a changeable yPos to check for new lines
	var checkPos = tGrp.textFrames[0].anchor[1];
	// Experimental contents array
	var contentsArray = [];
	// for (var i = 0; i < len; i++) {
	// Tspans get reversed. Doesn't everything?!
	for (var i = len; i >= 0; i--) {
		var tf = tGrp.textFrames[i];
		var str = tf.contents;	//myTrim(tf.contents);
		var newline = false;
		if (str.length > 0) {
			// Set xAnchor on each loop, leaving it at last position
			// (looping back, remember!)
			// tf.anchor is array [xPos, yPos]. I'm only
			// interested in yPos, which indicates a new line
			// (I'll get xPos from the metadata)
			var yPos = tf.anchor[1];
			if (yPos !== checkPos) {
				// New line: append separator to existing string:
				if (contents.length > 0) {
					contents += c_newline;
					newline = true;
				}
				// Reset ypos comparison
				checkPos = yPos;
				// And probably reset 'final' anchor, which I want to be
				// the y-anchor of the topmost tspan
				// (
//				if (checkPos > anchorY) {
//					anchorY = checkPos;
//				}
			}
			// Add contents to this tspan
			var myStr = str;	// myTrim(str)
			contents += myStr;
			if (newline) {
				myStr = c_newline + myStr;
				// And catch space at start of line:
				myStr = myStr.replace((c_newline + ' '), c_newline);
			}
			var tfObj = {
				contents: myStr,
				textFont: tf.textRange.textFont,
				newline: newline
			}
			contentsArray.push(tfObj);
		}
	}
	// Do we have contents?
	if (contents.length > 0) {
		// Extract the metadata constituent
		var tProps = getMetadata(tGrp.name);
		// Now work out xPos from width and justification
		var width = parseFloat(tProps.width);
		var just = tProps.justification;
		if (just === 'center' || just === 'middle') {
			anchorX += width / 2;
		} else if (just === 'end') {
			anchorX += width;
		}

		// Assemble all properties into an object
		var textProps = {
			context: tGrp.parent,
			anchor: [anchorX, anchorY],
			fill: makeColourObject(tProps.fill),
			font: tGrp.textFrames[0].textRange.characterAttributes.textFont,
			size: tGrp.textFrames[0].textRange.characters[0].size,
			// Note: AI converts 'letter-spacing' to 'tracking'
			tracking: tGrp.textFrames[0].textRange.characterAttributes.tracking,
			leading: parseFloat(tProps.leading),
			justification: just,
			contents: contents,
			contentsArray: contentsArray,
			name: tProps.name
		}
		var myText = makeText(textProps);
        // tGrp.remove();
	}
	return myText;
}
// CONVERT TEXT TO FRAME ends

// SET TEXT FRAME ATTRIBUTES
// Called from rationaliseText. Passed a simple text frame (i.e. not a group of 'tspans'),
// it just sets attributes from metadata buried in element.name
function setTextFrameAttributes(tFrame) {
	// Extract the metadata constituent
	var tProps = getMetadata(tFrame.name, true);
	// Overwrite props on the element
	// Position (seems to work better than 'anchor')
	var position = tFrame.position;
	// Fill (from name)
	var fill = tProps.fill;
	var colObj = makeColourObject(fill);
	tFrame.textRange.characterAttributes.fillColor = colObj;
	// Does text overprint? Look it up the fill name in the list...
	var overprint = c_textOverprint.search(fill) >= 0;
	tFrame.textRange.characterAttributes.overprintFill = overprint;
	// Justification: default is 'end' / RIGHT
	// Careful: width comes in as a string...
	var xTweak = parseFloat(tProps.width);
	var just = Justification.RIGHT;
	switch (tProps.justification) {
		case 'start' :
			just=Justification.LEFT;
			xTweak = 0;;
			break;
		case 'center' :
			just=Justification.CENTER;
			xTweak /= 2;
			break;
		case 'middle' :
			just=Justification.CENTER;
			xTweak /= 2;
			break;
		default :
			just=Justification.RIGHT;
	}
	position[0] = position[0] + xTweak;
	tFrame.position = position;
	tFrame.textRange.justification = just;
	// And ID...
	tFrame.name = tProps.name;
}
// SET TEXT FRAME ATTRIBUTES ends

// IS TEXT GROUP
// Called from rationaliseText. Passed a groupItem, loops through
// its child pageItems to check whether thay are all textFrames...
function isTextGroup(grp) {
	// The problem is that a block of text comes through as a GroupItem
  // So I need to check if this is a textblock
	// Set a flag (forced to false if empty group, which will recurse and get zapped)
	var isText = true;
  // Iterate through the group. If every child is a TextFrame, this is text...
	for (var j = 0; j < grp.pageItems.length; j++) {
		if (grp.pageItems[j].typename !== 'TextFrame') {
			isText = false;
			break;
		}
	}
	return isText;
}
// IS TEXT GROUP ends

function deleteMarkedGroups(grps) {
	var len = grps.length - 1;
	for (var i = len; i >= 0; i--) {
		var g = grps[i];
		if (g.name === c_deleteme) {
			g.remove();
		}
	}
}

// REMOVE ORIGINAL GROUP
// Called from rationaliseText. Deletes all elements in a group
// Possible duplicate of deleteMarkedGroups; and probably better!
function removeOriginalGrp(grp) {
    var len = grp.pageItems.length - 1;
	for (var i = len; i >= 0; i--) {
		var item = grp.pageItems[i];
		item.remove();
	}
}
// REMOVE ORIGINAL GROUP ends

// RATIONALISE TEXT
// Called from processSibyl, etc., to convert text groups into textFrames...
// Arg 1 is a groupItem: a strings group;
// Arg 2 is a flag: use the group's name to set attributes on child textFrames
function rationaliseText(grp, useGroupName) {
  var gLen = grp.groupItems.length;
	var tLen = grp.textFrames.length;
	// This may be over-optimistic... but...
	if (gLen > 0) {
		// Text as groups
		for (var i = (gLen - 1); i >= 0; i--) {
			var myG = grp.groupItems[i];
			// If group is empty, simply delete it
			if (myG.pageItems.length === 0) {
				alert("Deleting textGroup " + myG);
				myG.remove();
			} else if (isTextGroup(myG)) {
				// All children are text, so treat as such
				var textFrame = convertTextGroupToFrames(myG);
				// Mark original group for deletion
				myG.name = c_deleteme;
			}
			// Assumption is that any other groups are non-text and get handled when we've sorted text out...
		}
		// Now loop through again, deleting marked groups
		// (I can't delete groups on the fly, because in the end any parent group (specifically
		// the background.strings group) winds up containing only textFrames and getting zapped.
		// So I mark groups-of-text as I go and kill them now:
		deleteMarkedGroups(grp.groupItems, true);
	} else if (tLen > 0) {
        // So the argument was a single group of textFrames. These can, however, have
        // originally been tspans to be assembled into a single textFrame...
        // Inferentially look for:
        //      double-scale axis headers
        //      legend-text
        var tSpans = false;
        if (grp.name.search('axis-header') >= 0) {
            tSpans = true;
        } else if (grp.name.search('legend-text') >= 0) {
            tSpans = true;
        }
        if (tSpans) {
            var textFrame = convertTextGroupToFrames(grp);
            // grp.name = c_deleteme;
        } else {
            // ...or a set of independent textFrames (i.e. standard axis labels)
            // New group
            var newGroup = grp.parent.groupItems.add();
            newGroup.name = grp.name;
            for (i = tLen - 1; i >= 0; i--) {
                var tFrame = grp.textFrames[i];
                if (useGroupName) {
                    tFrame.name = grp.name;
                }
                // Create a duplicate (original deleted below)
                makeNewTextFrame(tFrame, newGroup);
            }
        }
        removeOriginalGrp(grp);
	}
    
  return true;
}
// RATIONALISE TEXT ends

// MAKE NEW TEXT FRAME
// Called from rationaliseText and processBlobPair
// Collects properties from a text frame, then calls makeText
// to create a new text element. In each case, the caller
// removes the original
function makeNewTextFrame(oFrame, newGroup) {
	var anchorX = oFrame.anchor[0];
    var anchorY = oFrame.anchor[1];
	// Extract the metadata constituent
	var tProps = getMetadata(oFrame.name, true);
	// Now work out xPos from width and justification
	var width = parseFloat(tProps.width);
	var just = tProps.justification;
	if (just === 'middle' || just === 'center') {
		anchorX += width / 2;
	} else if (just === 'end') {
		anchorX += width;
	}
    var contents = oFrame.contents;
    var contentsArray = [{
        contents: contents,
        textFont: oFrame.textRange.characterAttributes.textFont,
        newline: false
    }];
    // Extract properties from original frame
    var textProps = {
        context: oFrame.parent,
        anchor: [anchorX, anchorY],
        fill: makeColourObject(tProps.fill),
        font: oFrame.textRange.characterAttributes.textFont,
        size: oFrame.textRange.characters[0].size,
        tracking: oFrame.textRange.characterAttributes.tracking,
        leading: parseFloat(tProps.leading),
        justification:  just,
        name: tProps.name,
        contents: contents,
        contentsArray: contentsArray
    };
    var newText = makeText(textProps);
    newText.move(newGroup, ElementPlacement.PLACEATBEGINNING);
}
// MAKE NEW TEXT FRAME ends

// ***** MAIN GROUP AND ITS SUBGROUPS *****

// PROCESS AXIS GROUP
// Args are the axis group; a prefix ('x' or 'y'); the panel index;
// and a left/right string for y-axis (for x-axis, this is an empty string)
// So, in theory, this can handle x or y axes, linear or ordinal...
function processAxisGroup(aGrp, prefix, index, axisSide) {
	// An axis group may contain:
	//		xaxis-ticks-group-n (or yaxis...)
	//		xaxis-labels-group-n;
	//		xaxis-secondary-group-n
	// I need to separate things out into 2 groups: labels and ticks
	// It's all in 'ticks', so I move labels to labels...
	// So I want the three subgroups:
	// tickGrp currently contains all paths and textFrames
	// There may also be a header...?
	if (aGrp.textFrames.length > 0) {
		var t = aGrp.textFrames[0];
		var headText = setTextFrameAttributes(t);
	}
	var ticksGrp = aGrp.groupItems[prefix + c_myTicksGroup + index + axisSide];
	// labelsGrp is currently empty; all text will move in here
	var labelsGrp = aGrp.groupItems[prefix + c_myLabelsGroup + index + axisSide];
	// Any secondary labels will be moved to labelsGrp, then 2ryGrp removed
	// But is there a 2ryGrp?
	var secondaryGrp;
	try {
		secondaryGrp = aGrp.groupItems[prefix + c_mySecondaryGroup + index + axisSide];
	}
	catch (err) {}
	// So if no 2ryGrp, error was caught and var === undefined. See below...
	// Move all textFrames from ticksGrp subgroups into labelsGrp
	// And all tick paths from subgroups into main ticksGrp
	// Loop by 'tick' groups. There are tick-number such groups, each containing
	// a textFrame (label) and a pageItem (tick)
	var tickCount = ticksGrp.groupItems.length - 1;
	for (var i = tickCount; i >= 0; i--) {
		var thisTick = ticksGrp.groupItems[i];
		// Move labels to separate group
		if (thisTick.textFrames.length > 0) {
			var lab = thisTick.textFrames[0];
			lab.move(labelsGrp, ElementPlacement.PLACEATEND);
		}
         // But as of March'19, wrapped axis strings come as a group of textFrames (tspans)
         else if (thisTick.groupItems.length > 0) {
             var labGrp = thisTick.groupItems[0];
             labGrp.move(labelsGrp, ElementPlacement.PLACEATEND);
         }
		// And ticks out of sub-groups into main group...
		// ...careful: there may be more than one tick in the group
		var pCount = thisTick.pathItems.length;
		if (pCount > 0) {
			for (var j = (pCount - 1); j >= 0; j--) {
				var tickLine = thisTick.pathItems[j];
				// Check tick length; if zero, remove
				if (tickLine.length === 0) {
//					alert("Deleting tick")
					tickLine.remove();
				} else {
					tickLine.move(ticksGrp, ElementPlacement.PLACEATEND);
				}
			}
		}
		// Delete tickgroup:
		thisTick.remove();
	}
	// Secondary group: is there one?
	if (typeof secondaryGrp !== 'undefined') {
		// D3 buried any 2ry axis labels in tick-groups, so...
		for (i = 0; i < secondaryGrp.groupItems.length; i++) {
			var lab = secondaryGrp.groupItems[i].textFrames[0];
			lab.move(labelsGrp, ElementPlacement.PLACEATEND);
		}
		// And delete entire 2ry group (with subgroups):
		secondaryGrp.remove();
	}
	// Filter ticks and labels
	// Ticks (if there are any: zero-length ticks got deleted)
	if (ticksGrp.pathItems.length > 0) {
		if (!resetAllPathAttributes(ticksGrp)) {
			alert('Failed to reset ' + prefix + '-axis tick attributes. Sorry...');
			return false;
		}
	}
	// Labels
	if (!rationaliseText(labelsGrp, false)) {
        alert('Label rationalisation on ' + prefix + '-axis failed. Sorry...');
        return false;
    }
    setTabularLining(labelsGrp);
    // If double-scale, axis headers
    if (prefix === 'y') {
        processDoubleScaleAxisHeaders(aGrp, index);
    }
	// And handle any broken scale symbol or baseline.
	// Overall x- or y-axis group MAY contain a single pathItem:
	// either the broken scale symbol or baseline
	if (aGrp.pathItems.length > 0) {
		var bsElement = aGrp.pathItems[0];
		// (Can't use 'includes')
		if (
			(bsElement.name.search(c_breakSymbol) >= 0) ||
			(bsElement.name.search(c_breakBaseline) >= 0)
			) {
				setPathAttributes(bsElement);
		}
	}
	return true;
}
// PROCESS AXIS GROUP ends

function setTabularLining(labelsGroup) {

}

// PROCESS ONE DOUBLE-SCALE AXIS HEADER
// Called from processDoubleScaleAxisHeaders. Converts 
function processOneDoubleScaleAxisHeader(hGrp) {
	if (!rationaliseText(hGrp, true)) {
        alert('Double-scale axis header rationalisation failed. Sorry...');
    }
    // Processed text is a textFrame in hGrp
    // Move to parent group and delete hGrp
    var toGrp = hGrp.parent;
    hGrp.textFrames[0].move(toGrp, ElementPlacement.PLACEATEND);
    hGrp.remove();
}
// PROCESS ONE DOUBLE-SCALE AXIS HEADER ends

// PROCESS DOUBLE SCALE AXIS HEADER
// Param is axis group. Header is, putatively, a child groupItem
function processDoubleScaleAxisHeaders(aGrp, index) {
    // Look for headers and, if found, process them
    var headRoot = 'yaxis-header-' + index;
    var leftName = headRoot + '-left';
    var rightName = headRoot + '-right';
    // The trouble is: the headers' IDs have suffixed metadata
    // So loop
    for (var gNo = 0; gNo < aGrp.groupItems.length; gNo++) {
        var thisG = aGrp.groupItems[gNo];
        if (thisG.name.search(headRoot) >= 0) {
            processOneDoubleScaleAxisHeader(thisG);
         }
    }
}
// PROCESS DOUBLE SCALE AXIS HEADER ends
// PROCESS PANEL HEADERS
function processPanelHeaders(pGrp) {
	// If there are no panels, just delete group and return
	var pCount = pGrp.groupItems.length;
	if (pCount === 0) {
		pGrp.remove();
	} else {
		// So I have 2 or more panels. Headers are in groupItems 'panel-group-0', etc
		// Each group contains:
		//		- a pathItem: 'panel-header-rect'
		//		- a groupItem: 'panel-header-string', containing...
		//				- one of more 'tspan' textFrames to be consolidated, attributed, then moved
		//		- and I need to remove the string groupItem.
		// Loop on panel-header groups:
		for (var i = 0; i < pCount; i++) {
			var onePanel = pGrp.groupItems[i];
			// So onePanel is the group containing flash and string for one panel.
			// Let's do the flash:
			var pRect = onePanel.pathItems[0];
			setPathAttributes(pRect);
			var pTextGrp = onePanel.groupItems[0];
			// New flag: use group name on child textFrame... 
			var pText = rationaliseText(pTextGrp, true);
		}
	}
	return true;
}
// PROCESS PANEL HEADERS ends

// PROCESS LINE SERIES
// Called from processContentGroup to deal with a collection of line series,
// each of which is a pathItem. Arg is the group of series.
function processLineSeries(grp) {
    var isStacked = false;
    // Lines and possible fills are embedded in enclosing groups
	for(var i = 0; i < grp.groupItems.length; i++) {
		var thisLine = grp.groupItems[i].pathItems[0];
		setPathAttributes(thisLine);
        // Layer cake?

        if (grp.groupItems[i].pathItems.length > 1) {
            var thisFill = grp.groupItems[i].pathItems[1];
            // Some redundancy, but still: zero line comes to front of layercakes
            zeroLineBehind = false;
            setPathAttributes(thisFill);
        }
	}
	// And handle any index dot. The assumption is that the
	// overall line series group can contain only 1 pathItem: the dot
	if (grp.pathItems.length > 0) {
		var iDot = grp.pathItems[0];
		if (iDot.name.search(c_indexDot) === 0) {
				setPathAttributes(iDot);
		}
	}
}
// PROCESS LINE SERIES ends

// PROCESS COL-BAR SERIES
function processColBarSeries(grp) {
	// Zero line flag
	zeroLineBehind = false;
	// Group contains a subgroup for each series, so...
	for (var gNo = 0; gNo < grp.groupItems.length; gNo++) {
		var serGrp = grp.groupItems[gNo];
		// Loop by rects
		for(var rNo = 0; rNo < serGrp.pathItems.length; rNo++) {
			var thisRect = serGrp.pathItems[rNo];
			setPathAttributes(thisRect, false);
		}
	}
}
// PROCESS COL-BAR SERIES ends

// PROCESS THERMO SERIES
// Arg 'grp' includes any number of series groups, and one group of spindles
function processThermoSeries(grp) {
	// Zero line flag
	// Group contains a subgroup for each series, so...
  for (var gNo = 0; gNo < grp.groupItems.length; gNo++) {
		var serGrp = grp.groupItems[gNo];
		// Loop by paths
		for(var rNo = 0; rNo < serGrp.pathItems.length; rNo++) {
			var thisPath = serGrp.pathItems[rNo];
			setPathAttributes(thisPath);
		}
	}
}
// PROCESS THERMO SERIES ends
// else if (myGrp.name.search('spindle') >= 0) {
//			alert('Found spindle group: ' + myGrp.name);
//		}

// PROCESS ZERO LINE
// Sets attributes on a red zero line and moves it into stack
// position, in front of bar/column group, but behind line
// group.
// NOTE: there may be more refinements necessary, for other styles
// and for double scales...
function processZeroLine(zGrp, contentGrp) {
	try {
		zLine = zGrp.pathItems[0];
	}
	catch (e) {};
	if (typeof zLine !== 'undefined') {
		setPathAttributes(zLine);
		// Position is either at top or behind first group...
		if (zeroLineBehind) {
			// In most cases, zero line goes behind front group
			var refGrp = contentGrp.groupItems[0];
			zLine.move(refGrp, ElementPlacement.PLACEAFTER);
		} else {
			// Bars/cols goes right to front
			zLine.move(contentGrp, ElementPlacement.PLACEATBEGINNING);
		}
	}
	// Whatever, delete the separate group
	zGrp.remove();
}
// PROCESS ZERO LINE ends

// PROCESS BLOB PAIR
// Arg is (with luck) a group containing 2 items:
//		a pathItem -- the rect or circle
//		a textFrame -- the blob strings
function processBlobPair(grp) {
	var bShape = grp.pathItems[0];
	setPathAttributes(bShape);
	// Wow! Talk about inferential...
	// NOTE: I'm just not sure where to set this as a preference...
	bShape.blendingMode = BlendModes.MULTIPLY;
	var bText = grp.textFrames[0];
    // setTextFrameAttributes(bText);
    makeNewTextFrame(bText, grp)
    bText.remove();
	
}
// PROCESS BLOB PAIR ends

// PROCESS BLOBS GROUP
// Param is main blobs group, which should contain one or (maybe)
// more blobs 'series'...
function processBlobsGroup(grp, index) {
	var gLen = grp.groupItems.length;
	// No blobs? Kill the group
	if (gLen === 0) {
		grp.remove();
		return;
	}
	// I should have two groups:
	//		blob-header-group-n
	//		blob-series-group-n
	// Header -- I have to dig down to subgroup
	var headGroup = grp.groupItems[c_blobHeaderGroup + index];
	var subHeadGroup = headGroup.groupItems[0];
	processBlobPair(subHeadGroup);
	// Series group consists of a number of blob-pairs
	var seriesGroup = grp.groupItems[c_blobSeriesGroup + index];
	var serLen = seriesGroup.groupItems.length;
	for (var i = 0; i < serLen; i++) {
		var onePair = seriesGroup.groupItems[i]
		processBlobPair(onePair);
	}
}
// PROCESS BLOBS GROUP ends

// PROCESS CONTENT GROUP
// Called from processContentLayer. Args are a single content (panel) group, and its index number
function processContentGroup(cGrp, cIndex) {
	// One content group (i.e. panel) may contain:
	//		series-group
	//		zeroline-group-n
	//		xaxis-group-n
	//		yaxis-group-n-left
	//		yaxis-group-n-right
	//
	// Special case: line series (lines and points) are buried
	// another layer down; move up where we'll find them...
	// ...if they exist
	try {
		var outerLineGrp = cGrp.groupItems['all-line-series-outer-group'];
		if (typeof outerLineGrp !== 'undefined') {
			for (var gNo = (outerLineGrp.groupItems.length - 1); gNo >= 0; gNo--) {
				outerLineGrp.groupItems[gNo].move(cGrp, ElementPlacement.PLACEATBEGINNING);
			}
			outerLineGrp.remove();
		}
	}
	catch(e) {};

	// Deal singly...
	// ...starting with x axis
	var xName = c_myXaxisGroup + cIndex;
	var xAxisGrp = cGrp.groupItems[xName];
	processAxisGroup(xAxisGrp, 'x', cIndex, '');
	// y axis
	// y-axis can be left and/or right...
	try {
		var yLeftName = c_myYaxisGroup + cIndex + c_left;
		var yAxisGrp = cGrp.groupItems[yLeftName];
		processAxisGroup(yAxisGrp, 'y', cIndex, c_left);
	}
	catch(e) {};
	try {
		var yRightName = c_myYaxisGroup + cIndex + c_right;
		var yAxisGrp = cGrp.groupItems[yRightName];
		processAxisGroup(yAxisGrp, 'y', cIndex, c_right);
	}
	catch(e) {};
	// Blobs (if any??)
	var bName = c_blobsMainGroup + cIndex;
	try {
		var bGrp = cGrp.groupItems[bName];
		processBlobsGroup(bGrp, cIndex);
	}
	catch (e) {};

	// Series...
	// There may be more than one series group, so I loop through...
	for (var gNo = 0; gNo < cGrp.groupItems.length; gNo++) {
		var myGrp = cGrp.groupItems[gNo];
		if (myGrp.name.search('series-group') >= 0) {
			var seriesType = myGrp.name.split(':')[1];
			switch(seriesType) {
				case 'line':
					processLineSeries(myGrp);
					break;
				case 'column':
					processColBarSeries(myGrp);
					break;
				case 'bar':
					processColBarSeries(myGrp);
					break;
				case 'points':
					processColBarSeries(myGrp);
					break;
				case 'thermo':
					// Note: thermo group includes 'spindles'
					processThermoSeries(myGrp);
					break;
			}
		}
	}

	// Zero line (if any)
	var zName = c_zeroLineGroup + cIndex;
	var zGrp = cGrp.groupItems[zName];
	processZeroLine(zGrp, cGrp);
}
// PROCESS CONTENT GROUP ends

// PROCESS CONTENT LAYER
// Passed the entire Content layer
function processContentLayer(contentLayer) {
	// Content layer will consist of one or more panel-specific 'content' groups
	// So let's loop through them...
	var contentTotal = contentLayer.groupItems.length;
	// NOTE: THERE'S A POTENTIALLY DANGEROUS ASSUMPTION HERE...
	// ...that contentLayer contains ***only*** 'panel' groups...
	// So keep an eye on that...
	for (var i = 0; i < contentTotal; i++) {
		// Panels are numbered
		var cGrpName = c_myContentGroup + i;;
		var thisPanel = contentLayer.groupItems[cGrpName];
		if (typeof thisPanel !== 'undefined') {
			processContentGroup(thisPanel, i);
		}
	}
	return true;
}
// PROCESS CONTENT LAYER ends

// ***** DOCUMENT PROCESSING *****

// RESTRUCTURE DOC
// Called from processSibyl. SVG opens in a forced 'Layer 1'
// containing several groups. The first thing I want to do is create 2 layers...
function restructureDoc(myDoc) {
	// Trap SVGs that've been mal-processed
	try {
		// Grab the default SVG layer
		var layer1 = myDoc.layers[c_itsLayer1];
		// That has a 'base' group...
		var mainGroup = layer1.groupItems[c_itsMainGroup];
	}
	catch (e) {
		return false;
	}
	// The first thing is to re-layer the document: background and content layers
	var backLayer = myDoc.layers.add();
	backLayer.name = c_myBackLayer;
	var contentLayer = myDoc.layers.add();
	contentLayer.name = c_myContentLayer;

  // Now move groups into the new layers
	// Background layer
	try {
		var backGroup = mainGroup.groupItems[c_itsBackGroup];
		// Children should be 'shapes', 'strings' and 'panels'
		for (var i = backGroup.groupItems.length - 1; i >= 0; i--) {
			var g = backGroup.groupItems[i];
			g.move(backLayer,ElementPlacement.PLACEATBEGINNING);
		}
		// And delete the background group:
		backGroup.remove();
	} catch (e) {
		alert('Moving background elements to new layer failed with error ' + e);
		return false;
	}

	// LEGENDS GROUP
	// I don't know what the longterm solution will be; but for now, I'm just moving
	// and "legends-group" into the (just-moved, above) background group
	try {
		var legendsGroup = mainGroup.groupItems[c_legendsGroup];
		legendsGroup.move(backLayer,ElementPlacement.PLACEATBEGINNING);
	}
	catch (e) {}

	// Content layer
	// With the background group gone, I can loop (backwards) thro what's left in
	// the main group and shift it into the content layer
	try {
		for (i = mainGroup.groupItems.length - 1; i >= 0; i--) {
			var g = mainGroup.groupItems[i];
			g.move(contentLayer,ElementPlacement.PLACEATEND);
		}
		// So the content layer should now contain one or more indexed
		// contents (panel) groups
	} catch (e) {
		alert('Moving chart content to new layer failed with error ' + e);
		return false;
	}
	// Finally delete the original 'Layer 1'
	layer1.remove();
	return true;
}
// RESTRUCTURE DOC ends

// PROCESS SIBYL
// Called when importSybil has opened the SVG
// Controls processing of document elements. It restructures the SVG groups
// and sends each one to processGroup for unpicking and processing
function processSibyl(myDoc) {
	// Basic restructuring
  if (!restructureDoc(myDoc)) {
    alert("Initial document restructure failed. Sorry...");
    return;
  }
  // Doc now contains
  //		Background layer, with shapes and strings in groups...
	//			...and legends group
  //		Content layer, with...
  //			...one or more indexed contents group, each containing...
  //			series, x- and y-axis groups, zeroline group... and more???
  // Sort out the background layer, which contains 2 groups
  // Background strings:
  var backStringsGroup = myDoc.groupItems[c_myBackStringsGroup];
  if (!rationaliseText(backStringsGroup, false)) {
    alert("Background text rationalisation failed. Sorry...");
    return false;
  }

// Background shapes:
  var backShapesGroup = myDoc.groupItems[c_myBackShapesGroup];
  if (!resetAllPathAttributes(backShapesGroup)) {
  	alert('Failed to reset background path attributes. Sorry...');
  	return false;
  }

// Panel headers are part of the background layer...
	if (!processPanelHeaders(myDoc.groupItems[c_myPanelHeadersGroup])) {
		alert("Failed to process panel headers...");
		return false;
	}

// And any legends are in background layer
	// Are there legends?
	try {
		var legendsGroup = myDoc.groupItems[c_legendsGroup];
		if (!processLegends(legendsGroup)) {
			alert("Failed to process legends...");
			return false;
		}
	}
	// If no legends, don't worry:
	catch(err) {}
	// Now sort out the content layer, which will contain one or more panel-specific (excluding
	// panel flash and header) content-groups...
	if (!processContentLayer(myDoc.layers[c_myContentLayer])) {
		alert("Failed to process main group of chart-specific content...");
		return false;
	}	
	return true;
}
// PROCESS SIBYL ends

// SAVE AS EPS
// Called from importSibyl to save file as EPS to output folder
function saveAsEPS (myFile) {
	var path = c_outbox + myFile.name;
	var newFile = new File(path);
	var saveOpts = new EPSSaveOptions();
	saveOpts.cmykPostScript = true;
	saveOpts.embedAllFonts = true;
	myFile.saveAs( newFile, saveOpts );
}
// SAVE AS EPS ends


// CHECK OUTBOX
// Called from importSibyl to verify that outbox exists; if not, create...
function checkOutbox()
{
	if (Folder(c_outbox).exists) {
		return true;
	}
	else {
		// Folder doesn't exist: try to create it
		try {
			var tF = new Folder(c_outbox);
			tF.create();
			alert("New folder " + c_outbox +
				"\nI have created this folder as an out-tray for Silver Bullet .EPS files...")
			return true;
		}
		catch (err) {
			// Error returns false
			alert("Target folder " + c_outbox + "doesn't exist and I failed " +
				" to create it. Please create the folder manually", "Folder error")
			return false;
		}
	}
}
// CHECK OUTBOX ends


// IMPORT SIBYL is called at kick-off. It opens a file via a system dialog.
// Sets colour space then calls main processor function
function importSibyl() {
	// Check that there's an outbox
	if (!checkOutbox()) {
		return;
	}
  // Check that the necessary DUMMY file is open
	if (!checkOpenDocument()) {
		return;
	}
	// Still here? There's an open (dummy) file, which means we can get at the colourspace...
	// Prompt to open an SVG file...
	var path = new File(c_svgFolder);
	var myFile= path.openDlg("Import SVG file...");
	var madeit = false;
	var myDoc;
	if(myFile != null) {
		try {
			myDoc = app.open(myFile, DocumentColorSpace.CMYK);
			// app.documents.arrange(DocumentLayoutStyle.FLOATALL);
			// Set colourspace:
			app.executeMenuCommand('doc-color-cmyk');
			if (myDoc.documentColorSpace !== DocumentColorSpace.CMYK) {
				alert('Failed to reset file colour space. Sorry...');
				return;
			}
			// Still here? Let's process the SVG...
			madeit = processSibyl(myDoc);
		} catch (e) {
			msg = 'Load failed with error ' + e;
			alert(msg);
		}
	}
	// And save if successful; otherwise just close unsaved
	if (madeit) {
		saveAsEPS(myDoc);
	} else {
		if (typeof myDoc !== 'undefined') {
			// Eventually failure should simply close the active doc
			// myDoc.close( SaveOptions.DONOTSAVECHANGES );
		}
	}
}
// IMPORT SIBYL ends