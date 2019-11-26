package it.aizoon.scratch.app.controller;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

@Controller
@RequestMapping(value = "/private/view/", method = { RequestMethod.GET, RequestMethod.POST })
public class ControllerTest {

	@RequestMapping(value = "/osintSettings.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView test() {
		ModelAndView retVal = new ModelAndView("test/myView");
		retVal.addObject("nome", 7);

		return retVal;
	}

	@RequestMapping(value = "/dashboard.do", method = { RequestMethod.GET, RequestMethod.POST })
	public ModelAndView dashboard() {
		ModelAndView retVal = new ModelAndView("dashboard/dashboard");
		return retVal;
	}

	@RequestMapping("/getR2.do")
	public @ResponseBody List<Map> getR2(@RequestParam(value = "name", defaultValue = "World") String name)
			throws UnsupportedEncodingException {

		InputStream resourceAsStream = ControllerTest.class.getClassLoader().getResourceAsStream("r2/R3output.json");
		Gson gson = new GsonBuilder().create();
		BufferedReader reader = new BufferedReader(new InputStreamReader(resourceAsStream, "UTF-8"));

		List<Map> t = gson.fromJson(reader, new TypeToken<List<Map>>() {
		}.getType());

		return t;
	}

	public static void main(String[] args) throws UnsupportedEncodingException {

		InputStream resourceAsStream = ControllerTest.class.getClassLoader().getResourceAsStream("r2/R2.json");
		Gson gson = new GsonBuilder().create();
		BufferedReader reader = new BufferedReader(new InputStreamReader(resourceAsStream, "UTF-8"));

		List<Map> t = gson.fromJson(reader, new TypeToken<List<Map>>() {
		}.getType());

		System.out.println(t);

	}
}