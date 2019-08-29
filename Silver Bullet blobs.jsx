// Functions to process blobs

// PROCESS BLOB PAIR
// Arg is (with luck) a group containing 2 items:
//		a pathItem -- the rect or circle
//		a textFrame -- the blob strings
// NOTE: but allow for text as tspans
function processBlobPair(grp) {
	var bShape = grp.pathItems[0];
	setPathAttributes(bShape);
	// Inferential!
	bShape.blendingMode = BlendModes.MULTIPLY;
	var bText = grp.textFrames[0];
    // setTextFrameAttributes(bText);
    makeNewTextFrame(bText, grp)
    bText.remove();
	
}
// PROCESS BLOB PAIR ends

// PROCESS BLOBS GROUP
// Called from Content.processContentGroup
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
	var headGroup = grp.groupItems[c_itsBlobHeaderGroup + index];
  var subHeadGroup = headGroup.groupItems[0];
  processBlobPair(subHeadGroup);
  // Rename and move up to main blob group
  subHeadGroup.name = c_myBlobHeaderGroup;
  subHeadGroup.move(grp, ElementPlacement.PLACEATBEGINNING);
	// Series group consists of a number of blob-pairs
	var seriesGroup = grp.groupItems[c_blobSeriesGroup + index];
	var serLen = seriesGroup.groupItems.length;
	for (var i = 0; i < serLen; i++) {
		var onePair = seriesGroup.groupItems[0]
    processBlobPair(onePair);
    // Name is OK for now, at least; but move up:
    onePair.move(grp, ElementPlacement.PLACEATBEGINNING);
	}
}
// PROCESS BLOBS GROUP ends