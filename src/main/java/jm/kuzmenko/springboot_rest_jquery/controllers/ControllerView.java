package jm.kuzmenko.springboot_rest_jquery.controllers;

import jm.kuzmenko.springboot_rest_jquery.models.User;
import jm.kuzmenko.springboot_rest_jquery.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ControllerView {

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String loin() {
        return "redirect:/login";
    }

    @GetMapping("/admin")
    public String adminPage() {
        return "admin_page";
    }

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public String userPage(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        User user = userService.findUserBuyUsername(login);
        model.addAttribute("user", user);
        return "user";
    }
}
