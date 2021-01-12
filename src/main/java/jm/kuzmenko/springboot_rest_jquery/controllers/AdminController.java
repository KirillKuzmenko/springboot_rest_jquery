package jm.kuzmenko.springboot_rest_jquery.controllers;

import jm.kuzmenko.springboot_rest_jquery.models.User;
import jm.kuzmenko.springboot_rest_jquery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/admin")
public class AdminController {

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> userList() {
        return userService.listUser();
    }

    @GetMapping("/user")
    public User getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
//        User user = userService.findUserBuyUsername(login);
        return userService.findUserBuyUsername(login);
    }

    @PostMapping("/users")
    public User newUser(@RequestBody User user) {
        userService.addUser(user);
        return user;
    }

    @PutMapping("/user")
    public User updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return user;
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.removeUser(id);
        return id.toString();
    }
}