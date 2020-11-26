package com.o2o.action.server.app;

import com.google.actions.api.*;
import com.google.actions.api.response.*;
import com.google.actions.api.response.helperintent.*;
import com.google.api.services.actions_fulfillment.v2.model.*;
import com.google.gson.reflect.TypeToken;
import com.o2o.action.server.db.KtourApi;
import com.o2o.action.server.repo.KtourapiRepository;
import com.o2o.action.server.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;
import java.util.*;
import java.util.concurrent.*;

@Component
public class KangwonTour extends DialogflowApp {

  public static final String URL = "https://actions.o2o.kr/devsvr9/ko/index.html";

  @Autowired
  KtourapiRepository ktourapiRepository;

  @ForIntent("Default Welcome Intent")
  public ActionResponse defaultWelcome(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");

    if (!request.hasCapability("actions.capability.INTERACTIVE_CANVAS")) {
      return rb.add(new SimpleResponse().setSsml("Inveractive Canvas가 지원되지 않는 기기에요. 다른 기기로 다시 이용해 주세요."))
              .endConversation().build();
    } else {
      webdata.put("command", "MAIN");
      CommonUtil.printMapData(webdata);
      rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
      return rb.add(new SimpleResponse().setTextToSpeech("강원도 투어입니다. 저는 여행을 함께할 범이 라고 해요. 무엇을 도와드릴까요?"))
              .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
              .build();
    }
  }

  @ForIntent("Default Welcome Intent - fallback")
  public ActionResponse defaultWelcomeFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("Default Fallback Intent")
  public ActionResponse defaultFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("FILM")
  public ActionResponse searchForFilmingLocation(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();

    String response = "";
    String text = "";
    String condition = "";
    List<KtourApi> result = new ArrayList<>();
    int type = 0;

    String actor = CommonUtil.makeSafeString(request.getParameter("actor"));
    String title = CommonUtil.makeSafeString(request.getParameter("title"));

    System.out.println("actor >>> " + actor);
    System.out.println("title >>>" + title);

    request.getContexts().clear();
    rb.getConversationData().remove("fallback");

    //배우명 + 드라마 제목 검색(1)
    if (!CommonUtil.isEmptyString(actor) && !CommonUtil.isEmptyString(title)) {
      result = ktourapiRepository.findByFilmtitleContainingAndActorContaining(title, actor);
      text = actor + " 배우가 출연한 ";
      condition = title;
      type = 1;
    }
    //제목으로 검색(2)
    else if (CommonUtil.isEmptyString(actor) && !CommonUtil.isEmptyString(title)) {
      result = ktourapiRepository.findByFilmtitleContaining(title);
      condition = title;
      type = 2;
    }
    //배우명으로 검색(3)
    else if (!CommonUtil.isEmptyString(actor) && CommonUtil.isEmptyString(title)){
      result = ktourapiRepository.findByActorContaining(actor);
      condition = actor;
      type = 3;
    }

    rb.getConversationData().put("filmResult", result);

    if(result.size() == 1) {
      response = text + condition + " 촬영지" + result.get(0).getTitle() +" 입니다. 원하는 정보를 클릭하거나 제게 말을 걸어보세요.";
      webdata.put("info", result.get(0));
      rb.getConversationData().put("film_info", result.get(0));
      webdata.put("command", "FILM_RESULT");
    } else if(result.size() > 1) {
      response = text + condition + " 촬영지 검색 결과 입니다. 원하는 정보를 클릭하거나 제게 말을 걸어보세요.";
      webdata.put("command", "FILM_RESULT");
    } else {
      response = "원하시는 정보가 없는 것 같아요. 다른 검색어로 찾아보는 건 어떨까요?";
      webdata.put("command", "INFO_RESULT_FALLBACK");
    }
    webdata.put("actor", actor);
    webdata.put("title", title);
    webdata.put("type", type);
    webdata.put("result", result);

    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("FILM_DETAIL")
  public ActionResponse filmDetailIntent(ActionRequest request) throws ExecutionException, InterruptedException {

    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();

    Object obj = rb.getConversationData().get("filmResult");
    int number = (int) Double.parseDouble(String.valueOf(request.getParameter("number")));

    List<KtourApi> result = (List<KtourApi>) obj;

    System.out.println(result);
    System.out.println(number);
    System.out.println(result.get(number - 1));

    webdata.put("info", result.get((number - 1)));
    webdata.put("info_number", number);
    webdata.put("command","FILM_DETAIL");
    rb.getConversationData().put("film_info", result.get((number - 1)));

    response = "선택하신 " +
            number
            + " 번째 촬영지 입니다. 원하는 정보를 클릭하거나 제게 말을 걸어보세요.";

    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("SEARCH")
  public ActionResponse intentInfoResult(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    String type = CommonUtil.makeSafeString(request.getParameter("type"));
    String sleep = CommonUtil.makeSafeString(request.getParameter("sleep"));
    String tour = CommonUtil.makeSafeString(request.getParameter("tour"));
    String eat = CommonUtil.makeSafeString(request.getParameter("eat"));
    String place = CommonUtil.makeSafeString(request.getParameter("place"));
    String search = CommonUtil.makeSafeString(request.getParameter("data_place"));
    String permission = CommonUtil.makeSafeString(rb.getConversationData().get("permission"));
    HtmlResponse htmlResponse = new HtmlResponse();
    request.getContexts().clear();
    rb.getConversationData().remove("fallback");

    if (!CommonUtil.isEmptyString(search)) { //search 변수에 값이 들어있을 경우
      System.out.println("data -> search : " + search);
      rb.getConversationData().put("search", search);

      response = "<speak><break time=\"4000ms\"/><sub alias=\"\">'"
              + search + "' 데이터를 검색중입니다.</sub></speak>";
      webdata.put("command", "INFO_SEARCH");
      webdata.put("any", search);
    } else { //변수에 값이 없을 경우
  
      if (!CommonUtil.isEmptyString(place)) {
        System.out.println("data -> place : " + place);
        if (place.equalsIgnoreCase("내 주변")) {
          if (CommonUtil.isEmptyString(permission)) {
            permission = "TRUE";
          } else {
            permission = "YES";
          }
        } else {
//          permission = "FALSE";
        }
      } else { // 위치가 아예 없음
        if (CommonUtil.isEmptyString(permission)) {
          permission = "TRUE";
        }
      }
  
      if (request.getWebhookRequest()
                .getQueryResult()
                .getQueryText()
                .equalsIgnoreCase("actions_intent_PERMISSION")) {
        if (CommonUtil.isEmptyString(type))
          type = CommonUtil.makeSafeString(rb.getConversationData().get("type"));

        if (CommonUtil.isEmptyString(sleep))
          sleep = CommonUtil.makeSafeString(rb.getConversationData().get("sleep"));

        if (CommonUtil.isEmptyString(tour))
          tour = CommonUtil.makeSafeString(rb.getConversationData().get("tour"));

        if (CommonUtil.isEmptyString(eat))
          eat = CommonUtil.makeSafeString(rb.getConversationData().get("eat"));

        if (request.getArgument("PERMISSION").getTextValue().equals("true")) {
          // PERMISSION -> CHECK 했고 Yes
          // place -> NULL (이후 사용자 위치 받음)  case 1
          permission = "YES";
        } else {
          // PERMISSION -> CHECK 했고 No
          // PERMISSION -> CHECK
          // 사용자 위치 place
          permission = "NO";
        }
        System.out.println("ARG_PERMISSION --> " + permission);
      }
  
      switch (permission) {
        case "TRUE":
          String[] permissions = new String[] {ConstantsKt.PERMISSION_NAME};
          String context = "현재 사용자의 위치를 수집합니다.";
          if (request.getUser().getUserVerificationStatus().equals("VERIFIED")) {
            permissions =
                new String[] {
                    ConstantsKt.PERMISSION_NAME, ConstantsKt.PERMISSION_DEVICE_PRECISE_LOCATION
                };
          }
          rb.getConversationData().put("permission", "TRUE");
          rb.add("현재 사용자의 위치를 수집합니다.")
              .add(new Permission().setPermissions(permissions).setContext(context));
          break;
        case "FALSE":
          System.out.println("place Not Null!  --> " + place);
          break;
        case "NO":
          place = "강원도";
          break;
        case "YES":
          Location location = request.getDevice().getLocation();
          rb.getConversationData().put("name", request.getUser().getProfile().getDisplayName());
          if (location.getFormattedAddress().contains("강원도")) { // 사용자 위치 --> 강원도 內
            webdata.put("lat", String.valueOf(location.getCoordinates().getLatitude()));
            webdata.put("lon", String.valueOf(location.getCoordinates().getLongitude()));
            place = location.getCity();
          } else { // 사용자 위치 --> 강원도 外
            place = "강원도";
          }
          break;
      }
  
      System.out.println("data -> PERMISSION : " + permission);
      rb.getConversationData().put("permission", permission);
      
      if (!CommonUtil.isEmptyString(sleep)) {
        System.out.println("data -> sleep : " + sleep);
        rb.getConversationData().put("sleep", sleep);
        webdata.put("sleep", sleep);
        rb.getConversationData().remove("place");
      }

      if (!CommonUtil.isEmptyString(tour)) {
        System.out.println("data -> tour : " + tour);
        rb.getConversationData().put("tour", tour);
        webdata.put("tour", tour);
      }

      if (!CommonUtil.isEmptyString(eat)) {
        System.out.println("data -> eat : " + eat);
        rb.getConversationData().put("eat", eat);
        webdata.put("eat", eat);
        rb.getConversationData().remove("place");
      }

      if (!CommonUtil.isEmptyString(type)) {
        System.out.println("data -> type : " + type);
        rb.getConversationData().put("type", type);
        webdata.put("type", type);
      }

      System.out.println("data -> PLACE : " + place);
      rb.getConversationData().put("place", place);
      webdata.put("place", place);

      if (type.equalsIgnoreCase("음식점")) {
        webdata.put("command", "INFO_RESULT_OPTION_EAT");
        response = "언제 식사하실 예정이신가요?";
      } else if (type.equalsIgnoreCase("숙박")) {
        webdata.put("command", "INFO_RESULT_OPTION_SLEEP");
        response = "어떤 숙소를 알아볼까요?";
      } else if (type.equalsIgnoreCase("관광지")) {
        webdata.put("command", "INFO_RESULT_OPTION_TOUR");
        response = "어떤 관광지를 알아볼까요?";
      } else if (!CommonUtil.isEmptyString(sleep)) {
        webdata.put("command", "INFO_RESULT");
        response = sleep + " 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
        htmlResponse.setSuppressMic(true);
      } else if (!CommonUtil.isEmptyString(tour)) {
        webdata.put("command", "INFO_RESULT");
        response = tour + " 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
        htmlResponse.setSuppressMic(true);
      } else if (!CommonUtil.isEmptyString(eat)) {
        webdata.put("command", "INFO_RESULT");
        response = eat + "식사 하기 좋은 음식점 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
        htmlResponse.setSuppressMic(true);
      } else if (tour.equalsIgnoreCase(("힐링"))) {
        webdata.put("command", "INFO_RESULT_OPTION_HEAL");
        response = "자연 속 힐링과 문화 시설에서 힐링 중 어느 곳을 찾아볼까요?";
      } else {
        response = "죄송해요, 원하시는 정보가 없는것 같아요. 다른 검색어로 찾아보는건 어떨까요?";
        webdata.put("command", "FALLBACK_NO_DATA");
      }
    }

    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
            .build();
  }

  @ForIntent("SEARCH - fallback")
  public ActionResponse searchFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RESULT_HEAL")
  public ActionResponse intentSearchHeal(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    String place = CommonUtil.makeSafeString(rb.getConversationData().get("place"));
    String heal = CommonUtil.makeSafeString(request.getParameter("heal"));

    HtmlResponse htmlResponse = new HtmlResponse();
    rb.getConversationData().remove("fallback");
    if (!CommonUtil.isEmptyString(place)) webdata.put("place", place);

    System.out.println("---------------RESULT_HEAL INTENT ------------");
    if (!CommonUtil.isEmptyString(heal)) {
      System.out.println("data -> heal : " + heal);
      rb.getConversationData().put("heal", heal);
      webdata.put("command", "INFO_RESULT");
      webdata.put("heal", heal);
      response = heal + " 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
    }

    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
        .build();
  }

  @ForIntent("RESULT_HEAL - fallback")
  public ActionResponse intentResultHealFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RESULT_LIST")
  public ActionResponse intentResultList(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    String sleep = CommonUtil.makeSafeString(request.getParameter("sleep"));
    String eat = CommonUtil.makeSafeString(request.getParameter("eat"));
    String place = CommonUtil.makeSafeString(rb.getConversationData().get("place"));
    String heal = CommonUtil.makeSafeString(request.getParameter("heal"));
    String tour = CommonUtil.makeSafeString(request.getParameter("tour"));

    HtmlResponse htmlResponse = new HtmlResponse();
    rb.getConversationData().remove("fallback");
    if (!CommonUtil.isEmptyString(place)) webdata.put("place", place);

    if (request.getRawInput().getQuery().equalsIgnoreCase("SEARCH_DATA_LIST")) {
      webdata.put("command", "INFO_SEARCH_RESULT");
      response = CommonUtil.makeSafeString(rb.getConversationData().get("search"))
              + " 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
    } else if (!CommonUtil.isEmptyString(eat)) {
      System.out.println("data -> eat : " + eat);
      rb.getConversationData().put("eat", eat);
      webdata.put("command", "INFO_RESULT");
      webdata.put("eat", eat);
      response = eat + "식사 하기 좋은 음식점 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
      htmlResponse.setSuppressMic(true);
    } else if (!CommonUtil.isEmptyString(heal)) {
      System.out.println("data -> heal : " + heal);
      rb.getConversationData().put("heal", heal);
      webdata.put("command", "INFO_RESULT");
      webdata.put("heal", heal);
      response = heal + " 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
    } else if (!CommonUtil.isEmptyString(sleep)) {
      System.out.println("data -> sleep : " + sleep);
      rb.getConversationData().put("sleep", sleep);
      webdata.put("command", "INFO_RESULT");
      webdata.put("sleep", sleep);
      response = sleep + " 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
      htmlResponse.setSuppressMic(true);
    } else if (!CommonUtil.isEmptyString(tour)) {
      System.out.println("data -> tour : " + tour);
      rb.getConversationData().put("tour", tour);
      webdata.put("tour", tour);
      if (tour.equalsIgnoreCase(("힐링"))) {
        webdata.put("command", "INFO_RESULT_OPTION_HEAL");
        response = "자연 속 힐링과 문화 시설에서 힐링 중 어느 곳을 찾아볼까요?";
      } else {
        webdata.put("command", "INFO_RESULT");
        response = tour + " 검색 결과입니다. 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
        htmlResponse.setSuppressMic(true);
      }
    }

    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
        .build();
  }

  @ForIntent("RESULT_LIST - fallback")
  public ActionResponse resultListFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RESULT_ONE")
  public ActionResponse intentResultOne(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");
    rb.getConversationData().remove("film_info");

    String response = "";
    if (request.getRawInput().getQuery().equalsIgnoreCase("SEARCH_DATA_ONE")) {

      webdata.put("command", "INFO_SEARCH_DETAIL");
      webdata.put("search_number", (int) 1);
      rb.getConversationData().put("search_number", (int) 1);
      response = "선택하신 " + CommonUtil.makeSafeString(rb.getConversationData().get("search"))
              + " 으로 안내를 원하시면 가는 길 알려줘 라고 말해보세요!";
    } else {
      double number = Double.parseDouble(String.valueOf(request.getParameter("number")));

      if (!Double.isNaN(number)) {
        webdata.put("command", "INFO_DETAIL");
        webdata.put("info_number", (int) number);
        rb.getConversationData().put("number", (int) number);
        response = "선택하신 " + (int) number + " 번으로 안내를 원하시면 가는 길 알려줘 라고 말해보세요!";
      }
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
            .build();
  }

  @ForIntent("RESULT_ONE - fallback")
  public ActionResponse resultOneFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("LINK_URL")
  public ActionResponse intentLinkUrl(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");

    String response = "";
    String link = CommonUtil.makeSafeString(request.getParameter("link"));

    if (!CommonUtil.isEmptyString(link)) {
      webdata.put("command", "INFO_DETAIL_LINK");
      webdata.put("link", link);

      webdata.put("film_info", rb.getConversationData().get("film_info"));
      System.out.println("link url film info >>> " + rb.getConversationData().get("film_info"));

      switch (link) {
        case "티맵":
          response = "T map 앱으로 안내를 진행하려면 버튼을 누르거나 연결이라고 말해보세요.";
          break;
        case "인스타그램":
          response = "<speak><sub alias=\"\">인스타그램 앱으로 태그를 검색하려면 버튼을 누르거나 인스타그램 더보기 라고 말해보세요</sub></speak>";
          break;
        case "유튜브":
          response = "<speak><sub alias=\"\">유튜브 앱으로 영상을 시청하려면 버튼을 누르거나 유튜브 더보기 라고 말해보세요</sub></speak>";
          break;
      }
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("LINK_URL - fallback")
  public ActionResponse intentLinkUrlFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("LINK_URL_GO")
  public ActionResponse intentDetailLinkFinal(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");

    webdata.put("command", "INFO_DETAIL_LINK_FINAL");
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand", CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech("<speak><sub alias=\"\">티맵을 실행합니다.</sub></speak>"))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("LINK_URL_GO - fallback")
  public ActionResponse intentLinkUrlGoFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("MAIN")
  public ActionResponse intentMain(ActionRequest request) {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");

    request.getContexts().clear();
    String response = "강원도에 대한 설명입니다. 화면을 통해 더 자세한 정보를 찾아보세요.";
    webdata.put("command", "ABOUT_KANGWON");
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
        .build();
  }

  @ForIntent("MAIN - fallback")
  public ActionResponse intentMainFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("MAIN_DIRECT_FOOD")
  public ActionResponse intentMainDirectFood(ActionRequest request) {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");
    String place = CommonUtil.makeSafeString(request.getParameter("place"));
    place = place.substring(0, place.length() - 1); // 지역단위 제거
    webdata.put("region", place);
    rb.getConversationData().put("region", place);
    webdata.put("command", "LOCAL_FOOD");

    String foodNm = Language.getFoodNm_Ko(place);
    String response = place + "의 대표음식인 " + foodNm + "에 관한 설명이에요, 맛이 궁금하다면 풍이에게 "
                    + foodNm + " 맛집을 물어 보세요";

    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response)) 
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("MAIN_DIRECT_FOOD - fallback")
  public ActionResponse intentMainDirectFoodFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("FOOD_RESTAURANT")
  public ActionResponse intentFoodRestaurant(ActionRequest request) {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();

    String food = CommonUtil.makeSafeString(request.getParameter("food"));
    System.out.println("kinda food >>> " + food);
    rb.getConversationData().remove("fallback");

    if (food.isEmpty())
      food = Language.getFoodNm_Ko(CommonUtil.makeSafeString(rb.getConversationData().get("region")));

    webdata.put("food", food.replace(" ", ""));
    webdata.put("command", "LOCAL_FOOD_STORES"); // data.put("command", "INFO_RESULT"); //기존 리스트
    String response = food + " 음식점 검색 결과입니다! 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response)) // TTS
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
            .build();
  }

  @ForIntent("FOOD_RESTAURANT - fallback")
  public ActionResponse intentFoodRestaurantFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("FOOD_RESTAURANT-SELECT")
  public ActionResponse intentFoodRestaurantSelect(ActionRequest request) {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    double number = Double.parseDouble(String.valueOf(request.getParameter("number")));
    rb.getConversationData().remove("fallback");
    rb.getConversationData().remove("film_info  ");

    webdata.put("command", "INFO_DETAIL");

    if (!Double.isNaN(number)) {
      System.out.println("data -> number : " + number);
      webdata.put("info_number", (int) number);
      rb.getConversationData().put("number", number);
      response = "<speak><break time=\"1000ms\"/><mark name=\"NEXT\"/>선택하신 "
              + (int) number + "번으로 안내를 원하시면 가는 길 알려줘 라고 말해보세요!</speak>";
    }

    System.out.println("Dialog response : " + response);
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand", CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
            .build();
  }

  @ForIntent("FOOD_RESTAURANT_SELECT - fallback")
  public ActionResponse intentFoodRestaurantSelectFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  /**
   * 추천코스 : "원하시는 테마를 말씀해주세요!"
   * choose among 힐링, 문화여행, 레저/스포츠
   */
  @ForIntent("RECOMMEND")
  public ActionResponse intentRecommend(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    request.getContexts().clear();
    rb.getConversationData().remove("fallback");

    webdata.put("command", "RECO");
    String response = "원하시는 테마를 말씀해주세요!";
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    System.out.println("Dialog response : " + response);
    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("RECOMMEND - fallback")
  public ActionResponse intentRecommendFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }
  /**
   * 추천코스 질문2
   * 질문1(힐링,문화) => 알뜰하게 or 욜로
   * 질문1(레저스포츠) => 혼자, 가족이랑, 친구랑, 연인이랑
   */
  @ForIntent("RECOMMEND_STEP_ONE")
  public ActionResponse intentRecommendStepOne(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    String question_one = CommonUtil.makeSafeString(request.getParameter("question_one"));
    rb.getConversationData().remove("fallback");

    if (!CommonUtil.isEmptyString(question_one)) { //question_one 변수에 값이 있을 경우
      webdata.put("command", "RECO_STEP_ONE");
      webdata.put("question_one", question_one);
      rb.getConversationData().put("question_one", question_one);
      if (!CommonUtil.isEmptyString(question_one) && question_one.equalsIgnoreCase("레저/스포츠"))
        response = "누구와 함께 여행하시나요?"; //레저/스포츠 일 경우
      else response = "여행 비용은 얼마나 생각하세요?"; //힐링, 문화여행일 경우
    }
    CommonUtil.printMapData(webdata);
    //command 에 저장된 값(RECO_STEP_ONE)을 recommand(recommend)에 넣어두기
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("RECOMMEND_STEP_ONE - fallback")
  public ActionResponse intentRecommendStepOneFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }
  /**
   * 추천코스 질문3
   * 여행기간 선택 : 당일치기, 1박2일, 2박3일
   */
  @ForIntent("RECOMMEND_STEP_TWO")
  public ActionResponse intentRecommendStepTwo(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    String question_one = CommonUtil.makeSafeString(rb.getConversationData().get("question_one"));
    String question_two = CommonUtil.makeSafeString(request.getParameter("question_two"));
    rb.getConversationData().remove("fallback");

    String course_type = "";
    int companion = 0;
    if (!CommonUtil.isEmptyString(question_two)) { 
      webdata.put("command", "RECO_STEP_TWO");
      webdata.put("question_one", question_one);
      webdata.put("question_two", question_two);
      rb.getConversationData().put("question_two", question_two);

      if (question_one.equals("힐링")) { //힐링일 경우
        if (!question_two.equals("욜로"))
          course_type = "one"; //힐링-알뜰하게
        else
          course_type = "two"; //힐링-욜로

      } else { //문화여행 or 레저/스포츠
        if("알뜰하게".equals(question_two)) course_type = "three";
        if("욜로".equals(question_two)) course_type = "four";
        //TODO
        if("혼자".equals(question_two)) {
          course_type = "five";
          companion = 4;
        }else if("친구들과".equals(question_two)) {
          course_type = "six";
          companion = 3;
        }else if("가족이랑".equals(question_two)) {
          course_type = "seven";
          companion = 2;
        }else if("연인이랑".equals(question_two)) {
          course_type = "eight";
          companion = 1;
        }else{
          companion = 0;
        }
      }
      webdata.put("companion", companion);
      webdata.put("course_type", course_type);
      rb.getConversationData().put("course_type", course_type);
      CommonUtil.printMapData(webdata);
      rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

      return rb.add(new SimpleResponse().setTextToSpeech("총 여행 기간은 얼마나 되나요?"))
              .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
              .build();
    } else {
      return countFallback(request);
    }
  }

  @ForIntent("RECOMMEND_STEP_TWO - fallback")
  public ActionResponse intentRecommendStepTwoFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RECOMMEND_STEP_DURATION")
  public ActionResponse intentRecommendStepDuration(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();

    String question_one = CommonUtil.makeSafeString(rb.getConversationData().get("question_one")); //테마
    System.out.println("question_one : " + question_one);
    String question_two = CommonUtil.makeSafeString(rb.getConversationData().get("question_two")); //비용 선택 / 일행 선택
    System.out.println("question_two : " + question_two);
    String question_three = CommonUtil.makeSafeString(request.getParameter("question_three")); //여행 길이
    System.out.println("question_three : " + question_three);
    String course_type = CommonUtil.makeSafeString(rb.getConversationData().get("course_type")); //코스 타입

    rb.getConversationData().remove("fallback");

    if (!CommonUtil.isEmptyString(question_three)) {
      System.out.println("course_type : " + course_type);

      webdata.put("command", "RECO_STEP_RESULT");
      webdata.put("course_type", course_type);
      webdata.put("question_three", question_three);
      webdata.put("question_two", question_two);
      webdata.put("question_one", question_one);
      rb.getConversationData().put("question_three", question_three);
    } else {
      return countFallback(request);
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand", CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech("원하시는 지역을 선택해 주세요."))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("RECOMMEND_STEP_DURATION - fallback")
  public ActionResponse intentRecommendStepDurationFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RECOMMEND_SELECT_PLACE")
  public ActionResponse intentRecommendSelectPlace(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    String response = "";
    String place = CommonUtil.makeSafeString(request.getParameter("place")); //지역
    String question_one = CommonUtil.makeSafeString(rb.getConversationData().get("question_one"));
    System.out.println("question_one : " + question_one);
    String question_two = CommonUtil.makeSafeString(rb.getConversationData().get("question_two"));
    System.out.println("question_two : " + question_two);
    String question_three = CommonUtil.makeSafeString(rb.getConversationData().get("question_three"));
    System.out.println("question_three : " + question_three);
    String course_type = CommonUtil.makeSafeString(rb.getConversationData().get("course_type"));
    System.out.println("course_type : " + course_type);

    rb.getConversationData().remove("fallback");

    if (request.getIntent().equalsIgnoreCase("RECOMMEND_SELECT_PLACE_MORE"))
      place = CommonUtil.makeSafeString(rb.getConversationData().get("place"));

    if (!CommonUtil.isEmptyString(place)) {
      System.out.println("place :" + place);
      webdata.put("command", "RECO_STEP_LOCALE");
      webdata.put("place", place); //장소
      webdata.put("question_one", question_one); //테마
      webdata.put("question_two", question_two); //비용 or 일행 선택
      webdata.put("question_three", question_three); //여행 길이
      webdata.put("course_type", course_type); //코스타입 - RECOMMEND_STEP_TWO 참고
      rb.getConversationData().put("place", place);
      response = question_two + " 떠나는 " + question_one + " 코스입니다! 다른 코스를 보시려면. 다른 코스로 추천해줘, 라고 말해보세요!";
    } else {
      return countFallback(request);
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("RECOMMEND_SELECT_PLACE_MAP")
  public ActionResponse IntentRecommendSelectPlaceMap(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    webdata.put("command", "RECO_STEP_LOCALE_MAP");

    return rb.add(new SimpleResponse().setTextToSpeech("길 안내를 시작합니다."))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
            .build();
  }

  @ForIntent("RECOMMEND_SELECT_PLACE - fallback")
  public ActionResponse intentRecommendSelectPlaceFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  /**
   * 추천코스 - site Detail
   */
  @ForIntent("RECOMMEND_COURSE_DETAIL")
  public ActionResponse intentRecommendCourseDetail(ActionRequest request) throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    double number = Double.parseDouble(String.valueOf(request.getParameter("number")));
    String sleep = CommonUtil.makeSafeString(request.getParameter("sleep"));
    rb.getConversationData().remove("fallback");
    rb.getConversationData().remove("film_info");

    webdata.put("command", "INFO_DETAIL");

    if (!Double.isNaN(number)) {
      System.out.println("data -> number : " + number);
      rb.getConversationData().put("number", number);
      webdata.put("reco_number", (int) number);
      webdata.put("command", "RECO_STEP_DETAIL");
      response = "<speak><break time=\"1000ms\"/><mark name=\"NEXT\"/>선택하신"
              + (int) number + "번으로 안내를 원하시면 가는 길 알려줘 라고 말해보세요!</speak>";
      if (!CommonUtil.isEmptyString(sleep) && sleep.equalsIgnoreCase("숙소")) {
        webdata.put("sleep", "숙소");
        rb.getConversationData().put("number", number);
        response = "<speak><break time=\"1000ms\"/><mark name=\"NEXT\"/>선택하신 "
                + (int) number + "번 숙소로 안내를 원하시면 가는 길 알려줘 라고 말해보세요!</speak>";
      }
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
            .build();
  }

  @ForIntent("RECOMMEND_SELECT_PLACE_MORE")
  public ActionResponse intentRecommendPlaceMore(ActionRequest request) throws ExecutionException, InterruptedException {
    return intentRecommendSelectPlace(request);
  }

  @ForIntent("RECOMMEND_COURSE_DETAIL - fallback")
  public ActionResponse intentRecommendCourseDetailFallback(ActionRequest request) throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("actions_intent_CANCEL")
  public ActionResponse intentActionsIntentCancel(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");

    String response = "";

    response = "강원도 투어를 종료하시겠습니까?";
    webdata.put("command", "END");
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("actions_intent_CANCEL - no")
  public ActionResponse intentActionsIntentCancelNo(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    response = "Exit Gangwon tour.";
    return rb.add(new SimpleResponse().setTextToSpeech(response)).endConversation().build();
  }

  private ActionResponse countFallback(ActionRequest request) {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata;

    int i = CommonUtil.makeSafeInt(rb.getConversationData().get("fallback"));
    System.out.println("!---------FALLBACK_COUNT CURRENT---------->" + (i));
    Map<String, Object> tempdatamap = rb.getConversationData();
    webdata = tempdatamap;

    if (i == 0 || i == 1) {
      response = "잘 못 들었어요. 다시 들려 주시겠어요?";
      for (int x = 0; x < request.getContexts().size(); x++) {
        rb.add(new ActionContext(request.getContexts().get(x).toString(), 2));
      }
      i += 1;
      System.out.println("!---------FALLBACK_COUNT UPDATE ---------->" + (i));
      webdata.put("fallback", String.valueOf(i));
      webdata.put("command",CommonUtil.makeSafeString(rb.getConversationData().get("recommand")));
      rb.getConversationData().put("fallback", String.valueOf(i));
    } else {
      webdata.put("command", "FALLBACK_LAST");
      response = "죄송해요, 원하시는 정보가 없는것 같아요. 다른 검색어로 찾아보는건 어떨까요?";
    }

    if (request.getRawInput().getQuery().equalsIgnoreCase("INFO_DATA_NULL")) {
      response = "죄송해요, 요청하신 정보를 찾지 못했어요. 대신 범이가 추천하는 곳은 어떠신가요? 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요!";
      webdata.put("command", "INFO_RESULT_FALLBACK");
    } else if (request.getRawInput().getQuery().equalsIgnoreCase("SEARCH_DATA_NULL")) {
      response = "죄송해요, 요청하신 정보는 없는것 같아요. 대신 다른 검색어로 찾아볼까요?";
      webdata.put("command", "FALLBACK_NO_DATA");
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }
}
