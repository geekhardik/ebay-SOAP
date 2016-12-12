package entities;

import java.sql.Date;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name = "User")
@XmlType(propOrder = {"user_id", "user_name", "f_name", "l_name", "contact", "secret", "salt", "location"})
public class UserEntity {
	


	public UserEntity() {
		
	}

	//signin
	public UserEntity(int user_id, String user_name, String f_name, String l_name, String location, String secret, String salt, String contact) {
		this.user_id = user_id;
		this.user_name = user_name;
		this.f_name = f_name;
		this.l_name = l_name;
		this.location = location;
		this.secret = secret;
		this.salt = salt;
		this.contact = contact;
	}

	//signup
	public UserEntity(String user_name, String f_name, String l_name,String secret, String salt,  String contact,
			String location) {
		this.user_name = user_name;
		this.f_name = f_name;
		this.l_name = l_name;
		this.contact = contact;
		this.secret = secret;
		this.salt = salt;
		this.location = location;
	}

	

	private int user_id;
	private String user_name;
	private String f_name;
	private String l_name;
	private String location;
	private String secret;
	private String salt;
	private String contact;

	@XmlElement
	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	@XmlElement
	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	@XmlElement
	public String getF_name() {
		return f_name;
	}

	public void setF_name(String f_name) {
		this.f_name = f_name;
	}

	@XmlElement
	public String getL_name() {
		return l_name;
	}

	public void setL_name(String l_name) {
		this.l_name = l_name;
	}

	@XmlElement
	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	@XmlElement
	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	@XmlElement
	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	@XmlElement
	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}
	
	@Override
	public String toString() {
		return "User ID: " + this.user_id + "\n" +
				"User Name: " + this.user_name + "\n" + 
				"First Name: " + this.f_name + "\n" +
				"Last Name: " + this.l_name + "\n" +
				"Location :  " + this.location + "\n" +
				"Secret: " + this.secret + "\n" +
				"Salt: " + this.salt + "\n" +
				"contact : " + this.location;
	}

	

}
