// import './common.js'
const tourPlaces = [
    '간현관광지',
    '고석정',
    '낙산사',
    '남이섬',
    '대관령목장',
    '대이리동굴지대',
    '두타연',
    '무릉계곡',
    '바다부채길',
    '선암마을',
    '설악산',
    '수타사',
    '월정사',
    '자작나무숲',
    '정선5일장',
    '죽도',
    '태백산',
    '통일전망대',
    '평화의종공원',
    '횡성호수길'
]
/**
 * 검색 결과 목록에서 해당 항목으로 넘어가기 위한 id를 저장하는 배열
 */
let resultidinfo = [];
let tmaplink = "";

function showmap(con) {
	if (con.style.display == 'none') {
		con.style.display = 'block';
	} else {
		con.style.display = 'none';
	}
}

/**
 * "관광지 정보" intent에 사용할 함수
 */
function info_view(data) {
	console.log("실행 : INFO()");
	// 전부 가리고 info div 보이게 하기
	hideall();
	hideall_info();
	document.getElementById("info").style.display = 'block';
	//	document.getElementById("info").style.backgroundImage = `url("./img/3_info.png")`;
	// 데이터 도착 확인
	console.log("info_view command  : " + data.command);
	console.log("info_view data : ↓↓");
	console.log(data);
}

/* 키워드 검색 : any */
async function info_search_view(data) {
	console.log("실행 : info_search_view()");
	const searchWord = data.any;
	
	resultidinfo = []; //reset
	// const url = `http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchKeyword?ServiceKey=${servicekey}&areaCode=32&sigunguCode=&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=A&numOfRows=12&pageNo=1&_type=json&keyword=${searchWord}`;
	const items = await tourAPI("이름검색", data);

	let result = [];
	//contenttypeid=25 (관광코스) 제외
	if (items) result = items.filter( item => item.contenttypeid != "25"); // && items.length > 1

	resultidinfo = []; //reset
	if (result && result.length > 1) {
		resultidinfo = result;
		sendText('SEARCH_DATA_LIST'); //TTS
	} else if (result && result.length  == 1) {
		resultidinfo = result;
		resultidinfo[0].selected = true;
		sendText('SEARCH_DATA_ONE');
	} else {
		sendText('SEARCH_DATA_NULL');
	}
}

/* 키워드 검색 -> LIST */
async function info_search_result_view(data) {
	console.log("실행 : info_search_result_view()");
	hideall();
	document.getElementById("info").style.display = 'block';
	document.getElementById("info_result").style.display = "block";

	const chara = document.getElementById("info_result_chara_image");
	if (data.fallback) {
		chara.setAttribute("src", `./img/p17.png`);
		console.log("fallback img changed");
		return;
	} else {
		chara.setAttribute("src", `./img/p6-2_chara.png`);
	}

	document.getElementById("info_result_tmapview").innerHTML = "";
	document.getElementById("info_result_list").innerHTML = `
		<span class="list-total-count" >총 ${resultidinfo.length}건</span>`;
	
	document.getElementById("info_result_list").style.height = (window.innerHeight - (window.innerHeight/1.6)) +"px";
	
	let pdata = [];
	resultidinfo.map( (data, i) => {
		const imgURL = data.firstimage ? `<img src="${data.firstimage}">` : "";
		pdata.push({ "lng": data.mapx, "lat": data.mapy, "parent": "info_result"});

		document.getElementById("info_result_list").innerHTML += `
			<div id = "resultlist${i}" class="list-box" onclick="resultnumber(${parseInt(i + 1)})">
				<div id="info_result-circle${i}" class="result-circle">
					<div class="result-number">${i + 1}</div>
				</div>
				<div class="result-img">
					${imgURL}
				</div>
				<div class="result-text">
					<div class="result-title">
						[${parseInt(i + 1)}] ${data.title}
					</div>
					<div class="result-addr">${data.addr1 ? data.addr1 : "주소정보 없음"}</div>
				</div>
			</div>`;
	});

	info_result_map(pdata, "info_result_tmapview");
}

/**
 * INFO_SEARCH:any 검색용 상세화면
 * @TODO info_search_result에서 1번 알려줘 => info_detail로 이동
 */
async function info_search_detail_view(data) {
	console.log("실행 : info_search_detail_view() >>> "+JSON.stringify(data));

	fallback = data.fallback;

	hideall();
	document.getElementById("info").style.display = 'block';
	document.getElementById("info_result").style.display = "block";
	document.getElementById("info_result_tmapview").innerHTML = "";
	document.getElementById("info_result_list").style.height = (window.innerHeight - window.innerHeight/1.6) +"px";

	if(resultidinfo){ //drawDetail(data);
		document.getElementById("info_result_list").innerHTML = `
			<div id="info_detail_title" class="detail-title"></div>
			<div id="info_detail_etc" class="detail-etc"></div>
			<div id="info_detail_image" class="detail_info-img"></div>
			<h4>개요</h4>
			<div id="info_detail_descript" class="detail-descript"></div>
			<h4>시설정보</h4>
			<div id="info_detail_intro" class="detail-intro"></div>
			<div class="localfood_guide_04">
				<img src="./img/btn_ytb.png" alt="유튜브에서 더보기" onclick="sendText('유튜브에서 더보기')">
				<img src="./img/btn_insta.png" alt="인스타그램에서 더보기" onclick="sendText('인스타그램에서 더보기')">
			</div>
		`;

		document.getElementById("info_result_chara_image").setAttribute("src", "./img/p6-4_chara.png");

		const jsonData = await tourAPI("상세정보", data, resultidinfo[0])
		jsonData.map( myObj => {
			console.log("1: json 응답 갯수 : " + myObj.length + "개");
			const website = myObj.homepage ?
				myObj.homepage.substring( myObj.homepage.indexOf(">")+1, myObj.homepage.lastIndexOf("<") )
				: '';

			const pdata = { //tmap myObj
				Lng: myObj.mapx,
				Lat: myObj.mapy,
				Name: myObj.title
				// Level: myObj.mlevel
			};

			document.querySelector("#info_detail_title").innerHTML = `
<!--				<img src="./img/local_food_02.png" class="go_prev" onclick="sendText('이전으로')" > -->
				<div class="detail_title_text">${myObj.title}</div>
				<img src="./img/info_detail_01.png" class="find_route" onclick="sendText('가는길알려줘')">`;
			//주소/홈페이지/전화번호
			document.querySelector("#info_detail_etc").innerHTML = `
				<i class='fas fa-map-marker-alt'></i> ${myObj.addr1 ? myObj.addr1 : "주소정보 없음"}<br>`;

			if(website) {
				document.querySelector("#info_detail_etc").innerHTML += `${website}<br>`;
			}
			if(myObj.tel) {
				document.querySelector("#info_detail_etc").innerHTML += `${myObj.tel}`;
			}

			//선택한 항목으로 지도 중심 옮기기 / 지도 핀 옮기기
			document.getElementById("info_result_tmapview").innerHTML = "";
			info_map(pdata, "info_result_tmapview");
			//Tmap 링크 생성
			tmaplink = `https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxef0befba10d74637b27b8d7a8acdd7aa&name=${pdata.Name}&lon=${pdata.Lng}&lat=${pdata.Lat}`;

			// const imgURL = myObj.firstimage ? replaceimage(myObj.firstimage) : "./img/icon/noimage.png";
			if(myObj.firstimage) document.querySelector("#info_detail_image").innerHTML = `<img src="${myObj.firstimage}">`;
			// document.querySelector("#info_detail_image").innerHTML = `<img src="${imgURL}">`;
			document.querySelector("#info_detail_descript").innerHTML = `${myObj.overview}`;

			linkKeyword = myObj.title; //sns에서 더보기

			//타이틀이 길 경우
			const marqueeTxt = document.querySelector(".detail_title_text");

			if (marqueeTxt.scrollWidth > marqueeTxt.offsetWidth) {
				marqueeTxt.classList.add("marquee");
			}

			const facilities = document.getElementById("info_detail_intro");

			if (myObj.chkbabycarriage) facilities.innerHTML += `- 유모차대여 정보 : ${myObj.chkbabycarriage}<br>`;
			if (myObj.accomcount) facilities.innerHTML += `- 수용인원 : ${myObj.accomcount}<br>`;
			if (myObj.infocenter) facilities.innerHTML += `- 문의 및 안내 : ${myObj.infocenter}<br>`;
			if (myObj.parking) facilities.innerHTML += `- 주차시설 : ${myObj.parking}<br>`;
			if (myObj.parkingfee) facilities.innerHTML += `- 주차요금 : ${myObj.parkingfee}<br>`;
			if (myObj.reservation) facilities.innerHTML += `- 예약안내 : ${myObj.reservation}<br>`;
			if (myObj.restdate) facilities.innerHTML += `- 쉬는날 : ${myObj.restdate}<br>`;
			if (myObj.chkpet) facilities.innerHTML += `- 애완동물동반가능정보 : ${myObj.chkpet}<br>`;
			if (myObj.opentime) facilities.innerHTML += `- 영업시간 : ${myObj.opentime}<br>`;
			if (myObj.usetime) facilities.innerHTML += `- 이용시간 : ${myObj.usetime}<br>`;
			if (myObj.usefee) facilities.innerHTML += `- 이용요금 : ${myObj.usefee}<br>`;
			//음식점 only
			if (myObj.discountinfofood) facilities.innerHTML += `- 할인정보 : ${myObj.discountinfofood}<br>`;
			if (myObj.firstmenu) facilities.innerHTML += `- 대표메뉴 : ${myObj.firstmenu}<br>`;
			if (myObj.packing) facilities.innerHTML += `- 포장가능 : ${myObj.packing}<br>`;
			//관광지 only
			if (myObj.useseason) facilities.innerHTML += `- 할인정보 : ${myObj.useseason}<br>`;
			//숙박시설 only
			if (myObj.checkintime) facilities.innerHTML += `- 입실시간 : ${myObj.checkintime}<br>`;
			if (myObj.checkouttime) facilities.innerHTML += `- 퇴실시간 : ${myObj.checkouttime}<br>`;
			if (myObj.chkcooking) facilities.innerHTML += `- 객실내 취사 여부 : ${myObj.chkcooking}<br>`;
			//레포츠 only
			if (myObj.expagerange) facilities.innerHTML += `- 체험 가능연령 : ${myObj.expagerange}<br>`;
			if (myObj.openperiod) facilities.innerHTML += `- 개장기간 : ${myObj.openperiod}<br>`;
			//쇼핑 only
			if (myObj.opendate) facilities.innerHTML += `- 개장일 : ${myObj.opendate}<br>`;
			if (myObj.fairday) facilities.innerHTML += `- 장서는날 : ${myObj.fairday}<br>`;
			if (myObj.saleitem) facilities.innerHTML += `- 판매 품목 : ${myObj.saleitem}<br>`;
		});

		fetch(`https://actions.o2o.kr/devsvr10/finddetailimg?contentid=${resultidinfo[0].contentid}`)
		.then( res => res.json())
		.then( jsonData	=> {
			console.log(`3: json 응답 갯수 : ${jsonData.length} 개 \n data >>> ${JSON.stringify(jsonData)}`);
			
			jsonData.map( obj => {
				document.getElementById("info_detail_image").innerHTML += `
					<img src="${replaceimage(obj.smallimageurl)}">
				`; //originimgurl
			})
		})

	}
}

// /**
//  * API 검색 결과 리스트를 띄우는 화면
//  * @param {*} data Fulfillment로부터 받은 데이터
//  * @param {*} wasDataNull 검색 결과가 0개인 오류를 받았었는가
//  */
// function info_result_view_before(data, wasDataNull) {
//
// 	if (data.fallback || wasDataNull) { // 3번 전까지 호랑이 땀흘리는 사진 넣기
// 		document.getElementById("info_result_chara_image").setAttribute("src", `./img/p17.png`);
// 	} else {
// 		document.getElementById("info_result_chara_image").setAttribute("src", `./img/p6-2_chara.png`);
// 	}

// 	let place, type, lon, lat;
// 	let smalltype = [];
//
// 	// 위치, 시설 받기
// 	if (data.lon || data.lat) {
// 		lon = data.lon;
// 		lat = data.lat;
// 	} else {
// 		place = dataplace(data.place);
// 	}
//
// 	type = datatype(data);
// 	smalltype = putsmalltype(type, data);
//
// 	var xmladdr = data.lon || data.lat
// 			? `http://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList?ServiceKey=${servicekey}&contentTypeId=${type}&mapX=${lon}&mapY=${lat}&radius=2000&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=A&numOfRows=10000&pageNo=1&_type=json`
// 			: `http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey=${servicekey}&contentTypeId=&areaCode=32&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=A&numOfRows=10000&pageNo=1&sigunguCode=${place}&_type=json`;
//
// 	fetch(xmladdr).then( response => {
// 		response.json().then( myObj => {
// 			console.log(myObj);
// 			console.log(smalltype); //소분류
// 			const count = myObj.response.body.totalCount;
// 			let pdata = [];
// 			let results = [];
//
// 			const ITEM = myObj.response.body.items.item;
//
// 			if (count == 0) {
// 				sendText("INFO_DATA_NULL");
// 			} else if (count == 1) {
// 				results[0] = ITEM;
// 			} else {
// 				if (!wasDataNull) {
// 					for (var addItem = 0; addItem < ITEM.length; addItem++) {
// 						smalltype.forEach( word => {
// 							if (ITEM[addItem].cat3 == word) {
// 								results.push(ITEM[addItem]);
// 							}
// 						})
// 					}
// 				} else {
// 					results = ITEM;
// 				}
// 			}
//
// 			if (results.length < 1) {
// 				sendText("INFO_DATA_NULL");
// 			} else {
// 				hideall();
// 				document.getElementById("info").style.display = 'block';
// 				document.getElementById("info_result").style.display = "block";
// 				document.getElementById("info_result_tmapview").innerHTML = "";
// 				document.getElementById("info_result_list").innerHTML = `
// 					<span class="list-total-count" >총 ${results.length}건</span>`;
//
// 				for (var i = 0; i < results.length; i++) {
// 					var imgURL = results[i].firstimage ? replaceimage(results[i].firstimage) : "./img/icon/noimage.png";
// 					pdata.push({ "lng": results[i].mapx, "lat": results[i].mapy, "parent": "info_result" });
//
// 					document.getElementById("info_result_list").innerHTML += `
// 						<div id = "resultlist${i}" class="list-box" onclick="resultnumber(${parseInt(i + 1)})">
// 						<div id="info_result-circle${i}" class="result-circle">
// 							<div class="result-number">${parseInt(i + 1)}</div>
// 						</div>
// 						<div class="result-img"><img src="${imgURL}"></div>
// 						<div class="result-text">
// 							<div class="result-title">
// 								[${parseInt(i + 1)}] ${results[i].title}
// 							</div>
// 							<div class="result-addr">
// 								<i class='fas fa-map-marker-alt'></i>  ${results[i].addr1 ? results[i].addr1 : "주소정보 없음"}
// 							</div>
// 						</div>`;
// 					resultidinfo[i] = results[i];
// 				}
// 				info_result_map(pdata, "info_result_tmapview");
// 			}
// 		})
// 	});
// }

async function info_result_view(data) {
	console.log(`실행 : info_result_view() >>> data >>> `+data);

	document.getElementById("welcome").style.backgroundImage = ``;

	const getResult = async (wasDataNull = false) => {
		let myObj = [];
		let result = [];

		let smalltype = putsmalltype(data);
		if (smalltype.length === 1) Object.assign(data, {"cat3" : true});

		if (wasDataNull) {
			Object.assign(data, {"cat3" : false});
			result = await tourAPI("재검색", data);

			if(data.sleep) data.sleep = "숙박업소";
			else if(data.eat) data.eat = "음식점";
			else if(data.tour) data.tour = "관광지";
			smalltype = putsmalltype(data);

		} else {
			result = await tourAPI("지역검색", data);
		}

		console.log(smalltype);
		// type = datatype(data);
		// let myObj = await tourAPI("지역검색", data);

		smalltype.forEach(word => {
			result.forEach(element => {
				if(element.cat3 === word && element.mapx) {
					myObj.push(element);
				}
			});
		});
		console.log("myObj length >>> " + myObj.length);
		return myObj;
	}

	let results = await getResult();

	// 위치, 시설 받기
	// if (data.lon || data.lat) {
	// 	lon = data.lon;
	// 	lat = data.lat;
	// } else {
	// 	place = dataplace(data.place);
	// }

	if (results.length < 1) {
		results = await getResult(true);

		if (results.length < 1) { //데이터가 없는 경우
			sendText("INFO_DATA_NULL");
			return;
		}
	}

	const count = 50;
	let index = 0;

	hideall();
	document.getElementById("info").style.display = 'block';
	document.getElementById("info_result").style.display = "block";
	document.getElementById("info_result_tmapview").innerHTML = "";

	const infoResultList = document.getElementById("info_result_list");
	infoResultList.innerHTML = `<span class="list-total-count" >총 ${results.length}건</span>`;

	infoResultList.style.height = (window.innerHeight - window.innerHeight/1.6) +"px";

	async function loadItems() {
		console.log("start with >>> "+ index)
		
		let temp = index+count > results.length ? results.length : index+count;
		let pdata = [];
		for(let i=index; i < temp; i++) { //console.log(" load more >>> "+i+ " / "+ count)
			const imgURL = results[i].firstimage ? replaceimage(results[i].firstimage) : "./img/icon/noimage.png";
			pdata.push({ "lng": results[i].mapx, "lat": results[i].mapy, "parent": "info_result" });
			
			infoResultList.innerHTML += `
				<div id = "resultlist${i}" class="list-box" onclick="resultnumber(${parseInt(i + 1)})">
					<div id="info_result-circle${i}" class="result-circle">
						<div class="result-number">${parseInt(i + 1)}</div>
					</div>
					<div class="result-img"><img src="${imgURL}"></div>
					<div class="result-text">
						<div class="result-title">
							[${parseInt(i + 1)}] ${results[i].title}
						</div>
						<div class="result-addr">
							<i class='fas fa-map-marker-alt'></i>  ${results[i].addr1 ? results[i].addr1 : "주소정보 없음"}
						</div>
					</div>
				</div>`;
			
			resultidinfo[i] = results[i];
		}
		
		document.getElementById("info_result_tmapview").innerHTML = "";
		info_result_map(pdata, "info_result_tmapview");
		index += count;

		const ioOptions = {
			root: null, //document.querySelector('.container'), // .container class를 가진 엘리먼트를 root로 설정. null일 경우 브라우저 viewport
			rootMargin: '20px', // rootMargin을 '10px 10px 10px 10px'로 설정
			threshold: 0.5 // target이 root에 진입시 : 0, root에 target의 50%가 있을 때 : 0.5, root에 target의 100%가 있을 때 : 1.0
		}
		
		const io = new IntersectionObserver( (entries, observer) => { 
			
			entries.forEach( async (entry) => {
				if (entry.isIntersecting) { //entry.intersectionRatio > 0
			
					infoResultList.innerHTML += `<div class="loading-spinner"></div>`;
					setTimeout( async  () => {
						loadItems();
						observer.unobserve(entry.target);

						const spinner = infoResultList.querySelector(".loading-spinner");
						spinner.parentNode.removeChild(spinner);
						console.log("removed")
					}, 260);
				}
			});
		}, ioOptions)
		
		if (results.length > temp) {
			const infoResultLastItem = document.querySelector(`#resultlist${temp-1}`);
			io.observe(infoResultLastItem); 
		}
	}

	loadItems();
}


/* 리스트 -> 상세페이지 */
function info_detail_view(data) {
	console.log("실행 : INFO_DETAIL_VIEW()");
	const tag = parseInt(data.info_number - 1);

	if( resultidinfo && !data.fallback ) {
		resultidinfo.map( (data, i) => {
			document.getElementById(`info_result-circle${i}`).style.backgroundColor = "#ffffff";
			document.getElementById(`resultlist${i}`).style.backgroundColor = "#ffffff";
		})

		document.getElementById(`info_result-circle${tag}`).style.backgroundColor = "#1ad3f1";
		document.getElementById(`resultlist${tag}`).style.backgroundColor = "#1ad3f1";

		setTimeout( ()=>drawDetail(data) , 1000);

	} else {
		document.getElementById("info_result_chara_image").setAttribute("src", "./img/p6-4_charafallback.png");
	}
}

function drawDetail_tourapi(data) {
	console.log(`실행 : drawDetail`);
	if(data.reco_detail) {
		document.getElementById("info").style.display = 'block';
		document.getElementById("info_result").style.display = "block";
	}
	document.getElementById("info_result_list").innerHTML = `
		<div id="info_detail_title" class="detail-title"></div>
		<div id="info_detail_etc" class="detail-etc"></div>
		<div id="info_detail_image" class="detail_info-img"></div>
		<h4>개요</h4>
		<div id="info_detail_descript" class="detail-descript"></div>
		<h4>시설정보</h4>
		<div id="info_detail_intro" class="detail-intro"></div>
		<div class="localfood_guide_04">
			<img src="./img/btn_ytb.png" alt="유튜브에서 더보기" onclick="sendText('유튜브에서 더보기')">
			<img src="./img/btn_insta.png" alt="인스타그램에서 더보기" onclick="sendText('인스타그램에서 더보기')">
		</div>
	`;

	document.getElementById("info_result_chara_image").setAttribute("src", "./img/p6-4_chara.png");

	const number = data.info_number;
	const type = resultidinfo[number - 1].contenttypeid;
	console.log("입력된 번호 : " + number + " 찾는 번호 : " + JSON.stringify(resultidinfo[number - 1]));
	resultidinfo[number - 1].selected = true;

	const xmladdr = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=${servicekey}&contentId=${resultidinfo[number - 1].contentid}&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&transGuideYN=Y&_type=json`;
	const xmladdr2 = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailIntro?ServiceKey=${servicekey}&contentTypeId=${type}&contentId=${resultidinfo[number - 1].contentid}&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&introYN=Y&_type=json&numOfRows=10000`;
	const xmladdr3 = `https://api.visitkorea.or.kr/openapi/service/rest/KorService/detailImage?ServiceKey=${servicekey}&contentTypeId=${type}&contentId=${resultidinfo[number - 1].contentid}&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&imageYN=Y&_type=json&numOfRows=10000`;

	fetch(xmladdr)
		.then( res => res.json() )
		.then( myObj => {
			console.log("1: json 응답 갯수 : " + myObj.response.body.totalCount + "개");
			const ITEM = myObj.response.body.items.item;

			const website = ITEM.homepage ?
				ITEM.homepage.substring( ITEM.homepage.indexOf(">")+1, ITEM.homepage.lastIndexOf("<") )
				: '';

			const pdata = { //tmap data
				Name: ITEM.title,
				Level: ITEM.mlevel,
				Lng: ITEM.mapx,
				Lat: ITEM.mapy
			};

			document.querySelector("#info_detail_title").innerHTML = `
<!--				<img src="./img/local_food_02.png" class="go_prev" onclick="sendText('이전으로')" >-->
				<div class="detail_title_text">${ITEM.title}</div>
				<img src="./img/info_detail_01.png" class="find_route" onclick="sendText('가는길알려줘')">`;
			//주소/홈페이지/전화번호
			document.querySelector("#info_detail_etc").innerHTML = `
				<i class='fas fa-map-marker-alt'></i> ${ITEM.addr1 ? ITEM.addr1 : "주소정보 없음"}<br>`;

			if(website) {
				document.querySelector("#info_detail_etc").innerHTML += `${website}<br>`;
			}
			if(ITEM.tel) {
				document.querySelector("#info_detail_etc").innerHTML += `${ITEM.tel}`;
			}

			//선택한 항목으로 지도 중심 옮기기 / 지도 핀 옮기기
			document.getElementById("info_result_tmapview").innerHTML = "";
			info_map(pdata, "info_result_tmapview");
			//Tmap 링크 생성
			tmaplink = `https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxef0befba10d74637b27b8d7a8acdd7aa&name=${pdata.Name}&lon=${pdata.Lng}&lat=${pdata.Lat}`;

			const imgURL = ITEM.firstimage ? replaceimage(ITEM.firstimage) : "./img/icon/noimage.png";
			document.querySelector("#info_detail_image").innerHTML = `<img src="${imgURL}">`;
			document.querySelector("#info_detail_descript").innerHTML = `${ITEM.overview}`;

			linkKeyword = ITEM.title; //sns에서 더보기

			//타이틀이 길 경우
			const marqueeTxt = document.querySelector(".detail_title_text");

			if (marqueeTxt.scrollWidth > marqueeTxt.offsetWidth) {
				marqueeTxt.classList.add("marquee");
			}
		});

	fetch(xmladdr2)
		.then( res => res.json() )
		.then( myObj => {
			console.log(`2: json 응답 갯수 : ${myObj.response.body.totalCount} 개`);
			const etcitem = myObj.response.body.items.item;
			const facilities = document.getElementById("info_detail_intro");

			if (type == 39) { //음식점
				//할인정보 대표메뉴 문의및안내 영업시간 포장가능 주차시설 예약안내 쉬는날
				if (etcitem.discountinfofood) facilities.innerHTML += `- 할인정보 : ${etcitem.discountinfofood}<br>`;
				if (etcitem.firstmenu) facilities.innerHTML += `- 대표메뉴 : ${etcitem.firstmenu}<br>`;
				if (etcitem.infocenterfood) facilities.innerHTML += `- 문의 및 안내 : ${etcitem.infocenterfood}<br>`;
				if (etcitem.opentimefood) facilities.innerHTML += `- 영업시간 : ${etcitem.opentimefood}<br>`;
				if (etcitem.packing) facilities.innerHTML += `- 포장가능 : ${etcitem.packing}<br>`;
				if (etcitem.parkingfood) facilities.innerHTML += `- 주차시설 : ${etcitem.parkingfood}<br>`;
				if (etcitem.reservationfood) facilities.innerHTML += `- 예약안내 : ${etcitem.reservationfood}<br>`;
				if (etcitem.restdatefood) facilities.innerHTML += `- 쉬는날 : ${etcitem.restdatefood}<br>`;

			} else if (type == 32) { //숙박시설
				//수용가능인원 입실시간 퇴실시간 객실내취사 문의및안내 주차시설 예약안내
				if (etcitem.accomcountlodging) facilities.innerHTML += `- 수용가능인원 : ${etcitem.accomcountlodging}<br>`;
				if (etcitem.checkintime) facilities.innerHTML += `- 입실시간 : ${etcitem.checkintime}<br>`;
				if (etcitem.checkouttime) facilities.innerHTML += `- 퇴실시간 : ${etcitem.checkouttime}<br>`;
				if (etcitem.chkcooking) facilities.innerHTML += `- 객실내 취사 여부 : ${etcitem.chkcooking}<br>`;
				if (etcitem.infocenterlodging) facilities.innerHTML += `- 문의 및 안내 : ${etcitem.infocenterlodging}<br>`;
				if (etcitem.parkinglodging) facilities.innerHTML += `- 주차시설 : ${etcitem.parkinglodging}<br>`;
				if (etcitem.reservationlodging) facilities.innerHTML += `- 예약안내 : ${etcitem.reservationlodging}<br>`;

			} else if (type == 12) { //관광지
				//수용인원 유모차대여 문의및안내 주차시설 쉬는날 이용시기 이용시간
				if (etcitem.accomcount) facilities.innerHTML += `- 수용인원 : ${etcitem.accomcount}<br>`;
				if (etcitem.chkbabycarriage) facilities.innerHTML += `- 유모차대여 정보 : ${etcitem.chkbabycarriage}<br>`;
				if (etcitem.infocenter) facilities.innerHTML += `- 문의 및 안내 : ${etcitem.infocenter}<br>`;
				if (etcitem.parking) facilities.innerHTML += `- 주차시설 : ${etcitem.parking}<br>`;
				if (etcitem.restdate) facilities.innerHTML += `- 쉬는날 : ${etcitem.restdate}<br>`;
				if (etcitem.useseason) facilities.innerHTML += `- 이용시기 : ${etcitem.useseason}<br>`;
				if (etcitem.usetime) facilities.innerHTML += `- 이용시간 : ${etcitem.usetime}<br>`;

			} else if (type == 14) { //문화시설
				//수용인원 유모차대여 문의및안내 주차시설 주차요금 쉬는날 이용요금 이용시간
				if (etcitem.accomcountculture) facilities.innerHTML += `- 수용인원 : ${etcitem.accomcountculture}<br>`;
				if (etcitem.chkbabycarriageculture) facilities.innerHTML += `- 유모차대여 정보 : ${etcitem.chkbabycarriageculture}<br>`;
				if (etcitem.Infocenterculture) facilities.innerHTML += `- 문의 및 안내 : ${etcitem.Infocenterculture}<br>`;
				if (etcitem.parkingculture) facilities.innerHTML += `- 주차시설 : ${etcitem.parkingculture}<br>`;
				if (etcitem.parkingfee) facilities.innerHTML += `- 주차요금 : ${etcitem.parkingfee}<br>`;
				if (etcitem.restdateculture) facilities.innerHTML += `- 쉬는날 : ${etcitem.restdateculture}<br>`;
				if (etcitem.usefee) facilities.innerHTML += `- 이용요금 : ${etcitem.usefee}<br>`;
				if (etcitem.usetimeculture) facilities.innerHTML += `- 이용시간 : ${etcitem.usetimeculture}<br>`;

			} else if (type == 38) { //쇼핑
				//유모차대여 장서는날 문의및안내 개장일 영업시간 주차시설 쉬는날 매장안내
				if (etcitem.chkbabycarriageshopping) facilities.innerHTML += `- 유모차대여 정보 : ${etcitem.chkbabycarriageshopping}<br>`;
				if (etcitem.fairday) facilities.innerHTML += `- 장서는 날 : ${etcitem.fairday}<br>`;
				if (etcitem.infocentershopping) facilities.innerHTML += `- 문의 및 안내 : ${etcitem.infocentershopping}<br>`;
				if (etcitem.opendateshopping) facilities.innerHTML += `- 개장일 : ${etcitem.opendateshopping}<br>`;
				if (etcitem.opentime) facilities.innerHTML += `- 영업시간 : ${etcitem.opentime}<br>`;
				if (etcitem.parkingshopping) facilities.innerHTML += `- 주차시설 : ${etcitem.parkingshopping}<br>`;
				if (etcitem.restdateshopping) facilities.innerHTML += `- 쉬는날 : ${etcitem.restdateshopping}<br>`;
				if (etcitem.shopguide) facilities.innerHTML += `- 매장안내 : ${etcitem.shopguide}<br>`;

			} else if (type == 28) { //레포츠
				//수용인원 유모차대여 애완동물동반 체험가능연령 문의및안내 개장기간 주차요금 주차시설 예약안내 쉬는날 입장료 이용시간
				if (etcitem.accomcountleports) facilities.innerHTML += `- 수용인원 : ${etcitem.accomcountleports}<br>`;
				if (etcitem.chkbabycarriageleports) facilities.innerHTML += `- 유모차대여 정보 : ${etcitem.chkbabycarriageleports}<br>`;
				if (etcitem.chkpetleports) facilities.innerHTML += `- 애완동물동반가능정보 : ${etcitem.chkpetleports}<br>`;
				if (etcitem.expagerangeleports) facilities.innerHTML += `- 체험 가능연령 : ${etcitem.expagerangeleports}<br>`;
				if (etcitem.infocenterleports) facilities.innerHTML += `- 문의 및 안내 : ${etcitem.infocenterleports}<br>`;
				if (etcitem.openperiod) facilities.innerHTML += `- 개장기간 : ${etcitem.openperiod}<br>`;
				if (etcitem.parkingfeeleports) facilities.innerHTML += `- 주자요금 : ${etcitem.parkingfeeleports}<br>`;
				if (etcitem.parkingleports) facilities.innerHTML += `- 주차시설 : ${etcitem.parkingleports}<br>`;
				if (etcitem.reservation) facilities.innerHTML += `- 예약안내 : ${etcitem.reservation}<br>`;
				if (etcitem.restdateleports) facilities.innerHTML += `- 쉬는날 : ${etcitem.restdateleports}<br>`;
				if (etcitem.usefeeleports) facilities.innerHTML += `- 입장료 : ${etcitem.usefeeleports}<br>`;
				if (etcitem.usetimeleports) facilities.innerHTML += `- 이용시간 : ${etcitem.usetimeleports}<br>`;
			}
		});

	fetch(xmladdr3).then( res => {
		res.json().then( myObj => {
			const count = myObj.response.body.totalCount;
			console.log(`3: json 응답 갯수 : ${count} 개`);
			var imageitem = myObj.response.body.items.item;
			console.log(imageitem);
			var moreimgs = document.getElementById("info_detail_image");

			if (count == 1) {
				moreimgs.innerHTML += `<img src="${replaceimage(imageitem.smallimageurl)}">`;
			} else if (count > 1) {
				for (var i = 0; i < count; i++) {
					moreimgs.innerHTML += `<img src="${replaceimage(imageitem[i].smallimageurl)}">`; //originimgurl
				}
			}
		})
	})
}

async function drawDetail(data) {
	console.log(`실행 : drawDetail`);
	if(data.reco_detail) {
		document.getElementById("info").style.display = 'block';
		document.getElementById("info_result").style.display = "block";
		// 스크롤 되지 않는 문제 수정
		document.getElementById("info_result_list").style.height = (window.innerHeight - window.innerHeight/1.6) +"px";
	}

	document.getElementById("info_result_list").innerHTML = `
		<div id="info_detail_title" class="detail-title"></div>
		<div id="info_detail_etc" class="detail-etc"></div>
		<div id="info_detail_image" class="detail_info-img"></div>
		<h4>개요</h4>
		<div id="info_detail_descript" class="detail-descript"></div>
		<h4>시설정보</h4>
		<div id="info_detail_intro" class="detail-intro"></div>
		<div class="localfood_guide_04">
			<img src="./img/btn_ytb.png" alt="유튜브에서 더보기" onclick="sendText('유튜브에서 더보기')">
			<img src="./img/btn_insta.png" alt="인스타그램에서 더보기" onclick="sendText('인스타그램에서 더보기')">
		</div>
	`;

	document.getElementById("info_result_chara_image").setAttribute("src", "./img/p6-4_chara.png");


	let number;
	if (data.info_number) {
		number = data.info_number - 1
		resultidinfo[number].selected = true;
	}

	const jsonData = await tourAPI("상세정보", data, resultidinfo[number])
	jsonData.map( myObj => {

		const website = myObj.homepage ?
			myObj.homepage.substring( myObj.homepage.indexOf(">")+1, myObj.homepage.lastIndexOf("<") )
			: '';

		const pdata = { //tmap myObj
			Lng: myObj.mapx,
			Lat: myObj.mapy,
			Name: myObj.title
			// Level: myObj.mlevel
		};

		document.querySelector("#info_detail_title").innerHTML = `
<!--			<img src="./img/local_food_02.png" class="go_prev" onclick="sendText('이전으로')" > -->
			<div class="detail_title_text">${myObj.title}</div>
			<img src="./img/info_detail_01.png" class="find_route" onclick="sendText('가는길알려줘')">`;
		//주소/홈페이지/전화번호
		document.querySelector("#info_detail_etc").innerHTML = `
			<i class='fas fa-map-marker-alt'></i> ${myObj.addr1 ? myObj.addr1 : "주소정보 없음"}<br>`;

		if(website) {
			document.querySelector("#info_detail_etc").innerHTML += `${website}<br>`;
		}
		if(myObj.tel) {
			document.querySelector("#info_detail_etc").innerHTML += `${myObj.tel}`;
		}

		//선택한 항목으로 지도 중심 옮기기 / 지도 핀 옮기기
		document.getElementById("info_result_tmapview").innerHTML = "";
		info_map(pdata, "info_result_tmapview");
		//Tmap 링크 생성
		tmaplink = `https://apis.openapi.sk.com/tmap/app/routes?appKey=l7xxef0befba10d74637b27b8d7a8acdd7aa&name=${pdata.Name}&lon=${pdata.Lng}&lat=${pdata.Lat}`;

		// const imgURL = myObj.firstimage ? replaceimage(myObj.firstimage) : "./img/icon/noimage.png";
		if(myObj.firstimage) document.querySelector("#info_detail_image").innerHTML = `<img src="${myObj.firstimage}">`;
		// document.querySelector("#info_detail_image").innerHTML = `<img src="${imgURL}">`;
		document.querySelector("#info_detail_descript").innerHTML = `${myObj.overview}`;

		linkKeyword = myObj.title; //sns에서 더보기

		//타이틀이 길 경우
		const marqueeTxt = document.querySelector(".detail_title_text");

		if (marqueeTxt.scrollWidth > marqueeTxt.offsetWidth) {
			marqueeTxt.classList.add("marquee");
		}

		const facilities = document.getElementById("info_detail_intro");

		if (myObj.chkbabycarriage) facilities.innerHTML += `- 유모차대여 정보 : ${myObj.chkbabycarriage}<br>`;
		if (myObj.accomcount) facilities.innerHTML += `- 수용인원 : ${myObj.accomcount}<br>`;
		if (myObj.infocenter) facilities.innerHTML += `- 문의 및 안내 : ${myObj.infocenter}<br>`;
		if (myObj.parking) facilities.innerHTML += `- 주차시설 : ${myObj.parking}<br>`;
		if (myObj.parkingfee) facilities.innerHTML += `- 주차요금 : ${myObj.parkingfee}<br>`;
		if (myObj.reservation) facilities.innerHTML += `- 예약안내 : ${myObj.reservation}<br>`;
		if (myObj.restdate) facilities.innerHTML += `- 쉬는날 : ${myObj.restdate}<br>`;
		if (myObj.chkpet) facilities.innerHTML += `- 애완동물동반가능정보 : ${myObj.chkpet}<br>`;
		if (myObj.opentime) facilities.innerHTML += `- 영업시간 : ${myObj.opentime}<br>`;
		if (myObj.usetime) facilities.innerHTML += `- 이용시간 : ${myObj.usetime}<br>`;
		if (myObj.usefee) facilities.innerHTML += `- 이용요금 : ${myObj.usefee}<br>`;
		//음식점 only
		if (myObj.discountinfofood) facilities.innerHTML += `- 할인정보 : ${myObj.discountinfofood}<br>`;
		if (myObj.firstmenu) facilities.innerHTML += `- 대표메뉴 : ${myObj.firstmenu}<br>`;
		if (myObj.packing) facilities.innerHTML += `- 포장가능 : ${myObj.packing}<br>`;
		//관광지 only
		if (myObj.useseason) facilities.innerHTML += `- 할인정보 : ${myObj.useseason}<br>`;
		//숙박시설 only
		if (myObj.checkintime) facilities.innerHTML += `- 입실시간 : ${myObj.checkintime}<br>`;
		if (myObj.checkouttime) facilities.innerHTML += `- 퇴실시간 : ${myObj.checkouttime}<br>`;
		if (myObj.chkcooking) facilities.innerHTML += `- 객실내 취사 여부 : ${myObj.chkcooking}<br>`;
		//레포츠 only
		if (myObj.expagerange) facilities.innerHTML += `- 체험 가능연령 : ${myObj.expagerange}<br>`;
		if (myObj.openperiod) facilities.innerHTML += `- 개장기간 : ${myObj.openperiod}<br>`;
		//쇼핑 only
		if (myObj.opendate) facilities.innerHTML += `- 개장일 : ${myObj.opendate}<br>`;
		if (myObj.fairday) facilities.innerHTML += `- 장서는날 : ${myObj.fairday}<br>`;
		if (myObj.saleitem) facilities.innerHTML += `- 판매 품목 : ${myObj.saleitem}<br>`;
	});
	// });

	fetch(`https://actions.o2o.kr/devsvr10/finddetailimg?contentid=${resultidinfo[number].contentid}`)
		.then( res => res.json() )
		.then( jsonData => {
		console.log(`3: json 응답 갯수 : ${jsonData.length} 개 \n data >>> ${JSON.stringify(jsonData)}`);
		
		jsonData.map( obj => {
			document.getElementById("info_detail_image").innerHTML += `
				<img src="${replaceimage(obj.smallimageurl)}">
			`; //originimgurl
		})
	});

}

function findLocalFoodStores(data) {
	console.log("실행 : findLocalFoodStores() , data.food >> "+data.food);

	if (data.fallback) {
		// 3번 전까지 호랑이 땀흘리는 사진 넣기
		document.getElementById("info_result_chara_image").setAttribute("src", `./img/p17.png`);
	} else {
		document.getElementById("info_result_chara_image").setAttribute("src", `./img/p6-2_chara.png`);
	}

	fetch(`https://actions.o2o.kr/devsvr10/findfoodplace?localfood=${data.food}`)
	// fetch(`${dblink}findfoodplace?localfood=${data.food}`)
	.then( res => res.json())
	.then( data => {

		hideall();
		document.getElementById("info").style.display = 'block';
		document.getElementById("info_result").style.display = "block";
		document.getElementById("info_result_tmapview").innerHTML = "";
		document.getElementById("info_result_list").innerHTML = `
			<span class="list-total-count" >총 ${data.length}건</span>`;
		
		document.getElementById("info_result_list").style.height = (window.innerHeight - window.innerHeight/1.6) +"px";

		let pdata = []; //long,lat
		resultidinfo = []; //reset
		data.map( (obj, i) => {

			let imgURL = obj.imageurl ? replaceimage(obj.imageurl) : "./img/icon/noimage.png";
			document.getElementById("info_result_list").innerHTML += `
				<div id = "resultlist${i}" class="list-box" onclick="resultnumber(${parseInt(i + 1)})">
					<div id="info_result-circle${i}" class="result-circle">
						<div class="result-number">${parseInt(i + 1)}</div>
					</div>
					<div class="result-img"><img src="${imgURL}"></div>
					<div class="result-text">
						<div class="result-title">
							[${parseInt(i + 1)}] ${obj.title}
						</div>
						<div class="result-addr">
							<i class='fas fa-map-marker-alt'></i> ${obj.address ? obj.address : "주소정보 없음"}
						</div>
					</div>
				</div>`;

			pdata.push({ "lng": obj.longitude, "lat": obj.latitude, "parent": "info_result" });
			resultidinfo[i] = obj;
		})
		info_result_map(pdata, "info_result_tmapview");
	});
}

function aboutKw(){
	hideall();
	const abtKw = document.getElementById("abt_kw");
	abtKw.style.display = "block";

	abtKw.innerHTML = `
		<div class="abt_kw_cat">
			<div class="about_place">
				<h3>강원도 대표 관광지</h3>
				<div class="card_list" id="tour_places"></div>
			</div>
			<div class="about_place">
				<h3>지역별 대표 음식</h3>
				<div id="local_food_list" class="card_list"></div>
			</div>
		</div>
	`;

	fetch(`${dblink}localfood`)
		.then( res => res.json() )
		.then( data => {
			const listDiv = document.getElementById("local_food_list");
			data.map( obj => {
				listDiv.innerHTML += `
					<div class="card_row" id="local_food_${obj.id}" onclick="sendText('${obj.locationname} 대표음식')" >
						<img src="${obj.imageurl}" alt="${obj.localfood} 이미지">
						<h5>${obj.locationname}</h5>
						<p>${obj.localfood}</p>
					</div>
				`;
			})
		});

	const ranNum = genRandomNo(4, 20);
	ranNum.map( data => {
		document.getElementById("tour_places").innerHTML += `
			<img src="./img/places/${data}.png" onclick="sendText('${tourPlaces[data-1]} 찾아줘')" >`;
	});

}

/* 지역별 음식 소개 */
function localFood(data) {
	hideall();
	document.getElementById("region").style.display = "block";

	// const url = `https://actions.o2o.kr/devsvr10/findlocalfood?locationname=${data.region}`
	const url = `${dblink}findlocalfood?locationname=${data.region}`
	fetch(url)
		.then( res => res.json() )
		.then( data => {
			data.map( obj => {
				linkKeyword = obj.localfood
				document.getElementById("region").innerHTML = `
					<div id="local_info_result">
						<div class="localfood_guide_01">
							<span>'${obj.localfood} 파는 곳 알려줘'<br>
							라고 말해보세요!</span>
						</div>
						<img src="${obj.imageurl}" alt="${obj.localfood} 이미지">
						<div class="localfood_guide_02">
<!--							<img src="./img/local_food_02.png" class="go_prev" onclick="sendText('이전으로')" > -->
							${obj.localfood}
							<img src="./img/local_food_03.png" class="find_route" onclick="sendText('${obj.localfood} 파는 곳 알려줘')">
						</div>
						<div class="localfood_guide_03">
							<h4>${obj.localfood}란?</h4>
							<div class="detail-descript-local">${obj.description}</div>
						</div>
						<div class="localfood_guide_04">
							<img src="./img/btn_ytb.png" alt="유튜브에서 더보기" onclick="sendText('유튜브에서 더보기')">
							<img src="./img/btn_insta.png" alt="인스타그램에서 더보기" onclick="sendText('인스타그램에서 더보기')">
						</div>
					</div>
				`;
			})
		});
}


function info_detail_link_view(data) {
	console.log("실행 : info_detail_link_view()");
	let selected;
	resultidinfo.forEach(function(word){
		if(word.selected) selected = word;
	});
	console.log(selected);

	// '가는길 알려줘' => 티맵 이동 modal화면
	if (data.link == "티맵") {
		document.getElementById("endImage").style.display = "table";
		document.getElementsByClassName("modal")[0].innerHTML = `
			<div class="info_detail_link_name">
				<div class="detail_link_title">${selected.title}</div>
				<i class="fa" onclick="closeModal()" aria-hidden="true">×</i>
			</div>
			<img src="./img/p7.png" width="100%" height:"auto">
			<div class="tmap-connect" onclick="goToPage(tmaplink)">연결</div>
			<map name="tmap-map">
			<area alt="연결" title="연결" onclick="goToPage(tmaplink)" coords="321,1091,612,1212" shape="rect">
			`;
		document.getElementsByClassName("modal")[0].style.backgroundImage = "none";
		// document.getElementsByClassName("modal")[0].style.height = "auto";

		//타이틀이 길 경우 스크롤
		const xMark = document.querySelector(".fa");
		const modal = document.querySelector(".modal");
		const marqueeTxt = document.querySelector(".detail_link_title");

		marqueeTxt.style.marginRight = `${modal.offsetWidth - xMark.offsetLeft}px`;

		if (marqueeTxt.scrollWidth > marqueeTxt.offsetWidth) {
			marqueeTxt.classList.add("marquee");
		}

	} else { //youtube, instragram에서 더보기
		datalink(data.link);
	}
}

function info_result_option_eat_view_legacy(data) {
	console.log("실행 : info_result_option_eat_view(), data >>> "+ JSON.stringify(data));
	let fallback;
	if(data.fallback) fallback = data.fallback;

	if(fallback){
		document.getElementById("eatimage").setAttribute("src", "./img/p12-1fallback.png");
	} else {
		document.getElementById("eatimage").setAttribute("src", "./img/p12-1.png");
	}

	hideall();
	document.getElementById("welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.getElementById("welcome").style.backgroundImage = `url("./img/background.png")`;
	document.getElementById("eat").style.display = "block";
	$('img[usemap]').trigger("click");
}

function info_result_option_eat_view(data) {
	console.log("실행 : info_result_option_eat_view(), data >>> "+ JSON.stringify(data));
	let fallback;
	if(data.fallback) fallback = data.fallback;

	hideall();
	document.querySelector("#welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.querySelector("#welcome").style.backgroundImage = `url("./img/background.png")`;
	if(document.querySelector("#eatWindow")) {
		let window = document.querySelector("#eatWindow");
		document.querySelector("#welcome").removeChild(window);
	}

	const eatWindow = document.createElement("div");
	document.querySelector("#welcome").appendChild(eatWindow);

	eatWindow.setAttribute("id", "sleepWindow");
	eatWindow.setAttribute("class", "option");
	eatWindow.style.backgroundImage = `url("./img/bg.png")`
	eatWindow.style.display = "block";

	const eatDiv = document.createElement("div");
	eatDiv.setAttribute("id", "eatDiv");
	eatDiv.setAttribute("class", "questionDiv");
	eatWindow.appendChild(eatDiv);

	const eatQuestion = document.createElement("div");
	eatQuestion.textContent = `언제 식사하실 예정인가요?`;
	eatQuestion.setAttribute("class", "question");
	eatDiv.appendChild(eatQuestion);

	let eatImage = [{"아침":"./img/icon/breakfast.png"}, {"점심":"./img/icon/lunch.png"}, {"저녁":"./img/icon/dinner.png"}];
	for (let i=0; i<eatImage.length; i++){
		const optionContainer = document.createElement("div");
		optionContainer.setAttribute("class", "selectionBox eatBox");
		const Imagetag = document.createElement("img");
		Imagetag.setAttribute("src", Object.values(eatImage[i])[0]);
		// Imagetag.setAttribute("class", "iconOption");
		optionContainer.setAttribute("onclick", `sendText("${Object.keys(eatImage[i])[0]}")`);
		optionContainer.textContent += Object.keys(eatImage[i])[0];
		optionContainer.appendChild(Imagetag);
		eatDiv.appendChild(optionContainer);
	}

	const charaDiv = document.createElement("div");
	charaDiv.setAttribute("class", "charaDiv");
	eatWindow.appendChild(charaDiv);

	const charaImage = document.createElement("img");
	charaImage.setAttribute("src", "./img/icon/ani_4.png");
	if(fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
	charaImage.setAttribute("class", "charaImage");
	charaDiv.appendChild(charaImage);
}

function info_result_option_sleep_view_legacy(data) {
	console.log("실행 : info_result_option_sleep_view(), data >>> "+ JSON.stringify(data));
	let fallback;
	if(data.fallback) fallback = data.fallback;

	if(fallback){
		document.getElementById("sleepimage").setAttribute("src", "./img/p6-1fallback.png");
	} else {
		document.getElementById("sleepimage").setAttribute("src", "./img/p6-1.png");
	}


	hideall();
	document.getElementById("welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.getElementById("welcome").style.backgroundImage = `url("./img/background.png")`;
	document.getElementById("sleep").style.display = "block";
}

function info_result_option_sleep_view(data) {
	console.log("실행 : info_result_option_sleep_view(), data >>> "+ JSON.stringify(data));
	let fallback;
	if(data.fallback) fallback = data.fallback;

	hideall();
	document.querySelector("#welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.querySelector("#welcome").style.backgroundImage = `url("./img/background.png")`;
	if(document.querySelector("#sleepWindow")) {
		let window = document.querySelector("#sleepWindow");
		document.querySelector("#welcome").removeChild(window);
	}

	const sleepWindow = document.createElement("div");
	document.querySelector("#welcome").appendChild(sleepWindow);
	
	sleepWindow.setAttribute("id", "sleepWindow");
	sleepWindow.setAttribute("class", "option");
	sleepWindow.style.backgroundImage = `url("./img/bg.png")`
	sleepWindow.style.display = "block";

	const sleepDiv = document.createElement("div");
	sleepDiv.setAttribute("id", "sleepDiv");
	sleepDiv.setAttribute("class", "questionDiv");
	sleepWindow.appendChild(sleepDiv);

	const sleepQuestion = document.createElement("div");
	sleepQuestion.textContent = `어떤 숙소 유형을 알아볼까요 ?`;
	sleepQuestion.setAttribute("class", "question");
	sleepDiv.appendChild(sleepQuestion);

	let sleepImage = [{"호텔":"./img/icon/hotel.png"}, {"모텔":"./img/icon/motel.png"}, {"펜션":"./img/icon/pension.png"}, {"게스트하우스":"./img/icon/guesthouse.png"}, {"콘도":"./img/icon/condominium.png"}];
	for (let i=0; i<sleepImage.length; i++){
		const optionContainer = document.createElement("div");
		optionContainer.setAttribute("class", "selectionBox accoBox");
		const Imagetag = document.createElement("img");
		Imagetag.setAttribute("src", Object.values(sleepImage[i])[0]);
		Imagetag.setAttribute("class", "iconOption");
		optionContainer.setAttribute("onclick", `sendText("${Object.keys(sleepImage[i])[0]}")`);
		optionContainer.textContent += Object.keys(sleepImage[i])[0];
		optionContainer.appendChild(Imagetag);
		sleepDiv.appendChild(optionContainer);
	}

	const charaDiv = document.createElement("div");
	charaDiv.setAttribute("class", "charaDiv");
	sleepWindow.appendChild(charaDiv);

	const charaImage = document.createElement("img");
	charaImage.setAttribute("src", "./img/icon/ani_4.png");
	if(fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
	charaImage.setAttribute("class", "charaImage");
	charaDiv.appendChild(charaImage);
}

const info_result_option_tour_view_legacy = (data) => {
	console.log("실행 : info_result_option_tour_view(), data >>> "+ JSON.stringify(data));
	let fallback;
	if(data.fallback) fallback = data.fallback;

	if(fallback){
		document.getElementById("tourimage").setAttribute("src", "./img/p17-2fallback.png");
	} else {
		document.getElementById("tourimage").setAttribute("src", "./img/p17-2.png");
	}

	hideall();
	document.getElementById("welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.getElementById("welcome").style.backgroundImage = `url("./img/background.png")`;
	document.getElementById("tour").style.display = "block";
	$('img[usemap]').trigger("click");
}

function info_result_option_tour_view(data) {
	console.log("실행 : info_result_option_tour_view(), data >>> "+ JSON.stringify(data));
	let fallback;
	if(data.fallback) fallback = data.fallback;

	hideall();
	document.querySelector("#welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.querySelector("#welcome").style.backgroundImage = `url("./img/background.png")`;
	if(document.querySelector("#tourWindow")) {
		let window = document.querySelector("#tourWindow");
		document.querySelector("#welcome").removeChild(window);
	}

	const tourWindow = document.createElement("div");
	document.querySelector("#welcome").appendChild(tourWindow);

	tourWindow.setAttribute("id", "tourWindow");
	tourWindow.setAttribute("class", "option");
	tourWindow.style.backgroundImage = `url("./img/bg.png")`
	tourWindow.style.display = "block";

	const tourDiv = document.createElement("div");
	tourDiv.setAttribute("id", "tourDiv");
	tourDiv.setAttribute("class", "questionDiv");
	tourWindow.appendChild(tourDiv);

	const tourQuestion = document.createElement("div");
	tourQuestion.textContent = `원하시는 테마를 말씀해주세요!`;
	tourQuestion.setAttribute("class", "question");
	tourDiv.appendChild(tourQuestion);

	let tourImage = [{"액티비티":"./img/icon/activities.png"}, {"힐링":"./img/icon/healing.png"}, {"전통":"./img/icon/traditional.png"}, {"쇼핑":"./img/icon/shopping.png"}];
	for (let i=0; i<tourImage.length; i++){
		const optionContainer = document.createElement("div");
		optionContainer.setAttribute("class", "selectionBox tourBox");
		const Imagetag = document.createElement("img");
		Imagetag.setAttribute("src", Object.values(tourImage[i])[0]);
		Imagetag.setAttribute("class", "iconOption");
		optionContainer.setAttribute("onclick", `sendText("${Object.keys(tourImage[i])[0]}")`);
		optionContainer.textContent += Object.keys(tourImage[i])[0];
		optionContainer.appendChild(Imagetag);
		tourDiv.appendChild(optionContainer);
	}

	const charaDiv = document.createElement("div");
	charaDiv.setAttribute("class", "charaDiv");
	tourWindow.appendChild(charaDiv);

	const charaImage = document.createElement("img");
	charaImage.setAttribute("src", "./img/icon/ani_4.png");
	if(fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
	charaImage.setAttribute("class", "charaImage");
	charaDiv.appendChild(charaImage);
}

const info_result_option_heal_view_legacy = (data) => {
	console.log("실행 : info_result_option_heal_view(), data >>> "+ JSON.stringify(data));
	let fallback;
	if(data.fallback) fallback = data.fallback;

	if(fallback){
		document.getElementById("healimage").setAttribute("src", "./img/p17-3fallback.png");
	} else {
		document.getElementById("healimage").setAttribute("src", "./img/p17-3.png");
	}

	hideall();
	document.getElementById("welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.getElementById("welcome").style.backgroundImage = `url("./img/background.png")`;
	document.getElementById("heal").style.display = "block";
	$('img[usemap]').trigger("click");
}

function info_result_option_heal_view(data) {
	console.log("실행 : info_result_option_heal_view(), data >>> "+ JSON.stringify(data));
	let fallback;
	if(data.fallback) fallback = data.fallback;

	hideall();
	document.querySelector("#welcome").style.display = "block";
	document.querySelector("#welcome").style.marginTop = `${barHeight.toString()}px`;
	document.querySelector("#welcome").style.backgroundImage = `url("./img/background.png")`;
	if(document.querySelector("#healWindow")) {
		let window = document.querySelector("#healWindow");
		document.querySelector("#welcome").removeChild(window);
	}

	const healWindow = document.createElement("div");
	document.querySelector("#welcome").appendChild(healWindow);

	healWindow.setAttribute("id", "healWindow");
	healWindow.setAttribute("class", "option");
	healWindow.style.backgroundImage = `url("./img/bg.png")`
	healWindow.style.display = "block";

	const healDiv = document.createElement("div");
	healDiv.setAttribute("id", "healDiv");
	healDiv.setAttribute("class", "questionDiv");
	healWindow.appendChild(healDiv);

	const healQuestion = document.createElement("div");
	healQuestion.textContent = `어떤 힐링을 경험하고 싶으세요?`;
	healQuestion.setAttribute("class", "question");
	healDiv.appendChild(healQuestion);

	let healImage = [{"자연 속 힐링":"./img/icon/natural.png"}, {"문화 속 힐링":"./img/icon/cultural.png"}];
	for (let i=0; i<healImage.length; i++){
		const optionContainer = document.createElement("div");
		optionContainer.setAttribute("class", "selectionBox healBox");
		const Imagetag = document.createElement("img");
		Imagetag.setAttribute("src", Object.values(healImage[i])[0]);
		// Imagetag.setAttribute("class", "iconOption");
		optionContainer.setAttribute("onclick", `sendText("${Object.keys(healImage[i])[0]}")`);
		optionContainer.textContent += Object.keys(healImage[i])[0];
		optionContainer.appendChild(Imagetag);
		healDiv.appendChild(optionContainer);
	}

	const charaDiv = document.createElement("div");
	charaDiv.setAttribute("class", "charaDiv");
	healWindow.appendChild(charaDiv);

	const charaImage = document.createElement("img");
	charaImage.setAttribute("src", "./img/icon/ani_4.png");
	if(fallback) charaImage.setAttribute("src", "./img/icon/ani_3.png");
	charaImage.setAttribute("class", "charaImage");
	charaDiv.appendChild(charaImage);
}