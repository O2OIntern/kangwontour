const servicekey = "t8eVLHdshDqoVX%2FO9rQO8d35XQQ5jIQGT3rmN9ewouc3GqjS05eMLm7Cx8%2FeMbkqBd1W9cFdaw%2BDk2R82yWKeQ%3D%3D";

const places = ['Gangneung', 'Goseong', 'Donghae', 'Samcheok', 'Sokcho', 'Yanggu', 'Yangyang', 'Yeongwol', 'Wonju', 'Inje', 'Jeongseon', 'Cheorwon', 'Chuncheon', 'Taebaek', 'Pyeongchang', 'Hongcheon', 'Hwacheon', 'Hoengseong'];
const course_places = ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군'];

const dblink =
    // "https://banana.o2o.kr/kangwontour/"
    "https://actions.o2o.kr/devsvr10/"
;

//한국어 지명 영문지명으로 바꾸기
const transplace = (place) => {
    let number;
    course_places.forEach((word, index) => {
        if(word.substring(0, 2).includes(place)){
            number = index;
        }
    });
    return places[number];
}

function hideall() {
    var classes = document.getElementsByClassName("view");
    var classes1 = document.getElementsByClassName("background");
    var classes2 = document.getElementsByClassName("info");
    var classes3 = document.getElementsByClassName("recommended");
    var classes4 = document.getElementsByClassName("recommended2");
    var classes5 = document.getElementsByClassName("option");

    document.getElementById("startImage").style.display = "none";
    // var classes2 = document.getElementsByClassName( "textfield" );
    for (var i = 0; i < classes.length; i++) {
        classes[i].style.display = "none";
    }
    for (var i = 0; i < classes1.length; i++) {
        classes1[i].style.display = "none";
    }
    for (var i = 0; i < classes2.length; i++) {
        classes2[i].style.display = "none";
    }
    for (var i = 0; i < classes3.length; i++) {
        classes3[i].style.display = "none";
    }
    for (var i = 0; i < classes4.length; i++) {
        classes4[i].style.display = "none";
    }
    for (var i = 0; i < classes5.length; i++) {
        classes5[i].style.display = "none";
    }
    document.querySelectorAll(".view_full").forEach( item => item.style.display="none");

    console.log("hideall() activated");
}

/* "info" class에 해당하는 모든 div 숨기기 => 삭제예정
function hideall_info() {
	var infoClasses = document.getElementsByClassName("info");
	for (var i = 0; i < infoClasses.length; i++) {
		infoClasses[i].style.display = 'none';
		console.log("hided : " + infoClasses[i].id);
	}
} */

async function headerHeight(){
    this.canvas = window.interactiveCanvas;
    this.scene = scene;
    const that = this;

    let headerheight;

    await that.canvas.getHeaderHeightPx().then(data => {
        console.log(`Bar Height : ${data}`);
        headerheight = data;
    });
    console.log(headerheight);

    return headerheight;
}

function directlink(tmaplink) {
    document.getElementById("reco_detail_tmapbtn").innerHTML = `<img src="./img/Tmap_button_3.png">`;
    document.getElementById("reco_detail_tmapbtn2").innerHTML = `<img src="./img/Tmap_button_3.png">`;
    document.getElementById("reco_detail_tmapbtn2").href = `${tmaplink}`;
    document.getElementById("reco_detail_tmapbtn").href = `${tmaplink}`;
    console.log("reco_detail_tmapbtn: " + reco_detail_tmapbtn.href+ "  /// reco_detail_info_tmapbtn2: " + reco_detail_tmapbtn.href);
}

function select(id) {
    this.canvas = window.interactiveCanvas;
    this.scene = scene;
    const that = this;
    switch (id) {
        case 'category1':
            that.canvas.sendTextQuery('추천 코스');
            break;
        case 'category2':
            that.canvas.sendTextQuery('관광지 정보');
            break;
        case 'category3':
            that.canvas.sendTextQuery('내맘대로 코스');
            break;
        case 'recommend1':
            that.canvas.sendTextQuery('연인끼리');
            break;
        case 'recommend2':
            that.canvas.sendTextQuery('가족이랑');
            break;
        case 'recommend3':
            that.canvas.sendTextQuery('맛집탐방');
            break;
    }
}

function resultnumber(number) {
    this.canvas = window.interactiveCanvas;
    this.scene = scene;
    const that = this;
    var text = `${number}번`
    that.canvas.sendTextQuery(text);
}

function sendText(keyword) {
    console.log("click sendText");
    this.canvas = window.interactiveCanvas;
    this.scene = scene;
    const that = this;
    console.log(keyword);
    that.canvas.sendTextQuery(keyword);
}

/**
 * TourAPI로 json을 호출하는 함수
 * @param {string} kind API 종류 {"지역검색", "주변검색", "이름검색", "상세정보1", "상세정보2", "상세정보3", "상세정보4"}
 * @param {string} arrangeType 정렬 방식 결정 {"제목순", "조회순", "수정일순", "생성일순", "거리순"(주변검색 한정)}
 * @param {object} data java Fulfillment에서 전해주는 data
 * @param {object} detaildata {contentid, contenttypeid}
 * @param {int} radius 주변검색시 검색할 최대 거리 (주변검색 한정)
 *
 * @returns API 호출로 불러온 json 데이터
 */
// function tourAPI(kind, arrangeType, data, detaildata = undefined, radius = 2000) {
//     let apiType; // API 종류 결정
//     let contentTypeId;
//     let longitude; // mapx (주변검색 한정)
//     let latitude; // mapy (주변검색 한정)
//     let sigunguCode;
//     let searchWord; // 검색어 (이름검색 한정)
//     let arrange; // 정렬 방식 결정
//     let contentId;
//     let url; // API 요청을 보낼 주소
//     let result; // return할 값을 저장할 변수
//
//     //data를 통해 contentTypeId, sigunguCode 결정
//     if (detaildata) contentTypeId = detaildata.contenttypeid;
//     else contentTypeId = datatype(data);
//     sigunguCode = dataplace(data.place);
//     //data를 통해 longitude, latitude 결정
//     if (data.lon && data.lat) {
//         longitude = data.lon;
//         latitude = data.lat;
//     }
//     //arrange 결정
//     switch (arrangeType) {
//         case ("제목순"):
//         case ("1"):
//         case ("A"):
//             arrange = "A";
//             break;
//         case ("조회순"):
//         case ("인기순"):
//         case ("2"):
//         case ("B"):
//             arrange = "B";
//             break;
//         case ("수정일순"):
//         case ("최근수정순"):
//         case ("3"):
//         case ("C"):
//             arrange = "C";
//             break;
//         case ("생성일순"):
//         case ("등록순"):
//         case ("4"):
//         case ("D"):
//             arrange = "D";
//             break;
//         case ("거리순"):
//         case ("5"):
//         case ("E"):
//             if (kind === `주변검색` || kind == '2') arrange = "E";
//             break;
//         default:
//             arrange = "B";
//     }
//     if (detaildata) {
//         contentTypeId = detaildata.contenttypeid;
//         contentId = detaildata.contentid;
//     }
//     //검색어 결정
//     if (kind === `이름검색` || kind == '3') searchWord = data.any;
//     //apiType 결정
//     switch (kind) {
//         case ("주변검색"):
//         case ("2"):
//             apiType = `locationBasedList?ListYN=Y&mapX=${longitude}&mapY=${latitude}&contentTypeId=${contentTypeId}&radius=${radius}`;
//             break;
//         case ("이름검색"):
//         case ("3"):
//             apiType = `searchKeyword?ListYN=Y&keyword=${searchWord}&sigunguCode=${sigunguCode}`;
//             break;
//         case ("상세정보1"):
//         case ("4"):
//             apiType = `detailCommon?defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&contentId=${contentId}`;
//             break;
//         case ("상세정보2"):
//         case ("5"):
//             apiType = `detailIntro?contentId=${contentId}&contentTypeId=${contentTypeId}`;
//             break;
//         case ("상세정보3"):
//         case ("6"):
//             apiType = `detailInfo?contentId=${contentId}&contentTypeId=${contentTypeId}`;
//             break;
//         case ("상세정보4"):
//         case ("7"):
//             apiType = `detailImage?contentId=${contentId}&imageYN=Y`;
//             break;
//         case ("지역검색"):
//         case ("1"):
//         default:
//             apiType = `areaBasedList?ListYN=Y&sigunguCode=${sigunguCode}&contentTypeId=${contentTypeId}`;
//     } // 공통 :
//     //API 호출
//     url = `http://api.visitkorea.or.kr/openapi/service/rest/KorService/${apiType}&ServiceKey=${servicekey}&arrange=${arrange}&areaCode=32&MobileOS=ETC&MobileApp=TourAPI3.0_Guide&numOfRows=10000&pageNo=1&_type=json`;
//     // url = `https://actions.o2o.kr/devsvr10/tourapi`;
//     result = fetch(url).then((response) => response.json());
//     //json 데이터 return
//     console.log(url);
//     console.log(result);
//     return result;
// }

function tourAPI(kind, data, detaildata = undefined) {
    let contentType;
    let cat3;
    let sigunguCode;
    let searchWord; // 검색어 (이름검색 한정)
    let contentId;
    let url; // API 요청을 보낼 주소
    let result; // return할 값을 저장할 변수

    if (data.cat3) {
        cat3 = putsmalltype(data)[0]
    } else {
        if (data.heal) {
            switch (data.heal) {
                case("자연 속 힐링"):
                    contentType = "자연%20속%20힐링";
                    break;
                case("문화시설에서 힐링"):
                    contentType = "문화시설에서%20힐링";
                    break;
            }
        } else if (data.eat) {
            contentType = "음식점";
        } else if (data.sleep) {
            contentType = data.sleep;
            if (kind === "재검색") contentType = "숙박업소";
        } else if (data.tour) {
            contentType = data.tour;
            if (kind === "재검색") contentType = "관광지";
        }
    }

    sigunguCode = dataplace(data.place);

    if (detaildata) {
        contentId = detaildata.contentid;
    }

    //검색어 결정
    if (kind === `이름검색`) {
        searchWord = "";
        let inputWord = data.any;
        let wordArray = inputWord.trim().split(' ');
        console.log(`받은 검색어 : ${wordArray}`);
        if (wordArray.length > 1) {
            wordArray.forEach((word, index) => {
                word = word.charAt(0).toUpperCase() + word.slice(1);
                console.log(`word = ${word}`);
                searchWord = searchWord.concat(`${word}%20`);
                console.log(`searchWord = ${searchWord}`)
            })
            if(searchWord.substring(searchWord.length - 3) === "%20") searchWord = searchWord.substring(0, searchWord.length - 3);
        } else if (wordArray.length === 1) {
            searchWord = (inputWord.charAt(0).toUpperCase() + inputWord.slice(1)).trim();
        }

        console.log(`검색어 생성 : ${searchWord}`);
    }
    //apiType 결정
    switch (kind) {
        case ("이름검색"):
            // url = `https://actions.o2o.kr/devsvr10/findtoruapi?title=${searchWord}&lang=en`;
            url = `${dblink}findtoruapi?title=${searchWord}&lang=en`
            break;
        case ("상세정보"):
            //url = `https://actions.o2o.kr/devsvr10/finddetailinfo?contentid=${contentId}&lang=en`;
            url = `${dblink}finddetailinfo?contentid=${contentId}&lang=en`;
            break;
        case ("지역검색"):
            // if (data.cat3) url = `https://actions.o2o.kr/devsvr10/findcat3?cat3=${cat3}&sigungucode=${sigunguCode}&lang=en`;
            // else url = `https://actions.o2o.kr/devsvr10/findcategory?category=${contentType}&sigungucode=${sigunguCode}&lang=en`;
            if (data.cat3) url = `${dblink}findcat3?cat3=${cat3}&sigungucode=${sigunguCode}&lang=en`;
            else url = `${dblink}findcategory?category=${contentType}&sigungucode=${sigunguCode}&lang=en`;
            break;
        case ("추천코스"):
            // url = `https://actions.o2o.kr/devsvr10/findsigungucode?sigungucode=${sigunguCode}&lang=en`;
            url = `${dblink}findsigungucode?sigungucode=${sigunguCode}&lang=en`;
            break;
        default:
            // url = `https://actions.o2o.kr/devsvr10/tourapi?lang=en`;
            url = `${dblink}tourapi?lang=en`;
    } // 공통 :
    //API 호출
    result = fetch(url).then(response => response.json());
    //json 데이터 return
    console.log(url);
    console.log(result);
    return result;
}

var endtimer;

//종료모달 화면 count down
function start() {
    var timeleft = 3;
    document.getElementsByClassName("modal")[0].innerHTML =
        `<img id="end_image" src="./img/p18.png" usemap="#end-map" width="1041" height="1404"></img>
		<map name="end-map">			
<!--			<area onclick="sendText('이전으로')" alt="이전으로" title="이전으로" coords="869,83,960,195" shape="rect">-->
        </map>`;

    $('img[usemap]').mouseenter(function () {
        $(this).rwdImageMaps();
        $("#img").width("100%");
    });

    document.getElementById('endImage').style.display = "table";
    endtimer = setInterval(function () {
        //	document.getElementById( 'endText' ).innerHTML = timeleft;
        document.getElementById("end_image").setAttribute("src", `./img/end${timeleft}.png`);
        timeleft -= 1;
        console.log(timeleft + " seconds remaining");
        if (timeleft < 0) {
            clearInterval(endtimer);
            sendText('yes');
        }
    }, 1000);
}

function setImage(id, image) {
    document.getElementById(id).style.backgroundImage = `url(${image})`;
}

function replaceimage(imgURL) {
    // return imgURL.replace('http://', 'https://');
    return imgURL;
}

/**
 * API의 sigungucode value값을 정하기 위한 switch문
 * @param {*} data
 */
function dataplace(data) {
    let place;
    console.log(`input = ${data}`);
    switch (data) {
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
        default:
            place = "32";
    }
    console.log(`dataplace results -> input : ${data}, sigungucode : ${place}`);
    return place;
}

// function datacourse(data) {
//     var course;
//     switch (data) {
//         case ("가족코스"):
//             course = "C0112";
//             break;
//         case ("나홀로코스"):
//             course = "C0113";
//             break;
//         case ("힐링코스"):
//             course = "C0114";
//             break;
//         case ("도보코스"):
//             course = "C0115";
//             break;
//         case ("캠핑코스"):
//             course = "C0116";
//             break;
//         case ("맛코스"):
//             course = "C0117";
//             break;
//         default:
//             course = "";
//     }
//     return course;
// }

function datatype(data) {
    var type;
    switch (data.type) {
        case ("관광지"):
            switch (data.tour) {
                case ("힐링"):
                case ("전통"):
                    type = "12";
                    break;
                case ("쇼핑"):
                    type = "38";
                    break;
                case ("액티비티"):
                    type = "28";
                    break;
                default:
                    type = "";
            }
            break;
        case ("문화시설"):
            type = "14";
            break;
        case ("축제공연행사"):
            type = "15";
            break;
        case ("레포츠"):
            type = "28";
            break;
        case ("숙박"):
            type = "32";
            break;
        case ("쇼핑"):
            type = "38";
            break;
        case ("음식점"):
            type = "39";
            break;
        default:
            type = "";
    }
    return type;
}

function datalink(data) {
    let linkURL;
    switch (data) {
        case ("인스타그램"):
            let instaTag = linkKeyword.split(' ')[0];
            // linkURL = "https://www.instagram.com/explore/tags/";
            linkURL = "instagram://tag?name="+instaTag;
            break;
        case ("유튜브"):
            // linkURL = "https://m.youtube.com/results?search_query=";
            linkURL = "vnd.youtube://m.youtube.com/results?search_query="+linkKeyword;
            break;
    }
    // window.location.href=linkURL; // 외부 링크 연결
    document.getElementById('externalframe').setAttribute('src', linkURL); // iframe external link
}

/**
 * tourAPI의 cat3 항목군을 정하기 위한 switch문
 * @param {*} data Fulfillment에서 받아오는 데이터 묶음
 */
function putsmalltype(data) {
    var typevalues = [];

    //오늘 날짜를 받아 하계/동계 구분
    let today = new Date();
    if(today.getMonth() >= 1 && today.getMonth() <= 11) season = "하계";
    else season = "동계";
    console.log(`계절 : ${season}`);

    //if(type == "32"){ // 숙박시설
    if (data.sleep) {
        if (data.sleep === "호텔") {
            typevalues.push("B02010100");
            typevalues.push("B02010200");
            typevalues.push("B02010300");
            typevalues.push("B02010400");
            typevalues.push("B02011500");
        }
        else if (data.sleep === "콘도") {
            typevalues.push("B02010500");
            typevalues.push("B02010600");
        }
        else if (data.sleep === "모텔") {
            typevalues.push("B02010800");
            typevalues.push("B02010900");
        }
        // 숙박시설
        else if (data.sleep === "관광호텔") typevalues.push("B02010100");
        else if (data.sleep === "수상관광호텔") typevalues.push("B02010200");
        else if (data.sleep === "전통호텔") typevalues.push("B02010300");
        else if (data.sleep === "가족호텔") typevalues.push("B02010400");
        else if (data.sleep === "콘도미니엄") typevalues.push("B02010500");
        else if (data.sleep === "유스호스텔") typevalues.push("B02010600");
        else if (data.sleep === "펜션") typevalues.push("B02010700");
        else if (data.sleep === "여관") typevalues.push("B02010800");
        else if (data.sleep === "모텔") typevalues.push("B02010900");
        else if (data.sleep === "민박") typevalues.push("B02011000");
        else if (data.sleep === "게스트하우스") typevalues.push("B02011100");
        else if (data.sleep === "홈스테이") typevalues.push("B02011200");
        else if (data.sleep === "서비스드레지던스") typevalues.push("B02011300");
        else if (data.sleep === "의료관광호텔") typevalues.push("B02011400");
        else if (data.sleep === "소형호텔") typevalues.push("B02011500");
        else if (data.sleep === "한옥스테이") typevalues.push("B02011600");
        else if (data.sleep === "숙박업소") {
            typevalues.push("B02010100");
            typevalues.push("B02010200");
            typevalues.push("B02010300");
            typevalues.push("B02010400");
            typevalues.push("B02010500");
            typevalues.push("B02010600");
            typevalues.push("B02010700");
            typevalues.push("B02010800");
            typevalues.push("B02010900");
            typevalues.push("B02011000");
            typevalues.push("B02011100");
            typevalues.push("B02011200");
            typevalues.push("B02011300");
            typevalues.push("B02011400");
            typevalues.push("B02011500");
            typevalues.push("B02011600");
        }
    }
    //} else if (type == "39"){ // 음식점
    else if (data.eat) {
        if (data.eat === "아침")
            typevalues.push("A05020100");
        else if (data.eat === "점심") {
            typevalues.push("A05020100");
            typevalues.push("A05020300");
            typevalues.push("A05020400");
            typevalues.push("A05020500");
            typevalues.push("A05020700");
        }
        else if (data.eat === "저녁") {
            typevalues.push("A05020100");
            typevalues.push("A05020200");
            typevalues.push("A05020300");
            typevalues.push("A05020400");
            typevalues.push("A05020600");
        }
        // 음식점
        else if (data.eat === "한식") typevalues.push("A05020100");
        else if (data.eat === "서양식") typevalues.push("A05020200");
        else if (data.eat === "일식") typevalues.push("A05020300");
        else if (data.eat === "중식") typevalues.push("A05020400");
        else if (data.eat === "아시아식") typevalues.push("A05020500");
        else if (data.eat === "패밀리레스토랑") typevalues.push("A05020600");
        else if (data.eat === "이색음식점") typevalues.push("A05020700");
        else if (data.eat === "채식전문점") typevalues.push("A05020800");
        else if (data.eat === "바/까페") typevalues.push("A05020900");
        else if (data.eat === "클럽") typevalues.push("A05021000");
        else if (data.eat === "음식점") {
            typevalues.push("A05020100");
            typevalues.push("A05020200");
            typevalues.push("A05020300");
            typevalues.push("A05020400");
            typevalues.push("A05020500");
            typevalues.push("A05020600");
            typevalues.push("A05020700");
            typevalues.push("A05020800");
            typevalues.push("A05020900");
            typevalues.push("A05021000");
        }
    }
    //} else if (type == "12"){ // 관광지 - 힐링/전통
    else if (data.tour === "힐링" || (data.tour === undefined && data.heal)) {
        // console.log("putsmalltype : 힐링");
        if (data.heal === "자연 속 힐링" || data.heal === undefined) {
            // console.log("putsmalltype : 자연");
            typevalues.push("A01010100"); //국립공원
            typevalues.push("A01010200"); //도립공원
            typevalues.push("A01010300"); //군립공원
            typevalues.push("A01010400"); //산
            typevalues.push("A01010500"); //자연생태관광지
            typevalues.push("A01010600"); //자연휴양림
            typevalues.push("A01010700"); //수목원
            typevalues.push("A01010800"); //폭포
            typevalues.push("A01010900"); //계곡
            typevalues.push("A01011000"); //약수터
            typevalues.push("A01011100"); //해안절경
            typevalues.push("A01011200"); //해수욕장
            typevalues.push("A01011300"); //섬
            typevalues.push("A01011400"); //항구/포구
            typevalues.push("A01011500"); //어촌
            typevalues.push("A01011600"); //등대
            typevalues.push("A01011700"); //호수
            typevalues.push("A01011800"); //강
            typevalues.push("A01011900"); //동굴
            typevalues.push("A02030100"); //농.산.어촌 체험
            typevalues.push("A02030500"); //관광농원
        }
        if (data.heal === "문화시설에서 힐링" || data.heal === undefined) {
            // console.log("putsmalltype : 문화");
            typevalues.push("A02030400"); //이색체험
            typevalues.push("A02030600"); //이색거리
            typevalues.push("A02020100"); //유원지
            typevalues.push("A02020200"); //관광단지
            typevalues.push("A02020300"); //온천/욕장/스파
            typevalues.push("A02020400"); //이색찜질방
            typevalues.push("A02020500"); //헬스투어
            typevalues.push("A02020600"); //테마공원
            typevalues.push("A02020700"); //공원
        }

    }
    else if (data.tour) {
        //} else if (type == "28"){ // 액티비티 == 레포츠
        if (data.tour === "액티비티") {
            // console.log("putsmalltype : 액티비티");
            typevalues.push("A03020500"); //자전거하이킹
            typevalues.push("A03021700"); //야영장, 오토캠핑장
            typevalues.push("A03030500"); //민물낚시
            typevalues.push("A03030600"); //바다낚시
            typevalues.push("A03050100"); //복합 레포츠
            typevalues.push("A02020800"); //유람선/잠수함관광 - 관광타입 = 12!
            if (season === "하계") {
                // console.log("putsmalltype : 하계");
                typevalues.push("A03030100"); //윈드서핑/제트스키
                typevalues.push("A03030200"); //카약/카누
                typevalues.push("A03030700"); //수영
                typevalues.push("A03030800"); //래프팅
            } else if (season === "동계") {
                // console.log("putsmalltype : 동계");
                typevalues.push("A03021200"); //스키/스노보드
                typevalues.push("A03021300"); //스케이트
                typevalues.push("A03021400"); //썰매장
            }
        }

        else if (data.tour === "전통") {
            // console.log("putsmalltype : 전통");
            typevalues.push("A02030200"); //전통체험
            typevalues.push("A02030300"); //산사체험
            typevalues.push("A02010600"); //민속마을
            typevalues.push("A02010700"); //유적지/사적지
            typevalues.push("A02060100"); //박물관 - 관광타입 = 14!
            typevalues.push("A02060200"); //기념관 - 관광타입 = 14!
            typevalues.push("A02060300"); //전시관 - 관광타입 = 14!
        }
        //} else if (type == "38"){ // 쇼핑
        else if (data.tour === "쇼핑") {
            // console.log("putsmalltype : 쇼핑");
            typevalues.push("A04010100"); //5일장
            typevalues.push("A04010200"); //상설시장
            typevalues.push("A04010700"); //공예, 공방
            typevalues.push("A04010800"); //관광기념품점
            typevalues.push("A04010900"); //특산물판매점
        }
        //관광지
        else if (data.tour === "국립공원") typevalues.push("A01010100");
        else if (data.tour === "도립공원") typevalues.push("A01010200");
        else if (data.tour === "군립공원") typevalues.push("A01010300");
        else if (data.tour === "산") typevalues.push("A01010400");
        else if (data.tour === "자연생태관광지") typevalues.push("A01010500");
        else if (data.tour === "자연휴양림") typevalues.push("A01010600");
        else if (data.tour === "수목원") typevalues.push("A01010700");
        else if (data.tour === "폭포") typevalues.push("A01010800");
        else if (data.tour === "계곡") typevalues.push("A01010900");
        else if (data.tour === "약수터") typevalues.push("A01011000");
        else if (data.tour === "해안절경") typevalues.push("A01011100");
        else if (data.tour === "해수욕장") typevalues.push("A01011200");
        else if (data.tour === "섬") typevalues.push("A01011300");
        else if (data.tour === "항구/포구") typevalues.push("A01011400");
        else if (data.tour === "어촌") typevalues.push("A01011500");
        else if (data.tour === "등대") typevalues.push("A01011600");
        else if (data.tour === "호수") typevalues.push("A01011700");
        else if (data.tour === "강") typevalues.push("A01011800");
        else if (data.tour === "동굴") typevalues.push("A01011900");
        else if (data.tour === "희귀동.식물") typevalues.push("A01020100");
        else if (data.tour === "기암괴석") typevalues.push("A01020200");
        else if (data.tour === "고궁") typevalues.push("A02010100");
        else if (data.tour === "성") typevalues.push("A02010200");
        else if (data.tour === "문") typevalues.push("A02010300");
        else if (data.tour === "고택") typevalues.push("A02010400");
        else if (data.tour === "생가") typevalues.push("A02010500");
        else if (data.tour === "민속마을") typevalues.push("A02010600");
        else if (data.tour === "유적지/사적지") typevalues.push("A02010700");
        else if (data.tour === "사찰") typevalues.push("A02010800");
        else if (data.tour === "종교성지") typevalues.push("A02010900");
        else if (data.tour === "안보관광") typevalues.push("A02011000");
        else if (data.tour === "유원지") typevalues.push("A02020100");
        else if (data.tour === "관광단지") typevalues.push("A02020200");
        else if (data.tour === "온천/욕장/스파") typevalues.push("A02020300");
        else if (data.tour === "이색찜질방") typevalues.push("A02020400");
        else if (data.tour === "헬스투어") typevalues.push("A02020500");
        else if (data.tour === "테마공원") typevalues.push("A02020600");
        else if (data.tour === "공원") typevalues.push("A02020700");
        else if (data.tour === "유람선/잠수함관광") typevalues.push("A02020800");
        else if (data.tour === "농.산.어촌 체험") typevalues.push("A02030100");
        else if (data.tour === "전통체험") typevalues.push("A02030200");
        else if (data.tour === "산사체험") typevalues.push("A02030300");
        else if (data.tour === "이색체험") typevalues.push("A02030400");
        else if (data.tour === "관광농원") typevalues.push("A02030500");
        else if (data.tour === "이색거리") typevalues.push("A02030600");
        else if (data.tour === "제철소") typevalues.push("A02040100");
        else if (data.tour === "조선소") typevalues.push("A02040200");
        else if (data.tour === "공단") typevalues.push("A02040300");
        else if (data.tour === "발전소") typevalues.push("A02040400");
        else if (data.tour === "광산") typevalues.push("A02040500");
        else if (data.tour === "식음료") typevalues.push("A02040600");
        else if (data.tour === "화학/금속") typevalues.push("A02040700");
        else if (data.tour === "기타") typevalues.push("A02040800");
        else if (data.tour === "전자/반도체") typevalues.push("A02040900");
        else if (data.tour === "자동차") typevalues.push("A02041000");
        else if (data.tour === "다리/대교") typevalues.push("A02050100");
        else if (data.tour === "기념탑/기념비/전망대") typevalues.push("A02050200");
        else if (data.tour === "분수") typevalues.push("A02050300");
        else if (data.tour === "동상") typevalues.push("A02050400");
        else if (data.tour === "터널") typevalues.push("A02050500");
        else if (data.tour === "유명건물") typevalues.push("A02050600");
        else if (data.tour === "박물관") typevalues.push("A02060100");
        else if (data.tour === "기념관") typevalues.push("A02060200");
        else if (data.tour === "전시관") typevalues.push("A02060300");
        else if (data.tour === "컨벤션센터") typevalues.push("A02060400");
        else if (data.tour === "미술관/화랑") typevalues.push("A02060500");
        else if (data.tour === "공연장") typevalues.push("A02060600");
        else if (data.tour === "문화원") typevalues.push("A02060700");
        else if (data.tour === "외국문화원") typevalues.push("A02060800");
        else if (data.tour === "도서관") typevalues.push("A02060900");
        else if (data.tour === "대형서점") typevalues.push("A02061000");
        else if (data.tour === "문화전수시설") typevalues.push("A02061100");
        else if (data.tour === "영화관") typevalues.push("A02061200");
        else if (data.tour === "어학당") typevalues.push("A02061300");
        else if (data.tour === "학교") typevalues.push("A02061400");
        else if (data.tour === "문화관광축제") typevalues.push("A02070100");
        else if (data.tour === "일반축제") typevalues.push("A02070200");
        else if (data.tour === "스포츠센터") typevalues.push("A03020100");
        else if (data.tour === "수련시설") typevalues.push("A03020200");
        else if (data.tour === "경기장") typevalues.push("A03020300");
        else if (data.tour === "인라인(실내 인라인 포함)") typevalues.push("A03020400");
        else if (data.tour === "자전거하이킹") typevalues.push("A03020500");
        else if (data.tour === "카트") typevalues.push("A03020600");
        else if (data.tour === "골프") typevalues.push("A03020700");
        else if (data.tour === "경마") typevalues.push("A03020800");
        else if (data.tour === "경륜") typevalues.push("A03020900");
        else if (data.tour === "카지노") typevalues.push("A03021000");
        else if (data.tour === "승마") typevalues.push("A03021100");
        else if (data.tour === "스키/스노보드") typevalues.push("A03021200");
        else if (data.tour === "스케이트") typevalues.push("A03021300");
        else if (data.tour === "썰매장") typevalues.push("A03021400");
        else if (data.tour === "수렵장") typevalues.push("A03021500");
        else if (data.tour === "사격장") typevalues.push("A03021600");
        else if (data.tour === "야영장,오토캠핑장") typevalues.push("A03021700");
        else if (data.tour === "암벽등반") typevalues.push("A03021800");
        else if (data.tour === "빙벽등반") typevalues.push("A03021900");
        else if (data.tour === "서바이벌게임") typevalues.push("A03022000");
        else if (data.tour === "ATV") typevalues.push("A03022100");
        else if (data.tour === "MTB") typevalues.push("A03022200");
        else if (data.tour === "오프로드") typevalues.push("A03022300");
        else if (data.tour === "번지점프") typevalues.push("A03022400");
        else if (data.tour === "자동차경주") typevalues.push("A03022500");
        else if (data.tour === "스키(보드) 렌탈샵") typevalues.push("A03022600");
        else if (data.tour === "트래킹") typevalues.push("A03022700");
        else if (data.tour === "윈드서핑/제트스키") typevalues.push("A03030100");
        else if (data.tour === "카약/카누") typevalues.push("A03030200");
        else if (data.tour === "요트") typevalues.push("A03030300");
        else if (data.tour === "스노쿨링/스킨스쿠버다이빙") typevalues.push("A03030400");
        else if (data.tour === "민물낚시") typevalues.push("A03030500");
        else if (data.tour === "바다낚시") typevalues.push("A03030600");
        else if (data.tour === "수영") typevalues.push("A03030700");
        else if (data.tour === "래프팅") typevalues.push("A03030800");
        else if (data.tour === "스카이다이빙") typevalues.push("A03040100");
        else if (data.tour === "초경량비행") typevalues.push("A03040200");
        else if (data.tour === "헹글라이딩/패러글라이딩") typevalues.push("A03040300");
        else if (data.tour === "열기구") typevalues.push("A03040400");
        else if (data.tour === "복합 레포츠") typevalues.push("A03050100");
        else if (data.tour === "5일장") typevalues.push("A04010100");
        else if (data.tour === "상설시장") typevalues.push("A04010200");
        else if (data.tour === "백화점") typevalues.push("A04010300");
        else if (data.tour === "면세점") typevalues.push("A04010400");
        else if (data.tour === "할인매장") typevalues.push("A04010500");
        else if (data.tour === "전문상가") typevalues.push("A04010600");
        else if (data.tour === "공예,공방") typevalues.push("A04010700");
        else if (data.tour === "관광기념품점") typevalues.push("A04010800");
        else if (data.tour === "특산물판매점") typevalues.push("A04010900");
        else if (data.tour === "관광지") {
                typevalues.push("A01010100");
                typevalues.push("A01010200");
                typevalues.push("A01010300");
                typevalues.push("A01010400");
                typevalues.push("A01010500");
                typevalues.push("A01010600");
                typevalues.push("A01010700");
                typevalues.push("A01010800");
                typevalues.push("A01010900");
                typevalues.push("A01011000");
                typevalues.push("A01011100");
                typevalues.push("A01011200");
                typevalues.push("A01011300");
                typevalues.push("A01011400");
                typevalues.push("A01011500");
                typevalues.push("A01011600");
                typevalues.push("A01011700");
                typevalues.push("A01011800");
                typevalues.push("A01011900");
                typevalues.push("A01020100");
                typevalues.push("A01020200");
                typevalues.push("A02010100");
                typevalues.push("A02010200");
                typevalues.push("A02010300");
                typevalues.push("A02010400");
                typevalues.push("A02010500");
                typevalues.push("A02010600");
                typevalues.push("A02010700");
                typevalues.push("A02010800");
                typevalues.push("A02010900");
                typevalues.push("A02011000");
                typevalues.push("A02020100");
                typevalues.push("A02020200");
                typevalues.push("A02020300");
                typevalues.push("A02020400");
                typevalues.push("A02020500");
                typevalues.push("A02020600");
                typevalues.push("A02020700");
                typevalues.push("A02020800");
                typevalues.push("A02030100");
                typevalues.push("A02030200");
                typevalues.push("A02030300");
                typevalues.push("A02030400");
                typevalues.push("A02030500");
                typevalues.push("A02030600");
                typevalues.push("A02040100");
                typevalues.push("A02040200");
                typevalues.push("A02040300");
                typevalues.push("A02040400");
                typevalues.push("A02040500");
                typevalues.push("A02040600");
                typevalues.push("A02040700");
                typevalues.push("A02040800");
                typevalues.push("A02040900");
                typevalues.push("A02041000");
                typevalues.push("A02050100");
                typevalues.push("A02050200");
                typevalues.push("A02050300");
                typevalues.push("A02050400");
                typevalues.push("A02050500");
                typevalues.push("A02050600");
                typevalues.push("A02060100");
                typevalues.push("A02060200");
                typevalues.push("A02060300");
                typevalues.push("A02060400");
                typevalues.push("A02060500");
                typevalues.push("A02060600");
                typevalues.push("A02060700");
                typevalues.push("A02060800");
                typevalues.push("A02060900");
                typevalues.push("A02061000");
                typevalues.push("A02061100");
                typevalues.push("A02061200");
                typevalues.push("A02061300");
                typevalues.push("A02061400");
                typevalues.push("A02070100");
                typevalues.push("A02070200");
                typevalues.push("A03020100");
                typevalues.push("A03020200");
                typevalues.push("A03020300");
                typevalues.push("A03020400");
                typevalues.push("A03020500");
                typevalues.push("A03020600");
                typevalues.push("A03020700");
                typevalues.push("A03020800");
                typevalues.push("A03020900");
                typevalues.push("A03021000");
                typevalues.push("A03021100");
                typevalues.push("A03021200");
                typevalues.push("A03021300");
                typevalues.push("A03021400");
                typevalues.push("A03021500");
                typevalues.push("A03021600");
                typevalues.push("A03021700");
                typevalues.push("A03021800");
                typevalues.push("A03021900");
                typevalues.push("A03022000");
                typevalues.push("A03022100");
                typevalues.push("A03022200");
                typevalues.push("A03022300");
                typevalues.push("A03022400");
                typevalues.push("A03022500");
                typevalues.push("A03022600");
                typevalues.push("A03022700");
                typevalues.push("A03030100");
                typevalues.push("A03030200");
                typevalues.push("A03030300");
                typevalues.push("A03030400");
                typevalues.push("A03030500");
                typevalues.push("A03030600");
                typevalues.push("A03030700");
                typevalues.push("A03030800");
                typevalues.push("A03040100");
                typevalues.push("A03040200");
                typevalues.push("A03040300");
                typevalues.push("A03040400");
                typevalues.push("A03050100");
                typevalues.push("A04010100");
                typevalues.push("A04010200");
                typevalues.push("A04010300");
                typevalues.push("A04010400");
                typevalues.push("A04010500");
                typevalues.push("A04010600");
                typevalues.push("A04010700");
                typevalues.push("A04010800");
                typevalues.push("A04010900");
            }
    }
    //}
    console.log(`putsmalltype results : ${JSON.stringify(typevalues)}`);
    return typevalues;
}

function typeAppend(word) {
    if (word.cat3 === "A03020500") word.type = "Bicycle Hiking";
    else if (word.cat3 === "A03021700") word.type = "Camping";
    else if (word.cat3 === "A03030500") word.type = "Freshwater Fishing";
    else if (word.cat3 === "A03030600") word.type = "Sea Fishing";
    else if (word.cat3 === "A03050100") word.type = "Leisure/Sports (Others)";
    else if (word.cat3 === "A02020800") word.type = "Cruises/Submarines";
    else if (word.cat3 === "A03030100") word.type = "Wind Surfing/Jet Skiing";
    else if (word.cat3 === "A03030200") word.type = "Kayaking/Canoeing";
    else if (word.cat3 === "A03030700") word.type = "Swimming";
    else if (word.cat3 === "A03030800") word.type = "Rafting";
    else if (word.cat3 === "A03021200") word.type = "Skiing/Snowboarding";
    else if (word.cat3 === "A03021300") word.type = "Ice Skating";
    else if (word.cat3 === "A03021400") word.type = "Sledding";
    else if (word.cat3 === "A01010100") word.type = "National Parks";
    else if (word.cat3 === "A01010200") word.type = "Provincial Parks";
    else if (word.cat3 === "A01010300") word.type = "County Parks";
    else if (word.cat3 === "A01010400") word.type = "Mountains";
    else if (word.cat3 === "A01010500") word.type = "Eco-Tourism Sites";
    else if (word.cat3 === "A01010600") word.type = "Recreational Forests";
    else if (word.cat3 === "A01010700") word.type = "Botanical Gardens";
    else if (word.cat3 === "A01010800") word.type = "Waterfalls";
    else if (word.cat3 === "A01010900") word.type = "Valleys";
    else if (word.cat3 === "A01011000") word.type = "Mineral Springs";
    else if (word.cat3 === "A01011100") word.type = "Coastal Attractions";
    else if (word.cat3 === "A01011200") word.type = "Beaches";
    else if (word.cat3 === "A01011300") word.type = "Islands";
    else if (word.cat3 === "A01011400") word.type = "Ports/Harbors";
    else if (word.cat3 === "A01011500") word.type = "Fishing Villages";
    else if (word.cat3 === "A01011600") word.type = "Lighthouses";
    else if (word.cat3 === "A01011700") word.type = "Lakes";
    else if (word.cat3 === "A01011800") word.type = "Rivers";
    else if (word.cat3 === "A01011900") word.type = "Caves";
    else if (word.cat3 === "A02030100") word.type = "Village Experience";
    else if (word.cat3 === "A02030500") word.type = "Farming Experience";
    else if (word.cat3 === "A02030400") word.type = "Unique Experience";
    else if (word.cat3 === "A02030600") word.type = "Cultural Districts\n";
    else if (word.cat3 === "A02020100") word.type = "Resorts";
    else if (word.cat3 === "A02020200") word.type = "Tourist Complexes";
    else if (word.cat3 === "A02020300") word.type = "Hot Springs & Spa";
    else if (word.cat3 === "A02020400") word.type = "Jjimjilbang (Dry Saunas)";
    else if (word.cat3 === "A02020500") word.type = "Medical Tourism Sites";
    else if (word.cat3 === "A02020600") word.type = "Theme Parks";
    else if (word.cat3 === "A02020700") word.type = "Parks";
    else if (word.cat3 === "A02030200") word.type = "Traditional Experience";
    else if (word.cat3 === "A02030300") word.type = "Temple Stay";
    else if (word.cat3 === "A02010600") word.type = "Folk Villages";
    else if (word.cat3 === "A02010700") word.type = "Historic Sites";
    else if (word.cat3 === "A02060100") word.type = "Museums";
    else if (word.cat3 === "A02060200") word.type = "Memorial Halls";
    else if (word.cat3 === "A02060300") word.type = "Exhibition Halls";
    else if (word.cat3 === "A04010100") word.type = "5-Day Markets";
    else if (word.cat3 === "A04010200") word.type = "Traditional Markets";
    else if (word.cat3 === "A04010700") word.type = "Craft Workshops";
    else if (word.cat3 === "A04010800") word.type = "Souvenir Shops";
    else if (word.cat3 === "A04010900") word.type = "Specialty Shops";
    else if (["B02010100", "B02010200", "B02010300", "B02010400", "B02010500"].indexOf(word.cat3) >= 0) word.type = "Hotels";
    else if (["B02010500", "B02010600"].indexOf(word.cat3) >= 0) word.type = "Condominiums";
    else if (word.cat3 === "B02010700") word.type = "Pensions";
    else if (["B02010800", "B02010900"].indexOf(word.cat3) >= 0) word.type = "Motels";
    else if (word.cat3 === "B02011100") word.type = "Guest Houses";
    else if (word.cat3 === "A05020100") word.type = "Korean Restaurants";
    else if (word.cat3 === "A05020200") word.type = "Western Restaurants";
    else if (word.cat3 === "A05020300") word.type = "Japanese Restaurants";
    else if (word.cat3 === "A05020400") word.type = "Chinese Restaurants";
    else if (word.cat3 === "A05020500") word.type = "Asian Restaurants";
    else if (word.cat3 === "A05020600") word.type = "Family Restaurants";
    else if (word.cat3 === "A05020700") word.type = "Unique Restaurants";
}

/** 중복되지 않는 랜덤넘버의 배열을 리턴
 n : 필요한 random num의 갯수, tot : 전체수 */
function genRandomNo(n, tot) {
    const numbers = [];
    function makeNum () {
        if (numbers.length < n) {
            let temp = Math.floor(Math.random() * tot) + 1;
            if (notSame(temp)) numbers.push(temp);
            makeNum();
        }
        function notSame (temp) {
            return numbers.every((e) => temp !== e);
        }
    }
    makeNum();
    return numbers;
}

function random_number(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Marker --> Static Map Tmap api
 * pdata에 있는 lng, lat값에 핀 1개만 표시
 */
function info_map(pdata, id) {
    console.log("info_map() start");
    // map 생성
    // Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
    var info_map = new Tmapv2.Map(id, // "map_div" : 지도가 표시될 div의 id
        {
            // center: new Tmapv2.LatLng(37.79135410000000,127.525541800000000), // 지도 초기 좌표
            center: new Tmapv2.LatLng(pdata.Lat, pdata.Lng), // 지도 초기 좌표
            width: "100%", // map의 width 설정
            height: "17rem", // map의 height 설정
            httpsMode: true // map의 https 모드 설정
        });
    //Marker 객체 생성.
    var marker = new Tmapv2.Marker({
        // position: new Tmapv2.LatLng(37.79135410000000,127.525541800000000),
        position: new Tmapv2.LatLng(pdata.Lat, pdata.Lng),
        map: info_map,
    });

    info_map.setZoom(18);
}

/**
 * 관광지 목록에 있는 모든 좌표에 핀 표시
 */
function info_result_map(pdata, id, width = '100%', height = '17rem') {
    console.log(`info_result_map() start`);
    var markers = [];
    var positions = [];
    function addMarker(status, lon, lat, tag, parent) {
        var imgURL;
        // console.log(`status : ↓↓`);
        // console.log(parent);
        if (parent === 'info_result'){
            if (status === 'red') imgURL = "https://actions.o2o.kr/content/kangwontour/img/marker/pin_r.png";
            else imgURL = `https://actions.o2o.kr/content/kangwontour/img/marker/pin_b.png`;
        }
        else if (parent === 'reco_locale'){
            if(tag < 15) imgURL = `https://actions.o2o.kr/content/kangwontour/img/marker/pin_b_m_${tag + 1}.png`;
            else imgURL = `https://actions.o2o.kr/content/kangwontour/img/marker/pin_b.png`;
        }
        var marker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(lat, lon),
            icon: imgURL,
            map: result_map,
        });
        // console.log(`tag : ${tag}, lon : ${lon}, lat : ${lat}`);
        marker.addListener("click", function (evt) {
            //선택되지 않은 리스트, 마커 색깔 원래 것으로 바꾸기
            for (var i = 0; i < pdata.length; i++) {
                document.getElementById(`info_result-circle${i}`).style.backgroundColor = "#ffffff";
                document.getElementById(`resultlist${i}`).style.backgroundColor = "#ffffff";
                removeMarkers();
            }
            //선택된 리스트 항목 색깔 바꾸기, 마커 색깔 바꾸기
            document.getElementById(`info_result-circle${tag}`).style.backgroundColor = "#1ad3f1";
            document.getElementById(`resultlist${tag}`).style.backgroundColor = "#1ad3f1";
            addMarkers(tag);
            console.log(`${tag} clicked!`);
        })
        return marker;
    }
    var result_map = new Tmapv2.Map(id, {
        center: new Tmapv2.LatLng(pdata[0].lat, pdata[0].lng),
        width: width,
        height: height,
        httpsMode: true,
    });
    var addMarkers = function (tag) {
        for (let i = 0; i < pdata.length; i++) {
            let items;
            if (i === tag) {
                markers.push(addMarker('red', pdata[i].lng, pdata[i].lat, i, pdata[i].parent));
            } else {
                markers.push(addMarker('blue', pdata[i].lng, pdata[i].lat, i, pdata[i].parent));
            }
            items = new Tmapv2.LatLng(pdata[i].lat, pdata[i].lng)
            positions.push(items);
        }
    }
    addMarkers(-1);
    var removeMarkers = function () {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
    console.log(positions);
    var PTbounds = new Tmapv2.LatLngBounds();
    for (let i = 0; i < positions.length; i++) {
        PTbounds.extend(positions[i]);
    }
    result_map.fitBounds(PTbounds);
    // console.log(result_map.getBounds());
    // console.log(PTbounds);
    // result_map.setZoom(17);
}

/**
 *	추천코스 화면의 해시태그를 만들기 위한 함수
 * @param {*} data //fulfillment에서 받은 data
 */
function getQuote(data) {
    //question_one {힐링, 문화여행, 레저/레포츠}
    //question_two {알뜰하게, 욜로, 혼자, 친구들과, 가족이랑, 연인이랑}
    //question_three {당일치기, 1박2일, 2박3일}
    //place

    let quote = {"question_one" : "", "question_two" : "", "question_three" : "", "place" : "", "tag" : "", "acco" : "", "tour" : "", "days" : ""};

    if(data.question_one === "레저/스포츠") {
        quote.question_one = "Leisure/Sports";
        quote.tour = "leisure/sports";
    }
    else if (data.question_one === "힐링") {
        quote.question_one = "Healing";
        quote.tour = "healing";
    }
    else if (data.question_one === "문화여행") {
        quote.question_one = "Cultural";
        quote.tour = "cultural";
    }

    if(data.question_two === "알뜰하게") {
        quote.question_two = "Small Budget";
        quote.tag = "smallbudget";
        quote.acco = "good price";
    }
    else if(data.question_two === "욜로") {
        quote.question_two = "Big Budget";
        quote.tag = "bigbudget";
        quote.acco = "affordable price";
    }
    else if(data.question_two === "혼자") {
        quote.question_two = "Solo";
        quote.acco = "stay alone";
        quote.tag = "solotravel";
    }
    else if(data.question_two === "친구들과") {
        quote.question_two = "with Friends";
        quote.acco = "stay with friends";
        quote.tag = "friendshiptravel";
    }
    else if(data.question_two === "가족이랑") {
        quote.question_two = "with Family";
        quote.acco = "stay with family";
        quote.tag = "familytravel";
    }
    else {
        quote.question_two = "with Partner";
        quote.acco = "stay with partner";
        quote.tag = "coupletravel";
    }

    if(data.question_three === "2박3일") {
        quote.question_three = "longtrip";
        quote.days = 3;
    }
    else if (data.question_three === "1박2일") {
        quote.question_three = "1night2days";
        quote.days = 2;
    }
    else if (data.question_three === "당일치기") {
        quote.question_three = "1daytrip";
        quote.days = 1;
    }

    if(data.place) {
        let sigungucode = parseInt(dataplace(data.place));
        quote.place = places[sigungucode - 1];
    }

    return quote;
}

const goToPage = (link => {
    document.getElementById('externalframe').setAttribute('src', link); // iframe 링크 연결
});

const closeModal = () => {
    document.getElementById("endImage").style.display = "none";
}