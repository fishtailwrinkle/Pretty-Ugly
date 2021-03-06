const FACE_PLUS_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
const FACE_PLUS_COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";
//const IMAGE_URL = "https://goo.gl/v8Mr1h"; //Beyonce
//const IMAGE_URL = "https://goo.gl/56QsnY"; //Elon Musk
//const IMAGE_URL = "http://1.bp.blogspot.com/-hMUpDcPMJUI/Vm75r4udnGI/AAAAAAAARLc/cUm2sWkeODk/s1600/Jennifer%2BLawrence%2Bhunger%2Bgames%2Bprequels%2Btoo%2Bsoon.jpg";

var DETECT_IMAGE_URL = "";
var COMPARE_IMAGE_URL = "";

function postDetectData(IMAGE_URL, callback) {
	//Query parameters for face detection API call
	console.log(`postDetectData: `+IMAGE_URL);
		
	const query = {
		api_key: "ed6us9-OR9eJ-TEAfUuI1btwiAeIEqrm",
		api_secret: "JEnUSKtyvfiXX8xQnxfqD8NJKIMllhbp",
		image_url: IMAGE_URL,
		return_landmark: 2,
		return_attributes: "gender,age,headpose,emotion,ethnicity,beauty,skinstatus"
	}

	$.post(FACE_PLUS_DETECT_URL, query, callback, "json")
		.fail(() => {
			alert("Please review the image requirements and provide a valid URL to your image!");
		});
}

function postCompareData(callback) {
	const query = {
		api_key: "ed6us9-OR9eJ-TEAfUuI1btwiAeIEqrm",
		api_secret: "JEnUSKtyvfiXX8xQnxfqD8NJKIMllhbp",
		image_url1: DETECT_IMAGE_URL,
		image_url2: COMPARE_IMAGE_URL
	}
	$.post(FACE_PLUS_COMPARE_URL, query, callback, "json");
}

function renderDetectResult(idString, IMAGE_URL, result) {
	const imgIdString = idString+"-face-img";

	//Sort emotion object in an array to find out the greatest confidence
	const emotions = result.faces[0].attributes.emotion;
	var sortEmotions = [];
	
	for (var emotion in emotions) {
		sortEmotions.push([emotion,emotions[emotion]]);
	}
	//Sort emotion confidence level from high to low
	sortEmotions.sort((a,b) => b[1]-a[1]);

	//Sort skin object in an array to find out the greatest confidence
	const skins = result.faces[0].attributes.skinstatus;
	var sortSkins = [];
	
	for (var skin in skins) {
		sortSkins.push([skin,skins[skin]]);
	}
	//Sort skin confidence level from high to low
	sortSkins.sort((a,b) => b[1]-a[1]);

	const getGender = result.faces[0].attributes.gender.value;
	const getAge = result.faces[0].attributes.age.value;
	const getEthnicity = result.faces[0].attributes.ethnicity.value;
	const getSkin = sortSkins[0][0];
	const getEmotion = sortEmotions[0][0];

  	var getSkinDes = "";
	var getEmotionDes = "";
	var getBeauty = "";
	
	if (getSkin === "health") {
    	getSkinDes = "Healthy";
  	}
  	else if (getSkin === "stain") {
    	getSkinDes = "Stain";
  	}
  	else if (getSkin === "acne") {
   		getSkinDes = "Acne";
  	}
  	else if (getSkin === "dark_circle") {
    	getSkinDes = "Bags";
  	}
  
	if (getEmotion === "disgust") {
    	getEmotionDes = "Disgust";
  	}
  	else if (getEmotion === "anger") {
   		getEmotionDes = "Anger";
  	}
  	else if (getEmotion === "fear") {
    	getEmotionDes = "Fear";
  	}
  	else if (getEmotion === "happiness") {
    	getEmotionDes = "Joy";
  	}
  	else if (getEmotion === "neutral") {
   		getEmotionDes = "Trust";
  	}
  	else if (getEmotion === "sadness") {
    	getEmotionDes = "Sadness";
  	}
  	else if (getEmotion === "surprise") {
    	getEmotionDes = "Surprise";
  	}

	if (getGender === "Male") {
		getBeauty = Math.round(result.faces[0].attributes.beauty.male_score);
	}
	else if (getGender === "Female") {
		getBeauty = Math.round(result.faces[0].attributes.beauty.female_score);
	}

	let viewportWidth = 500;

	if (document.documentElement.clientWidth < 500) {
		viewportWidth = document.documentElement.clientWidth;
	} 

	const faceDetailsHeight = viewportWidth*0.9;

	return `
		<div class="col-12 handle-img">
			<div class="img-box">
				<span class="helper"></span>
				<img class="rounded" id="${imgIdString}" src="${IMAGE_URL}" alt="${imgIdString}">
				<div class="js-${idString}-drawFaceBorder drawFaceBorder">
					<div class="js-${idString}-landmarkBox landmarkBox"></div>
				</div>
			</div>
		</div>
		
		<div class="face-details" style="height: ${faceDetailsHeight}px">
	    	<h6>Beauty Score</h6>
	    	<div class="progress">
        		<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${getBeauty}%" aria-valuemin="0" aria-valuemax="100" style="width: ${getBeauty}%">${getBeauty}%</div>
      		</div>
    
      		<div>
			<div class="face-circle border-warning">
				<h5 class="face-title">${getGender}</h5>
				<h5>Gender</h5>
			</div>
			<div class="face-circle border-danger">
				<h5 class="face-title">${getAge}</h5>
				<h5>Age</h5>
			</div>
			<div class="face-circle border-info">
				<h5 class="face-title">${getEthnicity}</h5>
				<h5>Race</h5>
			</div>
			</div>
			<div>
			<div class="face-circle border-primary">
				<h5 class="face-title">${getEmotionDes}</h5>
				<h5>Emotion</h5>
			</div>
			<div class="face-circle border-success">
				<h5 class="face-title">${getSkinDes}</h5>
				<h5>Skin</h5>
			</div>
			</div>
		</div>
	`;
}

function renderCompareResult(result) {
	const getConfidence = Math.round(result.confidence);

	return `
	  	<div class="face-alike">
		  <h6>Alikeness</h6>
 			<div class="progress">
            	<div id="progress-alike" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${getConfidence}%" aria-valuemin="0" aria-valuemax="100" style="width: ${getConfidence}%">${getConfidence}%</div>
      		</div>
      	</div>
	`;
}

function renderCompareUpload() {
	return `
		<p>Upload another pic to compare!</p>	
		<input class="col-9" type="text" id="compare-url">
		<button id="compare-button" class="btn btn-outline-danger btn-sm" type="button">URL</button>
	`;
}

function displayLandmarkBox(idString, data) {
	const imgIdString = idString+"-face-img";

	//Defining dimension and positioning of original and displayed (resized) image
	const naturalWidth = document.getElementById(imgIdString).naturalWidth;
	const naturalHeight = document.getElementById(imgIdString).naturalHeight;
	const width = document.getElementById(imgIdString).clientWidth;
	const height = document.getElementById(imgIdString).clientHeight;
	const marginleft = -(width/2);
	const margintop= -(height/2);
	var resize_ratio = 1;

	$(`.handle-img`).attr('style', `height:${height}px;`);
	$(`.img-box`).attr('style', `height:${height}px;`);
	
	//Calculate resize ratio for correct positioning of landmarkBox 
	if (naturalWidth>width) {
		resize_ratio = naturalWidth/width;
	} 
		
	//Based on displayed (resized) image dimension	
	//Set the dimension of the landmarkBox (box(es) around the face(s))
	const roll_angle = data.faces[0].attributes.headpose.roll_angle/resize_ratio;
	const face_rectangle_width = data.faces[0].face_rectangle.width/resize_ratio;
	const face_rectangle_height = data.faces[0].face_rectangle.height/resize_ratio;
	const face_rectangle_left = data.faces[0].face_rectangle.left/resize_ratio;
	const face_rectangle_top = data.faces[0].face_rectangle.top/resize_ratio;

	//Update the drawFaceBorder(current image dimention and position)
	//Update the landmarkBox(box(es) around the face(s))
	$(`.js-${idString}-drawFaceBorder`).attr('style', `width:${width}px; height:${height}px; top:50%; left:50%; margin-left:${marginleft}px; margin-top:${margintop}px;`);
	$(`.js-${idString}-landmarkBox`).attr('style', `transform: rotateZ(${roll_angle}deg); width:${face_rectangle_width}px; height:${face_rectangle_height}px; left:${face_rectangle_left}px; top:${face_rectangle_top}px;`);
}

//Displaying face detection data from Face++ API
//Dimension variables calculated based on original image are updated to reflect displayed (resized) image dimension 
function displayFaceDetectData(data) {
  //Calling function for html generation
	$('.face-detect').html('');
	$('.face-upload').html('');

	const result = renderDetectResult('detect', DETECT_IMAGE_URL, data);
	$('.js-detect-box').html(result);

	const compareButton = renderCompareUpload();
	$('.face-compare').html(compareButton);

	//Listen to image loading complete event to trigger the drawing of landmark box
	$('#detect-face-img').on('load', event => {
		displayLandmarkBox('detect', data);
	});
}

function displayFaceCompareData(data) {
	const detectResult = renderDetectResult('compare', COMPARE_IMAGE_URL, data);
	$('.js-compare-box').html(detectResult);
	$('#compare-face-img').on('load', event => {
		console.log('Compare load complete!');
		displayLandmarkBox('compare', data);
	});
}

function displayFaceCompareResult(data) {
	const compareResult = renderCompareResult(data);
	$('.face-compare-results').html(compareResult);
	$('.face-compare').html('');
	$('.face-footer').html('');
}

function renderInit() {
	return `
		<header class="col-12 text-center mt-20">
			<h2>How do you look? Let's <a class="text-danger">Face-It</a> :)</h2>
			<p>Upload a selfie for analysis!</p>
		</header>	
	`;
}

function renderUpload() {
	return `
		<form class="col-12 detect-img-url text-center" action="#">
			<input class="col-9" type="text" id="detect-url">
			<button id="detect-button" class="btn btn-outline-danger btn-sm" type="submit">URL</button>
		</form>	
	`;
}

function displayInit() {
	const init = renderInit();
	const upload = renderUpload();
	$('.face-detect').html(init);
	$('.face-detect-results').html('');
	$('.face-compare-results').html('');
	$('.face-compare').html('');
	$('.js-detect-box').html('');
	$('.js-compare-box').html('');
	$('.face-upload').html(upload);
	uploadDetect();
}

//Upload event triggered when user click upload button to input an image URL
function uploadDetect() {
	$('.detect-img-url').submit(event => {
		event.preventDefault();
		DETECT_IMAGE_URL = $('#detect-url').val();
		$('#detect-url').val("");
		postDetectData(DETECT_IMAGE_URL, displayFaceDetectData);
		uploadCompare();	
	});
}

function restartDetect() {
	$('#link-home').on('click', event => {
		DETECT_IMAGE_URL = "";
		COMPARE_IMAGE_URL = "";
		//Reload the page
		location.reload();
		//Alternative woring method to reload page
		//window.location.href=window.location.href;
	});
}

function uploadCompare() {
	$('.face-compare').unbind().on('click', '#compare-button', event => {
		event.preventDefault();
		COMPARE_IMAGE_URL = $('#compare-url').val();
		$('#compare-url').val("");
		postDetectData(COMPARE_IMAGE_URL, displayFaceCompareData);
		postCompareData(displayFaceCompareResult);
		
	});
}

function initApp() {
	displayInit();
	restartDetect();
}

$(initApp);