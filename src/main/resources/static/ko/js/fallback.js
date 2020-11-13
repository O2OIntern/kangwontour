function fallback_last_view(data){
	console.log("실행 : fallback_last_view()");
	document.getElementById("endImage").style.display = "table";
	//document.getElementsByClassName("modal")[0].style.backgroundImage = `url("./img/p14.png")`;
	document.getElementsByClassName("modal")[0].innerHTML = 
	`<img id="fallback_image" src="./img/p14.png" usemap="#fallback-map" width="1041" height="1404"></img>
		<map name="fallback-map">
<!--			<area onclick="sendText('이전으로')" alt="이전으로" title="이전으로" coords="127,923,919,1101" shape="rect">-->
			<area onclick="sendText('처음으로')" alt="처음으로" title="처음으로" coords="129,1129,919,1300" shape="rect">
			<area onclick="closeModal()" alt="닫기" title="닫기" coords="882,102,948,176" shape="rect">
		</map>`;
	//document.getElementsByClassName("modal")[0].style.height = "80%";
	
	 $('img[usemap]').click(function () {
	 	$(this).rwdImageMaps();
	 	$("#img").width("100%");
	 });
	 $('img[usemap]').trigger("click");
}

function fallback_no_data_view(data){
	console.log("실행 : fallback_no_data_view()");
	document.getElementById("endImage").style.display = "table";
	//document.getElementsByClassName("modal")[0].style.backgroundImage = `url("./img/p14.png")`;
    document.getElementsByClassName("modal")[0].innerHTML = 
	`<img id="fallback_image" src="./img/p14.png" usemap="#fallback-map" width="1041" height="1404"></img>
		<map name="fallback-map">
<!--			<area onclick="sendText('이전으로')" alt="이전으로" title="이전으로" coords="127,923,919,1101" shape="rect">-->
			<area onclick="sendText('처음으로')" alt="처음으로" title="처음으로" coords="129,1129,919,1300" shape="rect">
			<area onclick="closeModal()" alt="닫기" title="닫기" coords="882,102,948,176" shape="rect">
		</map>`;
	//document.getElementsByClassName("modal")[0].style.height = "80%";

	$('img[usemap]').click(function () {
		$(this).rwdImageMaps();
		$("#img").width("100%");
	});
	$('img[usemap]').trigger("click");
}