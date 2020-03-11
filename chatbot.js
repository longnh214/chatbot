/*자바스크립트를 이용한 카카오톡 챗봇*/

var player = null;
var preMsg = null;

function getWeathetInfo(pos) {
    try{
        var data = Utils.getWebText("https://m.search.naver.com/search.naver?query=" + pos + "%20날씨");  //검색 결과 파싱
        data = data.replace(/<[^>]+>/g,"");  //태그 삭제
        data = data.split("월간")[1];  //날씨 정보 시작 부분의 윗부분 삭제
        data = data.split("시간별 예보")[0];  //날씨 정보 끝 부분의 아래쪽 부분 삭제
        data = data.trim();  //위아래에 붙은 불필요한 공백 삭제
        data = data.split("\n");  //엔터 단위로 자름
        var results = [];
        results[0] = data[0];  //날씨 상태(?)
        results[1] = data[3].replace("온도", "온도 : ").trim() + "℃";  //현재 온도
        results[2] = data[4].replace("온도", "온도 : ").trim() + "℃";  //체감 온도
        results[3] = data[9].replace("먼지", "먼지 : ").trim();  //미세먼지
        results[4] = data[13].replace("습도", "습도 :").trim() + "%";  //습도
        var result = "[" + pos + " 날씨 정보]\n\n상태 : " + results.join("\n");
        return result;  //결과 반환
    } catch(e) {
        return null;
    }
}

function response(room, msg, sender, isGroup, replier) {
    msg = msg.trim();
    //명령어 변수
    var cmd = msg.split(" ")[0];
    var data = msg.replace(cmd + " ", "");
    //도배 방지
    if(msg == preMsg) return;

    if(cmd == "/날씨") {
        var result = getWeathetInfo(data);
        if(result == null) {
            replier.reply(data + "의 날씨 정보를 가져올 수 없습니다.");
        } else {
            replier.reply(result);
        }
    }

    if(msg == "/코로나"){
        var data = Utils.getWebText("https://m.search.naver.com/search.naver?query=코로나%20현황");  //검색 결과 파싱
            data = data.replace(/<[^>]+>/g,"");  //태그 삭제
        
        data = data.split("COVID-19")[1];
        data = data.split("중앙방역대책본부의")[0];
        data = data.trim();  //위아래에 붙은 불필요한 공백 삭제
        data = data.split("\n");  //엔터 단위로 자름
        var temp = [];
        //추가인원 표시 추가
        temp[0] = data[0].trim();
        temp[1] = data[1].trim();
        temp[2] = data[2].trim();
        temp[3] = data[3].trim();
        //보기 편하게
        var results = [];
        results[0] = temp[0].split(" ")[0] + " : " + temp[0].split(" ")[1] + " (" + temp[0].split(" ")[2] + ")";
        results[1] = temp[1].split(" ")[0] + " : " + temp[1].split(" ")[1] + " (" + temp[1].split(" ")[2] + ")";
        results[2] = temp[2].split(" ")[0] + " : " + temp[2].split(" ")[1] + " (" + temp[2].split(" ")[2] + ")";
        results[3] = temp[3].split(" ")[0] + " : " + temp[3].split(" ")[1] + " (" + temp[3].split(" ")[2] + ")";
        results[4] = data[7].trim();   
        var result = "[코로나 현황]\n\n"+results.join("\n");
        replier.reply(result);
    }
    preMsg = msg;
}