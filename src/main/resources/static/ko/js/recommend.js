/**
 * 검색 결과 목록에서 해당 항목으로 넘어가기 위한 id를 저장하는 배열
 */
let resultidreco = [];

function clear_reco_array() {
	for (let i = 0; i < 18; i++){
		resultidreco[i] = [];
	}
}

/**
 * 코스 상세정보 목록에서 해당 관광지 항목으로 넘어가기 위한 id를 저장하는 배열
 */
let resultidreco_info;

/** 
 * 코스 상세정보 목록에서 코스 타입에 따라 관광지 등 시설을 분류하기 위한 소분류 목록을 저장하는 배열
 */
let smallCategories = [];

/**
 * reco_detail_info에서 코스 시작위치로 가는 Tmap 버튼을 생성하기 위한 선택된 코스의 시작좌표를 저장하는 변수<br>
 * 현재 사용 안함

var selectedcourse = {
	"mapx": "0",
	"mapy": "0"
}; */

let existing_course, reco_tmaplink;

const placesSi = ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'];


/**
 * "recommended" class에 해당하는 모든 div 숨기기
 */
function hideall_recommended() {
	const recommendClasses = document.getElementsByClassName("recommended");
	for (let i = 0; i < recommendClasses.length; i++) {
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

		let resultStr = "";
		var distance = 0;
		var idx = 1;
		let newData = [];
		let equalData = [];
		let pointId1 = "-1234567";
		let ar_line = [];
		let pointArray = [];
		let new_polyLine = [];

		for (let i = 0; i < data.features.length; i++) {
			const feature = data.features[i];
			//배열에 경로 좌표 저장
			if (feature.geometry.type == "LineString") {
				ar_line = [];
				for (let j=0; j < feature.geometry.coordinates.length; j++) {
					const startPt = new Tmapv2.LatLng(feature.geometry.coordinates[j][1], feature.geometry.coordinates[j][0]);
					ar_line.push(startPt);
					pointArray.push(feature.geometry.coordinates[j]);
				}
				const polyline = new Tmapv2.Polyline({
					path: ar_line,
					strokeColor: "#ff0000",
					strokeWeight: 6,
					map: place_map
				});
				new_polyLine.push(polyline);
			}
			const pointId2 = feature.properties.viaPointId;
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
		let imgURL;
		let markerLayer;
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
	for (let i = 1; i < pdata.passLng.length - 1; i++) {
		console.log("경유지 forloop passLng[" + i + "] : " + pdata.passLng[i] + " passLat[" + i + "] : " + pdata.passLat[i]);
		addMarker("llPass", pdata.passLng[i], pdata.passLat[i], i);
	}
	console.log("forloop 경유지 addMarker End!")
	// 4. 경유지 최적화 API 사용요청
	const startX = pdata.passLng[0];
	const startY = pdata.passLat[0];
	const endX = pdata.passLng[pdata.passLng.length - 1];
	const endY = pdata.passLat[pdata.passLat.length - 1];
	const passList = pdata.passList;
	let prtcl;
	let headers = {};
	let geoData;

	console.log("startX = " + startX + ", startY = " + startY);
	console.log("endX = " + endX + ",endY = " + endY);
	console.log("passList = " + passList);
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
			const newData = geoData[0];
			const PTbounds = new Tmapv2.LatLngBounds();
			for (let i = 0; i < newData.length; i++) {
				const mData = newData[i];
				const type = mData.geometry.type;
				const pointType = mData.properties.pointType;
				if (type == "Point") {
					const linePt = new Tmapv2.LatLng(mData.geometry.coordinates[1], mData.geometry.coordinates[0]);
					console.log(linePt);
					PTbounds.extend(linePt);
				} else {
					let startPt, endPt;
					for (let j = 0; j < mData.geometry.coordinates.length; j++) {
						const linePt = new Tmapv2.LatLng(mData.geometry.coordinates[j][1], mData.geometry.coordinates[j][0]);
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
 */
const recommend_view_legacy = (data) => {
	console.log("실행 : recommend_view()");
	hideall();
	existing_course = [];
	document.getElementById("recommended").style.backgroundImage = `url("./img/background.png")`;
	document.querySelector("#recommended").style.marginTop = `${barHeight.toString()}px`;

	if (data.fallback)
		document.getElementById("reco_image").setAttribute("src", "./img/course1fallback.png");
	else
		document.getElementById("reco_image").setAttribute("src", "./img/course1.png");

	document.getElementById("recommended").style.display = "block";
	document.getElementById("reco").style.display = "block";
}

function recommend_view(data){
	console.log("실행 : recommend_view()");

	hideall();
	document.querySelector("#welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.querySelector("#welcome").style.backgroundImage = `url("./img/background.png")`;
	if(document.querySelector("#recoWindow")) {
		let window = document.querySelector("#recoWindow");
		document.querySelector("#welcome").removeChild(window);
	}

	const recoWindow = document.createElement("div");
	recoWindow.setAttribute("id", "recoWindow");
	recoWindow.setAttribute("class", "option");
	recoWindow.style.backgroundImage = `url("./img/bg.png")`
	recoWindow.style.display = "block";
	document.querySelector("#welcome").appendChild(recoWindow);

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
	if(data.fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
	charaImage.setAttribute("class", "charaImage");
	charaDiv.appendChild(charaImage);
}

/**
 * 추천코스 질문 2번째
 */
const reco_step_one_view_legacy = (data) => {
	console.log("실행 : reco_step_one_view()");
	hideall();
	existing_course = [];
	document.getElementById("recommended").style.backgroundImage = `url("./img/background.png")`;
	document.querySelector("#recommended").style.marginTop = `${barHeight.toString()}px`;

	document.getElementById("recommended").style.display = "block";
	if (data.question_one === "힐링") {
		document.getElementById("reco_step_one_type1").style.display = "block";
		document.getElementById("reco_step_one_type1_image").setAttribute("src", "./img/course2-1.png");
		if (data.fallback) document.getElementById("reco_step_one_type1_image").setAttribute("src", "./img/course2-1fallback.png");

	} else if (data.question_one === "문화여행") {
		document.getElementById("reco_step_one_type1").style.display = "block";
		document.getElementById("reco_step_one_type1_image").setAttribute("src", "./img/course2-2.png");
		if (data.fallback) document.getElementById("reco_step_one_type1_image").setAttribute("src", "./img/course2-2fallback.png");

	} else if (data.question_one === "레저/스포츠") {
		document.getElementById("reco_step_one_type2").style.display = "block";
		document.getElementById("reco_step_one_type2_image").setAttribute("src", "./img/course2-3.png");
		if (data.fallback)  document.getElementById("reco_step_one_type2_image").setAttribute("src", "./img/course2-3fallback.png");
	}
}

/**
 * 추천코스 질문 2번째
 */
function reco_step_one_view(data){
	console.log("실행 : recommend_view()");

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

	let recoStepOneImage, recoStepOneClass;

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
	if(data.fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
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
 */
const reco_step_two_view_legacy = async (data) => {
	console.log("실행 : reco_step_two_view()");
	hideall();
	clear_reco_array();
	existing_course = [];
	document.getElementById("recommended").style.backgroundImage = `url("./img/background.png")`;
	document.querySelector("#recommended").style.marginTop = `${barHeight.toString()}px`;

	document.getElementById("recommended").style.display = "block";
	document.getElementById("reco_step_two").style.display = "block";
	document.getElementById("reco_step_two_image").setAttribute("src", `./img/course3-${data.course_type}.png`);
	if (data.fallback)
		document.getElementById("reco_step_two_image").setAttribute("src", `./img/course3-${data.course_type}fallback.png`);

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
				if (!ITEM[i].mapx)
					console.log(`${i} : 좌표 데이터 없음`);
				else intermediate.push(ITEM[i]);
			}
		}
	})
	for (let i = 0; i < 18; i++) {
		intermediate.forEach(data => {
			if(data.sigungucode == i + 1)  resultidreco[i].push(data); //도시별로 배열에 넣음
		})
	}
	console.log(ITEM);
	console.log(intermediate);
	console.log(resultidreco);
}

/**
 * 추천코스 질문 3번째
 * 여행기간 선택 : 당일치기, 1박2일, 2박3일
 */
async function reco_step_two_view(data){ console.log("실행 : recommend_view()");
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
	if(data.fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
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
	//TODO makeCourse 함수(기존 추천코스 로직) 쓰지 않고 새로운 로직으로 변경시 여기서부터 677번째 줄 까지 필요 없음
	// existing_course = [], smallCategories = [], let intermediate = [];
	//
	// //1, 2번째 질문 결과에 따라 관광지 소분류 분류
	// if (data.course_type == "one") { //힐링 - 알뜰
	// 	smallCategories = [putsmalltype({ "tour": "힐링", "heal": "자연 속 힐링" }), ...putsmalltype({ "tour": "전통" })];
	// } else if (data.course_type == "two") { //힐링 - 욜로
	// 	smallCategories = putsmalltype({ "tour": "힐링" });
	// } else if (data.course_type == "three") { //알뜰
	// 	smallCategories = putsmalltype({ "tour": "전통" });
	// } else if (data.course_type == "four") { //욜로
	// 	smallCategories = [putsmalltype({ "tour": "쇼핑" }), ...putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "문화시설에서 힐링" })];
	// } else if (data.course_type == "five") { //혼자
	// 	smallCategories = [putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "자연 속 힐링" })];
	// } else { //친구들, 가족, 연인
	// 	smallCategories = [putsmalltype({ "tour": "액티비티" }), ...putsmalltype({ "tour": "힐링", "heal": "문화시설에서 힐링" })];
	// }
	/**smallCategories로 results 거르기
	let ITEM = await tourAPI("", data);
	smallCategories.forEach(word => {
		for (let i = 0; i < ITEM.length; i++) {
			if (ITEM[i].cat3 == word) { //해당 테마
				if (!ITEM[i].mapx) {
					console.log(`${i} : 좌표 데이터 없음`);
				} else intermediate.push(ITEM[i]); //좌표데이터 있는 관광지만 모음
			}
		}
	})
	for (let i = 0; i < 18; i++)
		intermediate.forEach(data => ㅑf(data.sigungucode == i + 1) resultidreco[i].push(data) ); //도시별로 배열에 넣음
	console.log(ITEM); //3276
	console.log(intermediate); //807
	console.log(resultidreco); //27
	 */
}

/**
 * 지역 선택
 * 지역별 관광지 count API by 테마
 */
const reco_step_result_view = async (data) => {
	console.log("실행 : reco_result_view()");
	hideall();
	const reco = document.getElementById("recommended").style;
	reco.display = "block";
	document.getElementById("reco_step_result").style.display = "block";
	existing_course = [];
	reco.backgroundImage = "";
	reco.marginTop = `${barHeight.toString()}px`;

	let distribution = []; //도시당 1개의 관광지 추출

	let attr, restCnt; // 추천 관광지 수
	if (data.question_three === "당일치기") {
		attr = 3;
		restCnt = 0;
	} else if (data.question_three === "1박2일") {
		attr = 6;
		restCnt = 1;
	} else if (data.question_three === "2박3일") {
		attr = 9;
		restCnt = 1 //숙소는 하나만 추천
	}


	//TODO 지역별 추천코스 ...
	// const URL = "https://actions.o2o.kr/devsvr9/sigungu/count?theme=" + data.course_type;
	const URL = "https://actions.o2o.kr/devsvr9/stayAndFoodCnt?theme=" + data.course_type;
	let result = await fetch(URL).then(response => response.json());
	console.log("지역별 추천코스 >>> " + JSON.stringify(result) );

	let chips = ``;
	for(let i=0; i<result.length; i++) {
	// for(let attrsAndRests in result) {
		let attrsAndRests = result[i];
		if (attrsAndRests[1] > attr && attrsAndRests[2]>=restCnt) { //필요한 추천개수보다 많으면 파란색 ..
			chips += `<div onclick="sendText('${places[i]}')" id="chip${attrsAndRests[0]}" class="reco_button exists">${places[i]}</div>`;
			existing_course.push(`${places[i]}`); //코스 존재 배열에 지역이름 넣어두기
		} else {
			chips += `<div id="chip${attrsAndRests[0]}" class=" reco_button">${places[i]}</div>`;
		}
	}

	// for(let sigungucode in result) {
	// 	if (result[sigungucode] > attr) { //필요한 추천개수보다 많으면 파란색 ..
	// 		chips += `<div onclick="sendText('${places[sigungucode - 1]}')" id="chip${sigungucode}" class="reco_button exists">${places[sigungucode - 1]}</div>`;
	// 		existing_course.push(`${places[sigungucode - 1]}`); //코스 존재 배열에 지역이름 넣어두기
	// 	} else {
	// 		chips += `<div id="chip${sigungucode}" class=" reco_button">${places[sigungucode - 1]}</div>`;
	// 	}
	// }

	//TODO 주석 처리 해야함(736~744)
	// let chips = ``;
	// for (let i = 0; i < 18; i++){
	// 	if(distribution[i]) { //지역의 관광지가 뽑혔다면 지역 버튼 파란색으로 생성
	// 		chips += `<div onclick="sendText('${places[i]}')" id="chip${i + 1}" class="reco_button exists">${places[i]}</div>`;
	// 		existing_course.push(`${places[i]}`); //코스 존재 배열에 지역이름 넣어두기
	// 	} else { //아니라면 지역 버튼 삭제(display: none)
	// 		chips += `<div id="chip${i + 1}" class="reco_button">${places[i]}</div>`;
	// 	}
	// }

	let quote = getQuote(data);
	let title = `${quote.question_two} 떠나는 ${quote.question_one} 코스!`;
	let hashtag = `#${quote.question_one}코스  #${quote.tag}  #${quote.question_three}`;

	document.getElementById("reco_step_result_title").innerHTML = title;
	document.getElementById("reco_step_result_hashtag").innerHTML = hashtag;
	document.getElementById("reco_step_result_map").innerHTML = chips;
}

/**
 * 지역별 숙소 랜덤 선택 후 숙소기준으로
 * scheduler 호출 , 코스 생성
 */
const reco_step_locale_view = async (data, rerun = false) => {
	console.log("실행 : reco_locale_view()");
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

	let quote = getQuote(data); // 코스 제목/해시태그 지정
	let title = `${quote.question_two} 떠나는 ${quote.question_one} 코스!`;
	let hashtag = `#${quote.question_one}코스  #${quote.tag}  #${quote.question_three}  #${quote.place}`;

	document.getElementById("reco_step_locale_title").innerHTML = title;
	document.getElementById("reco_step_locale_hashtag").innerHTML = hashtag;
	const sigungu = parseInt(placesSi.indexOf(data.place))+ 1;
	console.log("sigungu >> "+sigungu)

	//response 1 :: 숙소리스트
	// let URL = "https://actions.o2o.kr/devsvr9/sigungu/accommodation?sigungucode=" + sigungu
	// 		+ "&theme=" + data.course_type;
	// const accoList = await fetch(URL).then(response => response.json()); //.then(data => accoList = data);
	// console.log("accoList >>> "+accoList); //숙소리스트

	let accomContents = "";
	if(data.accomData) {
		document.getElementById("reco_step_locale_acco_subject").innerHTML = `${quote.acco} 좋은 숙소로 추천해요!`;

		const accoObj = data.accomData; console.log("accoObj >> "+ JSON.stringify(accoObj));
		resultidinfo = [accoObj];
		resultidinfo[0].selected = true;
		let imgURL = accoObj.firstimage ? replaceimage(accoObj.firstimage) : "./img/icon/noimage.png";
		accomContents = `<div class="localeAcco" onclick="sendText('숙소보여줘')"> 
						<!-- <div class="localeAcco-img"></div>-->
							<img src="${imgURL}">
						<div class="localeAcco-disc">
							<div class="acco acconame">${accoObj.title}</div>
							<div class="acco accocat">${accoObj.category}</div>
							<div class="acco accoaddr">${accoObj.addr1}</div>
						</div>
					</div>`; //TODO onclick id 전송으로 변경 //sendText('${i + 1}번 숙소')
	} else {
		accomContents = '해당 코스에 맞는 숙박 시설을 찾지 못했습니다.';
	}
	document.getElementById("reco_step_locale_acco").innerHTML = accomContents;

    /** TODO 음식점 호출
	URL = "https://actions.o2o.kr/devsvr9/sigungu/accommodation?sigungucode=" + sigungu + "&theme=음식점";
	const foodPlaceList = await fetch(URL).then(response => response.json());

	let rest; // 추천 음식점 수 :: 여행일수에 따라 관광지, 음식점 추천수 varied
	if (data.question_three === "당일치기"){
		rest = 2; //attr = 3;
	} else if (data.question_three === "1박2일"){
		rest = 4; //attr = 6;
	} else if (data.question_three === "2박3일"){
		rest = 6; //attr = 9;
	}
	let stayOption = [];
	let restObj = {}
	if(foodPlaceList.length) {
		const numArr = genRandomNo(rest, foodPlaceList.length);
		for(let i=0; i<numArr.length; i++) {
			restObj = foodPlaceList[numArr[i]];
			if(i%2==0){
				restObj.startTime = "12:00";
				restObj.endTime = "13:00";
			}else{
				restObj.startTime = "18:00";
				restObj.endTime = "19:00";
			}
			console.log("추천 음식점 : "+ numArr[i] + " >> "+JSON.stringify(restObj))
			stayOption.push(restObj);
		}
		console.log("추천 음식점All : >> "+JSON.stringify(stayOption))
	} */

	/** TODO 스케줄러 호출 body 구성
	const schedulerEndpoint = "http://172.30.1.65:8070";
	let startDateTime ;
	const today = new Date();
	let startDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); //YYYY-MM-DD
	let endDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+(quote.days-1); //YYYY-MM-DD
	const theme = [];
	if(data.course_type =="one"){
		theme.push("1");
		theme.push("3");
	}else if(data.course_type =="two"){
		theme.push("1");
		theme.push("2");
	}else if(data.course_type =="three"){
		theme.push("3");
	}else if(data.course_type =="four"){
		theme.push("2");
		theme.push("4");
		theme.push("5");
	}else if(data.course_type =="five"){
		theme.push("1");
		theme.push("4");
	}else if(data.course_type =="six"){
		theme.push("2");
		theme.push("4");
	}else if(data.course_type =="seven"){
		theme.push("2");
		theme.push("4");
	}else if(data.course_type =="seven"){
		theme.push("2");
		theme.push("4");
	}

	const body ={
		"gender":"0", "age":"0", "budget":"99999999", //선택하지 않는 옵션 ..
		"transportType":"1", //자동차 fixed
		"startTime": startDate+ " 09:00", "endTime": endDate + " 18:00",
		"destination": sigungu, "days": quote.days, //TODO 1인경우 확인 要
		"theme": theme, "partner": data.companion,
		"stay": stayOption, "count": "1",
	}
	let options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(body)
	}
	console.log("body >>> "+ JSON.stringify(options));
	const result = await fetch(schedulerEndpoint, options).then(res => res.json())
	console.log("리졀트 >>>> " + JSON.stringify(result))
	const attrs = result.course.locations; // [] , 0은 출발지점 */

	//TODO 이 아래서부터 새로운 로직에 대한 response 에 맞춰 변경해야함
	//let course = await makeCourse(data, rerun); //TODO 주석 처리 해야함 (기존 추천 코스)
	//resultidreco_info = course; //reco_tmaplink = course.tmaplink; //티맵 링크

	//array.key()는 배열의 각 인덱스를 키값으로 가지는 새로운 array iterator 반환
	//array.map()은 주어진 함수를 호출한 결과를 모아 새로운 array 반환

	// let days = [...Array(9).keys()].map(word => word + 1); //왜 Array(9) ????????????? => [1, 2, 3, ... , 9]

	// T맵실행
	//document.getElementById("getNavigation").setAttribute("onclick", `goToPage('${course.tmaplink}')`);
	const jsonData = JSON.parse(data.scheduledData);
	let attrs = jsonData.course[0].locations;
	console.log("리졀트1 >>>> " + JSON.stringify(attrs));
	console.log("attrs.length >> "+ attrs.length);

	if(attrs.length>3) {
		document.querySelector("#reco_step_locale_body").innerHTML
		+= `<div id="reco_step_locale_buttons">
				<span id="getNavigation" class="localeButtons"><i class="fas fa-map-marked-alt"></i> 길찾기 실행</span>
				<span id="getOtherCourse" class="localeButtons" onclick="sendText('다른 코스로 추천해줘')"><i class="fas fa-sync"></i> 다른 코스 보기</span>
			</div>
			<div id="reco_step_locale_tmapview"></div>
			<div id="reco_step_locale_course"></div>`;

		document.querySelector("#reco_step_locale_course_subject").innerHTML = `${quote.tour} 여행을 떠나 볼까요?`;

		if(jsonData.course.length > 1){
			for(let i=1; i<jsonData.course.length; i++){
				attrs = attrs.concat(jsonData.course[i].locations);
			}
			console.log("리졀트2 >>>> " + JSON.stringify(attrs));
			console.log("attrs.length >> "+ attrs.length);
		}

		let results = "", pdata = [], num = 0;
		for (let i=0; i < quote.days; i++) { //여행 기간> 2박3일=3, 1박2일=2, 당일치기=1
			// if(i === 0) {//수직 방향 회색 라인
			// 	results += `<div id="reco_step_locale_course_day1" class="locale_day day1">
			// 					<div class="verticalLine"></div>`;
			// } else if (i === 1) { //중간에 둘째날 출력
			// 	results += `	<div id="locale_day2" class="day_divider day1" onclick="openDay(2)">
			// 						<div class="horizontalLine left"></div>둘째날 <span><i class="fas fa-angle-double-down"></i></span>
			// 						<div class="horizontalLine right"></div>
			// 					</div><div id="reco_step_locale_course_day2" class="locale_day day2">
			// 					<div class="verticalLine"></div>`;
			// } else { //셋째날 출력
			// 	results += `	<div id="locale_day3" class="day_divider day2" onclick="openDay(3)">
			// 					<div class="horizontalLine left"></div>셋째날 <span><i class="fas fa-angle-double-down"></i></span>
			// 						<div class="horizontalLine right"></div>
			// 					</div>
			// 					<div id="reco_step_locale_course_day3" class="locale_day day3"><div class="verticalLine">
			// 				</div>`;
			// }
			if (i === 0) {//수직 방향 회색 라인
				results += `<div id="reco_step_locale_course_day1" class="locale_day day1">`;
			} else if (i === 1) { //중간에 둘째날 출력
				results += `	<div id="locale_day2" class="day_divider day1" onclick="openDay(2)">
									<div class="horizontalLine left"></div>둘째날 <span><i class="fas fa-angle-double-down"></i></span>
									<div class="horizontalLine right"></div>
								</div>
								<div id="reco_step_locale_course_day2" class="locale_day day2">
								`;
			} else { //셋째날 출력
				results += `	<div id="locale_day3" class="day_divider day2" onclick="openDay(3)">
									<div class="horizontalLine left"></div>
									셋째날 <span><i class="fas fa-angle-double-down"></i></span>
									<div class="horizontalLine right"></div>
								</div>
								<div id="reco_step_locale_course_day3" class="locale_day day3">`;
			}

			const maxCnt = quote.days*5 > jsonData.course[0].locations.length-3 ? 5 : jsonData.course[0].locations.length; //TODO 애매 ...
			console.log("maxCnt >> " + maxCnt);

			resultidreco_info = []; //attrs; //상세페이지 표시를 위한 전역변수

			for (let j=0; j<maxCnt; j++) {  //하루 다섯개 추천 ...식사 포함 //attrs.length-1
				const obj = attrs[j]; console.log(j +" ::: "+ JSON.stringify(obj));
				if (!obj.placeImageUrl || obj.placeImageUrl == "null") continue;
				++num;

				resultidreco_info.push(obj); //상세페이지 표시를 위한 전역변수

				//let number = i*maxCnt + ();
				const imgURL = obj.placeImageUrl || obj.placeImageUrl != "null" ? replaceimage(obj.placeImageUrl) : "./img/icon/noimage.png";
				const typeClass = "";// j == 2 || j == 5 ? "restaurant" : "";
				console.log("course num >> " + num + ",, imgURL >> " + imgURL);
				results += `<div id="courselist${num}" class="course-list" onclick="sendText('${num}번')">`;
				if (j < maxCnt-1) {
					results += `<div class="verticalLine"></div>`;
				}
				results += `	<div id="locale_circle${num}" class="locale-circle ${typeClass}">
									<div class="result-number"> ${num} </div>
								</div>`; //class restaurant
				// if(j == 2) {
				// 	results += `<div class="course-name"> 점심코스 : <span>${obj.type ? obj.type : ""}</span></div>`; //word.type == 한식
				// } else if (j == 5) {
				// 	results += `<div class="course-name"> 저녁코스 : <span>${obj.type ? obj.type : ""}</span></div>`;
				// } else {
				//	results += `<div class="course-name"> 관광코스 ${days.shift()} : <span>${obj.type ? obj.type : ""}</span></div>`;
				// }
				// results += `	<div class="course-name"> 관광코스 ${number} : <span>${obj.type ? obj.type : ""}</span></div>
				// 				<div class="locale-box">
				// 					<div class="locale-box-img"><img src=${imgURL} ></div>
				// 					<div class="locale-box-disc">
				// 						<div class="locale-box-disc-title">${obj.title}</div>
				// 						<div class="locale-box-disc-addr"><i class='fas fa-map-marker-alt'></i> ${obj.addr1}</div>
				// 					</div>
				// 				</div>
				// 			</div>`; // ${JSON.stringify(attrs[number]) }
				results += `	<div class="course-name"> 관광코스 ${num} : <span>${obj.type ? obj.type : ""}</span></div>
								<div class="locale-box">
									<img src=${imgURL} >
									<div class="locale-box-disc">
										<div class="locale-box-disc-title">${obj.title}</div>
										<div class="locale-box-disc-addr">${obj.sTime} ~</div>
										<div class="locale-box-disc-addr">	${obj.eTime}</div>
									</div>
								</div>
							</div>`;
				pdata.push({"lng": obj.x, "lat": obj.y, "parent": "reco_locale"}); //pdata에 관광지(음식점) 정보 넣음
			}
			document.getElementById("reco_step_locale_course").innerHTML = results;
			document.getElementById("reco_step_locale_course_day1").style.display = "block";
			// for(let j = 0; j < 5; j++){
			// 	let word = course.course[number - 1]; //관광지+음식점
			// 	pdata.push({"lng" : word.mapx, "lat" : word.mapy, "parent" : "reco_locale"}); //pdata에 관광지(음식점) 정보 넣음
			// 	results += `<div id="courselist${number}" class="course-list" onclick="sendText('${number}번')">`; //관광지(+음식점) 선택시
			//
			// 	if([1, 4].indexOf(j) > -1) { //j가 1 혹은 4 라면, number 가 2, 5번째 일 때(점심 저녁)
			// 		results += `<div id="locale_circle${number}" class="locale-circle restaurant">
			// 						<div class="result-number"> ${number} </div>
			// 					</div>`;
			// 		if(j === 1) {
			// 		results += `<div class="course-name"> 점심코스 : <span>${word.type ? word.type : ""}</span></div>`; //word.type == 한식
			// 		} else {
			// 		results += `<div class="course-name"> 저녁코스 : <span>${word.type ? word.type : ""}</span></div>`;
			// 		}
			// 	} else { //그냥 관광지일 경우
			// 		results += `<div id="locale_circle${number}" class="locale-circle">
			// 						<div class="result-number"> ${number} </div>
			// 					</div>
			// 					<div class="course-name"> 관광코스 ${days.shift()} : <span>${word.type ? word.type : ""}</span></div>`;
			// 	}
			// 	let imgURL = word.firstimage ? replaceimage(word.firstimage) : "./img/icon/noimage.png";
			// 		results += `<div class="locale-box">
			// 						<div class="locale-box-img"><img src="${imgURL}"/></div>
			// 						<div class="locale-box-disc">
			// 							<div class="locale-box-disc-title">${word.title}</div>
			// 							<div class="locale-box-disc-addr"><i class='fas fa-map-marker-alt'></i> ${word.addr1}</div>
			// 						</div>
			// 					</div>
			// 				</div>`;
			// }
			// results += `</div>`;}
		}
		console.log("pdata >>> " + pdata);
		document.getElementById("reco_step_locale_tmapview").innerHTML = "";
		info_result_map(pdata, "reco_step_locale_tmapview", "auto", "16%");

		document.querySelectorAll(".day2").forEach(word => word.style.display = "none");
		console.log("day2 veiled");
		document.querySelectorAll(".day3").forEach(word => word.style.display = "none");
		console.log("day3 veiled");
		console.log(`코스 일정 : ${quote.days}일`);

		const count = 1;
		let index = 0;

		const infoResultList = document.getElementById("reco_step_locale_course");

		async function loadItems() {
			console.log("start with >>> " + index);
			// 화면 표시 및 얼마나 표시되었는지 플래그 숫자 올리기
			let temp = index + count > quote.days ? quote.days : index + count;
			console.log(`몇번째 날 = ${temp}`);

			document.querySelectorAll(`.day${temp}`).forEach(element => element.style.display = "block");
			console.log(`day ${temp} unveiled`);

			index += count;

			const ioOptions = {
				root: null, //document.querySelector('.container'), // .container class를 가진 엘리먼트를 root로 설정. null일 경우 브라우저 viewport
				rootMargin: '20px', // rootMargin을 '10px 10px 10px 10px'로 설정
				threshold: 0.5 // target이 root에 진입시 : 0, root에 target의 50%가 있을 때 : 0.5, root에 target의 100%가 있을 때 : 1.0
			}
			const io = new IntersectionObserver((entries, observer) => {
				entries.forEach(async (entry) => {
					if (entry.isIntersecting) { //entry.intersectionRatio > 0
						if (!infoResultList.querySelector(".loading-spinner")) {
							infoResultList.innerHTML += `<div class="loading-spinner"></div>`;
							setTimeout(async () => {
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
				io.observe(infoResultLastItem);
			}
		}
		loadItems();
	}else{
		// document.getElementById("reco_step_locale_course").innerHTML = "추천 코스가 검색되지 않습니다.";
		document.querySelector("#reco_step_locale_course_subject").innerHTML = "추천 코스가 검색되지 않습니다.";
	}
}
/** 추천코스 상세화면 */
const reco_step_detail_view = (data) => {
	console.log("실행 : reco_detail_view()"); // {"reco_number":2,"command":"RECO_STEP_DETAIL","previous":"RECO_STEP_LOCALE"}
	console.log(resultidreco_info); //숙소인경우 undefined
	hideall();

	if (data.sleep === "숙소") {} //resultidinfo = resultidreco_info.acco;
	else resultidinfo = resultidreco_info; //.course;

	const detail_data = {...data, "reco_detail" : true, "info_number" : data.reco_number}
	drawDetail(detail_data);
}


const makeCourse = async (data, rerun = false) => {
	// 선택된 도시의 관광지 목록을 불러옴
	let placeList = resultidreco[parseInt(dataplace(data.place) - 1)]; //지역 관광지 목록

	//여행일수에 따라 관광지, 음식점 추천수 varied
	let attr, rest; // 관광지, 음식점
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
	if(['one', 'three', 'six', 'eight'].indexOf(data.course_type) > 0) { //course_type 이 배열에 존재하지 않으면 '-1' return -> else
		acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "모텔"})];
		if(data.course_type === "eight") {
			acco_smalltype =  [acco_smalltype, ...putsmalltype({"sleep" : "호텔"}), ...putsmalltype({"sleep" : "펜션"})];
		} else {
			acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "게스트하우스"})];
			if(data.course_type === "six")
				acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "호텔"})];
		}
	} else {
		acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "호텔"})];
		if(data.course_type === "five"){
			acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "게스트하우스"})];
		} else {
			acco_smalltype = [acco_smalltype, ...putsmalltype({"sleep" : "콘도"}), ...putsmalltype({"sleep" : "펜션"})];
		}
	}

	let item;
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
	let attr_arr = [], rest_arr = [], acco_arr = [];
	let radius = 2000;
	let courseResults = [];

	// 1번째 관광지 위치를 기준으로 주변검색 (초기값 2km, 부족할 시 이후 2km씩 증가)
	// for(let i = 0; attr_arr.length < attr || rest_arr.length < rest || acco_arr.length < 1; i++) {
		courseResults = await tourAPI("추천코스", data);
		courseResults.forEach(word => {
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

	let attr_rand = genRandomNo(attr, attr_arr.length).map(word => word - 1);
	let rest_rand = genRandomNo(rest, rest_arr.length).map(word => word - 1);
	let course = [];
	// 1, 3, 4번째는 관광지, 2, 5번째는 음식점
	for(let i = 0; i < attr / 3 * 5; i++) {
		if([0, 2, 3].indexOf(i % 5) >= 0) {
			course[i] = attr_arr[attr_rand.shift()];
		} else {
			course[i] = rest_arr[rest_rand.shift()];
		}
	}

	//코스의 첫번째 관광지 tmaplink 넘겨줌
	let tmaplink = `https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxef0befba10d74637b27b8d7a8acdd7aa&name=${course[0].title}&lon=${course[0].mapx}&lat=${course[0].mapy}`;
	return {course : course, acco : acco_arr, tmaplink : tmaplink};
}

//티맵 길안내 시작
const reco_step_locale_map_view = (data) => {
	goToPage(reco_tmaplink);
}

//코스 내 시설 상세정보 출력


