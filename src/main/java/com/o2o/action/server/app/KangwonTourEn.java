package com.o2o.action.server.app;

import com.google.actions.api.*;
import com.google.actions.api.response.*;
import com.google.actions.api.response.helperintent.*;
import com.google.api.services.actions_fulfillment.v2.model.*;
import com.o2o.action.server.util.*;
import java.util.*;
import java.util.concurrent.*;

public class KangwonTourEn extends DialogflowApp {
//    public static final String URL = "https://actions.o2o.kr/devsvr8/en/index.html";
  public static final String URL = "https://banana.o2o.kr/kangwontour/en/index.html";
  //    public static final String URL = "https://kangwontour-e9b17.web.app";
//  public static final String URL = "https://actions.o2o.kr/devsvr2/en/index.html";
//      public static final String URL = "https://actions.o2o.kr/content/kangwontour/index.html";
  //  public static final String URL = "https://actions.o2o.kr/content/shzheng/kangwontour/";

  @ForIntent("Default Welcome Intent")
  public ActionResponse defaultWelcome(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    String response = "";
    rb.getConversationData().remove("fallback");

    if (!request.hasCapability("actions.capability.INTERACTIVE_CANVAS")) {
      response =
          "It's a device that doesn't support Inactive Canvas. Please use another device again.";
      return rb.add(new SimpleResponse().setSsml(response)).endConversation().build();
    } else {
      webdata.put("command", "MAIN");
      response =
          "Hello! This is Gangwon Province Tour Service. Hi! I'm Bumi. I will help you with your travels in Gangwon Province. How can I help you?";
      CommonUtil.printMapData(webdata);
      rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
      return rb.add(new SimpleResponse().setTextToSpeech(response))
          .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
          .build();
    }
  }

  @ForIntent("Default Welcome Intent - fallback")
  public ActionResponse defaultWelcomeFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("Default Fallback Intent")
  public ActionResponse defaultFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("SEARCH")
  public ActionResponse intentInfoResult(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    String type = CommonUtil.makeSafeString(request.getParameter("type"));
    String sleep = CommonUtil.makeSafeString(request.getParameter("sleep"));
    String tour = CommonUtil.makeSafeString(request.getParameter("tour"));
    String eat = CommonUtil.makeSafeString(request.getParameter("eat"));
    String place = CommonUtil.makeSafeString(request.getParameter("place"));
    String search = CommonUtil.makeSafeString(request.getParameter("search"));
    String permission = CommonUtil.makeSafeString(rb.getConversationData().get("permission"));
    HtmlResponse htmlResponse = new HtmlResponse();
    request.getContexts().clear();
    rb.getConversationData().remove("fallback");

    if (!CommonUtil.isEmptyString(search)) {
      System.out.println("data -> search : " + search);
      rb.getConversationData().put("search", search);

      response =
          "<speak><break time=\"4000ms\"/><sub alias=\"\">'Searching for data "
              + search
              + "'.</sub></speak>";
      webdata.put("command", "INFO_SEARCH");
      webdata.put("any", search);
    } else {

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

      if (request
          .getWebhookRequest()
          .getQueryResult()
          .getQueryText()
          .equalsIgnoreCase("actions_intent_PERMISSION")) {
        if (CommonUtil.isEmptyString(type)) {
          type = CommonUtil.makeSafeString(rb.getConversationData().get("type"));
        }
        if (CommonUtil.isEmptyString(sleep)) {
          sleep = CommonUtil.makeSafeString(rb.getConversationData().get("sleep"));
        }
        if (CommonUtil.isEmptyString(tour)) {
          tour = CommonUtil.makeSafeString(rb.getConversationData().get("tour"));
        }
        if (CommonUtil.isEmptyString(eat)) {
          eat = CommonUtil.makeSafeString(rb.getConversationData().get("eat"));
        }
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
          String context = "Collects the current user's location";
          if (request.getUser().getUserVerificationStatus().equals("VERIFIED")) {
            permissions =
                new String[] {
                  ConstantsKt.PERMISSION_NAME, ConstantsKt.PERMISSION_DEVICE_PRECISE_LOCATION
                };
          }
          rb.getConversationData().put("permission", "TRUE");
          rb.add("Collects the current user's location")
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
        response =
            "What kind of restaurant would you like to eat at" + Language.getEat_En(eat) + "?";
      } else if (type.equalsIgnoreCase("숙박")) {
        webdata.put("command", "INFO_RESULT_OPTION_SLEEP");
        response = "What kind of accommodation would you like to stay?."; // 숙박 필요
      } else if (type.equalsIgnoreCase("관광지")) {
        webdata.put("command", "INFO_RESULT_OPTION_TOUR");
        response = "What kind of tourist attraction do you want to know?";
      } else if (!CommonUtil.isEmptyString(sleep)) {
        webdata.put("command", "INFO_RESULT");
        response =
            "Here's the search results for "
                + Language.getSleep_En(sleep)
                + "! Click on the information you want, or talk to me.";
        htmlResponse.setSuppressMic(true);
      } else if (!CommonUtil.isEmptyString(tour)) {
        webdata.put("command", "INFO_RESULT");
        response =
            "Here's the search results for "
                + Language.getTour_En(tour)
                + "! Click on the information you want, or talk to me.";
        htmlResponse.setSuppressMic(true);
      } else if (!CommonUtil.isEmptyString(eat)) {
        webdata.put("command", "INFO_RESULT");
        response =
            "Here's a search result of good restaurants for "
                + Language.getEat_En(eat)
                + "! Click on the information you want, or talk to me.";
        htmlResponse.setSuppressMic(true);
      } else if (tour.equalsIgnoreCase(("힐링"))) {
        webdata.put("command", "INFO_RESULT_OPTION_HEAL");
        response = "Which experience would you like to know more? Nature or cultural healing?";
      } else {
        response =
            "I'm sorry. The information you searched for is unavailable. Would you like to try searching with other words?";
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
  public ActionResponse searchFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
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
      response =
          "Here's the results of the "
              + CommonUtil.makeSafeString(rb.getConversationData().get("search"))
              + " search! Click on the information you want, or talk to me.";
    }

    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
        .build();
  }

  @ForIntent("RESULT_HEAL - fallback")
  public ActionResponse intentResultHealFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
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
      response =
          "Here's the results of the "
              + CommonUtil.makeSafeString(rb.getConversationData().get("search"))
              + " search! Click on the information you want, or talk to me.";
    } else if (!CommonUtil.isEmptyString(eat)) {
      System.out.println("data -> eat : " + eat);
      rb.getConversationData().put("eat", eat);
      webdata.put("command", "INFO_RESULT");
      webdata.put("eat", eat);
      response =
          "Here's a search result of good restaurants for "
              + Language.getEat_En(eat)
              + "! Click on the information you want, or talk to me.";
      htmlResponse.setSuppressMic(true);
    } else if (!CommonUtil.isEmptyString(heal)) {
      System.out.println("data -> heal : " + heal);
      rb.getConversationData().put("heal", heal);
      webdata.put("command", "INFO_RESULT");
      webdata.put("heal", heal);
      response =
          "Here's the results of the "
              + CommonUtil.makeSafeString(rb.getConversationData().get("search"))
              + " search! Click on the information you want, or talk to me.";
    } else if (!CommonUtil.isEmptyString(sleep)) {
      System.out.println("data -> sleep : " + sleep);
      rb.getConversationData().put("sleep", sleep);
      webdata.put("command", "INFO_RESULT");
      webdata.put("sleep", sleep);
      response =
          "Here's the search results for "
              + Language.getSleep_En(sleep)
              + "! Click on the information you want, or talk to me.";
      htmlResponse.setSuppressMic(true);
    } else if (!CommonUtil.isEmptyString(tour)) {
      System.out.println("data -> tour : " + tour);
      rb.getConversationData().put("tour", tour);
      webdata.put("tour", tour);
      if (tour.equalsIgnoreCase(("힐링"))) {
        webdata.put("command", "INFO_RESULT_OPTION_HEAL");
        response = "Which experience would you like to know more? Nature or cultural healing?";
      } else {
        webdata.put("command", "INFO_RESULT");
        response =
            "Here's the search results for "
                + Language.getTour_En(tour)
                + "! Click on the information you want, or talk to me.";
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
  public ActionResponse resultListFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RESULT_ONE")
  public ActionResponse intentResultOne(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");
    if (request.getRawInput().getQuery().equalsIgnoreCase("SEARCH_DATA_ONE")) {
      response =
          "<speak><break time=\"1000ms\"/>Please tell me if you need directions to "
              + CommonUtil.makeSafeString(rb.getConversationData().get("search"))
              + "! Scroll down for more information and SNS.</speak>";
      webdata.put("command", "INFO_SEARCH_DETAIL");
      webdata.put("search_number", (int) 1);
      rb.getConversationData().put("search_number", (int) 1);
    } else {
      double number = Double.parseDouble(String.valueOf(request.getParameter("number")));

      if (!Double.isNaN(number)) {
        webdata.put("command", "INFO_DETAIL");
        webdata.put("info_number", (int) number);
        rb.getConversationData().put("number", (int) number);
        response =
            "<speak><break time=\"1000ms\"/>Please tell me if you want to get directions to option number "
                + (int) number
                + "! Scroll down for more information and SNS.</speak> ";
      }
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
//    rb.getConversationData().put("reprompt", )
  
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
    if (CommonUtil.isEmptyString(link)) link = "티맵";

    if (!CommonUtil.isEmptyString(link)) {
      webdata.put("command", "INFO_DETAIL_LINK");
      webdata.put("link", link);

      switch (link) {
        case "티맵":
          response = "To use the T map app, press the button or say connect.";
          //          response = "T map 앱으로 안내를 진행하려면 버튼을 누르거나 연결이라고 말해보세요.";
          break;
        case "인스타그램":
          response =
              "<speak><sub alias=\"\">Run the Instagram app to search for the tag.</sub></speak>";
          break;
        case "유튜브":
          response =
              "<speak><sub alias=\"\">Launch the YouTube app to search for related videos.</sub></speak>";
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
  public ActionResponse intentLinkUrlFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("LINK_URL_GO")
  public ActionResponse intentDetailLinkFinal(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");

    webdata.put("command", "INFO_DETAIL_LINK_FINAL");
    String response = "";

    response = "<speak><sub alias=\"\">Turning on T-map.</sub></speak>";
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("LINK_URL_GO - fallback")
  public ActionResponse intentLinkUrlGoFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("MAIN")
  public ActionResponse intentMain(ActionRequest request) {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    rb.getConversationData().remove("fallback");

    request.getContexts().clear();
    String response =
        "This is an explanation about Gangwon Province. Find more information on the screen.";
    // String response = "강원도에 대한 설명입니다. 화면을 통해 더 자세한 정보를 찾아보세요.";
    webdata.put("command", "ABOUT_KANGWON");
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
        .build();
  }

  @ForIntent("MAIN - fallback")
  public ActionResponse intentMainFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
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

    String response =
        "Let's take a look at the representative food of "
            + Language.getPlace_En(place)
            + ", "
            + Language.getFoodNm_En(place)
            + ". Say Show me"
            + Language.getFoodNm_En(place)
            + " restaurant options. we'll show you the choices! Scroll down for more information and SNS.";
    //            place + "의 대표음식인 " + foodNm + "에 관한 설명이에요, 맛이 궁금하다면 범이에게 " + foodNm + " 맛집을 물어
    // 보세요";
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response)) // TTS
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("MAIN_DIRECT_FOOD - fallback")
  public ActionResponse intentMainDirectFoodFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
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
      food =
          Language.getFoodNm_Ko(CommonUtil.makeSafeString(rb.getConversationData().get("region")));

    webdata.put("food", food.replace(" ", ""));
    webdata.put("command", "LOCAL_FOOD_STORES"); //        data.put("command", "INFO_RESULT"); //기존 리스트
    String response =
        "These are the search results for "
            + Language.getFoodNm_En(food)
            + " restaurants! Click or say the option number.";
    //    String response = food + " 음식점 검색 결과입니다! 원하는 정보를 클릭하거나, 제게 말을 걸어 보세요.";
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response)) // TTS
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
        .build();
  }

  @ForIntent("FOOD_RESTAURANT - fallback")
  public ActionResponse intentFoodRestaurantFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
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

    webdata.put("command", "INFO_DETAIL");

    if (!Double.isNaN(number)) {
      System.out.println("data -> number : " + number);
      webdata.put("info_number", (int) number);
      rb.getConversationData().put("number", number);
      response =
          "<speak><break time=\"1000ms\"/>Please tell me if you want to get directions to option number "
              + (int) number
              + "! Scroll down for more information and SNS.</speak>";
    }

    System.out.println("Dialog response : " + response);
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
        .build();
  }

  @ForIntent("FOOD_RESTAURANT_SELECT - fallback")
  public ActionResponse intentFoodRestaurantSelectFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RECOMMEND")
  public ActionResponse intentRecommend(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    request.getContexts().clear();
    rb.getConversationData().remove("fallback");

    webdata.put("command", "RECO");
    response = "Please say the theme that you want to choose";
    //    response = "원하시는 테마를 말씀해주세요!";
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    System.out.println("Dialog response : " + response);
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("RECOMMEND - fallback")
  public ActionResponse intentRecommendFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RECOMMEND_STEP_ONE")
  public ActionResponse intentRecommendStepOne(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    String question_one = CommonUtil.makeSafeString(request.getParameter("question_one"));
    rb.getConversationData().remove("fallback");

    if (!CommonUtil.isEmptyString(question_one)) {
      webdata.put("command", "RECO_STEP_ONE");
      webdata.put("question_one", question_one);
      rb.getConversationData().put("question_one", question_one);
      if (!CommonUtil.isEmptyString(question_one) && question_one.equalsIgnoreCase("레저/스포츠"))
        response = "Who are you traveling with?";
      //        response = "누구와 함께 여행하시나요?";
      else response = "Whats your budget for the trip?";
      //        response = "여행 비용은 얼마나 생각하세요?";
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
//    rb.getConversationData().put("")

    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("RECOMMEND_STEP_ONE - fallback")
  public ActionResponse intentRecommendStepOneFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RECOMMEND_STEP_TWO")
  public ActionResponse intentRecommendStepTwo(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    String question_two = CommonUtil.makeSafeString(request.getParameter("question_two"));
    String response = "";
    String course_type = "";
    rb.getConversationData().remove("fallback");

    if (!CommonUtil.isEmptyString(question_two)) {
      webdata.put("command", "RECO_STEP_TWO");
      webdata.put("question_two", question_two);
      rb.getConversationData().put("question_two", question_two);
      if (CommonUtil.makeSafeString(rb.getConversationData().get("question_one"))
          .equalsIgnoreCase("힐링")) {
        if (!question_two.equalsIgnoreCase("욜로")) {
          course_type = "one";
        } else {
          course_type = "two";
        }
      } else {
        switch (question_two) {
          case "알뜰하게":
            course_type = "three";
            break;
          case "욜로":
            course_type = "four";
            break;
          case "혼자":
            course_type = "five";
            break;
          case "친구들과":
            course_type = "six";
            break;
          case "가족이랑":
            course_type = "seven";
            break;
          case "연인이랑":
            course_type = "eight";
            break;
        }
      }
      webdata.put("course_type", course_type);
      rb.getConversationData().put("course_type", course_type);
      response = "How long are you traveling?";
    } else {
      return countFallback(request);
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("RECOMMEND_STEP_TWO - fallback")
  public ActionResponse intentRecommendStepTwoFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RECOMMEND_STEP_DURATION")
  public ActionResponse intentRecommendStepDuration(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    String response = "";
    String question_one = CommonUtil.makeSafeString(rb.getConversationData().get("question_one"));
    System.out.println("question_one : " + question_one);
    String question_two = CommonUtil.makeSafeString(rb.getConversationData().get("question_two"));
    System.out.println("question_two : " + question_two);
    String question_three = CommonUtil.makeSafeString(request.getParameter("question_three"));
    System.out.println("question_three : " + question_three);
    String course_type = CommonUtil.makeSafeString(rb.getConversationData().get("course_type"));

    rb.getConversationData().remove("fallback");

    if (!CommonUtil.isEmptyString(question_three)) {
      System.out.println("course_type : " + course_type);

      webdata.put("command", "RECO_STEP_RESULT");
      webdata.put("course_type", course_type);
      webdata.put("question_three", question_three);
      webdata.put("question_two", question_two);
      webdata.put("question_one", question_one);
      rb.getConversationData().put("question_three", question_three);
      response = "Where would you like to go? Please choose the area you want to visit!";
      //      response = "원하시는 지역을 선택해 주세요.";
    } else {
      return countFallback(request);
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
  
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("RECOMMEND_STEP_DURATION - fallback")
  public ActionResponse intentRecommendStepDurationFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RECOMMEND_SELECT_PLACE")
  public ActionResponse intentRecommendSelectPlace(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();
    String response = "";
    String place = CommonUtil.makeSafeString(request.getParameter("place"));
    String question_one = CommonUtil.makeSafeString(rb.getConversationData().get("question_one"));
    System.out.println("question_one : " + question_one);
    String question_two = CommonUtil.makeSafeString(rb.getConversationData().get("question_two"));
    System.out.println("question_two : " + question_two);
    String question_three =
        CommonUtil.makeSafeString(rb.getConversationData().get("question_three"));
    System.out.println("question_three : " + question_three);
    String course_type = CommonUtil.makeSafeString(rb.getConversationData().get("course_type"));
    System.out.println("course_type : " + course_type);

    rb.getConversationData().remove("fallback");

    if (request.getIntent().equalsIgnoreCase("RECOMMEND_SELECT_PLACE_MORE")) {
      place = CommonUtil.makeSafeString(rb.getConversationData().get("place"));
    }

    if (!CommonUtil.isEmptyString(place)) {
      System.out.println("place :" + place);
      webdata.put("command", "RECO_STEP_LOCALE");
      webdata.put("place", place);
      webdata.put("question_one", question_one);
      webdata.put("question_two", question_two);
      webdata.put("question_three", question_three);
      webdata.put("course_type", course_type);
      rb.getConversationData().put("place", place);
      response =
              "Here is your result. Would you like to get the direction? say \"Connect to the map\". To see other course options, say \"Show other courses\".";
//          "This is the result for "
//              + Language.getQuestion_two_En(question_two)
//              + " "
//              + Language.getQuestion_one_En(question_one)
//              + " course. If you want to see other courses, please say \"Recommend me other courses\"";
      //              question_two + " 떠나는 " + question_one + " 코스입니다! 다른 코스를 보시려면. 다른 코스로 추천해줘, 라고
      // 말해보세요!";
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
  public ActionResponse IntentRecommendSelectPlaceMap(ActionRequest request)
          throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    Map<String, Object> webdata = new HashMap<>();

    String response = "Start directions..";
    webdata.put("command", "RECO_STEP_LOCALE_MAP");

    return rb.add(new SimpleResponse().setTextToSpeech(response))
            .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata).setSuppressMic(true))
            .build();
  }

  @ForIntent("RECOMMEND_SELECT_PLACE - fallback")
  public ActionResponse intentRecommendSelectPlaceFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
    System.out.println("!--------- FALLBACK ---------->" + request.getIntent());
    return countFallback(request);
  }

  @ForIntent("RECOMMEND_COURSE_DETAIL")
  public ActionResponse intentRecommendCourseDetail(ActionRequest request)
      throws ExecutionException, InterruptedException {
    ResponseBuilder rb = getResponseBuilder(request);
    String response = "";
    Map<String, Object> webdata = new HashMap<>();
    double number = Double.parseDouble(String.valueOf(request.getParameter("number")));
    String sleep = CommonUtil.makeSafeString(request.getParameter("sleep"));
    rb.getConversationData().remove("fallback");

    webdata.put("command", "INFO_DETAIL");

    if (!Double.isNaN(number)) {
      System.out.println("data -> number : " + number);
      rb.getConversationData().put("number", number);
      webdata.put("reco_number", (int) number);
      webdata.put("command", "RECO_STEP_DETAIL");
      response =
          "<speak><break time=\"1000ms\"/><mark name=\"NEXT\"/>"
              + "Please tell me if you want to get directions to option number"
              + (int) number
              + "! Scroll down for more information and SNS.</speak>";
      if (!CommonUtil.isEmptyString(sleep) && sleep.equalsIgnoreCase("숙소")) {
        webdata.put("sleep", "숙소");
        rb.getConversationData().put("number", number);
        response =
          "<speak><break time=\"1000ms\"/>Please tell me if you want to get directions to option number "
                  + (int) number
                  + "! Scroll down for more information and SNS.</speak>";
      }
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));

    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }

  @ForIntent("RECOMMEND_SELECT_PLACE_MORE")
  public ActionResponse intentRecommendPlaceMore(ActionRequest request)
      throws ExecutionException, InterruptedException {
    return intentRecommendSelectPlace(request);
  }

  @ForIntent("RECOMMEND_COURSE_DETAIL - fallback")
  public ActionResponse intentRecommendCourseDetailFallback(ActionRequest request)
      throws ExecutionException, InterruptedException {
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

    response = "Are you sure, want to close the Gangwon Tour?";
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
    Map<String, Object> webdata = new HashMap<>();

    int i = CommonUtil.makeSafeInt(rb.getConversationData().get("fallback"));
    System.out.println("!---------FALLBACK_COUNT CURRENT---------->" + (i));
    Map<String, Object> tempdatamap = rb.getConversationData();
    // TODO Map에 Object형태로 저장되어있는 Map을 형변환
    webdata = tempdatamap;
    for (int x = 0; x < request.getContexts().size(); x++) {
      rb.add(new ActionContext(request.getContexts().get(x).toString(), 2));
    }

    if (i == 0 || i == 1) {
      response = "I didn't understand that, could you say it again?";
      i += 1;
      System.out.println("!---------FALLBACK_COUNT UPDATE ---------->" + (i));
      webdata.put("fallback", String.valueOf(i));
      webdata.put("command",CommonUtil.makeSafeString(rb.getConversationData().get("recommand")));
      rb.getConversationData().put("fallback", String.valueOf(i));
    } else {
      webdata.put("command", "FALLBACK_LAST");
      response =
          "I'm sorry. The information you searched for is unavailable. Would you like to try searching with other words?";
    }

    if (request.getRawInput().getQuery().equalsIgnoreCase("INFO_DATA_NULL")) {
      response =
          "Sorry, I couldn't find the information you requested. How about a place that Bumi recommends instead? Click on the information you want, or talk to me!";
      webdata.put("command", "INFO_RESULT_FALLBACK");
    } else if (request.getRawInput().getQuery().equalsIgnoreCase("SEARCH_DATA_NULL")) {
      response =
          "I'm sorry. The information you searched for is unavailable. Would you like to try searching with other words?";
      //        response = "죄송해요, 요청하신 정보는 없는것 같아요. 대신 다른 검색어로 찾아볼까요?";
      webdata.put("command", "FALLBACK_NO_DATA");
    }
    CommonUtil.printMapData(webdata);
    rb.getConversationData().put("recommand",CommonUtil.makeSafeString(webdata.get("command")));
    return rb.add(new SimpleResponse().setTextToSpeech(response))
        .add(new HtmlResponse().setUrl(URL).setUpdatedState(webdata))
        .build();
  }
}
