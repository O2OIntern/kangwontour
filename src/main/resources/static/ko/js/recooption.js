// jshint esversion: 6
/**
  * 랜덤 번호 생성 함수
  */

 function random_number(min, max) {
 	return Math.floor(Math.random() * (max - min + 1)) + min;
 }

 /**
  * "추천 코스2" intent에 사용할 함수
  */

 function reco_option_during_view(data) {
 	// 전부 가리고 reco_option_during_view div 보이게 하기
 	hideall();
 	document.getElementById("recooption")
 		.style.display = "block";
 	document.getElementById("reco_option_during")
 		.style.display = "block";

 	// 데이터 도착 확인
 	console.log("reco_option_during command  : " + data.command);
 }

 function reco_option_age_view(data) {
 	// 전부 가리고 reco_option_age_view div 보이게 하기
 	hideall();
 	document.getElementById("recooption")
 		.style.display = "block";
 	document.getElementById("reco_option_age")
 		.style.display = "block";

 	// 데이터 도착 확인
 	console.log("reco_option_age command  : " + data.command);
 	console.log("reco_option_age during  : " + data.during);
 }

 function reco_option_together_view(data) {
 	// 전부 가리고 reco_option_together_view div 보이게 하기
 	hideall();
 	document.getElementById("recooption")
 		.style.display = "block";
 	document.getElementById("reco_option_together")
 		.style.display = "block";

 	// 데이터 도착 확인
 	console.log("reco_option_together command  : " + data.command);
 	console.log("reco_option_together during  : " + data.during);
 	console.log("reco_option_together age  : " + data.age);
 }

 function reco_option_traffic_view(data) {
 	// 전부 가리고 reco_option_traffic_view div 보이게 하기
 	hideall();
 	document.getElementById("recooption")
 		.style.display = "block";
 	document.getElementById("reco_option_traffic")
 		.style.display = "block";

 	// 데이터 도착 확인
 	console.log("reco_option_traffic command  : " + data.command);
 	console.log("reco_option_traffic during  : " + data.during);
 	console.log("reco_option_traffic age  : " + data.age);
 	console.log("reco_option_traffic together  : " + data.together);
 }

 function reco_option_place_view(data) {
 	// 전부 가리고 reco_option_place_view div 보이게 하기
 	hideall();
 	document.getElementById("recooption")
 		.style.display = "block";
 	document.getElementById("reco_option_place")
 		.style.display = "block";

 	// 데이터 도착 확인
 	console.log("reco_option_place command  : " + data.command);
 	console.log("reco_option_place during  : " + data.during);
 	console.log("reco_option_place age  : " + data.age);
 	console.log("reco_option_place together  : " + data.together);
 	console.log("reco_option_place traffic  : " + data.traffic);
 }


 async function reco_option_result_view(data) {
 	// 전부 가리고 reco_option_result div 보이게 하기
 	hideall();
 	document.getElementById("recooption")
 		.style.display = "block";
 	document.getElementById("reco_option_result")
 		.style.display = "block";
 	document.getElementById("reco_option_result_sub")
 		.innerHTML = "";

 	var place;
 	var trip_days = {};
 	var courseArray = new Array();

 	switch (data.during) {
 		case ("당일치기로"):
 			trip_days.attr = 3;
 			trip_days.rest = 2;
 			trip_days.acco = 0;
 			break;
 		case ("1박 2일 동안"):
 			trip_days.attr = 6;
 			trip_days.rest = 4;
 			trip_days.acco = 1;
 			break;
 		case ("2박 3일 동안"):
 			trip_days.attr = 9;
 			trip_days.rest = 6;
 			trip_days.acco = 2;
 			break;
 		case ("3박 4일 동안"):
 			trip_days.attr = 12;
 			trip_days.rest = 8;
 			trip_days.acco = 3;
 			break;
 		default:
 			alert("일정을 정해주세요!");
 	}
 	trip_days.all = trip_days.attr + trip_days.rest + trip_days.acco;
 	console.log("여행 일정 : ↓↓");
 	console.log(trip_days);

 	switch (data.place) {
 		case ("강릉시"):
 			place = "1";
 			break;
 		case ("고성군"):
 			place = "2";
 			break;
 		case ("동해시"):
 			place = "3";
 			break;
 		case ("삼척시"):
 			place = "4";
 			break;
 		case ("속초시"):
 			place = "5";
 			break;
 		case ("양구군"):
 			place = "6";
 			break;
 		case ("양양군"):
 			place = "7";
 			break;
 		case ("영월군"):
 			place = "8";
 			break;
 		case ("원주시"):
 			place = "9";
 			break;
 		case ("인제군"):
 			place = "10";
 			break;
 		case ("정선군"):
 			place = "11";
 			break;
 		case ("철원군"):
 			place = "12";
 			break;
 		case ("춘천시"):
 			place = "13";
 			break;
 		case ("태백시"):
 			place = "14";
 			break;
 		case ("평창군"):
 			place = "15";
 			break;
 		case ("홍천군"):
 			place = "16";
 			break;
 		case ("화천군"):
 			place = "17";
 			break;
 		case ("횡성군"):
 			place = "18";
 			break;
 		case ("강원도"):
 			place = "";
 			break;
		case ("현위치"):
 		default:
 			place = "";
 	}

 	console.log("카테고리 랜덤으로 돌리기");

 	function dataRandomizer() {
 		var result = {};
 		var rand = random_number(1, 3);
 		console.log("무작위 번호 : " + rand);
 		switch (rand) {
 			case (1):
 				console.log("랜덤 : 자연");
 				result.contenttypeid = "12";
 				result.cat1 = "A01";
 				break;
 			case (2):
 				console.log("랜덤 : 인문");
 				result.contenttypeid = "12";
 				result.cat1 = "A02";
 				break;
 			case (3):
 				console.log("랜덤 : 레포츠");
 				result.contenttypeid = "28";
 				result.cat1 = "A03";
 				break;
 			default:
 				console.log("카테고리 설정 오류");
 		}
 		console.log("랜덤 설정 결과 : ↓↓");
 		console.log(result);
 		return result;
 	}

 	var requestdata = dataRandomizer();

 	/**
 	 *  첫 번째 관광지/레포츠 지정
 	 */
 	async function ajaxrequest1() {
 		console.log("데이터 가져오기");
 		var requestdatas = `MobileOS=ETC&MobileApp=TourAPI3.0_Guide&ServiceKey=${servicekey}&listYN=Y&numOfRows=10000&pageNo=1&_type=json&areaCode=32&sigunguCode=${place}&contentTypeId=${requestdata.contenttypeid}&cat1=${requestdata.cat1}`;
 		console.log("API 전송 데이터 : " + requestdatas);
 		return new Promise(function (resolve, reject) {
 				$.ajax({
 					url: "https://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList",
 					data: requestdatas,
 					method: "GET",
 					dataType: "json",
 					success: function (json) {
 						if (json) {
 							resolve(json);
 						}
 						reject(new Error("ajaxrequest1 : 실패"));
 					}
 				})
 			})
 			.catch(function (err) {
 				console.error(err);
 			})
 	}

 	async function getLocation() {
 		// 위에서 랜덤으로 가져온 결과 json을 가져옴
 		var randomRequest = await ajaxrequest1();
 		var randomITEM = randomRequest.response.body.items.item;
 		console.log("randomITEM = ↓↓");
 		console.log(randomITEM);
 		// json에서 랜덤으로 여행지 1개를 선택
 		var selector = random_number(0, randomRequest.response.body.totalCount);
 		console.log("getLocation : 선택된 번호 = " + selector);
 		// 선택된 여행지를 첫 번째 여행지로 지정함
 		courseArray[0] = randomITEM[selector];
 		console.log("courseArray : ");
 		console.log(courseArray);
 		console.log(`randomITEM[${selector}] : `);
 		console.log(randomITEM[selector]);
 		// 첫 번째 여행지의 좌표를 출력
 		var requestmap = {
 			'x': courseArray[0].mapx,
 			'y': courseArray[0].mapy
 		};
 		console.log("getLocation : requestmapx = " + requestmap.x);
 		console.log("getLocation : requestmapy = " + requestmap.y);
 		return requestmap;
 	}

 	const requestmap = await getLocation();


 	/**
 	 * 주변검색으로 관광지 검색
 	 * @param {*} radius 주변검색 범위
 	 */
 	async function ajaxrequest2(radius) {
 		console.log("ajaxrequest2 현재 범위 : " + radius);
 		// 첫 번째 여행지의 좌표를 기준으로 해당 위치 주변 검색을 돌림
 		return new Promise(function (resolve, reject) {
 				$.ajax({
 					url: "https://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList",
 					data: `MobileOS=ETC&MobileApp=TourAPI3.0_Guide&ServiceKey=${servicekey}&listYN=Y&radius=${radius}&arrange=E&numOfRows=10000&pageNo=1&_type=json&contentTypeId=12&mapX=${requestmap.x}&mapY=${requestmap.y}`,
 					method: "GET",
 					dataType: "json",
 					success: function (json) {
 						if (json) {
 							resolve(json);
 						}
 						reject(new Error("ajaxrequest2 : 실패"));
 					}
 				})
 			})
 			.catch(function (err) {
 				console.error(err);
 			})
 	}

 	/**
 	 * 주변검색으로 음식점 검색
 	 * @param {*} radius 주변검색 범위
 	 */
 	async function ajaxrequest3(radius) {
 		console.log("ajaxrequest3 현재 범위 : " + radius);
 		return new Promise(function (resolve, reject) {
 				$.ajax({
 					url: "https://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList",
 					data: `MobileOS=ETC&MobileApp=TourAPI3.0_Guide&ServiceKey=${servicekey}&listYN=Y&radius=${radius}&arrange=E&numOfRows=10000&pageNo=1&_type=json&contentTypeId=39&mapX=${requestmap.x}&mapY=${requestmap.y}`,
 					method: "GET",
 					dataType: "json",
 					success: function (json) {
 						if (json) {
 							resolve(json);
 						}
 						reject(new Error("ajaxrequest3 : 실패"));
 					}
 				})
 			})
 			.catch(function (err) {
 				console.error(err);
 			})
 	}

 	/**
 	 * 주변검색으로 숙박시설 검색
 	 * @param {*} radius 주변검색 범위
 	 */
 	async function ajaxrequest4(radius) {
 		console.log("ajaxrequest4 현재 범위 : " + radius);
 		return new Promise(function (resolve, reject) {
 				$.ajax({
 					url: "https://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList",
 					data: `MobileOS=ETC&MobileApp=TourAPI3.0_Guide&ServiceKey=${servicekey}&listYN=Y&radius=${radius}&arrange=E&numOfRows=10000&pageNo=1&_type=json&contentTypeId=32&mapX=${requestmap.x}&mapY=${requestmap.y}`,
 					method: "GET",
 					dataType: "json",
 					success: function (json) {
 						if (json) {
 							resolve(json);
 						}
 						reject(new Error("ajaxrequest4 : 실패"));
 					}
 				})
 			})
 			.catch(function (err) {
 				console.error(err);
 			})
 	}

 	async function createCourse() {
 		var radius = 0;
 		var addAttr = await ajaxrequest2(radius);
 		var ADDATTR = new Array();
 		var tempAttr = new Array();
 		do {
 			radius = radius + 2000;
 			addAttr = await ajaxrequest2(radius);
 		} while (addAttr.response.body.totalCount < trip_days.attr)
 		console.log("찾은 관광지 : ↓↓");
 		console.log(addAttr);
 		console.log(addAttr.response.body.items.item);
 		for (var i = 0; i < trip_days.attr; i++) {
 			tempAttr[i] = random_number(0, addAttr.response.body.totalCount - 1);
 			if (i == 0) continue;
 			for (var j = tempAttr.length - 1; j >= 0; j--) {
 				if (tempAttr[i] == tempAttr[j]) {
 					tempAttr[i] = random_number(0, addAttr.response.body.totalCount - 1);
 					j = tempAttr.length - 1;
 				}
 			}
 		}
 		for (var i = 0; i < tempAttr.length; i++) {
 			ADDATTR[i] = addAttr.response.body.items.item[tempAttr[i]];
 		}
 		console.log("정렬 결과 : ↓↓");
 		console.log(tempAttr);
 		console.log(ADDATTR);

 		var addRest = await ajaxrequest3(radius);
 		var ADDREST = new Array();
 		var tempRest = new Array();
 		while (addRest.response.body.totalCount < trip_days.rest) {
 			addRest = await ajaxrequest3(radius);
 			radius = radius + 2000;
 		}
 		console.log("찾은 음식점 : ↓↓");
 		console.log(addRest);
 		console.log(addRest.response.body.items.item);
 		for (var i = 0; i < trip_days.rest; i++) {
 			tempRest[i] = random_number(0, addRest.response.body.totalCount - 1);
 			if (i == 0) continue;
 			for (var j = tempRest.length - 1; j >= 0; j--) {
 				if (tempRest[i] == tempRest[j]) {
 					tempRest[i] = random_number(0, addRest.response.body.totalCount - 1);
 					j = tempRest.length - 1;
 				}
 			}
 		}
 		for (var i = 0; i < tempRest.length; i++) {
 			ADDREST[i] = addRest.response.body.items.item[tempRest[i]];
 		}
 		console.log("정렬 결과 : ↓↓");
 		console.log(tempRest);
 		console.log(ADDREST);

 		if (trip_days.acco != 0) {
 			var addAcco = await ajaxrequest4(radius);
 			var ADDACCO = new Array();
 			var tempAcco = new Array();
 			while (addAcco.response.body.totalCount < trip_days.acco) {
 				addAcco = await ajaxrequest4(radius);
 				radius = radius + 2000;
 			}
 			console.log("찾은 숙박시설 : ↓↓");
 			console.log(addAcco);
 			console.log(addAcco.response.body.items.item);
 			for (var i = 0; i < trip_days.acco; i++) {
 				tempAcco[i] = random_number(0, addAcco.response.body.totalCount - 1);
 				if (i == 0) continue;
 				for (var j = tempAcco.length - 1; j >= 0; j--) {
 					if (tempAcco[i] == tempAcco[j]) {
 						tempAcco[i] = random_number(0, addAcco.response.body.totalCount - 1);
 						j = tempAcco.length - 1;
 					}
 				}
 			}
 			for (var i = 0; i < tempAcco.length; i++) {
 				if (addAcco.response.body.totalCount < 2) {
 					ADDACCO[i] = addAcco.response.body.items.item;
 				} else {
 					ADDACCO[i] = addAcco.response.body.items.item[tempAcco[i]];
 				}
 			}
 			console.log("정렬 결과 : ↓↓");
 			console.log(tempAcco);
 			console.log(ADDACCO);
 		}

 		console.log("최종 범위 : " + radius);

 		var course_result = new Array();

 		for (var i = 0; i < ADDATTR.length; i++) {
 			course_result[i * 2] = ADDATTR[i];
 			console.log(`course_result[${i*2}] = ADDATTR[${i}]`);
 		}
 		for (var i = 0; i < ADDREST.length; i++) {
 			if (i % 2 == 0) {
 				course_result[i * 3 + 1] = ADDREST[i];
 				console.log(`course_result[${i*3 + 1}] = ADDREST[${i}]`);
 			} else {
 				course_result[i * 3] = ADDREST[i];
 			}
 		}
 		if (trip_days.acco != 0) {
 			for (var i = 0; i < ADDACCO.length; i++) {
 				course_result[(i + 1) * 6 - 1] = ADDACCO[i];
 				console.log(`course_result[${(i+1) * 6 - 1}] = ADDACCO[${i}]`);
 			}
 		}

 		console.log("최종 코스 : ↓↓");
 		console.log(course_result);

 		for (var i = 0; i < course_result.length; i++) {
 			var imgURL = course_result[i].firstimage;
 			if (imgURL == undefined) {
 				imgURL = "./img/icon/noimage.png";
 			} else {
 				imgURL = imgURL.replace('http://', 'https://');
 			}
 			console.log(`imgURL(변경) : ${imgURL}`);

 			document.getElementById("reco_option_result_sub")
 				.innerHTML +=
 				`<div class=detail-subtitle-course onclick ="resultnumber(${parseInt(i+1)})">[${parseInt(i + 1)}] ${course_result[i].title}</div><div class=detail-img-course><img src=${imgURL}></div><div class=detail-descript-course>${course_result[i].addr1}<br></div>`;
 		}

 	}

 	createCourse();

 	// 데이터 도착 확인
 	console.log("reco_option_result_view command  : " + data.command);
 	console.log("reco_option_result_view during  : " + data.during);
 	console.log("reco_option_result_view age  : " + data.age);
 	console.log("reco_option_result_view together  : " + data.together);
 	console.log("reco_option_result_view traffic  : " + data.traffic);
 	console.log("reco_option_result_view place  : " + data.place);
 }
