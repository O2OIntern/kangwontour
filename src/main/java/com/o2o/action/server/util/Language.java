package com.o2o.action.server.util;

import java.util.*;

public class Language {
  public static int USER_DISPLAY_LANGUAGE_CODE;
  private final List<String> REPEAT_PREFIX = Arrays.asList("Sorry, I said ", "Let me repeat that.");
  private final String SsmlPrefix = "<speak>";
  private static final List<String> MAIN_TEXT_RESPONSE_FALLBACK =
      Arrays.asList(
          "Sorry, what was that?",
          "I didn\'t quite get that. I can tell you all about IO, like date or location, or about the sessions. What do you want to know about?");
  private static final List<String> MAIN_TEXT_RESPONSE_WELCOME =
      Arrays.asList(
          "Sorry, what was that?", "I didn\'t catch that. Could you tell me which one you liked?");
  private static final List<String> FINAL_FALLBACK =
      Arrays.asList("I\'m sorry I\'m having trouble here. Maybe we should try this again later.");

  private static final String INFO_RESULT_TEXT_RESPONSE = "";

  public static void setUserDisplayLanguageCode(String userLanguageCode) {
    USER_DISPLAY_LANGUAGE_CODE = Integer.parseInt(userLanguageCode);
    System.out.println(
        "USER_DISPLAY_LANGUAGE_CODE : " + String.valueOf(USER_DISPLAY_LANGUAGE_CODE));
  }

  public static String getInfoResultTextResponse() {

    return INFO_RESULT_TEXT_RESPONSE;
  }

  public static String getFoodNm_Ko(String place) {
    String foodNm = "";
    return foodNm =
        (place.equals("강릉")
            ? "초당순두부"
            : (place.equals("고성")
                ? "동치미막국수"
                : (place.equals("동해")
                    ? "오징어물회"
                    : (place.equals("삼척")
                        ? "곰치국"
                        : (place.equals("속초")
                            ? "오징어순대"
                            : (place.equals("양구")
                                ? "오골계숯불구이"
                                : (place.equals("양양")
                                    ? "송이밥"
                                    : (place.equals("영월")
                                        ? "칡국수"
                                        : (place.equals("원주")
                                            ? "추어탕"
                                            : (place.equals("인제")
                                                ? "황태국"
                                                : (place.equals("정선")
                                                    ? "곤드레나물밥"
                                                    : (place.equals("철원")
                                                        ? "민물매운탕"
                                                        : (place.equals("춘천")
                                                            ? "닭갈비"
                                                            : (place.equals("태백")
                                                                ? "한우갈빗살구이"
                                                                : (place.equals("평창")
                                                                    ? "메밀전병"
                                                                    : (place.equals("홍천")
                                                                        ? "홍천한우구이"
                                                                        : (place.equals("화천")
                                                                            ? "산천어회"
                                                                            : (place.equals("횡성")
                                                                                ? "한우등심구이"
                                                                                : ""))))))))))))))))));
  }

  public static String getFoodNm_En(String place) {
    String foodNm = "";
    return foodNm =
        (place.equals("강릉")
            ? "Chodang Soft Tofu"
            : (place.equals("고성")
                ? "Dongchimi Makguksu"
                : (place.equals("동해")
                    ? "Cold Raw Fish Soup"
                    : (place.equals("삼척")
                        ? "Gomchi Hangover Soup"
                        : (place.equals("속초")
                            ? "Squid Sausage"
                            : (place.equals("양구")
                                ? "Charcoal Grilled Black Chicken"
                                : (place.equals("양양")
                                    ? "Pine Mushroom Rice"
                                    : (place.equals("영월")
                                        ? "Chigguksu"
                                        : (place.equals("원주")
                                            ? "Chueotang"
                                            : (place.equals("인제")
                                                ? "Hwangtaeguk"
                                                : (place.equals("정선")
                                                    ? "Gondre Namulbap"
                                                    : (place.equals("철원")
                                                        ? "Freshwater Spicy Soup"
                                                        : (place.equals("춘천")
                                                            ? "Dakgalbi"
                                                            : (place.equals("태백")
                                                                ? "Grilled Korean Beef Fillet"
                                                                : (place.equals("평창")
                                                                    ? "Buckwheat Crepe"
                                                                    : (place.equals("홍천")
                                                                        ? "Hongcheon Grilled Korean Beef"
                                                                        : (place.equals("화천")
                                                                            ? "Raw Cherry Salmon Dish"
                                                                            : (place.equals("횡성")
                                                                                ? "Grilled sirloin"
                                                                                : ""))))))))))))))))));
  }

  public static String getPlace_En(String place) {
    return (place.equals("강릉")
        ? "Gangneung"
        : (place.equals("고성")
            ? "Goseong"
            : (place.equals("동해")
                ? "Donghae"
                : (place.equals("삼척")
                    ? "Samcheok"
                    : (place.equals("속초")
                        ? "Sokcho"
                        : (place.equals("양구")
                            ? "Yanggu"
                            : (place.equals("양양")
                                ? "Yangyang"
                                : (place.equals("영월")
                                    ? "Yeongwol"
                                    : (place.equals("원주")
                                        ? "Wonju"
                                        : (place.equals("인제")
                                            ? "Inje"
                                            : (place.equals("정선")
                                                ? "Jeongseon"
                                                : (place.equals("철원")
                                                    ? "Cheorwon"
                                                    : (place.equals("춘천")
                                                        ? "Chuncheon"
                                                        : (place.equals("태백")
                                                            ? "Taebaek"
                                                            : (place.equals("평창")
                                                                ? "Pyeongchang"
                                                                : (place.equals("홍천")
                                                                    ? "Hongcheon"
                                                                    : (place.equals("화천")
                                                                        ? "Hwacheon"
                                                                        : (place.equals("횡성")
                                                                            ? "Hoengseong"
                                                                            : (place.equals("강원도")
                                                                                ? "Gangwon"
                                                                                : "")))))))))))))))))));
  }

  public static String getQuestion_one_En(String recoType) {
    return (recoType.equals("힐링")
        ? "Healing"
        : (recoType.equals("문화여행")
            ? "Culture Travel"
            : (recoType.equals("레저/스포츠") ? "Leisure Sports" : "")));
  }

  public static String getQuestion_two_En(String recoType) {
    return (recoType.equals("알뜰하게")
        ? "Healing"
        : (recoType.equals("욜로")
            ? "Culture Travel"
            : (recoType.equals("혼자")
                ? "Leisure Sports"
                : (recoType.equals("친구들과")
                    ? "with Friends"
                    : (recoType.equals("가족이랑")
                        ? "with Family"
                        : (recoType.equals("연인이랑") ? "with Couple" : ""))))));
  }

	public static String getSleep_En(String sleep) {
  	return (sleep.equals("호텔")
				? "Hotel"
	         :(sleep.equals("모텔")
				? "Motel"
	          :(sleep.equals("펜션")
				? "Pension"
	           :(sleep.equals("콘도")
				? "Condo"
	            :(sleep.equals("게스트하우스")
				? "Guest House"
	             :(sleep.equals("숙소")
				? "Dormitory"
	              :""))))));
		}


	public static String getTour_En(String tour) {
		return (tour.equals("액티비티")
		        ? "Activity"
		        :(tour.equals("전통")
		          ? "Tradition"
		          :(tour.equals("쇼핑")
		            ? "to Shop"
		            :(tour.equals("힐링")
		              ? "Healing"
		              :""))));
	}

	public static String getEat_En(String eat) {
		return (eat.equals("아침")
		        ? "Breakfast"
		        :(eat.equals("점심")
		          ? "Lunch"
		          :(eat.equals("저녁")
		            ? "Dinner"
		                  :"")));
	}


	public static String getHeal_En(String eat) {
		return (eat.equals("자연 속 힐링")
		        ? "Nature Healing"
		        :(eat.equals("문화시설에서 힐링")
		          ? "Healing in Ccultural facilities"
		            :""));
	}
}

	//	public static String getMainTextResponseFallback() {
  //		switch (USER_DISPLAY_LANGUAGE_CODE){
  //			case Locale.KOREAN
  //		}
  //		return MAIN_TEXT_RESPONSE_FALLBACK;
  //	}
  //
  //	public static String getMainTextResponseWelcome() {
  //
  //		return MAIN_TEXT_RESPONSE_WELCOME;
  //	}
