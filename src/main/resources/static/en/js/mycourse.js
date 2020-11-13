/**
 * "내맘대로 코스" intent에 사용할 함수
 */
function mycourse_view(data)
{
    // 전부 가리고 mycourse div 보이게 하기
    hideall();
    document.getElementById("mycourse").style.display = "block";

    // 데이터 도착 확인
    console.log("mycourse_view command  : " + data.command);
}