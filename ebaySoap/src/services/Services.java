package services;

import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

import org.json.simple.JSONObject;

import entities.UserEntity;
import utilities.BCrypt;
import utilities.ConnctionPool;
import utilities.Dao;

@WebService(name = "Servies", targetNamespace = "http://localhost:8080/WebServices/services")
@SOAPBinding(style = SOAPBinding.Style.RPC, use = SOAPBinding.Use.LITERAL, parameterStyle = SOAPBinding.ParameterStyle.WRAPPED)
public class Services {

	public Services() {
		ConnctionPool.initializePool(10);
	}

	@WebMethod
	public String authenticate(String username, String password) {
		JSONObject userJSON = new JSONObject();
		UserEntity user = Dao.getUserFromUserName(username);
		if (BCrypt.hashpw(password, user.getSalt()).equals(user.getSecret())) {
			
			userJSON.put("user_id", user.getUser_id());
			userJSON.put("username", user.getUser_name());
			userJSON.put("statusCode", 200);
						
			return userJSON.toJSONString();
		} else {
			userJSON.put("statusCode", 401);
			return userJSON.toJSONString();
		}
	}

	@SuppressWarnings("unchecked")
	@WebMethod
	public String fetchUser(String username) {
		JSONObject userJSON = new JSONObject();
		UserEntity user = Dao.getUserFromUserName(username);
		userJSON.put("user_id", user.getUser_id());
		userJSON.put("user_name", user.getUser_name());
		userJSON.put("f_name", user.getF_name());
		userJSON.put("l_name", user.getL_name());
		userJSON.put("location", user.getLocation());
		userJSON.put("contact", user.getContact());
		return userJSON.toJSONString();
	}
	
	@WebMethod
	public boolean catalouge(String seller_id) {
		JSONObject catalougeJSON = new JSONObject();
		Dao.getCatalouge(seller_id);		
		return true;
	}
	
	@WebMethod
	public boolean sell(String query) {
		JSONObject sellJSON = new JSONObject();
		Dao.sell(query);		
		return true;
	}
	
	@WebMethod
	public boolean getBought(String args) {
		JSONObject boughtJSON = new JSONObject();
		Dao.bought(args);		
		return true;
	}
	
	@WebMethod
	public boolean getSold(String args) {
		JSONObject soldJSON = new JSONObject();
		Dao.sold(args);		
		return true;
	}
	
	@WebMethod
	public boolean getuserinfo(String args) {
		JSONObject userInfoJSON = new JSONObject();
		Dao.userinfo(args);		
		return true;
	}
	
	@WebMethod
	public boolean delet_cartitem(String args) {
		Dao.delet(args);		
		return true;
	}
	
	@WebMethod
	public boolean checkout(String query) {
		Dao.checkout(query);		
		return true;
	}
	
	@WebMethod
	public boolean getCart(String args) {
		JSONObject cartJSON = new JSONObject();
		Dao.cart(args);		
		return true;
	}
	
	@WebMethod
	public boolean bid(String args) {
		Dao.bid(args);		
		return true;
	}
	
	@WebMethod
	public boolean item(String args) {
		JSONObject itemJSON = new JSONObject();
		Dao.item(args);		
		return true;
	}

	@WebMethod
	public boolean addUser(String username, String f_name, String l_name, String secret,
			String contact, String location) {
		String salt = BCrypt.gensalt(10);
//		System.out.println(l_name);
		return Dao.insertNewUser(
				new UserEntity(username, f_name, l_name, BCrypt.hashpw(secret, salt), salt, contact,location));
	}
	
//	@WebMethod
//	public boolean updateLastLogin(int user_id) {
//		return Dao.updateLastLogin(user_id);
//	}

}