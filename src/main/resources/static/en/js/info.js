// import './common.js'
const tourPlaces = [
	'Goseokjeong National Tourist Area',
	'Naksansa Temple',
	'Namiseom Island',
	'Daegwallyeong Sheep Ranch',
	'Hwanseongul Cave Daeiri Cave System',
	'Dutayeonpokpo Falls Gangwon Peace National Geopark',
	'Mureunggyegok Valley',
	'Yoseonjeong Pavilion Yoseonam Rock',
	'Seoraksan National Park Visitor Center',
	'Sutasa Temple',
	'Woljeongsa Temple Fir Tree Forest',
	'Wondaeri Birch Forest',
	'Jeongseon Arirang Market',
	'Taebaeksan National Park',
	'Goseong Unification Observation Tower',
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
		<span class="list-total-count" >Results number : ${resultidinfo.length}</span>`;

	document.getElementById("info_result_list").style.height = (window.innerHeight - window.innerHeight/1.6) +"px";

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
 */
async function info_search_detail_view(data) {
	console.log("실행 : info_search_detail_view() >>> "+JSON.stringify(data));

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
			<h4>General</h4>
			<div id="info_detail_descript" class="detail-descript"></div>
			<h4>Facility Information</h4>
			<div id="info_detail_intro" class="detail-intro"></div>
			<div class="localfood_guide_04">
				<img src="./img/btn_ytb.png" alt="유튜브에서 더보기" onclick="sendText('Show more in Youtube')">
				<img src="./img/btn_insta.png" alt="인스타그램에서 더보기" onclick="sendText('Show more in Instagram')">
			</div>
		`;

		document.getElementById("info_result_chara_image").setAttribute("src", "./img/p6-4_chara.png");

		const jsonData = await tourAPI("상세정보", data, resultidinfo[0])
		jsonData.map( myObj => {
			console.log("1: json 응답 갯수 : " + myObj.length + "개");
			console.log("222222222 " + JSON.stringify(myObj) );

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

			if (myObj.chkbabycarriage) facilities.innerHTML += `- Stroller rental availability: ${myObj.chkbabycarriage}<br>`;
			if (myObj.accomcount) facilities.innerHTML += `- Capacity : ${myObj.accomcount}<br>`;
			if (myObj.infocenter) facilities.innerHTML += `- Information : ${myObj.infocenter}<br>`;
			if (myObj.parking) facilities.innerHTML += `- Parking availability : ${myObj.parking}<br>`;
			if (myObj.parkingfee) facilities.innerHTML += `- Parking fee : ${myObj.parkingfee}<br>`;
			if (myObj.reservation) facilities.innerHTML += `- Reservation : ${myObj.reservation}<br>`;
			if (myObj.restdate) facilities.innerHTML += `- Closed : ${myObj.restdate}<br>`;
			if (myObj.chkpet) facilities.innerHTML += `- Pets allowed : ${myObj.chkpet}<br>`;
			if (myObj.opentime) facilities.innerHTML += `- Opening hours : ${myObj.opentime}<br>`;
			if (myObj.usetime) facilities.innerHTML += `- Business hours : ${myObj.usetime}<br>`;
			if (myObj.usefee) facilities.innerHTML += `- Usage fee : ${myObj.usefee}<br>`;
			//음식점 only
			if (myObj.discountinfofood) facilities.innerHTML += `- Discount info : ${myObj.discountinfofood}<br>`;
			if (myObj.firstmenu) facilities.innerHTML += `- Representative menu : ${myObj.firstmenu}<br>`;
			if (myObj.packing) facilities.innerHTML += `- Packing availability : ${myObj.packing}<br>`;
			//관광지 only
			if (myObj.useseason) facilities.innerHTML += `- Discount info : ${myObj.useseason}<br>`; // 데이터 없음
			//숙박시설 only
			if (myObj.checkintime) facilities.innerHTML += `- Check-in time : ${myObj.checkintime}<br>`;
			if (myObj.checkouttime) facilities.innerHTML += `- Check-out time : ${myObj.checkouttime}<br>`;
			if (myObj.chkcooking) facilities.innerHTML += `- Self-catering : ${myObj.chkcooking}<br>`;
			//레포츠 only
			//contenttypeid가 75일 때 -> 체험 연령(expagerange) / 76일 때 -> 체험 내용(expguide)
			if (myObj.expagerange) {
				if (myObj.contenttypeid == 75) facilities.innerHTML += `- Age limit : ${myObj.expagerange}<br>`;
				if (myObj.contenttypeid == 76) facilities.innerHTML += `- Experience guide : ${myObj.expagerange}<br>`;
			}
			if (myObj.openperiod) facilities.innerHTML += `- Open period : ${myObj.openperiod}<br>`; // 데이터 없음
			//쇼핑 only
			if (myObj.opendate) facilities.innerHTML += `- Open date : ${myObj.opendate}<br>`; // 데이터 없음
			if (myObj.fairday) facilities.innerHTML += `- Market day : ${myObj.fairday}<br>`; // 데이터 없음
			if (myObj.saleitem) facilities.innerHTML += `- Sale item : ${myObj.saleitem}<br>`; // 데이터 없음
		});

		// fetch(`https://actions.o2o.kr/devsvr10/finddetailimg?contentid=${resultidinfo[0].contentid}&lang=en`)
		fetch(`${dblink}finddetailimg?contentid=${resultidinfo[0].contentid}&lang=en`)
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

/**
 * API 검색 결과 리스트를 띄우는 화면
 * @param {*} data Fulfillment로부터 받은 데이터
 * @param {*} wasDataNull 검색 결과가 0개인 오류를 받았었는가
 */
function info_result_view_before(data, wasDataNull) {

	if (data.fallback || wasDataNull) { // 3번 전까지 호랑이 땀흘리는 사진 넣기
		document.getElementById("info_result_chara_image").setAttribute("src", `./img/p17.png`);
	} else {
		document.getElementById("info_result_chara_image").setAttribute("src", `./img/p6-2_chara.png`);
	}

	// 쿼리 생성
	let place, type, lon, lat;
	let smalltype = [];

	// 위치, 시설 받기
	if (data.lon || data.lat) {
		lon = data.lon;
		lat = data.lat;
	} else {
		place = dataplace(data.place);
	}

	type = datatype(data);
	smalltype = putsmalltype(data);

	var xmladdr = data.lon || data.lat
		? `http://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList?ServiceKey=${servicekey}&contentTypeId=${type}&mapX=${lon}&mapY=${lat}&radius=2000&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=A&numOfRows=10000&pageNo=1&_type=json`
		: `http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList?ServiceKey=${servicekey}&contentTypeId=&areaCode=32&listYN=Y&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&arrange=A&numOfRows=10000&pageNo=1&sigunguCode=${place}&_type=json`;

	fetch(xmladdr).then( response => {
		response.json().then( myObj => {
			console.log(myObj);
			console.log(smalltype); //소분류
			const count = myObj.response.body.totalCount;
			let pdata = [];
			let results = [];

			const ITEM = myObj.response.body.items.item;

			if (count == 0) {
				sendText("INFO_DATA_NULL");
			} else if (count == 1) {
				results[0] = ITEM;
			} else {
				if (!wasDataNull) {
					for (var addItem = 0; addItem < ITEM.length; addItem++) {
						smalltype.forEach( word => {
							if (ITEM[addItem].cat3 == word) {
								results.push(ITEM[addItem]);
							}
						})
					}
				} else {
					results = ITEM;
				}
			}

			if (results.length < 1) {
				sendText("INFO_DATA_NULL");
			} else {
				hideall();
				document.getElementById("info").style.display = 'block';
				document.getElementById("info_result").style.display = "block";
				document.getElementById("info_result_tmapview").innerHTML = "";
				document.getElementById("info_result_list").innerHTML = `
					<span class="list-total-count" >Total ${results.length} results</span>`;

				for (var i = 0; i < results.length; i++) {
					var imgURL = results[i].firstimage ? replaceimage(results[i].firstimage) : "./img/icon/noimage.png";
					pdata.push({ "lng": results[i].mapx, "lat": results[i].mapy, "parent": "info_result" });

					document.getElementById("info_result_list").innerHTML += `
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
						</div>`;
					resultidinfo[i] = results[i];
				}
				info_result_map(pdata, "info_result_tmapview");
			}
		})
	});
}

async function info_result_view(data) {
	console.log(`실행 : info_result_view()`);
	console.log(data);

	document.getElementById("welcome").style.backgroundImage = ``;

	// if (data.fallback) {
	// 	// 3번 전까지 호랑이 땀흘리는 사진 넣기
	// 	document.getElementById("info_result_chara_image").setAttribute("src", `./img/p17.png`);
	// } else {
	// 	document.getElementById("info_result_chara_image").setAttribute("src", `./img/p6-2_chara.png`);
	// }

	const getResult = async (wasDataNull = false) => {
		let myObj = [];

		let smalltype = putsmalltype(data);
		if (smalltype.length === 1) Object.assign(data, {"cat3" : true});

		let result;
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
		console.log("myObj length >>>  \n" + myObj.length);
		console.log(myObj);

		return myObj;
	}

	let results = await getResult();

	if (results.length < 1) {
		results = await getResult(true);
		if (results.length < 1) sendText("INFO_DATA_NULL");
	}

	const count = 50;
	let index = 0;

	hideall();
	document.getElementById("info").style.display = 'block';
	document.getElementById("info_result").style.display = "block";
	document.getElementById("info_result_tmapview").innerHTML = "";
	const infoResultList = document.getElementById("info_result_list");
	infoResultList.innerHTML = `
		<span class="list-total-count" >Total ${results.length} results</span>`;

	infoResultList.style.height = (window.innerHeight - window.innerHeight/1.65) +"px";


	function loadItems() { console.log("start with >>> "+ index)
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
			rootMargin: '1px', // rootMargin을 '10px 10px 10px 10px'로 설정
			threshold: [0, 0.5, 1] // 타겟 엘리먼트가 교차영역에 진입했을 때, 교차영역에 타켓 엘리먼트의 50%가 있을 때, 교차 영역에 타켓 엘리먼트의 100%가 있을 때 observe가 반응한다.
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
		<h4>General</h4>
		<div id="info_detail_descript" class="detail-descript"></div>
		<h4>Facility Information</h4>
		<div id="info_detail_intro" class="detail-intro"></div>
		<div class="localfood_guide_04">
			<img src="./img/btn_ytb.png" alt="유튜브에서 더보기" onclick="sendText('Show more in Youtube')">
			<img src="./img/btn_insta.png" alt="인스타그램에서 더보기" onclick="sendText('Show more in Instagram')">
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
				if (etcitem.discountinfofood) facilities.innerHTML += `- Discount Info : ${etcitem.discountinfofood}<br>`;
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
		<h4>General</h4>
		<div id="info_detail_descript" class="detail-descript"></div>
		<h4>Facility Information</h4>
		<div id="info_detail_intro" class="detail-intro"></div>
		<div class="localfood_guide_04">
			<img src="./img/btn_ytb.png" alt="유튜브에서 더보기" onclick="sendText('Show more in Youtube')">
			<img src="./img/btn_insta.png" alt="인스타그램에서 더보기" onclick="sendText('Show more in Instagram')">
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

		if (myObj.chkbabycarriage) facilities.innerHTML += `- Stroller rental availability: ${myObj.chkbabycarriage}<br>`;
		if (myObj.accomcount) facilities.innerHTML += `- Capacity : ${myObj.accomcount}<br>`;
		if (myObj.infocenter) facilities.innerHTML += `- Information : ${myObj.infocenter}<br>`;
		if (myObj.parking) facilities.innerHTML += `- Parking availability : ${myObj.parking}<br>`;
		if (myObj.parkingfee) facilities.innerHTML += `- Parking fee : ${myObj.parkingfee}<br>`;
		if (myObj.reservation) facilities.innerHTML += `- Reservation : ${myObj.reservation}<br>`;
		if (myObj.restdate) facilities.innerHTML += `- Closed : ${myObj.restdate}<br>`;
		if (myObj.chkpet) facilities.innerHTML += `- Pets allowed : ${myObj.chkpet}<br>`;
		if (myObj.opentime) facilities.innerHTML += `- Opening hours : ${myObj.opentime}<br>`;
		if (myObj.usetime) facilities.innerHTML += `- Business hours : ${myObj.usetime}<br>`;
		if (myObj.usefee) facilities.innerHTML += `- Usage fee : ${myObj.usefee}<br>`;
		//음식점 only
		if (myObj.discountinfofood) facilities.innerHTML += `- Discount info : ${myObj.discountinfofood}<br>`;
		if (myObj.firstmenu) facilities.innerHTML += `- Representative menu : ${myObj.firstmenu}<br>`;
		if (myObj.packing) facilities.innerHTML += `- Packing availability : ${myObj.packing}<br>`;
		//관광지 only
		if (myObj.useseason) facilities.innerHTML += `- Discount info : ${myObj.useseason}<br>`; // 데이터 없음
		//숙박시설 only
		if (myObj.checkintime) facilities.innerHTML += `- Check-in time : ${myObj.checkintime}<br>`;
		if (myObj.checkouttime) facilities.innerHTML += `- Check-out time : ${myObj.checkouttime}<br>`;
		if (myObj.chkcooking) facilities.innerHTML += `- Self-catering : ${myObj.chkcooking}<br>`;
		//레포츠 only
		//contenttypeid가 75일 때 -> 체험 연령(expagerange) / 76일 때 -> 체험 내용(expguide)
		if (myObj.expagerange) {
			if (myObj.contenttypeid == 75) facilities.innerHTML += `- Age limit : ${myObj.expagerange}<br>`;
			if (myObj.contenttypeid == 76) facilities.innerHTML += `- Experience guide : ${myObj.expagerange}<br>`;
		}
		if (myObj.openperiod) facilities.innerHTML += `- Open period : ${myObj.openperiod}<br>`; // 데이터 없음
		//쇼핑 only
		if (myObj.opendate) facilities.innerHTML += `- Open date : ${myObj.opendate}<br>`; // 데이터 없음
		if (myObj.fairday) facilities.innerHTML += `- Market day : ${myObj.fairday}<br>`; // 데이터 없음
		if (myObj.saleitem) facilities.innerHTML += `- Sale item : ${myObj.saleitem}<br>`; // 데이터 없음
	});
	// });

	// fetch(`https://actions.o2o.kr/devsvr10/finddetailimg?contentid=${resultidinfo[number].contentid}&lang=en`)
	fetch(`${dblink}finddetailimg?contentid=${resultidinfo[number].contentid}&lang=en`)
		.then( res => res.json() )
		.then( jsonData => {
			console.log(`3: json 응답 갯수 : ${jsonData.length} 개 \n data >>> ${JSON.stringify(jsonData)}`);

			jsonData.map( obj => {
				if(obj.smallimageurl) {
					document.getElementById("info_detail_image").innerHTML += `
					<img src="${replaceimage(obj.smallimageurl)}">
					`; //originimgurl
				}
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

	// fetch(`https://actions.o2o.kr/devsvr10/findfoodplace?localfood=${data.food}&lang=en`)
	fetch(`${dblink}findfoodplace?localfood=${data.food}&lang=en`)
		.then( res => res.json())
		.then( data => {

			hideall();
			document.getElementById("info").style.display = 'block';
			document.getElementById("info_result").style.display = "block";
			document.getElementById("info_result_tmapview").innerHTML = "";
			document.getElementById("info_result_list").innerHTML = `
			<span class="list-total-count" >Total ${data.length} results</span>`;
			// 스크롤 되지 않는 문제 수정
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
	//abtKw div의 top값을 상단바 크기만큼 내리기 -> 그림 윗부분에 여백이 있어 (상단바 크기 - 35px)만큼 내리기
	abtKw.style.marginTop = `${(barHeight).toString()}px`;

	abtKw.innerHTML = `
		<div class="abt_kw_cat">
			<div class="about_gangwon">
				<div class="about_gangwon_picture">
					<img src="img/about_kw_map.png">
				</div>
				<div class="about_gangwon_description">Gangwon-do is located on the east part of the central part of the Korean Peninsula and is largely divided into Yeongdong and Yeongseo center of the Taebaek Mountain Range and is located in the warm climate zone.</div>
			</div>
			<div class="about_place">
				<h3>Favorite Tourist Destinations</h3>
				<div class="card_list" id="tour_places"></div>
			</div>
			<div class="about_place">
				<h3>Regional Representative Foods</h3>
				<div id="local_food_list" class="card_list"></div>
			</div>
		</div>
	`;

	// fetch('https://actions.o2o.kr/devsvr10/localfood?lang=en')
	fetch(`${dblink}localfood?lang=en`)
		.then( res => res.json() )
		.then( data => {
			const listDiv = document.getElementById("local_food_list");
			data.map( obj => {
				listDiv.innerHTML += `
					<div class="card_row" id="local_food_${obj.id}" onclick="sendText('What is famous food at ${transplace(obj.locationname)}')">
						<img src="${obj.imageurl}" alt="${obj.localfood} 이미지">
						<h5>${transplace(obj.locationname)}</h5>
						<p>${obj.localfood}</p>
					</div>
				`;
			})
		});

	const ranNum = genRandomNo(4, tourPlaces.length);
	ranNum.map( data => {
		document.getElementById("tour_places").innerHTML += `
			<img src="./img/places/${data}.png" onclick="sendText('search ${tourPlaces[data-1]}')" >`;
	});

}

/* 지역별 음식 소개 */
function localFood(data) {
	hideall();
	document.getElementById("region").style.display = "block";

	// const url = `https://actions.o2o.kr/devsvr10/findlocalfood?locationname=${data.region}&lang=en`
	const url = `${dblink}findlocalfood?locationname=${data.region}&lang=en`
	fetch(url)
		.then( res => res.json() )
		.then( data => {
			data.map( obj => {
				linkKeyword = obj.localfood
				document.getElementById("region").innerHTML = `
					<div id="local_info_result">
						<div class="localfood_guide_01">
							<div>Tell me "Show me ${obj.localfood} restaurant options"!</div>
						</div>
						<img src="${obj.imageurl}" alt="${obj.localfood} 이미지">
						<div class="localfood_guide_02">
<!--							<img src="./img/local_food_02.png" class="go_prev" onclick="sendText('이전으로')" > -->
							<div class="localfood_title_text">
								${obj.localfood}
							</div>
							<img src="./img/local_food_03.png" class="find_route" onclick="sendText('show me ${obj.localfood} restaurant options')">
						</div>
						<div class="localfood_guide_03">
							<h4>What is ${obj.localfood}?</h4>
							<div class="detail-descript-local">${obj.description}</div>
						</div>
						<div class="localfood_guide_04">
							<img src="./img/btn_ytb.png" alt="유튜브에서 더보기" onclick="sendText('Show more in Youtube')">
							<img src="./img/btn_insta.png" alt="인스타그램에서 더보기" onclick="sendText('Show more in Instagram')">
						</div>
					</div>
				`;
				//타이틀이 길 경우
				const marqueeTxt = document.querySelector(".localfood_title_text");

				if (marqueeTxt.scrollWidth > marqueeTxt.offsetWidth) {
					marqueeTxt.classList.add("marquee");
				}
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
			<img src="./img/p7.png" usemap="#tmap-map" width="930" height="1305">
			<map name="tmap-map">
				<area alt="연결" title="connect" href="${tmaplink}" coords="321,1091,612,1212" shape="rect">
<!--				<area alt="이전으로" title="이전으로" onclick="sendText('이전으로')" coords="832,63,882,113" shape="rect">-->
			</map>`;
		document.getElementsByClassName("modal")[0].style.backgroundImage = "none";
		// document.getElementsByClassName("modal")[0].style.height = "auto";

		$('img[usemap]').mouseenter(function () {
			$(this).rwdImageMaps();
			$("#img").width("100%");
		});

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

function info_result_option_eat_view(data) {
	console.log("실행 : info_result_option_eat_view(), data >>> "+ data);
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
}

function info_result_option_sleep_view(data) {
	console.log("실행 : info_result_option_sleep_view(), data >>> "+ data);
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

const info_result_option_tour_view = (data) => {
	console.log("실행 : info_result_option_tour_view(), data >>> "+ data);
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
}

const info_result_option_heal_view = (data) => {
	console.log("실행 : info_result_option_heal_view(), data >>> "+ data);
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
}
