/**
 * "view" class에 해당하는 모든 div 숨기기
 */

//function scrollupdate() {
//	var scroll = document.getElementsByClassName("flex-container");
//	scroll[0].scrollLeft = 10000;
//	console.log("scroll update!");
//}

/**
 * This class is used as a wrapper for Google Assistant Canvas Action class
 * along with its callbacks.
 */
class Action {
    /**
     * @param {*} scene which serves as a container of all visual elements
     */
    constructor(scene) {
        this.canvas = window.interactiveCanvas;
        this.scene = scene;
        const that = this;
        var cat2 = "";
        var city = "";
        var keyword = "";
        var resultid = new Array();
        this.commands = {
            MAIN: function (data) {
                console.log("실행 : MAIN()");
                // console.log(data);
                if (parseInt(data.fallback) > 0) {
                    setImage("startImage", "./img/p14-1.png");
                } else {
                    hideall();
                    clearInterval(endtimer);
                    document.getElementById("endImage").style.display = "none";
                    document.getElementById("welcome").style.display = "block";
                    //document.getElementById("welcome").style.backgroundImage = `url("./img/icon/welcome.png")`;
                    document.getElementById("startImage").style.display = "block";
                    setImage("startImage", "./img/p2-2.png");
                    // document.getElementById("startImage").src = "./img/p2-2.png";

					document.getElementById( "welcome" ).style.backgroundColor = "cde3f4";
					// console.log( "image changed : p2-2.png" );

                    setTimeout( `setImage("startImage", "./img/p2-3.png");
                    			document.getElementById("welcome").style.backgroundColor = "ffe1c4";
                    			// console.log("image changed : p2-3.png");`
                    , 3700 );
					setTimeout( `setImage("startImage", "./img/p2-4.png");
								document.getElementById("welcome").style.backgroundColor = "cf5060";
								// console.log("image changed : p2-4.png");`
					, 9500 );
				}
				console.log( "main command : " + data.command );
			},
			INFO: function ( data ) {
				console.log( "실행 : INFO()" );
				console.log( "data : " + data.keyword );
				console.log( data.keyword );
				// console.log( data );
				clearInterval( endtimer );
				document.getElementById( 'endImage' )
					.style.display = "none";
				info_view( data );
				//					document.getElementById("info_keyword")
				//						.style.display = "flex";
				//					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
				//					for (var i = 0; i < data.keyword.length; i++) {
				//						keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
				//					}
				//					keyword += `</div>`;
				//					document.getElementById("info_keyword")
				//						.innerHTML = keyword;
				//					scrollupdate();

            },
            INFO_RESULT: function (data) {
                console.log("실행 : INFO_RESULT()");
                console.log("data : " + data.keyword);
                console.log(data.keyword);
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                if (data.fallback) { // 3번 전까지 호랑이 땀흘리는 사진 넣기
                    document.getElementById("info_result_chara_image").setAttribute("src", `./img/p17.png`);
                } else {
                    document.getElementById("info_result_chara_image").setAttribute("src", `./img/p6-2_chara.png`);
                    info_result_view(data);
                }
                //	document.getElementById("info_keyword").style.display = "flex";
                //	keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
                //	for (var i = 0; i < data.keyword.length; i++) {
                //		keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
                //	}
                //	keyword += `</div>`;
                //	document.getElementById("info_keyword").innerHTML = keyword;
                //	scrollupdate();
            },
            // INFO_WAITING: function ( data ) {
            // 	console.log( "실행 : INFO_WAITING()" );
            // 	console.log( "data : " + data.keyword );
            // 	console.log( data.keyword );
            // 	console.log(data);
            // 	clearInterval( endtimer );
            // 	document.getElementById('endImage').style.display = "none";
            // 	info_waiting_view( data );
            // },
            INFO_RESULT_FALLBACK: (data) => { // 검색 결과가 0개일 경우 분류 하나를 떼고 검색
                console.log("실행 : INFO_RESULT_FALLBACK()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                fallback_no_data_view(data);
            },
            /* 상세정보 페이지 */
            INFO_DETAIL: function (data) {
                console.log("실행 :INFO_DETAIL()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_detail_view(data);
                //	document.getElementById("info_keyword").style.display = "flex";
                //	keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
                //	for (var i = 0; i < data.keyword.length; i++) {
                //		keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
                //	}
                //	keyword += `</div>`;
                //	document.getElementById("info_keyword").innerHTML = keyword;
                //	scrollupdate();
            },
            LOCAL_FOOD_STORES: function (data) {
                console.log(`local food 의 데이터 :: ${JSON.stringify(data)}`)
                //clearInterval( endtimer );
                findLocalFoodStores(data);
            },
            LOCAL_FOOD: function (data) {
                console.log(`local food 의 데이터 :: ${JSON.stringify(data)}`)
                //clearInterval( endtimer );
                localFood(data);
            },
            ABOUT_KANGWON: function (data) {
                aboutKw();
            },
            INFO_SEARCH: function (data) {
                console.log("실행 : INFO_SEARCH()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_search_view(data);
            },
            INFO_SEARCH_RESULT: function (data) {
                console.log("실행 : INFO_SEARCH_RESULT()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_search_result_view(data);
            },
            INFO_SEARCH_DETAIL: function (data) {
                console.log("실행 : INFO_SEARCH_DETAIL()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_search_detail_view(data);
            },
            INFO_RESULT_OPTION_EAT: function (data) {
                console.log("실행 : INFO_RESULT_OPTION_EAT()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                info_result_option_eat_view(data);
            },
            INFO_RESULT_OPTION_SLEEP: function (data) {
                console.log("실행 : INFO_RESULT_OPTION_SLEEP()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                info_result_option_sleep_view(data);
            },
            INFO_RESULT_OPTION_TOUR: (data) => {
                console.log("실행 : INFO_RESULT_OPTION_TOUR()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                info_result_option_tour_view(data);
            },
            INFO_RESULT_OPTION_HEAL: (data) => {
                console.log("실행 : INFO_RESULT_OPTION_HEAL()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                info_result_option_heal_view(data);
            },
            INFO_DETAIL_LINK: function (data) {
                console.log("실행 : INFO_DETAIL_LINK()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                // if(data.previous == "INFO_SEARCH_DETAIL") resultidinfo[0].selected = true;
                info_detail_link_view(data);
            },
            INFO_DETAIL_LINK_FINAL: (data) => {
                console.log("실행 : INFO_DETAIL_LINK_FINAL()");
                document.getElementById('externalframe').setAttribute('src', tmaplink); // iframe 링크 연결
                // window.location.href = tmaplink;
            },
            RECO: (data) => {
                console.log("실행 : RECO()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                recommend_view(data);
            },
            RECO_STEP_ONE: (data) => {
                console.log("실행 : RECO_STEP_ONE()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_step_one_view(data);
            },
            RECO_STEP_TWO: (data) => {
                console.log("실행 : RECO_STEP_TWO()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_step_two_view(data);
            },
            RECO_STEP_RESULT: (data) => {
                console.log("실행 : RECO_STEP_RESULT()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_step_result_view(data);
            },
            RECO_STEP_LOCALE: (data) => {
                console.log("실행 : RECO_STEP_LOCALE()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                if(!data.fallback){
                    console.log("------------------matching result------------------")
                    console.log(existing_course);
                    console.log(data.place);
                    if(!existing_course.includes(data.place)){
                        // console.log(existing_course);
                        // console.log(`selected = ${data.place}`);
                        // console.log(`place check unpassed`);
                        sendText(`SEARCH_DATA_NULL`);
                    } else {
                        // console.log(existing_course);
                        // console.log(`selected = ${data.place}`);
                        // console.log(`place check passed`);
                        reco_step_locale_view(data);
                    }
                }
            },
            RECO_STEP_LOCALE_MAP: (data) => {
                console.log("실행 : RECO_STEP_LOCALE_MAP()");
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_step_locale_map_view(data);
            },
            RECO_STEP_DETAIL: (data) => {
                console.log("실행 : RECO_STEP_DETAIL()");
                // console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_step_detail_view(data);
            },
            // RECOMMENDED: function ( data ) {
            // 	console.log( "실행 : RECOMMENDED()" );
            // 	console.log( "data : " + data.keyword );
            // 	console.log( data.keyword );
            // 	console.log(data);
            // 	clearInterval( endtimer );
            // 	document.getElementById( 'endImage' )
            // 		.style.display = "none";
            // 	recommended_view( data );
            //					document.getElementById("reco_keyword")
            //						.style.display = "flex";
            //					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
            //					for (var i = 0; i < data.keyword.length; i++) {
            //						keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
            //					}
            //					keyword += `</div>`;
            //					document.getElementById("reco_keyword")
            //						.innerHTML = keyword;
            //					scrollupdate();
            // },
            // RECO_RESULT: function ( data ) {
            // 	console.log( "실행 : RECO_RESULT()" );
            // 	console.log( "data : " + data.keyword );
            // 	console.log( data.keyword );
            // 	console.log(data);
            // 	clearInterval( endtimer );
            // 	document.getElementById( 'endImage' )
            // 		.style.display = "none";
            // 	reco_result_view( data );
            //					document.getElementById("reco_keyword")
            //						.style.display = "flex";
            //					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></di
            // 	clearInterval( endtimer );
            // 	document.getElementById( 'endImage' )
            // 		.style.display = "none";
            // 	reco_detail_view( data );
            //					document.getElementById("reco_keyword")
            //						.style.display = "flex";
            //					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
            //					for (var i = 0; i < data.keyword.length; i++) {
            //						keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
            //					}
            //					keyword += `</div>`;
            //					document.getElementById("reco_keyword")
            //						.innerHTML = keyword;
            //					scrollupdate();
            // },
            // RECO_DETAIL_INFO: function ( data ) {
            // 	console.log( "실행 : RECO_DETAIL_INFO()" );
            // 	console.log( "data : " + data.keyword );
            // 	console.log( data.keyword );
            // 	console.log(data);
            // 	clearInterval( endtimer );
            // 	document.getElementById( 'endImage' )
            // 		.style.display = "none";
            // 	reco_detail_info_view( data );
            // 	//					document.getElementById("reco_keyword")
            // 	//						.style.display = "flex";
            // 	//					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
            // 	//					for (var i = 0; i < data.keyword.length; i++) {
            // 	//						keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
            // 	//					}
            // 	//					keyword += `</div>`;
            // 	//					document.getElementById("reco_keyword")
            // 	//						.innerHTML = keyword;
            // 	//					scrollupdate();
            // },
            RECO_OPTION_DURING: function (data) {
                console.log("실행 : RECO_OPTION_DURING()");
                console.log("data : " + data.keyword);
                console.log(data.keyword);
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_option_during_view(data);
                //					document.getElementById("option_keyword")
                //						.style.display = "flex";
                //					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
                //					for (var i = 0; i < data.keyword.length; i++) {
                //						keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
                //					}
                //					keyword += `</div>`;
                //					document.getElementById("option_keyword")
                //						.innerHTML = keyword;
                //					scrollupdate();
            },
            RECO_OPTION_AGE: function (data) {
                console.log("실행 : RECO_OPTION_AGE()");
                console.log("data : " + data.keyword);
                console.log(data.keyword);
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_option_age_view(data);
                //					document.getElementById("option_keyword")
                //						.style.display = "flex"
                //					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
                //					for (var i = 0; i < data.keyword.length; i++) {
                //						keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
                //					}
                //					keyword += `</div>`;
                //					document.getElementById("option_keyword")
                //						.innerHTML = keyword;
                //					scrollupdate();
            },
            RECO_OPTION_TOGETHER: function (data) {
                console.log("실행 : RECO_OPTION_TOGETHER()");
                console.log(data.keyword);
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_option_together_view(data);
                //					document.getElementById("option_keyword")
                //						.style.display = "flex";
                //					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
                //					for (var i = 0; i < data.keyword.length; i++) {
                //						keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
                //					}
                //					keyword += `</div>`;
                //					document.getElementById("option_keyword")
                //						.innerHTML = keyword;
                //					scrollupdate();
            },
            RECO_OPTION_TRAFFIC: function (data) {
                console.log("실행 : RECO_OPTION_TRAFFIC()");
                console.log(data.keyword);
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_option_traffic_view(data);
                //					document.getElementById("option_keyword")
                //						.style.display = "flex";
                //					keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
                //					for (var i = 0; i < data.keyword.length; i++) {
                //						keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
                //					}
                //					keyword += `</div>`;
                //					document.getElementById("option_keyword")
                //						.innerHTML = keyword;
                //					scrollupdate();
            },
            RECO_OPTION_PLACE: function (data) {
                console.log("실행 : RECO_OPTION_PLACE()");
                console.log(data.keyword);
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_option_place_view(data);
            },
            RECO_OPTION_RESULT: function (data) {
                console.log("실행 : RECO_OPTION_RESULT()");
                console.log(data.keyword);
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                reco_option_result_view(data);
                //	document.getElementById("option_keyword").style.display = "flex";
                //	keyword = `<div class="fa fa-arrow-left" onclick="before('이전으로')" style="font-size: 1.9rem;left: 0px;top: 0px; color: white; background-color: rgba(212, 245, 254, 1); text-align: center; margin:20px; width:10%;"></div> <div class="flex-container">`;
                //	for (var i = 0; i < data.keyword.length; i++) {
                //		keyword += `<div onclick="before('${data.keyword[i]}')">${data.keyword[i]}</div>`;
                //	}
                //	keyword += `</div>`;
                //	document.getElementById("option_keyword").innerHTML = keyword;
                //	scrollupdate();
            },
            END: function (data) {
                console.log("실행 : RECO_OPTION_RESULT()");
                // console.log( data.end );
                console.log(data);
                start();
            },
            FALLBACK_LAST: function (data) {
                console.log("실행 : FALLBACK_LAST()");
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage')
                    .style.display = "none";
                fallback_last_view(data);
            },
            FALLBACK_NO_DATA: function (data) {
                console.log("실행 : FALLBACK_NO_DATA()");
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                fallback_no_data_view(data);
            }
            // MYCOURSE: function(data){
            //   mycourse_view(data);
            // },
        };

    }

    /*
     * Register all callbacks used by Interactive Canvas
     * executed during scene creation time.
     *
     */
    setCallbacks() {
        const that = this;
        let _data;
        // declare interactive canvas callbacks
        const callbacks = {
            onUpdate(data) {
                // try {
                console.log(data);
                that.commands[data.command.toUpperCase()](data);
                _data = data;
                console.log("onUpdate : " + data.command);

                // 예상 출력값 : onUpdate : MAIN
                // }
                // catch ( e ) {
                // 	// AoG 입력값을 매칭하지 못했을 경우
                // 	console.log( "error : " + e );
                // 	// 예상 출력값 : error : TypeError: Cannot read property 'toUpperCase' of undefined
                // 	// do nothing, when no command is sent or found
                // }
            },
            //fulfillment의 TTS에 mark name으로 선언해놓은 시간에 작동되는 명령
            // onTtsMark(markName) {
            // 	let command = _data.command;
            //     if (markName === 'NEXT') {
            //         switch (command) {
            //             case 'MAIN':
            //                 setImage("startImage", "./img/p2-3.png");
            //                 console.log("image changed : p2-3.png");
            //                 break;
            //             case 'INFO_DETAIL':
			// 			case 'INFO_SEARCH_DETAIL':
			// 			    if(!_data.fallback)
            //                 drawDetail(_data);
            //                 break;
            //         }
            //     }
            //     if(markName === 'MAIN_NEXT'){
            //     	switch (command) {
			// 			case 'MAIN':
			// 				setImage("startImage", "./img/p2-3.png");
			// 				console.log("image changed : p2-3.png");
			// 				break;
			// 		}
			// 	}
			// 	if(markName === 'END') {
			// 		console.log( "TTS Ended!" );
			// 		switch (command) {
			// 			case 'MAIN':
			// 				setImage("startImage", "./img/p2-4.png");
			// 		}
			// 	}
			// 	if(markName === 'START') {
			// 		console.log( "TTS Started!" );
			// 	}
			// 	if(markName === 'ERROR') {
			// 		console.log( "TTS ERROR!" );
			// 	}
            // },
        };

        // called by the Interactive Canvas web app once web app has loaded to
        // register callbacks
        this.canvas.ready(callbacks);
        console.log("setCallbacks READY");
    }
}
