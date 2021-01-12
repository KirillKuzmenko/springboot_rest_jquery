package jm.kuzmenko.springboot_rest_jquery.service;

import jm.kuzmenko.springboot_rest_jquery.models.User;

import java.util.List;

public interface UserService {
    void addUser(User user);
    void updateUser(User user);
    List<User> listUser();
    User getUserById(Long id);
    void removeUser(Long id);
    User findUserBuyUsername(String username);
}
