package com.o2o.action.server.rest;

import com.o2o.action.server.app.KangwonTour;
import com.o2o.action.server.util.CommonUtil;
import java.util.concurrent.ExecutionException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KangwonTourController {

    @Autowired
    private KangwonTour kangwontour;

    //@Autowired
    //private CategoryRepository categoryRepository;

//    public KangwonTourController() {
//        kangwontour = new KangwonTour();
//    }

    @RequestMapping(value = "/kangwontour", method = RequestMethod.POST)
    public @ResponseBody
    String processActions(@RequestBody String body, HttpServletRequest request,
                          HttpServletResponse response) {
        String jsonResponse = null;
        try {
            System.out.println("request : " + body);

            JSONParser jsonParse = new JSONParser();

            JSONObject jsonObject = (JSONObject) jsonParse.parse(body);
            JSONObject requestObject = (JSONObject) jsonObject.get("originalDetectIntentRequest");
            JSONObject payloadObject = (JSONObject) requestObject.get("payload");
            JSONArray inputArray = (JSONArray) payloadObject.get("inputs");
            JSONObject inputObject = (JSONObject) inputArray.get(0);
            JSONArray rawArray = (JSONArray) inputObject.get("rawInputs");
            JSONObject rawObject = (JSONObject) rawArray.get(0);
            String query = (String) rawObject.get("query");

            System.out.println("\nquery = " + query);
            JSONObject resultObject = (JSONObject) jsonObject.get("queryResult");JSONObject intentObject = (JSONObject)  resultObject.get("intent");String intentName = (String) intentObject.get("displayName");
            System.out.println("\nintent = " + intentName + "\n");

            jsonResponse = kangwontour.handleRequest(body, CommonUtil.getHttpHeadersMap(request)).get();
            System.out.println("response : " + jsonResponse);
            System.out.println("------------------------end of conversation------------------------");

        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (ParseException e){
            e.printStackTrace();
        }

        return jsonResponse;
    }
}