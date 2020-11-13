/**
 * 검색 결과 목록에서 해당 항목으로 넘어가기 위한 id를 저장하는 배열
 */
var resultidreco = [];

function clear_reco_array() {
	for (let i = 0; i < 18; i++){
		resultidreco[i] = [];
	}
}

/**
 * 코스 상세정보 목록에서 해당 관광지 항목으로 넘어가기 위한 id를 저장하는 배열
 */
var resultidreco_info;

/** 
 * 코스 상세정보 목록에서 코스 타입에 따라 관광지 등 시설을 분류하기 위한 소분류 목록을 저장하는 배열
 */
let smallCategories = [];

/**
 * reco_detail_info에서 코스 시작위치로 가는 Tmap 버튼을 생성하기 위한 선택된 코스의 시작좌표를 저장하는 변수<br>
 * 현재 사용 안함
 */
var selectedcourse = {
	"mapx": "0",
	"mapy": "0"
};

let existing_course;

let reco_tmaplink;

/**
 * "recommended" class에 해당하는 모든 div 숨기기
 */
function hideall_recommended() {
	var recommendClasses = document.getElementsByClassName("recommended");
	for (var i = 0; i < recommendClasses.length; i++) {
		recommendClasses[i].style.display = "none";
		console.log("hided : " + recommendClasses[i].id);
	}
	console.log("hideall_recommended() activated");
}

/**
 * 경유지포함한 코스 경로안내 마커찍기 --> Static Map Tmap api
 */
function place_map(pdata, id) {
	console.log("place_map() Start ==> pdata.passLat[0] : " + pdata.passLat[0] + "pdata.passLng[0] : " + pdata.passLng[0]);
	console.log(pdata);
	// map 생성
	// Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
	var place_map = new Tmapv2.Map(id, // "map_div" : 지도가 표시될 div의 id
		{
			// center: new Tmapv2.LatLng(37.52084364186228,127.058908811749), // 지도 초기 좌표
			center: new Tmapv2.LatLng(pdata.passLat[0], pdata.passLng[0]), // 지도 초기 좌표
			width: "100%", // map의 width 설정
			height: "100%", // map의 height 설정
			httpsMode: true // map의 https 모드 설정
		});

	function drawData(data) {

		var resultStr = "";
		var distance = 0;
		var idx = 1;
		var newData = [];
		var equalData = [];
		var pointId1 = "-1234567";
		var ar_line = [];
		var pointArray = [];
		var new_polyLine = [];

		for (var i = 0; i < data.features.length; i++) {
			var feature = data.features[i];
			//배열에 경로 좌표 저장
			if (feature.geometry.type == "LineString") {
				ar_line = [];
				for (var j = 0; j < feature.geometry.coordinates.length; j++) {
					var startPt = new Tmapv2.LatLng(feature.geometry.coordinates[j][1], feature.geometry.coordinates[j][0]);
					ar_line.push(startPt);
					pointArray.push(feature.geometry.coordinates[j]);
				}
				var polyline = new Tmapv2.Polyline({
					path: ar_line,
					strokeColor: "#ff0000",
					strokeWeight: 6,
					map: place_map
				});
				new_polyLine.push(polyline);
			}
			var pointId2 = feature.properties.viaPointId;
			if (pointId1 != pointId2) {
				equalData = [];
				equalData.push(feature);
				newData.push(equalData);
				pointId1 = pointId2;
			} else {
				equalData.push(feature);
			}
		}
		geoData = newData;
		var markerCnt = 1;
		for (var i = 0; i < newData.length; i++) {
			var mData = newData[i];
			var type = mData[0].geometry.type;
			var pointType = mData[0].properties.pointType;
			var pointTypeCheck = false; // 경유지 일때만 true
			if (mData[0].properties.pointType == "S") {
				// var dimg = 'http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_s.png';
				var dimg = 'https://actions.o2o.kr/content/kangwontour/img/marker/pin_r_m_s.png';
				var dLng = mData[0].geometry.coordinates[0];
				var dLat = mData[0].geometry.coordinates[1];
				//ReAddMarker2(lon, lat,img);
			} else if (mData[0].properties.pointType == "E") {
				// var dimg = 'http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_e.png';
				var dimg = 'https://actions.o2o.kr/content/kangwontour/img/marker/pin_r_m_e.png';
				var dLng = mData[0].geometry.coordinates[0];
				var dLat = mData[0].geometry.coordinates[1];
				//ReAddMarker2(lon, lat,img);
			} else {
				markerCnt = i;
				var dLng = mData[0].geometry.coordinates[0];
				var dLat = mData[0].geometry.coordinates[1];
				//ReAddMarker(lon, lat,markerCnt);
			}
		}
	}

	function addMarker(status, lon, lat, tag) {
		//출도착경유구분
		//이미지 파일 변경.
		var imgURL;
		var markerLayer;
		switch (status) {
			case "llStart":
				//  imgURL = 'http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_s.png';
				imgURL = 'https://actions.o2o.kr/content/kangwontour/img/marker/pin_r_m_s.png';
				break;
			case "llPass":
				//  imgURL = 'http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_p.png';
				imgURL = 'https://actions.o2o.kr/content/kangwontour/img/marker/pin_b_m_p.png';
				break;
			case "llEnd":
				//  imgURL = 'http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_e.png';
				imgURL = 'https://actions.o2o.kr/content/kangwontour/img/marker/pin_r_m_e.png';
				break;
			default:
		}
		console.log(imgURL);
		var marker = new Tmapv2.Marker({
			position: new Tmapv2.LatLng(lat, lon),
			icon: imgURL,
			map: place_map,
		});
		console.log(status + "_" + tag + " : " + lat + " , " + lon);
		// 마커 드래그 설정
		// 작동 안됨. markerList를 읽지 못함.
		var markerList = [];
		console.log("tag = " + tag);
		console.log("markerList = " + markerList);
		marker.tag = tag;
		console.log("marker.tag = " + marker.tag);
		marker.addListener("dragend", function (evt) {
			markerListenerEvent(evt);
		});
		marker.addListener("drag", function (evt) {
			markerObject = markerList[tag];
		});
		marker.addListener("click", function (evt) {
			for (i = 0; i < pdata.passLng.length; i++) {
				document.getElementById("subcourse" + i).style.backgroundColor = "purple";
				document.getElementById("subcourse" + i).style.borderColor = "purple";
				console.log("subcourse" + i + " = purple");
			}
			document.getElementById("subcourse" + tag).style.backgroundColor = "#00ff00";
			document.getElementById("subcourse" + tag).style.borderColor = "#00ff00";
			console.log("subcourse" + tag + " = green");
		})
		markerList[tag] = marker;
		return marker;
	}

	// 2. 시작, 도착 심볼찍기
	// 시작
	addMarker("llStart", pdata.passLng[0], pdata.passLat[0], 0);
	// console.log("llEnd passLng[pdata.passLng.length-1] : " +pdata.passLng[pdata.passLng.length-1] + "passLat[pdata.passLat.length-1]" +pdata.passLat[pdata.passLat.length-1]);
	// 도착
	addMarker("llEnd", pdata.passLng[pdata.passLng.length - 1], pdata.passLat[pdata.passLat.length - 1], pdata.passLng.length - 1);
	// 3. 경유지 심볼 찍기
	for (var i = 1; i < pdata.passLng.length - 1; i++) {
		console.log("경유지 forloop passLng[" + i + "] : " + pdata.passLng[i] + " passLat[" + i + "] : " + pdata.passLat[i]);
		addMarker("llPass", pdata.passLng[i], pdata.passLat[i], i);
	}
	console.log("forloop 경유지 addMarker End!")
	// 4. 경유지 최적화 API 사용요청
	var startX = pdata.passLng[0];
	var startY = pdata.passLat[0];
	var endX = pdata.passLng[pdata.passLng.length - 1];
	var endY = pdata.passLat[pdata.passLat.length - 1];
	var passList = pdata.passList;
	var prtcl;
	var headers = {};
	var geoData;

	console.log("startX = " + pdata.passLng[0]);
	console.log("startY = " + pdata.passLat[0]);
	console.log("endX = " + pdata.passLng[pdata.passLng.length - 1]);
	console.log("endY = " + pdata.passLat[pdata.passLat.length - 1]);
	console.log("passList = " + pdata.passList);
	headers["appKey"] = "l7xxef0befba10d74637b27b8d7a8acdd7aa";
	$.ajax({
		method: "POST",
		headers: headers,
		url: "https://apis.openapi.sk.com/tmap/routes?version=1&format=json", //
		async: false,
		data: {
			startX: startX,
			startY: startY,
			endX: endX,
			endY: endY,
			passList: passList,
			reqCoordType: "WGS84GEO",
			resCoordType: "WGS84GEO",
			angle: "172",
			searchOption: "0",
			trafficInfo: "Y"
		},
		success: function (response) {
			prtcl = response;
			console.log("지도 그리기 POST 성공 : ");
			console.log(prtcl);
			// 5. 경유지 최적화 결과 Line 그리기
			var trafficColors = {
				extractStyles: true,
				/* 실제 교통정보가 표출되면 아래와 같은 Color로 Line이 생성됩니다. */
				trafficDefaultColor: "#636f63", //Default
				trafficType1Color: "#19b95f", //원할
				trafficType2Color: "#f15426", //지체
				trafficType3Color: "#ff970e" //정체
			};
			var style_red = {
				fillColor: "#FF0000",
				fillOpacity: 0.2,
				strokeColor: "#FF0000",
				strokeWidth: 3,
				strokeDashstyle: "solid",
				pointRadius: 2,
				title: "this is a red line"
			};
			drawData(prtcl);
			//place_map.zoomToExtent(routeLayer.getDataExtent());
			// 6. 경유지 최적화 결과 반경만큼 지도 레벨 조정
			var newData = geoData[0];
			var PTbounds = new Tmapv2.LatLngBounds();
			for (var i = 0; i < newData.length; i++) {
				var mData = newData[i];
				var type = mData.geometry.type;
				var pointType = mData.properties.pointType;
				if (type == "Point") {
					var linePt = new Tmapv2.LatLng(mData.geometry.coordinates[1], mData.geometry.coordinates[0]);
					console.log(linePt);
					PTbounds.extend(linePt);
				} else {
					var startPt, endPt;
					for (var j = 0; j < mData.geometry.coordinates.length; j++) {
						var linePt = new Tmapv2.LatLng(mData.geometry.coordinates[j][1], mData.geometry.coordinates[j][0]);
						PTbounds.extend(linePt);
					}
				}
			}
			place_map.fitBounds(PTbounds);
			//  place_map.setZoom(17); // setZoom (1~19)
		},
		error: function (request, status, error) {
			console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});

}

function recommended_view(data) {
	console.log("실행 : RECOMMENDED()");
	// 전부 가리고 recomme div 보이게 하기
	hideall();
	hideall_recommended();
	document.getElementById("recommended").style.display = "block";
	// 배경 바꾸기
	document.getElementById("reco_select").style.display = "block";
	document.getElementById("reco_select").style.backgroundImage = `url("./img/icon/recommended.png")`;
	// 데이터 도착 확인
	console.log("recommended_view command  : " + data.command);
}

/**
 * 추천코스 질문 1번째 (코스 타입)
 * @param {*} data fulfillment에서 가져온 데이터
 */
const recommend_view_legacy = (data) => {
	console.log("실행 : recommend_view()");
	console.log(data);
	hideall();
	existing_course = [];
	document.getElementById("recommended").style.backgroundImage = `url("./img/background.png")`;
	document.querySelector("#recommended").style.marginTop = `${barHeight.toString()}px`;

	let fallback;
	if (data.fallback) fallback = data.fallback;

	if (fallback) {
		document.getElementById("reco_image").setAttribute("src", "./img/course1fallback.png");
	} else {
		document.getElementById("reco_image").setAttribute("src", "./img/course1.png");
	}

	document.getElementById("recommended").style.display = "block";
	document.getElementById("reco").style.display = "block";
}

function recommend_view(data){
	console.log("실행 : recommend_view()");
	let fallback;
	if(data.fallback) fallback = data.fallback;

	hideall();
	document.querySelector("#welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.querySelector("#welcome").style.backgroundImage = `url("./img/background.png")`;
	if(document.querySelector("#recoWindow")) {
		let window = document.querySelector("#recoWindow");
		document.querySelector("#welcome").removeChild(window);
	}

	const recoWindow = document.createElement("div");
	document.querySelector("#welcome").appendChild(recoWindow);

	recoWindow.setAttribute("id", "recoWindow");
	recoWindow.setAttribute("class", "option");
	recoWindow.style.backgroundImage = `url("./img/bg.png")`
	recoWindow.style.display = "block";

	const recoDiv = document.createElement("div");
	recoDiv.setAttribute("id", "recoDiv");
	recoDiv.setAttribute("class", "recoQuestionDiv");
	recoWindow.appendChild(recoDiv);

	const recoQuestion = document.createElement("div");
	recoQuestion.textContent = `원하시는 테마를 말씀해주세요!`;
	recoQuestion.setAttribute("class", "question");
	recoDiv.appendChild(recoQuestion);

	let recoImage = [{"힐링":"./img/icon/healing_2.png"}, {"문화여행":"./img/icon/traditional.png"}, {"레저/스포츠":"./img/icon/leisure.png"}];
	for (let i=0; i<recoImage.length; i++){
		const optionContainer = document.createElement("div");
		optionContainer.setAttribute("class", "selectionBox recoBox");
		const Imagetag = document.createElement("img");
		Imagetag.setAttribute("src", Object.values(recoImage[i])[0]);
		// Imagetag.setAttribute("class", "iconOption");
		optionContainer.setAttribute("onclick", `sendText("${Object.keys(recoImage[i])[0]}")`);
		optionContainer.textContent += Object.keys(recoImage[i])[0];
		optionContainer.appendChild(Imagetag);
		recoDiv.appendChild(optionContainer);
	}

	const charaDiv = document.createElement("div");
	charaDiv.setAttribute("class", "charaDiv");
	recoWindow.appendChild(charaDiv);

	const charaImage = document.createElement("img");
	charaImage.setAttribute("src", "./img/icon/ani_4.png");
	if(fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
	charaImage.setAttribute("class", "charaImage");
	charaDiv.appendChild(charaImage);
}

/**
 * 추천코스 질문 2번째
 * @param {*} data fulfillment에서 가져온 데이터
 */
const reco_step_one_view_legacy = (data) => {
	console.log("실행 : reco_step_one_view()");
	console.log(data);
	hideall();
	existing_course = [];
	document.getElementById("recommended").style.backgroundImage = `url("./img/background.png")`;
	document.querySelector("#recommended").style.marginTop = `${barHeight.toString()}px`;

	let fallback;
	if (data.fallback) fallback = data.fallback;

	document.getElementById("recommended").style.display = "block";
	if (data.question_one === "힐링") {
		document.getElementById("reco_step_one_type1").style.display = "block";
		document.getElementById("reco_step_one_type1_image").setAttribute("src", "./img/course2-1.png");
		if (fallback) {
			document.getElementById("reco_step_one_type1_image").setAttribute("src", "./img/course2-1fallback.png");
		}
	} else if (data.question_one === "문화여행") {
		document.getElementById("reco_step_one_type1").style.display = "block";
		document.getElementById("reco_step_one_type1_image").setAttribute("src", "./img/course2-2.png");
		if (fallback) {
			document.getElementById("reco_step_one_type1_image").setAttribute("src", "./img/course2-2fallback.png");
		}
	} else if (data.question_one === "레저/스포츠") {
		document.getElementById("reco_step_one_type2").style.display = "block";
		document.getElementById("reco_step_one_type2_image").setAttribute("src", "./img/course2-3.png");
		if (fallback) {
			document.getElementById("reco_step_one_type2_image").setAttribute("src", "./img/course2-3fallback.png");
		}
	}

}

/**
 * 추천코스 질문 2번째
 * @param {*} data fulfillment에서 가져온 데이터
 */
function reco_step_one_view(data){
	console.log("실행 : recommend_view()");
	let fallback;
	if(data.fallback) fallback = data.fallback;

	hideall();
	document.querySelector("#welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.querySelector("#welcome").style.backgroundImage = `url("./img/background.png")`;
	if(document.querySelector("#recoStepOneWindow")) {
		let window = document.querySelector("#recoStepOneWindow");
		document.querySelector("#welcome").removeChild(window);
	}

	const recoStepOneWindow = document.createElement("div");
	document.querySelector("#welcome").appendChild(recoStepOneWindow);

	recoStepOneWindow.setAttribute("id", "recoStepOneWindow");
	recoStepOneWindow.setAttribute("class", "option");
	recoStepOneWindow.style.backgroundImage = `url("./img/bg.png")`
	recoStepOneWindow.style.display = "block";

	const recoStepOneDiv = document.createElement("div");
	recoStepOneDiv.setAttribute("id", "recoStepOneDiv");
	recoStepOneDiv.setAttribute("class", "recoQuestionDiv");
	recoStepOneWindow.appendChild(recoStepOneDiv);

	const recoStepOneQuestion = document.createElement("div");

	let recoStepOneImage;
	let recoStepOneClass;

	if(data.question_one === "레저/스포츠"){
		recoStepOneImage = [{"혼자서":"./img/icon/solo.png"}, {"가족이랑":"./img/icon/family.png"}, {"친구랑":"./img/icon/friends.png"}, {"연인이랑":"./img/icon/partner.png"}];
		recoStepOneClass = "recoStepOneBox_2";
		recoStepOneQuestion.textContent = `누구와 함께 여행하시나요?`;
	} else {
		recoStepOneImage = [{"알뜰하게":"./img/icon/smallbudget.png"}, {"욜로":"./img/icon/bigbudget.png"}];
		recoStepOneClass = "recoStepOneBox_1";
		recoStepOneQuestion.textContent = `여행 비용은 얼마나 생각하세요?`;
	}

	recoStepOneQuestion.setAttribute("class", "question");
	recoStepOneDiv.appendChild(recoStepOneQuestion);
	
	for (let i=0; i<recoStepOneImage.length; i++){
		const optionContainer = document.createElement("div");
		optionContainer.setAttribute("class", `selectionBox ${recoStepOneClass}`);
		const Imagetag = document.createElement("img");
		Imagetag.setAttribute("src", Object.values(recoStepOneImage[i])[0]);
		// Imagetag.setAttribute("class", "iconOption");
		optionContainer.setAttribute("onclick", `sendText("${Object.keys(recoStepOneImage[i])[0]}")`);
		optionContainer.textContent += Object.keys(recoStepOneImage[i])[0];
		optionContainer.appendChild(Imagetag);
		recoStepOneDiv.appendChild(optionContainer);
	}

	const charaDiv = document.createElement("div");
	charaDiv.setAttribute("class", "charaDiv");
	recoStepOneWindow.appendChild(charaDiv);

	const charaImage = document.createElement("img");
	charaImage.setAttribute("src", "./img/icon/ani_4.png");
	if(fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
	charaImage.setAttribute("class", "charaImage");
	charaDiv.appendChild(charaImage);

	const historyChipsDiv = document.createElement("div");
	historyChipsDiv.setAttribute("class", "historyChipsDiv");
	recoStepOneWindow.appendChild(historyChipsDiv);

	const historyChip = document.createElement("div");
	historyChip.setAttribute("class", "historyChip");
	historyChip.textContent = data.question_one;
	historyChipsDiv.appendChild(historyChip);
}

/**
 * 추천코스 질문 3번째
 * @param {*} data fulfillment에서 가져온 데이터
 */
const reco_step_two_view_legacy = async (data) => {
	console.log("실행 : reco_step_two_view()");
	console.log(data);
	hideall();
	clear_reco_array();
	existing_course = [];
	document.getElementById("recommended").style.backgroundImage = `url("./img/background.png")`;
	document.querySelector("#recommended").style.marginTop = `${barHeight.toString()}px`;

	let fallback;
	if (data.fallback) fallback = data.fallback;

	document.getElementById("recommended").style.display = "block";
	document.getElementById("reco_step_two").style.display = "block";
	document.getElementById("reco_step_two_image").setAttribute("src", `./img/course3-${data.course_type}.png`);
	if (fallback) {
		document.getElementById("reco_step_two_image").setAttribute("src", `./img/course3-${data.course_type}fallback.png`);
	}

	smallCategories = [];
	let intermediate = [];

	//1, 2번째 질문 결과에 따라 관광지 소분류 분류
	if (data.course_type == "one") {
		smallCategories = [putsmalltype({ "tour": "힐링", "heal": "자연 속 힐링" }), ...putsmalltype({ "tour": "전통" })];
	} else if (data.course_type == "two") {
		smallCategories = putsmalltype({ "tour": "힐링" });
	} else if (data.course_type == "three") {
		smallCategories = putsmalltype({ "tour": "전통" });
	} else if (data.course_type == "four") {
		smallCategories = [putsmalltype({ "tour": "쇼핑" }), ...putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "문화시설에서 힐링" })];
	} else if (data.course_type == "five") {
		smallCategories = [putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "자연 속 힐링" })];
	} else {
		smallCategories = [putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "문화시설에서 힐링" })];
	}

	//smallCategories로 results 거르기
	let ITEM = await tourAPI("", data);
	smallCategories.forEach(word => {
		for (let i = 0; i < ITEM.length; i++) {
			if (ITEM[i].cat3 == word) {
				if (!ITEM[i].mapx) {
					console.log(`${i} : 좌표 데이터 없음`);
				}
				else intermediate.push(ITEM[i]);
			}
		}
	})
	for (let i = 0; i < 18; i++) {
		intermediate.forEach(data => {
			if(data.sigungucode == i + 1) {
				//도시별로 배열에 넣음
				resultidreco[i].push(data);
			}
		})
	}
	console.log(ITEM);
	console.log(intermediate);
	console.log(resultidreco);
}

/**
 * 추천코스 질문 3번째
 * @param {*} data fulfillment에서 가져온 데이터
 */
async function reco_step_two_view(data){
	console.log("실행 : recommend_view()");
	let fallback;
	if(data.fallback) fallback = data.fallback;

	hideall();
	document.querySelector("#welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.querySelector("#welcome").style.backgroundImage = `url("./img/background.png")`;
	if(document.querySelector("#recoStepTwoWindow")) {
		let window = document.querySelector("#recoStepTwoWindow");
		document.querySelector("#welcome").removeChild(window);
	}

	const recoStepTwoWindow = document.createElement("div");
	document.querySelector("#welcome").appendChild(recoStepTwoWindow);

	recoStepTwoWindow.setAttribute("id", "recoStepTwoWindow");
	recoStepTwoWindow.setAttribute("class", "option");
	recoStepTwoWindow.style.backgroundImage = `url("./img/bg.png")`
	recoStepTwoWindow.style.display = "block";

	const recoStepTwoDiv = document.createElement("div");
	recoStepTwoDiv.setAttribute("id", "recoStepTwoDiv");
	recoStepTwoDiv.setAttribute("class", "recoQuestionDiv");
	recoStepTwoWindow.appendChild(recoStepTwoDiv);

	const recoStepTwoQuestion = document.createElement("div");
	recoStepTwoQuestion.textContent = `총 여행 기간은 얼마나 되나요?`;
	recoStepTwoQuestion.setAttribute("class", "question");
	recoStepTwoDiv.appendChild(recoStepTwoQuestion);

	const recoStepTwoSelectionDiv = document.createElement("div");
	recoStepTwoSelectionDiv.setAttribute("class", "recoStepTwoSelectionDiv");
	const recoStepTwoArray = [`당일치기`, `1박2일`, `2박3일`];
	for (let i=0; i<recoStepTwoArray.length; i++){
		const recoStepTwoSelection = document.createElement("div");
		recoStepTwoSelection.setAttribute("class", "recoStepTwoSelection");
		recoStepTwoSelection.textContent = `"${recoStepTwoArray[i]}"`;
		recoStepTwoSelection.setAttribute("onclick", `sendText("${recoStepTwoArray[i]}")`);
		recoStepTwoSelectionDiv.appendChild(recoStepTwoSelection);
	}
	recoStepTwoDiv.appendChild(recoStepTwoSelectionDiv);

	const charaDiv = document.createElement("div");
	charaDiv.setAttribute("class", "charaDiv");
	recoStepTwoWindow.appendChild(charaDiv);

	const charaImage = document.createElement("img");
	charaImage.setAttribute("src", "./img/icon/ani_4.png");
	if(fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
	charaImage.setAttribute("class", "charaImage");
	charaDiv.appendChild(charaImage);

	const historyChipsDiv = document.createElement("div");
	historyChipsDiv.setAttribute("class", "historyChipsDiv");
	recoStepTwoWindow.appendChild(historyChipsDiv);

	let historyChipsArray = [data.question_one, data.question_two];
	for (let i=0; i<historyChipsArray.length; i++){
		const historyChip = document.createElement("div");
		historyChip.setAttribute("class", "historyChip");
		historyChip.textContent = historyChipsArray[i];
		historyChipsDiv.appendChild(historyChip);
	}

	clear_reco_array();
	existing_course = [];

	smallCategories = [];
	let intermediate = [];

	//1, 2번째 질문 결과에 따라 관광지 소분류 분류
	if (data.course_type == "one") { //힐링 - 알뜰
		smallCategories = [putsmalltype({ "tour": "힐링", "heal": "자연 속 힐링" }), ...putsmalltype({ "tour": "전통" })];
	} else if (data.course_type == "two") { //힐링 - 욜로
		smallCategories = putsmalltype({ "tour": "힐링" });
	} else if (data.course_type == "three") { //알뜰
		smallCategories = putsmalltype({ "tour": "전통" });
	} else if (data.course_type == "four") { //욜로
		smallCategories = [putsmalltype({ "tour": "쇼핑" }), ...putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "문화시설에서 힐링" })];
	} else if (data.course_type == "five") { //혼자
		smallCategories = [putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "자연 속 힐링" })];
	} else { //친구들, 가족, 연인
		smallCategories = [putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "문화시설에서 힐링" })];
	}

	//smallCategories로 results 거르기
	let ITEM = await tourAPI("", data);
	smallCategories.forEach(word => {
		for (let i = 0; i < ITEM.length; i++) {
			if (ITEM[i].cat3 == word) { //해당 테마
				if (!ITEM[i].mapx) {
					console.log(`${i} : 좌표 데이터 없음`);
				}
				else intermediate.push(ITEM[i]); //좌표데이터 있는 관광지만 모음
			}
		}
	})
	for (let i = 0; i < 18; i++) {
		intermediate.forEach(data => {
			if(data.sigungucode == i + 1) {
				//도시별로 배열에 넣음
				resultidreco[i].push(data);
			}
		})
	}
	console.log(ITEM);
	console.log(intermediate);
	console.log(resultidreco);
}

//코스 지도 출력
const reco_step_result_view = async (data) => {
	console.log("실행 : reco_result_view()");
	console.log(data);
	hideall();
	document.getElementById("recommended").style.display = "block";
	document.getElementById("reco_step_result").style.display = "block";
	existing_course = [];
	document.getElementById("recommended").style.backgroundImage = "";
	document.querySelector("#recommended").style.marginTop = `${barHeight.toString()}px`;

	//도시당 1개의 관광지 추출
	let distribution = [];

	let attr; // 관광지

	// 시설 갯수 지정
	if (data.question_three === "당일치기"){
		attr = 3;
	} else if (data.question_three === "1박2일"){
		attr = 6;
	} else if (data.question_three === "2박3일"){
		attr = 9;
	}

	//TODO 관광지 지역별 counting 해서 attr(개수) 보다 크면 지역 버튼 파란색 / 아니면 회색 처리

	for (let i = 0; i < 18; i++){ //모든 지역(18개)을 돌면서 랜덤으로 관광지
		let selector = random_number(0, resultidreco[i].length - 1); //min ~ max 사이의 random number
		if(resultidreco[i][selector]){ //해당 지역의 [selector] 번째 관광지가 있다면
			if(resultidreco[i].length > attr) { //해당 지역의 관광지 길이가 가려는 시설 개수보다 크다면
				distribution[i] = (resultidreco[i][selector]); //도시당 하나의 관광지 뽑음
				resultidreco[i][selector].selected = true;
				//코스 랜덤 1번으로 설정하기 위함
				//이전 거리 좌표값 기준 위함 => 수정 및 삭제 가능!!!
			}
		}
	}

	// console.log(distribution);
	// const URL = "https://actions.o2o.kr/devsvr4/sigungu/count?theme=" + data.course_type;
	//
	// let result;
	// await fetch(URL).then(response => response.json()).then(data => result = data);
	// console.log(result);
	//
	let chips = ``;
	//
	// for(var sigungucode in result) {
	// 	if (result[sigungucode] > attr) {
	// 		chips += `<div onclick="sendText('${places[sigungucode - 1]}')" id="chip${sigungucode}" class="reco_button exists">${places[sigungucode - 1]}</div>`;
	// 		existing_course.push(`${places[sigungucode - 1]}`); //코스 존재 배열에 지역이름 넣어두기
	// 	} else {
	// 		chips += `<div id="chip${sigungucode}" class="reco_button">${places[sigungucode - 1]}</div>`;
	// 	}
	// }
	//
	for (let i = 0; i < 18; i++){
		if(distribution[i]) { //지역의 관광지가 뽑혔다면 지역 버튼 파란색으로 생성
			chips += `<div onclick="sendText('${places[i]}')" id="chip${i + 1}" class="reco_button exists">${places[i]}</div>`;
			existing_course.push(`${places[i]}`); //코스 존재 배열에 지역이름 넣어두기
		} else { //아니라면 지역 버튼 삭제(display: none)
			chips += `<div id="chip${i + 1}" class="reco_button">${places[i]}</div>`;
		}
	}

	
	let quote = getQuote(data);

	let title = `${quote.question_two} 떠나는 ${quote.question_one} 코스!`;
	let hashtag = `#${quote.question_one}코스  #${quote.tag}  #${quote.question_three}`;

	document.getElementById("reco_step_result_title").innerHTML = title;
	document.getElementById("reco_step_result_hashtag").innerHTML = hashtag;
	document.getElementById("reco_step_result_map").innerHTML = chips;
}

const reco_step_locale_view = async (data, rerun = false) => {
	console.log("실행 : reco_locale_view()");
	// console.log(data);
	hideall();
	document.getElementById("recommended").style.display = "block";
	document.getElementById("reco_step_locale").style.display = "block";

	document.getElementById("blank_space").style.height = `${document.getElementById("reco_step_locale_fixed").clientHeight}px`;
	document.querySelector("#recommended").style.marginTop = `0px`;

	if(data.question_three === "당일치기"){
		document.getElementById("reco_step_locale_acco_subject").style.display = "none";
		document.getElementById("reco_step_locale_acco").style.display = "none";
	} else {
		document.getElementById("reco_step_locale_acco_subject").style.display = "block";
		document.getElementById("reco_step_locale_acco").style.display = "flex";
	}

	// 코스 제목/해시태그 지정
	let quote = getQuote(data);
	
	let title = `${quote.question_two} 떠나는 ${quote.question_one} 코스!`;
	let hashtag = `#${quote.question_one}코스  #${quote.tag}  #${quote.question_three}  #${quote.place}`;

	document.getElementById("reco_step_locale_acco_subject").innerHTML = `${quote.acco} 좋은 숙소로 추천해요!`;
	document.getElementById("reco_step_locale_course_subject").innerHTML = `${quote.tour} 여행을 떠나 볼까요?`;

	document.getElementById("reco_step_locale_title").innerHTML = title;
	document.getElementById("reco_step_locale_hashtag").innerHTML = hashtag;

	//추천코스 가져옴
	//TODO 스케줄러 fetch 해서 쓰기

	// function timeForm(date) {
	//
	// 	return leadingZeros(date.getFullYear(), 4) + '-' +
	// 		leadingZeros(date.getMonth() + 1, 2) + '-' +
	// 		leadingZeros(date.getDate(), 2) + ' ' +
	//
	// 		leadingZeros(date.getHours(), 2) + ':' +
	// 		leadingZeros(date.getMinutes(), 2) + ':' +
	// 		leadingZeros(date.getSeconds(), 2);
	// }
	//
	// function leadingZeros(n, digits) {
	// 	var zero = '';
	// 	n = n.toString();
	//
	// 	if (n.length < digits) {
	// 		for (i = 0; i < digits - n.length; i++)
	// 			zero += '0';
	// 	}
	// 	return zero + n;
	// }
	//
	// const theme = new Map([
	// 	["one", ["2", "3"]],
	// 	["two", ["1", "2"]],
	// 	["three", ["3"]],
	// 	["four", ["2", "4", "5"]],
	// 	["five", ["1", "4"]],
	// 	["six", ["2", "4"]],
	// 	["seven", ["2", "4"]],
	// 	["eight", ["2", "4"]]
	// ]);
	//
	// const periArr = ["당일치기", "1박2일", "2박3일"];
	// const partArr = ["eight", "seven", "six", "five"];
	//
	// let destination = places.indexOf(data.place) + 1; //places array 에서 해당 지역 이름 찾아 번호로 변환
	// let partner = partArr.indexOf(data.course_type) == -1 ? "" : partArr.indexOf(data.course_type) + 1; //파트너 설정이 필요없으면(one~four) blank
	// let budget = "99999999"; //임시
	// let period = periArr.indexOf(data.question_three); //여행기간(1일~3일)
	//
	// //시작 날짜
	// const start = new Date();
	// //여행 시간 (12시간, 24시간, 48시간 ...)
	// const hours = (period == 0) ? 12 : 24 * period;
	// //종료 날짜 (시작 날짜 + 여행 시간)
	// const end = start.setHours(start.getHours() + hours);
	//
	// const startTime = timeForm(start); //yyyy-MM-dd HH:mm
	// const endTime = timeForm(end);
	//
	// const params = {
	// 	'gender': "0",
	// 	'age': "0",
	// 	'transportType': "1",
	// 	'count': "0",
	// 	'startTime': startTime,
	// 	'endTime': endTime,
	// 	'destination': destination,
	// 	'theme': theme.get(data.course_type),
	// 	'partner': partner,
	// 	'budget': budget,
	// 	'days' : period + 1
	// };
	//
	// let course; //응답 결과 받을 변수
	//
	// fetch('http://143.248.57.63:8080/scheduler', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify(params)
	// })
	// .then(res => res.json())
	// .then(response => {
	// 	course = response;
	// })
	// .catch(err => {
	// 	console.log('Error:', err);
	// });

	let course = await makeCourse(data, rerun);

	resultidreco_info = course;
	reco_tmaplink = course.tmaplink; //티맵 링크
	let accommodations = "";
	let results = "";
	//array.key()는 배열의 각 인덱스를 키값으로 가지는 새로운 array iterator 반환
	//array.map()은 주어진 함수를 호출한 결과를 모아 새로운 array 반환
	//왜 Array(9) ????????????? => [1, 2, 3, ... , 9]
	let days = [...Array(9).keys()].map(word => word + 1);
	let pdata = [];

	document.getElementById("getNavigation").setAttribute("onclick", `goToPage('${course.tmaplink}')`);
	if(course.acco.length) {
		course.acco.forEach((word, i) => {
			let imgURL = word.firstimage ? replaceimage(word.firstimage) : "./img/icon/noimage.png"; //숙소 이미지 확인
			//숙소 선택 부분 (@intent RECOMMEND_COURSE_DETAIL)
			accommodations += `
			<div class="localeAcco" onclick="sendText('${i + 1}번 숙소')">
				<div class="localeAcco-img">
					<img src="${imgURL}">
				</div>
				<div class="localeAcco-disc">
					<div class="acco acconame">${word.title}</div>
					<div class="acco accocat">${word.type}</div>
					<div class="acco accoaddr">${word.addr1}</div>
				</div>
			</div>
			`;
		});
	} else {
		accommodations = `해당 코스에 맞는 숙박 시설을 찾지 못했습니다.`
	}

	for(let i = 0; i < quote.days; i++){ //여행 기간 / 2박 3일 = 3, 1박 2일 = 2, 당일치기 = 1
		if(i === 0) //수직 방향 회색 라인
			results += `<div id="reco_step_locale_course_day1" class="locale_day day1"><div class="verticalLine"></div>`;
		else if (i === 1){ //중간에 둘째날 출력
			results += `<div id="locale_day2" class="day_divider day1" onclick="openDay(2)"><div class="horizontalLine left"></div>둘째날 <span><i class="fas fa-angle-double-down"></i></span><div class="horizontalLine right"></div></div><div id="reco_step_locale_course_day2" class="locale_day day2"><div class="verticalLine"></div>`;
		} else { //셋째날 출력
			results += `<div id="locale_day3" class="day_divider day2" onclick="openDay(3)"><div class="horizontalLine left"></div>셋째날 <span><i class="fas fa-angle-double-down"></i></span><div class="horizontalLine right"></div></div><div id="reco_step_locale_course_day3" class="locale_day day3"><div class="verticalLine"></div>`;
		}
		for(let j = 0; j < 5; j++){
			let number = j + 1 + i * 5;
			let word = course.course[number - 1]; //관광지+음식점
			pdata.push({"lng" : word.mapx, "lat" : word.mapy, "parent" : "reco_locale"}); //pdata에 관광지(음식점) 정보 넣음
			results += `<div id="courselist${number}" class="course-list" onclick="sendText('${number}번')">`; //관광지(+음식점) 선택시
			if([1, 4].indexOf(j) > -1) { //j가 1 혹은 4 라면, number 가 2, 5번째 일 때(점심 저녁)
				results += `<div id="locale_circle${number}" class="locale-circle restaurant">
							<div class="result-number"> ${number} </div>
							</div>`;
				if(j === 1) {
					results += `<div class="course-name"> 점심코스 : <span>${word.type ? word.type : ""}</span></div>`; //word.type == 한식
				} else {
					results += `<div class="course-name"> 저녁코스 : <span>${word.type ? word.type : ""}</span></div>`;
				}
			} else { //그냥 관광지일 경우
				results += `<div id="locale_circle${number}" class="locale-circle">
							<div class="result-number"> ${number} </div>
							</div>
							<div class="course-name"> 관광코스 ${days.shift()} : <span>${word.type ? word.type : ""}</span></div>`;
			}
			let imgURL = word.firstimage ? replaceimage(word.firstimage) : "./img/icon/noimage.png"; //이미지가 있으면 넣어주고 아니면 noimage 출력
			results += `<div class="locale-box">
						<div class="locale-box-img"><img src="${imgURL}"/></div>
						<div class="locale-box-disc"><div class="locale-box-disc-title">${word.title}</div><div class="locale-box-disc-addr"><i class='fas fa-map-marker-alt'></i> ${word.addr1}</div></div></div></div>`;
		}
		results += `</div>`;
		// if(i === 0) results += `</div>`;
		// if(quote.days === 1) results += `</div>`;
		// if(i === 1) results += `</div>`;
		// if(quote.days === 2) results += `</div>`;
		// if(i === 2) results += `</div>`;
	}

	document.querySelectorAll(`.day2`).forEach(word => word.style.display = "none");
	console.log("day2 veiled");
	document.querySelectorAll(`.day3`).forEach(word => word.style.display = "none");
	console.log("day3 veiled");
	console.log(`코스 일정 : ${quote.days}일`);

	const count = 1;
	let index = 0;

	const infoResultList = document.getElementById("reco_step_locale_course");

	async function loadItems() {
		console.log("start with >>> " + index);

		// 화면 표시 및 얼마나 표시되었는지 플래그 숫자 올리기
		let temp = index+count > quote.days ? quote.days : index+count;
		console.log(`몇번째 날 = ${temp}`);

		document.querySelectorAll(`.day${temp}`).forEach(element => element.style.display = "block");
		console.log(`day ${temp} unveiled`);

		index += count;

		const ioOptions = {
			root: null, //document.querySelector('.container'), // .container class를 가진 엘리먼트를 root로 설정. null일 경우 브라우저 viewport
			rootMargin: '20px', // rootMargin을 '10px 10px 10px 10px'로 설정
			threshold: 0.5 // target이 root에 진입시 : 0, root에 target의 50%가 있을 때 : 0.5, root에 target의 100%가 있을 때 : 1.0
		}

		const io = new IntersectionObserver( (entries, observer) => {

			entries.forEach( async (entry) => {
				if (entry.isIntersecting) { //entry.intersectionRatio > 0

					if(!infoResultList.querySelector(".loading-spinner")){
						infoResultList.innerHTML += `<div class="loading-spinner"></div>`;

						setTimeout( async  () => {
							loadItems();
							observer.unobserve(entry.target);

							const spinner = infoResultList.querySelector(".loading-spinner");
							spinner.parentNode.removeChild(spinner);
							console.log("removed")
						}, 260);
					}
				}
			});
		}, ioOptions)

		if (quote.days > temp) {
			console.log(`현재 temp = ${temp}`);
			const infoResultLastItem = document.querySelector(`#lazy_border`);
			console.log(infoResultLastItem);
			io.observe(infoResultLastItem);
		}
	}

	loadItems();

	// console.log(results);
	document.getElementById("reco_step_locale_tmapview").innerHTML = "";
	info_result_map(pdata, "reco_step_locale_tmapview", "auto", "16%");
	document.getElementById("reco_step_locale_acco").innerHTML = accommodations;
	document.getElementById("reco_step_locale_course").innerHTML = results;
	document.getElementById("reco_step_locale_course_day1").style.display = "block";
}

// function openDay(day){
// 	document.getElementById(`reco_step_locale_course_day${day}`).style.display = "block";
// }

//TODO makeCourse 추천코스 시스템으로 변경
const makeCourse = async (data, rerun = false) => {
	// console.log("진입 : makeCourse");
	// 선택된 도시의 관광지 목록을 불러옴 
	let placeList = resultidreco[parseInt(dataplace(data.place) - 1)];
	// console.log(`placeList : ↓↓`);
	// console.log(placeList);
	
	let item;
	let course = [];
	
	let attr; // 관광지
	let rest; // 음식점

	// 시설 갯수 지정
	if (data.question_three === "당일치기"){
		attr = 3;
		rest = 2;
	} else if (data.question_three === "1박2일"){
		attr = 6;
		rest = 4;
	} else if (data.question_three === "2박3일"){
		attr = 9;
		rest = 6;
	}
	
	// 숙박업소 타입 지정
	let acco_smalltype = [];
	if(['one', 'three', 'six', 'eight'].indexOf(data.course_type) > 0) { //course_type 이 배열에 존재하지 않으면 '-1' return
		acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "모텔"})];
		if(data.course_type === "eight") {
			acco_smalltype =  [acco_smalltype, ...putsmalltype({"sleep" : "호텔"}), ...putsmalltype({"sleep" : "펜션"})];
		} else {
			acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "게스트하우스"})];
			if(data.course_type === "six") {
				acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "호텔"})];
			}
		}
	} else {
		acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "호텔"})];
		if(data.course_type === "five"){
			acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "게스트하우스"})];
		} else {
			acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "콘도"}), ...putsmalltype({"sleep" : "펜션"})];
		}
	}
	
	// 코스 1번째 관광지 지정
	if(!rerun){
		for (let i = 0; i < placeList.length; i++){
			if(placeList[i].selected) {
				item = placeList[i];
				break;
			}
		}
	} else {
		do {
			item = placeList[random_number(0, placeList.length)];
		} while(!item.mapx);
	}
	
	let requestLocation = {'lon' : item.mapx, 'lat' : item.mapy};
	
	let attr_arr = [];
	let rest_arr = [];
	let acco_arr = [];
	
	let radius = 2000;
	
	let courseResults = [];

	let ITEM;

	// console.log(`관광지 배열 초기 : ${attr_arr.length}`);
	// console.log(`음식점 배열 초기 : ${rest_arr.length}`);
	// console.log(`관광지 배열 필요값 : ${attr}`);
	// console.log(`음식점 배열 필요값 : ${rest}`);

	// 1번째 관광지 위치를 기준으로 주변검색 (초기값 2km, 부족할 시 이후 2km씩 증가)
	// for(let i = 0; attr_arr.length < attr || rest_arr.length < rest || acco_arr.length < 1; i++) {
		attr_arr = [];
		rest_arr = [];
		acco_arr = [];
		courseResults = await tourAPI("추천코스", data);

		ITEM = courseResults;

		ITEM.forEach(word => {
			typeAppend(word);
			if(smallCategories.indexOf(word.cat3) > 0) { // 관광지
				if(word.mapx) attr_arr.push(word);
			} else if (word.contenttypeid == 39) { // 음식점
				if(word.mapx) rest_arr.push(word);
			} else if (acco_smalltype.indexOf(word.cat3) > 0) { // 숙박시설
				if(word.mapx) acco_arr.push(word);
			}
		});
	// }

	// console.log(attr_arr);
	// console.log(rest_arr);
	// console.log(acco_arr);

	// console.log(`랜덤 번호 생성 : ${attr_arr.length}개 중 ${attr}개`);
	// console.log(`랜덤 번호 생성 : ${rest_arr.length}개 중 ${rest}개`);

	let attr_rand = genRandomNo(attr, attr_arr.length).map(word => word - 1);
	let rest_rand = genRandomNo(rest, rest_arr.length).map(word => word - 1);

	// console.log(`관광지 랜덤 : ${JSON.stringify(attr_rand)}`);
	// console.log(`음식점 랜덤 : ${JSON.stringify(rest_rand)}`);

	// console.log(`코스 목록 갯수 : ${attr / 3 * 5}`);

	// 1, 3, 4번째는 관광지, 2, 5번째는 음식점
	for(let i = 0; i < attr / 3 * 5; i++) {
		if([0, 2, 3].indexOf(i % 5) >= 0) {
			course[i] = attr_arr[attr_rand.shift()];
		} else {
			course[i] = rest_arr[rest_rand.shift()];
		}
	}

	let tmaplink = `https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxef0befba10d74637b27b8d7a8acdd7aa&name=${course[0].title}&lon=${course[0].mapx}&lat=${course[0].mapy}`;

	// console.log({course : course, acco : acco_arr});

	return {course : course, acco : acco_arr, tmaplink : tmaplink};
}

const reco_step_locale_map_view = (data) => {
	goToPage(reco_tmaplink);
}

//코스 내 시설 상세정보 출력
const reco_step_detail_view = (data) => {
	console.log("실행 : reco_detail_view()");
	console.log(data); // {"reco_number":2,"command":"RECO_STEP_DETAIL","previous":"RECO_STEP_LOCALE"}
	console.log(resultidreco_info);
	hideall();

	if (data.sleep === "숙소") resultidinfo = resultidreco_info.acco;
	else resultidinfo = resultidreco_info.course;

	let detail_data = {...data, "reco_detail" : true, "info_number" : data.reco_number}

	drawDetail(detail_data);
}

// function reco_result_view( data ) {
// 	console.log( "실행 : RECO_RESULT()" );
// 	// reco_result만 보이게 하기
// 	hideall();
// 	hideall_recommended();
// 	document.getElementById( "recommended" )
// 		.style.display = "block";
// 	document.getElementById( "reco_result" )
// 		.style.display = "block";
// 	document.getElementById( "recommended" )
// 		.style.backgroundImage = `url("./img/icon/result_list_background.png")`;
// 	document.getElementById( "reco_result" )
// 		.innerHTML = ``;

// 	// 쿼리 생성

// 	var xmlhttp = new XMLHttpRequest();
// 	var place;
// 	var course;

// 	// 위치, 시설 받기

// 	if(data.lon || data.lat){
// 		lon = data.lon;
// 		lat = data.lat;
// 	} else {
// 		place = dataplace(data.place);
// 	}

// 	course = datacourse(data.course);

// 	var xmladdr = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey=${servicekey}&contentTypeId=25&areaCode=32&sigunguCode=${place}&cat1=C01&cat2=${course}&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=B&numOfRows=10000&pageNo=1&_type=json`;

// 	console.log("xmladdr = " + xmladdr);
// 	console.log(data.place + " : " + place);
// 	console.log(data.course + " : " + course);

// 	xmlhttp.onreadystatechange = function () {
// 		if (this.readyState == 4 && this.status == 200) {
// 			var myObj = JSON.parse(this.responseText);
// 			console.log("json 응답 갯수 : " + myObj.response.body.totalCount + "개");
// 			// document.getElementById("reco_result-text").innerHTML = "";
// 			var imgURL;

// 			if (myObj.response.body.totalCount > 1) {
// 				for (var i = 0; i < myObj.response.body.totalCount; i++) {
// 					imgURL = myObj.response.body.items.item[i].firstimage;
// 					console.log("이미지 Url : " + imgURL);
// 					if (imgURL == undefined) {
// 						// imgURL = "https://www.actions.o2o.kr/content/apple/img/icon/noimage.png";
// 						imgURL = "./img/icon/noimage.png";
// 					} else {
// 						imgURL = imgURL.replace('http://', 'https://');
// 					}
// 					console.log("이미지 Url (변경) : " + imgURL);
// 					document.getElementById( "reco_result" )
// 						.innerHTML += `<div class="list-box" onclick ="resultnumber(${parseInt(i+1)})">
// 						<div id=reco_result-circle${i} class="result-circle"><div class="result-number">${parseInt(i + 1)}</div></div>
// 						<div class="result-img">
// 							<img src="${imgURL}">
// 							</div>
// 							<div class="result-text">
// 								<div class="result-title">
// 									[${parseInt(i + 1)}] ${myObj.response.body.items.item[i].title}
// 								</div>
// 								<div class="result-addr">◎ 조회수 :${myObj.response.body.items.item[i].readcount}
// 								</div>
// 							</div>
// 						</div>`;
// 					// document.getElementById("reco_result-text").innerHTML += "<img src=" + myObj.response.body.items.item[i].firstimage + "><br><br>" +
// 					// parseInt(i+1) + " : " + myObj.response.body.items.item[i].title + "<br><br>" +
// 					// "조회수 : " + myObj.response.body.items.item[i].readcount + "<br><br>";
// 					resultidreco[i] = myObj.response.body.items.item[i].contentid;
// 					console.log("시설 이름 : " + myObj.response.body.items.item[i].title);
// 					console.log("조회수 : " + myObj.response.body.items.item[i].readcount);
// 				}
// 			} else if ( myObj.response.body.totalCount == 1 ) {
// 				imgURL = myObj.response.body.items.item.firstimage;
// 				console.log( "이미지 Url : " + imgURL );
// 				if ( imgURL == undefined ) {
// 					// imgURL = "https://www.actions.o2o.kr/content/apple/img/icon/noimage.png";
// 					imgURL = "./img/icon/noimage.png";
// 				} else {
// 					imgURL = imgURL.replace( 'http://', 'https://' );
// 				}
// 				console.log( "이미지 Url (변경) : " + imgURL );
// 				document.getElementById( "reco_result" )
// 					.innerHTML += `<div class="list-box" onclick ="resultnumber(${parseInt(1)})"><div class="result-img">
// 						<img src="${imgURL}">
// 						</div>
// 						<div class="result-title">
// 						[1] ${myObj.response.body.items.item.title}
// 						</div>
// 						<div class="result-addr">◎ 조회수 :
// 						${myObj.response.body.items.item.readcount}
// 						</div>></div>`;
// 				// document.getElementById("reco_result-text").innerHTML += "<img src=" + myObj.response.body.items.item.firstimage + "><br><br>" +
// 				// "1" + " : " + myObj.response.body.items.item.title + "<br><br>" +
// 				// "조회수 : " + myObj.response.body.items.item.readcount + "<br><br>";
// 				resultidreco[ 0 ] = myObj.response.body.items.item.contentid;
// 				console.log( "시설 이름 : " + myObj.response.body.items.item.title );
// 				console.log( "조회수 : " + myObj.response.body.items.item[ i ].readcount );
// 			} else {
// 				document.getElementById( "reco_result" )
// 					.innerHTML += `<div class="list-box"><div class="result-img">
// 						<img src="${imgURL}">
// 						</div><div class="result-title">- 검색된 결과가 없습니다! -
// 						</div></div>`;
// 				// document.getElementById("reco_result-text").innerHTML = "검색 결과가 없습니다.";
// 				console.log( "조회수 : 	- 검색된 결과가 없습니다! -" );
// 			}
// 		}
// 	};

// 	// db.collection( "recent" )
// 	// 	.add( {
// 	// 		place: data.place,
// 	// 		course: data.course
// 	// 	} )
// 	// 	.then( function ( docRef ) {
// 	// 		console.log( "Firebase Firestore에 올라간 데이터 ID : ", docRef.id );
// 	// 	} )
// 	// 	.catch( function ( err ) {
// 	// 		console.error( "Firestore error : ", err );
// 	// 	} );

// 	// API 요청 전송
// 	xmlhttp.open("GET", xmladdr, true);
// 	xmlhttp.send();

// 	// 데이터 도착 확인
// 	console.log("reco_result_view command : " + data.command);
// 	console.log("place : " + data.place);
// 	console.log("course : " + data.course);
// }

// function reco_detail_view(data) {
// 	console.log( "실행 : RECO_DETAIL()" );
// 	//reco_detail만 보이게 하기
// 	//	hideall();
// 	//	hideall_recommended();
// 	//	document.getElementById( "recommended" )
// 	//		.style.display = "block";
// 	//	document.getElementById( "reco_detail" )
// 	//		.style.display = "block";
// 	//	document.getElementById( "recommended" )
// 	//		.style.backgroundImage = `url("./img/icon/result_list_background.png")`;
// 	document.getElementById( "reco_detail" )
// 		.style.display = "table";
// 	document.getElementById( "reco_detail" )
// 		.style.background = "transparent";
// 	document.getElementById( "reco_detail_sub" )
// 		.innerHTML = "";
// 	document.getElementById( "reco_detail" )
// 		.classList.add( "animation" );
// 	document.getElementById( "reco_detail" )
// 		.classList.remove( "out" );

// 	var number = data.course_number;
// 	var results;
// 	console.log( "입력된 번호 : " + number );
// 	console.log( "찾는 번호 : " + resultidreco[ number - 1 ] );

// 	var xyarray = new Array();
// 	var j = 0;

// 	// db.collection( "recent" )
// 	// 	.get()
// 	// 	.then( ( querySnapshot ) => {
// 	// 		querySnapshot.forEach( ( doc ) => {
// 	// 			console.log( `Firebase Data : ${doc.id} => ${doc.data()}` );
// 	// 			console.log( doc.data() );
// 	// 		} );
// 	// 	} );

// 	/**
// 	 * 코스 상세정보 목록에서 코스 경로 지도를 보여주기 위해 코스 요소들의 좌표를 저장하는 배열
// 	 */
// 	var pdata;

// 	// 코스 기본정보
// 	function ajaxrequest1() {
// 		$.ajax({
// 				url: "https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon",
// 				data: `ServiceKey=${servicekey}&contentId=${resultidreco[ number - 1 ]}&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&transGuideYN=Y&_type=json`,
// 				method: "GET",
// 				dataType: "json",
// 			})
// 			.done(function (json) {
// 				console.log("ajaxrequest1 : 성공");
// 				console.log(json);
// 				var ITEM = json.response.body.items.item;
// 				console.log("1: json 응답 갯수 : " + json.response.body.totalCount + "개");
// 				var imgURL = ITEM.firstimage;
// 				console.log("이미지 Url : " + imgURL);
// 				if (imgURL == undefined) {
// 					// imgURL = "https://www.actions.o2o.kr/content/apple/img/icon/noimage.png";
// 					imgURL = "./img/icon/noimage.png";
// 				} else {
// 					imgURL = imgURL.replace('http://', 'https://');
// 				}
// 				console.log("이미지 Url (변경) : " + imgURL);
// 				selectedcourse.mapx = ITEM.mapx;
// 				selectedcourse.mapy = ITEM.mapy;
// 				document.getElementById("reco_detail_image")
// 					.innerHTML = `<img src="${imgURL}">`;
// 				document.getElementById("reco_detail_title")
// 					.innerHTML = `${ITEM.title}`;
// 				document.getElementById("reco_detail_descript")
// 					.innerHTML = `* 개요 *</br></br>${ITEM.overview}`;
// 				// document.getElementById("reco_detail-text").innerHTML = "";
// 				// document.getElementById("reco_detail-text").innerHTML +=
// 				// `<img src = ` + ITEM.firstimage + `><br><br>` +
// 				// `개요 : ` + ITEM.overview + `<br><br>`;
// 				//tmap
// 				pdata = {
// 					course: json.response.body.items.item.title,
// 					passtitle: [""],
// 					passLng: [""],
// 					passLat: [""],
// 					passList: ""
// 				};
// 				console.log("course : " + pdata.course);
// 			})
// 			.fail(function (xhr, statur, errorThrown) {
// 				console.log("ajaxrequest1 : 실패");
// 				console.log(errorThrown);
// 			});
// 	}

// 	// 코스 개요
// 	function ajaxrequest2() {
// 		$.ajax({
// 				url: "https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailIntro",
// 				data: `ServiceKey=${servicekey}&contentId=${resultidreco[ number - 1 ]}&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&contentTypeId=25&introYN=Y&_type=json`,
// 				method: "GET",
// 				dataType: "json",
// 			})
// 			.done(function (json) {
// 				console.log("ajaxrequest2 : 성공");
// 				console.log(json);
// 				var ITEM = json.response.body.items.item;
// 				console.log("2: json 응답 갯수 : " + json.response.body.totalCount + "개");
// 				document.getElementById("reco_detail_etc")
// 					.innerHTML = "코스 총 거리 : " + ITEM.distance + "<br>" +
// 					"소요 시간 : " + ITEM.taketime + "<br>";
// 			})
// 			.fail(function (xhr, status, errorThrown) {
// 				console.log("ajaxrequest2 : 실패");
// 				console.log(errorThrown);
// 			})
// 	}

// 	// xmlhttp3.onreadystatechange = function() {
// 	//   if (this.readyState == 4 && this.status == 200) {
// 	//     var myObj = JSON.parse(this.responseText);
// 	//     results = myObj.response.body.totalCount;
// 	//     console.log("3: json 응답 갯수 : " + myObj.response.body.totalCount + "개");
// 	//     /**
// 	//      * 코스 상세정보 목록에서 코스 경로 지도를 보여주기 위해 코스 요소들의 좌표를 저장하는 배열
// 	//      */
// 	//     var resultxy = [
// 	//       [128.8850778068, 37.7865588677],
// 	//       [128.9170802756, 37.7931115115],
// 	//       [128.9092532394, 37.7919364948],
// 	//       [128.8965126086, 37.7955691591],
// 	//       [128.8985803831, 37.7537518153]
// 	//     ];
// 	//     for (var i = 0; i < myObj.response.body.items.item.length - 1; i++) {
// 	//       resultidreco_info[i] = myObj.response.body.items.item[i].subcontentid;
// 	//       // document.getElementById("reco_detail-text").innerHTML +=
// 	//       // "<img src=\"" + myObj.response.body.items.item[i].subdetailimg + "\"/>" +
// 	//       // "<br><br>" + parseInt(i+1) + ". " + myObj.response.body.items.item[i].subname +
// 	//       // "<br><br>개요 : <br>" + myObj.response.body.items.item[i].subdetailoverview + "<br><br>";
// 	//       console.log("resultyxy.length = " + resultxy.length);
// 	//       console.log("resultxy = " + resultxy[i][0] + "resultxy = " + resultxy[i][1]);
// 	//       pdata.passLng[i] = resultxy[i][0];
// 	//       pdata.passLat[i] = resultxy[i][1];
// 	//       pdata.passtitle[i] = myObj.response.body.items.item[i].subname;
// 	//       if (i > 0 && i < myObj.response.body.items.item.length - 1 - 1) {
// 	//         if (i == myObj.response.body.items.item.length - 2 - 1) {
// 	//           pdata.passList += resultxy[i][0] + "," + resultxy[i][1];
// 	//         } else {
// 	//           pdata.passList += resultxy[i][0] + "," + resultxy[i][1] + "_";
// 	//         }
// 	//       }

// 	//     }
// 	//   }
// 	// }

// 	//코스 상세정보
// 	function ajaxrequest3() {
// 		return new Promise(function (resolve, reject) {
// 				$.ajax({
// 					url: "https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailInfo", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
// 					data: `ServiceKey=${servicekey}&contentId=${resultidreco[ number - 1 ]}&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&contentTypeId=25&listYN=Y&_type=json`, // HTTP 요청과 함께 서버로 보낼 데이터
// 					method: "GET", // HTTP 요청 메소드(GET, POST 등)
// 					dataType: "json", // 서버에서 보내줄 데이터의 타입
// 					success: function (json) {
// 						if (json) {
// 							resolve(json);
// 						}
// 						reject(new Error("ajaxrequest3 : 실패"));
// 					}
// 				})
// 			})
// 			.catch(function (err) {
// 				console.error(err);
// 			})
// 	}

// 	function xmlforroute(subcontentid, number) {
// 		return new Promise(function (resolve, reject) {
// 				var xyobject;
// 				$.ajax({
// 						url: "https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon",
// 						data: `MobileOS=ETC&MobileApp=TourAPI3.0_Guide&mapinfoYN=Y&ServiceKey=${servicekey}&contentId=${subcontentid}&defaultYN=Y&_type=json`,
// 						method: "GET",
// 						dataType: "json"
// 					})
// 					.done(function (json) {
// 						console.log("xmlforroute " + number + " : 성공");
// 						resolve(json);
// 					})
// 					.fail(function (xhr, status, errorThrown) {
// 						console.log("xmlforroute " + number + " : 실패");
// 						console.log(errorThrown);
// 					})
// 			})
// 			.then(function (json) {
// 				var itemobject = json.response.body.items.item;

// 				xyobject = {
// 					"mapx": itemobject.mapx,
// 					"mapy": itemobject.mapy,
// 					"title": itemobject.title
// 				};
// 				xyarray[number] = xyobject;
// 				console.log(json);
// 				console.log("xmlforroute " + number + " 결과값 : ");
// 				console.log(xyobject);

// 				j++;
// 				console.log("성공 횟수 : " + j);
// 				console.log(xyarray);
// 				return xyobject;
// 			})
// 			.catch(function (err) {
// 				console.log("Promise.then 에러 : " + err);
// 			})
// 	}

// 	async function asyncArray() {
// 		var json = await ajaxrequest3();
// 		var ITEM = json.response.body.items.item;
// 		var idarray = new Array();
// 		var x_y_object = new Array();
// 		var x_y_array = new Array();
// 		console.log("3: json 응답 갯수 : " + json.response.body.totalCount + "개");
// 		for (var i = 0; i < ITEM.length; i++) {
// 			idarray[i] = ITEM[i].subcontentid;
// 			resultidreco_info[i] = ITEM[i].subcontentid;
// 			console.log("idarray : ↓↓")
// 			console.log(idarray);
// 			var imgURL = ITEM[i].firstimage;
// 			var imgURL2 = ITEM[i].subdetailimg;

// 			console.log("이미지 Url : " + imgURL);
// 			if (imgURL == undefined) {
// 				// imgURL = "https://www.actions.o2o.kr/content/apple/img/icon/noimage.png";
// 				imgURL = "./img/icon/noimage.png";
// 			} else {
// 				imgURL = imgURL.replace('http://', 'https://');
// 			}
// 			console.log("이미지 Url (변경) : " + imgURL);
// 			if (imgURL2 == undefined) {
// 				// imgURL2 = "https://www.actions.o2o.kr/content/apple/img/icon/noimage.png";
// 				imgURL2 = "./img/icon/noimage.png";
// 			} else {
// 				imgURL2 = imgURL2.replace('http://', 'https://');
// 			}
// 			console.log("이미지 Url2 (변경) : " + imgURL2);
// 			document.getElementById("reco_detail_sub")
// 				.innerHTML += `<div class=detail-subtitle-course>[${parseInt(i + 1)}] ${ITEM[i].subname}</div><div class=detail-img-course><img src=${imgURL2}></div><div class=detail-descript-course>${ITEM[i].subdetailoverview}<br></div>`;
// 		}
// 		for (var i = 0; i < idarray.length; i++) {
// 			try {
// 				x_y_object[i] = await xmlforroute(idarray[i], i);
// 			} catch (err) {
// 				console.error("for문 에러 : " + err);
// 			}
// 			console.log(x_y_object);
// 		}
// 		console.log("for문 끝 " + x_y_object[0]);
// 		console.log(x_y_object[0]);
// 		var appender = 0;
// 		for (var adder = 0; adder < x_y_object.length; adder++) {
// 			console.log("for문 진입 : " + adder);
// 			console.log(x_y_object[adder]);
// 			if (x_y_object[adder] == undefined) {
// 				console.log("undefined 감지 : " + adder);
// 			} else {
// 				x_y_array[appender] = x_y_object[adder];
// 				appender++;
// 				console.log("실행 횟수 : " + appender);
// 			}
// 		}

// 		console.log("실행 완료 결과 : ");
// 		console.log(x_y_array);
// 		console.log(pdata);
// 		var limtlength = x_y_array.length;
// 		if (x_y_array.length > 7) {
// 			limtlength = 6;
// 			pdata.passLng[6] = x_y_array[x_y_array.length - 1].mapx;
// 			pdata.passLat[6] = x_y_array[x_y_array.length - 1].mapy;
// 			pdata.passtitle[6] = x_y_array[x_y_array.length - 1].title;
// 		}
// 		console.log("limtlength : " + limtlength);
// 		console.log("------x_y_array 예외처리------");
// 		console.log(pdata);

// 		console.log("limtlength : " + limtlength);
// 		for (var mapadder = 0; mapadder < limtlength; mapadder++) {
// 			console.log("지도 출력 for문 돌입 : ");
// 			console.log(x_y_array[mapadder]);
// 			pdata.passLng[mapadder] = x_y_array[mapadder].mapx;
// 			pdata.passLat[mapadder] = x_y_array[mapadder].mapy;
// 			pdata.passtitle[mapadder] = x_y_array[mapadder].title;

// 			if (mapadder > 0) {
// 				if (x_y_array.length > 7) {
// 					if (mapadder == limtlength - 1) {
// 						pdata.passList += x_y_array[mapadder].mapx + "," + x_y_array[mapadder].mapy;
// 					} else {
// 						pdata.passList += x_y_array[mapadder].mapx + "," + x_y_array[mapadder].mapy + "_";
// 					}
// 				} else {
// 					if (mapadder < limtlength - 1) {
// 						if (mapadder == limtlength - 2) {
// 							pdata.passList += x_y_array[mapadder].mapx + "," + x_y_array[mapadder].mapy;
// 						} else {
// 							pdata.passList += x_y_array[mapadder].mapx + "," + x_y_array[mapadder].mapy + "_";
// 						}
// 					}
// 				}
// 			}
// 			console.log("지도 출력 for문 " + mapadder + "회차 : ");
// 			console.log(pdata);
// 		}
// 		for (var i = 0; i < pdata.passtitle.length; i++) {
// 			console.log("passtitle : " + pdata.passtitle[i]);
// 			console.log("passLng: " + pdata.passLng[i]);
// 			console.log("passLat: " + pdata.passLat[i]);
// 		}
// 		console.log("passList: " + pdata.passList);
// 		document.getElementById("reco_detail_tmapview")
// 			.innerHTML = "";
// //		var sampledata = {
// //			course: "",
// //			passtitle: [""],
// //			passLng: [""],
// //			passLat: [""],
// //			passList: ""
// //		};
// 		// sampledata.course = "고성의 독특한 전통문화를 즐기다";
// 		// sampledata.passList = "128.5583925050,38.2644664608_128.5534730594,38.2787869192_128.5480926686,38.2891606056_128.5179112859,38.3145681678_128.4999565594,38.3402870425";
// 		// sampledata.passLng = [128.4693434396, 128.5583925050, 128.5534730594, 128.5480926686, 128.5179112859, 128.4999565594, 128.5173717748];
// 		// sampledata.passLat = [38.2269885423, 38.2644664608, 38.2787869192, 38.2891606056, 38.3145681678, 38.3402870425, 38.3359906599];
// 		// sampledata.passtitle = ["화암사(고성)", "청간정", "아야진해변", "천학정/문암포구", "고성 어명기 고택", "고성 왕곡마을", "송지호관망타워"];
// 		place_map(pdata, "reco_detail_tmapview");
// 		console.log( "마커 목록 : ↓↓" );
// 		console.log( markers );
// 		// place_map( sampledata, "reco_detail_tmapview" );
// 		var tmaplink = "https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxef0befba10d74637b27b8d7a8acdd7aa&name=" + pdata.passtitle[0] + "&lon=" + pdata.passLng[0] + "&lat=" + pdata.passLat[0];
// 		directlink(tmaplink);
// 	};

// 	//API 요청 전송
// 	ajaxrequest1();
// 	ajaxrequest2();
// 	asyncArray();

// 	console.log("info_detail_view command : " + data.command);

// 	// 데이터 도착 확인
// }

// function reco_detail_info_view( data ) {
// 	console.log( "실행 : RECO_DETAIL_INFO()" );
// 	// reco_detail_info만 보이게 하기
// 	hideall();
// 	hideall_recommended();
// 	document.getElementById( "recommended" )
// 		.style.display = "block";
// 	document.getElementById( "reco_detail_info" )
// 		.style.display = "block";
// 	document.getElementById( "recommended" )
// 		.style.backgroundImage = `url("./img/icon/result_list_background.png")`;

// 	var number = data.reco_number;
// 	var tmaplink = "";

// 	console.log( "입력된 번호 : " + number );
// 	console.log( "찾는 번호 : " + resultidreco_info[ number - 1 ] );

// 	// 쿼리 생성
// 	var xmlhttp = new XMLHttpRequest();
// 	var xmlhttp2 = new XMLHttpRequest();
// 	var xmladdr = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=${servicekey}&contentId=${resultidreco_info[ number - 1 ]}&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&transGuideYN=Y&_type=json`;
// 	var xmladdr2 = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailIntro?ServiceKey=${servicekey}&contentId=${resultidreco_info[ number - 1 ]}&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&introYN=Y&contentTypeId=12&_type=json`;

// 	console.log( "API 요청 주소 1 : " + xmladdr + "\nAPI 요청 주소 2 : " + xmladdr2 );
// 	externalxml = `${xmladdr}`;
// 	console.log( "button query : " + externalxml );

// 	xmlhttp.onreadystatechange = function () {
// 		if ( this.readyState == 4 && this.status == 200 ) {
// 			var myObj = JSON.parse( this.responseText );
// 			tempjson = myObj;
// 			console.log( "1: json 응답 갯수 : " + myObj.response.body.totalCount + "개" );
// 			//tmap
// 			var pdata = {
// 				Name: myObj.response.body.items.item.title,
// 				Level: myObj.response.body.items.item.mlevel,
// 				Lng: myObj.response.body.items.item.mapx,
// 				Lat: myObj.response.body.items.item.mapy
// 			};
// 			console.log( "Name : " + pdata.Name );
// 			console.log( "Level : " + pdata.Level );
// 			console.log( "Lng : " + pdata.Lng );
// 			console.log( "Lat : " + pdata.Lat );
// 			document.getElementById( "reco_detail_info_tmapview" )
// 				.innerHTML = "";
// 			info_map( pdata, "reco_detail_info_tmapview" )
// 			var imgURL = myObj.response.body.items.item.firstimage;
// 			console.log( "이미지 Url : " + imgURL );
// 			if ( imgURL == undefined ) {
// 				// imgURL = "https://www.actions.o2o.kr/content/apple/img/icon/noimage.png";
// 				imgURL = "./img/icon/noimage.png";
// 			} else {
// 				imgURL = imgURL.replace( 'http://', 'https://' );
// 			}
// 			console.log( "이미지 Url (변경) : " + imgURL );

// 			document.getElementById( "reco_detail_info_image" )
// 				.innerHTML = `<img src="${imgURL}">`;
// 			document.getElementById( "reco_detail_info_title" )
// 				.innerHTML = `${myObj.response.body.items.item.title}`;
// 			document.getElementById( "reco_detail_info_etc" )
// 				.innerHTML = `- 주소 : ${myObj.response.body.items.item.addr1}</br>- 전화번호 : ${myObj.response.body.items.item.tel}</br>`;
// 			document.getElementById( "reco_detail_info_descript" )
// 				.innerHTML = `* 개요 *</br></br>${myObj.response.body.items.item.overview}`;
// 			document.getElementById( "reco_detail_info_tmapbtn" )
// 				.innerHTML = `<img src="./img/detail_tmap.png">`;
// 			document.getElementById( "reco_detail_info_tmapbtn" )
// 				.href = `https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxef0befba10d74637b27b8d7a8acdd7aa&name=${pdata.Name}&lon=${pdata.Lng}&lat=${pdata.Lat}`;
// 		}
// 	};
// 	xmlhttp2.onreadystatechange = function () {
// 		if ( this.readyState == 4 && this.status == 200 ) {
// 			var myObj = JSON.parse( this.responseText );
// 			tempjson2 = myObj;
// 			console.log( "2: json 응답 갯수 : " + myObj.response.body.totalCount + "개" );
// 			// document.getElementById("reco_detail_info-text").innerHTML +=
// 			// "유모차 대여여부 : " + myObj.response.body.items.item.chkbabycarriage + "<br><br>" +
// 			// "신용카드 가능여부 : " + myObj.response.body.items.item.chkcreditcard + "<br><br>" +
// 			// "애완동물 동반 가능여부 : " + myObj.response.body.items.item.chkpet + "<br><br>" +
// 			// "문의 및 안내 : " + myObj.response.body.items.item.infocenter + "<br><br>" +
// 			// "이용시간 : " + myObj.response.body.items.item.usetime + "<br><br>" +
// 			// "주차시설 : " + myObj.response.body.items.item.parking + "<br><br>";
// 			var etcitem = myObj.response.body.items.item;
// 			if ( etcitem.parkingfood != undefined ) {
// 				document.getElementById( "reco_detail_info_etc" )
// 					.innerHTML += `
// 				주차정보: ${
// 					myObj.response.body.items.item.parkingfood
// 				} <br>`;
// 			}
// 			if ( etcitem.restdatefood != undefined ) {
// 				document.getElementById( "reco_detail_info_etc" )
// 					.innerHTML += `
// 				휴무일: ${
// 					myObj.response.body.items.item.restdatefood
// 				} <br>`;
// 			}
// 			if ( etcitem.treatmenu != undefined ) {
// 				document.getElementById( "reco_detail_info_etc" )
// 					.innerHTML += `
// 				식당메뉴: ${
// 					myObj.response.body.items.item.treatmenu
// 				} <br>`;
// 			}
// 		}
// 	};

// 	// API 요청 전송
// 	xmlhttp.open( "GET", xmladdr, true );
// 	xmlhttp.send();
// 	xmlhttp2.open( "GET", xmladdr2, true );
// 	xmlhttp2.send();

// 	// 데이터 도착 확인
// 	console.log( "reco_detail_info command : " + data.command );
// }

// function reco_detail_data_view( data ) {
// 	document.getElementById( "reco_detail_info-text" )
// 		.innerHTML = data.url;
// 	console.log( data.url );
// }
