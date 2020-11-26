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
        let cat2 = "", city = "", keyword = "";
        let resultid = new Array();
        this.commands = {
            MAIN: function (data) {
                console.log("실행 : MAIN()");
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
					console.log( "image changed : p2-2.png" );

                    setTimeout(() => {
                        setImage("startImage", "./img/p2-3.png");
                        document.getElementById("welcome").style.backgroundColor = "ffe1c4";
                    }, 1600 );
					setTimeout( () => {
					    setImage("startImage", "./img/p2-4.png");
                        document.getElementById("welcome").style.backgroundColor = "cf5060";
                        document.getElementById("welcome").style.backgroundImage = "";
                    }, 5700 );

                    document.querySelectorAll(".view_full").forEach(item => {
                        item.style.marginTop = barHeight;
                    });
				}
			},
			INFO: (data) => {
				console.log( "실행 : INFO()" );
				clearInterval( endtimer );
				document.getElementById( 'endImage' ).style.display = "none";
				info_view( data );
            },
            INFO_RESULT: (data) => {
                console.log("실행 : INFO_RESULT()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                if (data.fallback) { // 3번 전까지 호랑이 땀흘리는 사진 넣기
                    document.getElementById("info_result_chara_image").setAttribute("src", `./img/p17.png`);
                } else {
                    document.getElementById("info_result_chara_image").setAttribute("src", `./img/p6-2_chara.png`);
                    info_result_view(data);
                }

            },
            INFO_RESULT_FALLBACK: (data) => { // 검색 결과가 0개일 경우 분류 하나를 떼고 검색
                console.log("실행 : INFO_RESULT_FALLBACK()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                fallback_no_data_view(data);
            },
            /* 상세정보 페이지 */
            INFO_DETAIL: (data) => {
                console.log("실행 :INFO_DETAIL()\n data >> " + data );
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_detail_view(data);
            },
            LOCAL_FOOD_STORES: (data) => {
                console.log(`local food 의 데이터 :: ${JSON.stringify(data)}`)
                //clearInterval( endtimer );
                findLocalFoodStores(data);
            },
            LOCAL_FOOD: (data) => {
                console.log(`local food 의 데이터 :: ${JSON.stringify(data)}`)
                localFood(data);
            },
            ABOUT_KANGWON: (data) => {
                aboutKw();
            },
            INFO_SEARCH: function (data) {
                console.log("실행 : INFO_SEARCH()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_search_view(data);
            },
            INFO_SEARCH_RESULT: function (data) {
                console.log("실행 : INFO_SEARCH_RESULT()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_search_result_view(data);
            },
            INFO_SEARCH_DETAIL: function (data) {
                console.log("실행 : INFO_SEARCH_DETAIL()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_search_detail_view(data);
            },
            INFO_RESULT_OPTION_EAT: function (data) {
                console.log("실행 : INFO_RESULT_OPTION_EAT()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_result_option_eat_view(data);
            },
            INFO_RESULT_OPTION_SLEEP: function (data) {
                console.log("실행 : INFO_RESULT_OPTION_SLEEP()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_result_option_sleep_view(data);
            },
            INFO_RESULT_OPTION_TOUR: (data) => {
                console.log("실행 : INFO_RESULT_OPTION_TOUR()");
                clearInterval(endtimer);
                document.getElementById('endImage') .style.display = "none";
                info_result_option_tour_view(data);
            },
            INFO_RESULT_OPTION_HEAL: (data) => {
                console.log("실행 : INFO_RESULT_OPTION_HEAL()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                info_result_option_heal_view(data);
            },
            INFO_DETAIL_LINK: function (data) {
                console.log("실행 : INFO_DETAIL_LINK()");
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
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                recommend_view(data);
            },
            RECO_STEP_ONE: (data) => {
                console.log("실행 : RECO_STEP_ONE()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_step_one_view(data);
            },
            RECO_STEP_TWO: (data) => {
                console.log("실행 : RECO_STEP_TWO()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_step_two_view(data);
            },
            RECO_STEP_RESULT: (data) => {
                console.log("실행 : RECO_STEP_RESULT()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_step_result_view(data);
            },
            RECO_STEP_LOCALE: (data) => {
                console.log("실행 : RECO_STEP_LOCALE()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                if(!data.fallback){
                    if(!existing_course.includes(data.place.substr(0, 2))){
                        sendText(`SEARCH_DATA_NULL`);
                    } else {
                        reco_step_locale_view(data);
                    }
                }
            },
            //TODO
            RECO_STEP_LOCALE_MAP: (data) => {
                console.log("실행 : RECO_STEP_LOCALE_MAP()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_step_locale_map_view(data);
            },
            RECO_STEP_DETAIL: (data) => {
                console.log("실행 : RECO_STEP_DETAIL()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_step_detail_view(data);
            },
            RECO_OPTION_DURING: (data) => {
                console.log("실행 : RECO_OPTION_DURING()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_option_during_view(data);
            },
            RECO_OPTION_AGE: (data) => {
                console.log("실행 : RECO_OPTION_AGE()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_option_age_view(data);
            },
            RECO_OPTION_TOGETHER: (data) => {
                console.log("실행 : RECO_OPTION_TOGETHER()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_option_together_view(data);
            },
            RECO_OPTION_TRAFFIC: (data) => {
                console.log("실행 : RECO_OPTION_TRAFFIC()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_option_traffic_view(data);
            },
            RECO_OPTION_PLACE: (data) => {
                console.log("실행 : RECO_OPTION_PLACE()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_option_place_view(data);
            },
            RECO_OPTION_RESULT: (data) => {
                console.log("실행 : RECO_OPTION_RESULT()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                reco_option_result_view(data);
            },
            END: (data) => {
                console.log("실행 : RECO_OPTION_RESULT()");
                start();
            },
            FALLBACK_LAST: (data) => {
                console.log("실행 : FALLBACK_LAST()");
                console.log(data);
                clearInterval(endtimer);
                document.getElementById('endImage').tyle.display = "none";
                fallback_last_view(data);
            },
            FALLBACK_NO_DATA: (data) => {
                console.log("실행 : FALLBACK_NO_DATA()");
                clearInterval(endtimer);
                document.getElementById('endImage').style.display = "none";
                fallback_no_data_view(data);
            },
            FILM_RESULT: (data) => {
                console.log("실행 : FILM_RESULT");

                const result = data.result; //결과 list
                console.log("data.result.length >>> " + result.length);

                if(result.length === 1) {
                    document.getElementById('startImage').style.display = "none";
                    document.getElementById("welcome").style.backgroundImage = ``;

                    hideall();
                    drawFilmResultDetail(data.info);
                } else {

                    let myObj = [];
                    let index = 0;
                    const count = 50;

                    result.forEach(element => {
                        if(element.mapx) myObj.push(element);
                    });

                    document.getElementById('startImage').style.display = "none";
                    document.getElementById("welcome").style.backgroundImage = ``;

                    hideall();
                    document.getElementById("info").style.display = 'block';
                    document.getElementById("info_result").style.display = "block";
                    document.getElementById("info_result_tmapview").innerHTML = "";

                    const infoResultList = document.getElementById("info_result_list");
                    infoResultList.innerHTML = `<span class="list-total-count" >총 ${data.result.length}건</span>`;

                    infoResultList.style.height = (window.innerHeight - window.innerHeight/1.6) +"px";

                    async function loadItems() {
                        console.log("start with >>> "+ index)

                        let temp = index+count > result.length ? result.length : index+count;
                        let pdata = [];
                        for(let i=index; i < temp; i++) { //console.log(" load more >>> "+i+ " / "+ count)
                            const imgURL = result[i].firstimage ? replaceimage(result[i].firstimage) : "./img/icon/noimage.png";
                            pdata.push({ "lng": result[i].mapx, "lat": result[i].mapy, "parent": "info_result" });

                            infoResultList.innerHTML += `
                                <div id = "resultlist${i}" class="list-box" onclick="resultnumber(${parseInt(i + 1)})">
                                    <div id="info_result-circle${i}" class="result-circle">
                                        <div class="result-number">${parseInt(i + 1)}</div>
                                    </div>
                                    <div class="result-img"><img src="${imgURL}"></div>
                                    <div class="result-text">
                                        <div class="result-title">
                                            [${parseInt(i + 1)}] ${result[i].title}
                                        </div>
                                        <div class="result-addr">
                                            <i class='fas fa-map-marker-alt'></i>  ${result[i].addr1 ? result[i].addr1 : "주소정보 없음"}
                                        </div>
                                    </div>
                                </div>`;

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

                        if (result.length > temp) {
                            const infoResultLastItem = document.querySelector(`#resultlist${temp-1}`);
                            io.observe(infoResultLastItem);
                        }
                    }

                    loadItems();
                }
            },
            FILM_DETAIL: function (data) {
                console.log("실행 : FILM_DETAIL");
                console.log(data.info);
                console.log(data.info.title);

                const tag = parseInt(data.info_number - 1);

                if( resultidinfo && !data.fallback ) {
                    resultidinfo.map( (data, i) => {
                        document.getElementById(`info_result-circle${i}`).style.backgroundColor = "#ffffff";
                        document.getElementById(`resultlist${i}`).style.backgroundColor = "#ffffff";
                    })

                    document.getElementById(`info_result-circle${tag}`).style.backgroundColor = "#1ad3f1";
                    document.getElementById(`resultlist${tag}`).style.backgroundColor = "#1ad3f1";

                    setTimeout( ()=>drawFilmDetail(data) , 1000);

                } else {
                    document.getElementById("info_result_chara_image").setAttribute("src", "./img/p6-4_charafallback.png");
                }
            }
            // MYCOURSE: function(data){
            //   mycourse_view(data);
            // },
        };

    }

    /*
     * Register all callbacks used by Interactive Canvas
     * executed during scene creation time.
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
            // fulfillment의 TTS에 mark name으로 선언해놓은 시간에 작동되는 명령
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
