package utilities;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import entities.UserEntity;

public class Dao {	

//		public static UserEntity getUserFromID(int user_id) {
//			UserEntity user = null;
//			try {
//				PreparedStatement stmt = ConnctionPool.getConnection().prepareStatement(
//						"select user_id, user_name, f_name, l_name, email, secret, salt, last_login from user_account where user_id = ?");
//				stmt.setInt(1, user_id);
//				ResultSet rs = stmt.executeQuery();
//				if (rs.next()) {
//					user = new UserEntity(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4), rs.getString(5),
//							rs.getString(6), rs.getString(7), rs.getDate(8));
//				}
//			} catch (SQLException e) {
//				e.printStackTrace();
//			}
//			return user;
//		}
//		
		public static UserEntity getUserFromUserName(String user_name) {
			UserEntity user = null;
			try {
				PreparedStatement stmt = ConnctionPool.getConnection().prepareStatement(
						"select user_id, username, firstname, lastname, location, password, salt, contact from users where username = ?");
				stmt.setString(1, user_name);
				ResultSet rs = stmt.executeQuery();
				if (rs.next()) {
					user = new UserEntity(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4), rs.getString(5),
							rs.getString(6), rs.getString(7), rs.getString(8));
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
			return user;
		}
//		
//		public static boolean updateLastLogin(int user_id) {
//			int rowsAffected = 0;
//			try {
//				PreparedStatement stmt = ConnctionPool.getConnection().prepareStatement(
//						"update user_account set last_login = ? where user_id = ?");
//				stmt.setDate(1, new Date(new java.util.Date().getTime()));
//				stmt.setInt(2, user_id);
//				rowsAffected = stmt.executeUpdate();
//			} catch (SQLException e) {
//				e.printStackTrace();
//			}
//			return rowsAffected == 1 ? true : false;
//		}
		
		public static boolean insertNewUser(UserEntity user) {
			boolean result = false;
			try {
				PreparedStatement stmt = ConnctionPool.getConnection().prepareStatement(
						"insert into users set username = ?, firstname = ?, lastname = ?, password = ?, salt = ?, contact = ?, location = ?");
				stmt.setString(1, user.getUser_name());
				stmt.setString(2, user.getF_name());
				stmt.setString(3, user.getL_name());
				stmt.setString(4, user.getSecret());
				stmt.setString(5, user.getSalt());
				stmt.setString(6, user.getContact());
				stmt.setString(7, user.getLocation());
				result = stmt.execute();
				System.out.println(result);
			} catch (SQLException e) {
				e.printStackTrace();
			}
			return result;
		}

		public static void getCatalouge(String seller_id) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"select * from sell where not seller_id = ?");
				stmt.setString(1, seller_id);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}

		public static void sell(String args) {
			// TODO Auto-generated method stub
						PreparedStatement stmt;
						try {
							stmt = ConnctionPool.getConnection().prepareStatement(
									"insert into sell SET = ?");
							stmt.setString(1, args);
						} catch (SQLException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
			
		}

		public static void bought(String args) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"select * from order_details where user_id = ?");
				stmt.setString(1, args);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		public static void sold(String args) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"select * from sell where seller_id = ?");
				stmt.setString(1, args);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		public static void userinfo(String args) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"select * from users where user_id = ?");
				stmt.setString(1, args);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		public static void delet(String args) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"delete from cart where user_id = ? and item = ?");
				stmt.setString(1, args);
				stmt.setString(2, args);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		public static void checkout(String args) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"insert into transection SET= ?");
				stmt.setString(1, args);
				
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		public static void cart(String args) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"select * from cart where user_id = ?");
				stmt.setString(1, args);
				
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		public static void bid(String args) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"insert into bids SET = ?");
				stmt.setString(1, args);
				
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		public static void item(String args) {
			// TODO Auto-generated method stub
			PreparedStatement stmt;
			try {
				stmt = ConnctionPool.getConnection().prepareStatement(
						"select * from sell where item_id = ?");
				stmt.setString(1, args);
				
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}	
}
