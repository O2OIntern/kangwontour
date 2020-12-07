package com.o2o.action.server.app;

import com.o2o.action.server.db.KtourApi;
import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class RestProvider {

    public static void main(String[] args) {
        KtourApi[] accomData = callAccomAndRestApi("1", "six");
        callScheduler("1", "six", "1박2일", accomData[0]);
    }

    public static KtourApi[] callAccomAndRestApi(String sigunguCd, String course_type) {
        final String accomAndRestUri
                = "https://actions.o2o.kr/devsvr9/sigungu/accommodation?sigungucode=" + sigunguCd
                + "&theme=" + course_type;

//        JSONArray accoOrRests = new RestTemplate().getForObject(accomAndRestUri, JSONArray.class);
//        List<KtourApi> accoOrRests = new RestTemplate().getForObject(accomAndRestUri, List.class);
        //java.util.LinkedHashMap cannot be cast to com.o2o.action.server.db.KtourApi
        KtourApi[] accoOrRests = new RestTemplate().getForObject(accomAndRestUri, KtourApi[].class);
        return accoOrRests;
    }
    public static String callScheduler(String sigunguCd, String course_type, String question_three, KtourApi stay) {
        final String schedulerUri = "http://172.30.1.88:8070";

        String days = "당일치기".equals(question_three) ? "1"
                    : "1박2일".equals(question_three) ? "2"
                    : "2박3일".equals(question_three) ? "3" : "1";

        // request body parameters //Map<String, Object> map = new HashMap<>();
        JSONObject reqBody = new JSONObject();
        reqBody.put("gender", "0");
        reqBody.put("age", "0");
        reqBody.put("budget", "99999999");
        reqBody.put("transportType", "1");//여기까지 고정

        reqBody.put("startTime", getCurrentTimeUsingCalendar(0) + " 08:00");
        reqBody.put("endTime", getCurrentTimeUsingCalendar(Integer.parseInt(days) - 1) + " 20:00");
        reqBody.put("destination", sigunguCd);
        reqBody.put("days", days);
        JSONArray themes = getTheme(course_type);
        System.out.println("JSONArray themes >>> "+themes.toString());
        reqBody.put("theme", themes); //TODO

//        KtourApi[] restArr = callAccomAndRestApi(sigunguCd, "음식점");
//        int howManyRest = "1".equals(days) ? 2 : "2".equals(days) ? 4 : "3".equals(days) ? 6 : 6;
//        List<Integer> howManyRests = getRanNums(howManyRest, restArr.length);

//        JSONArray newArr = new JSONArray();
//        for(int n=0; n<howManyRests.size(); n++) {
//            JSONObject obj =(JSONObject)restArr.get(n);
//            obj.put("address", obj.get("addr1")); //addr1 => address
//            //시간추가
//            if(n%2==0) {
//                obj.put("startTime", "12:00");
//                obj.put("endTime", "13:00");
//            }else{
//                obj.put("startTime", "18:00");
//                obj.put("endTime", "19:00");
//            }
//            newArr.put(obj);
//        } System.out.println("rest >>> "+newArr);
        JSONObject stayObj = null;
        JSONArray stayArr = new JSONArray();
        if(stay!=null){
            stayObj = new JSONObject(stay);
            stayObj.put("startTime", "22:00");
            stayObj.put("endTime", "09:00");
            stayObj.put("address", stay.getAddr1());
            stayArr.put(stayObj);
        }
        reqBody.put("stay", stayArr);

        reqBody.put("partner", "five".equals(course_type) ? "4"
                            : "six".equals(course_type) ? "3"
                            : "seven".equals(course_type) ? "2"
                            : "eight".equals(course_type) ? "1"
                            : "0");
        reqBody.put("count", "1");

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getMessageConverters()
                    .add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); //_UTF8 X
        HttpEntity<?> entity = new HttpEntity<String>(reqBody.toString(), headers);
        System.out.println("reqBody.toString() >> "+reqBody.toString());
        ResponseEntity<String> response = restTemplate.exchange(schedulerUri, HttpMethod.POST, entity, String.class);
//        ResponseEntity<JSONArray> response = restTemplate.postForEntity(schedulerUri, entity, JSONArray.class);
//        ResponseEntity<List<KtourApi>> response = restTemplate.exchange(schedulerUri, HttpMethod.POST, entity, typeRef);

        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Request Successful");
            System.out.println(response.getBody());
        } else {
            System.out.println("Request Failed");
            System.out.println(response.getStatusCode());
        }

        return response.getBody();
    }
    public static List<Integer> getRanNums(int n, int tot) {
        System.out.println(tot + " 개 중에서 " + n + " 개 뽑기");
        Random rand = new Random();
        List<Integer> numbers = new ArrayList<>(); //Arrays.asList(); //new int[n];

        while (numbers.size() < n) {
            // take a raundom index between 0 to size of given List
            int randomIndex = rand.nextInt(tot);
            if (numbers.contains(randomIndex)) continue;
            numbers.add(randomIndex);
        }
        return numbers;
    }
    /** recursive하게 바꿀까 ? 고민
    public List<Integer> getRandom(int n, int tot) {
        System.out.println(tot+" 개 중에서 "+ n + " 개 뽑기");
        List<Integer> numbers = Arrays.asList(); //new int[n];
        return makeNum(numbers, n, tot);
    }
    private List<Integer> makeNum (List<Integer> numbers, int n, int tot) {
        if (numbers.size() < n) {
            int ranNo = (int) Math.floor(Math.random() * tot) + 1;
            for(int i : numbers) if(i != ranNo) numbers.add(ranNo);
            makeNum(numbers, n, tot);
        }
        return numbers;
    }*/

    public static String getCurrentTimeUsingCalendar(int day) {
        Calendar cal = Calendar.getInstance();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd"); // HH:mm");

//        String formattedDate = dateFormat.format(cal.getTime() ); //Date
//        System.out.println("now >>> " + formattedDate);

        cal.add(Calendar.DAY_OF_MONTH, day);
        String newDate = dateFormat.format(cal.getTime());
        System.out.println("newDate >>> " + newDate);
        return newDate;
    }

    public static String getSigunguCd(String sigunguNm) {
        String sigunguCd
                = "강릉시".equals(sigunguNm) ? "1"
                : "고성군".equals(sigunguNm) ? "2"
                : "동해시".equals(sigunguNm) ? "3"
                : "삼척시".equals(sigunguNm) ? "4"
                : "속초시".equals(sigunguNm) ? "5"
                : "양구군".equals(sigunguNm) ? "6"
                : "양양군".equals(sigunguNm) ? "7"
                : "영월군".equals(sigunguNm) ? "8"
                : "원주시".equals(sigunguNm) ? "9"
                : "인제군".equals(sigunguNm) ? "10"
                : "정선군".equals(sigunguNm) ? "11"
                : "철원군".equals(sigunguNm) ? "12"
                : "춘천시".equals(sigunguNm) ? "13"
                : "태백시".equals(sigunguNm) ? "14"
                : "평창군".equals(sigunguNm) ? "15"
                : "홍천군".equals(sigunguNm) ? "16"
                : "화천군".equals(sigunguNm) ? "17"
                : "횡성군".equals(sigunguNm) ? "18"
                : null;
        return sigunguCd;
    }

    private static JSONArray getTheme(String course_type) {
        System.out.println("getTheme");
        JSONArray arr = new JSONArray();
        if ("one".equals(course_type)) { //힐링, 알뜰하게
            arr.put("1");
            arr.put("3");
        } else if ("two".equals(course_type)) { //힐링, 욜로
            arr.put("1");
            arr.put("2");
        } else if ("three".equals(course_type)) { //문화여행, 알뜰하게
            arr.put("3");
        } else if ("four".equals(course_type)) { //문화여행, 욜로
            arr.put("2");
            arr.put("4");
            arr.put("5");
        } else if ("five".equals(course_type)) { //레저, 혼자
            arr.put("1");
            arr.put("4");
        } else if ("six".equals(course_type) || "seven".equals(course_type) || "eight".equals(course_type)) { //레저, 혼자이외
            arr.put("2");
            arr.put("4");
        }
        return arr;
    }
}