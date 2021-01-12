package jm.kuzmenko.springboot_rest_jquery.service;

import jm.kuzmenko.springboot_rest_jquery.dao.RoleDao;
import jm.kuzmenko.springboot_rest_jquery.dao.UserDao;
import jm.kuzmenko.springboot_rest_jquery.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserDetailsService, UserService {

    private UserDao userDao;
    private RoleDao roleDao;

    @Autowired
    public void setUserDao(UserDao userDao, RoleDao roleDao) {
        this.userDao = userDao;
        this.roleDao = roleDao;
    }

    @Override
    @Transactional
    public void addUser(User user) {
        setUserRoles(user);
        userDao.addUser(user);
    }

    @Transactional
    public void setUserRoles(User user) {
        user.setRoles(user
                .getRoles()
                .stream()
                .map(role -> roleDao.findRoleByName(role.getRole()))
                .collect(Collectors.toSet()));
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        setUserRoles(user);
        userDao.updateUser(user);
    }

    @Override
    @Transactional
    public List<User> listUser() {
        return userDao.listUser();
    }

    @Override
    @Transactional
    public User getUserById(Long id) {
        return userDao.getUserById(id);
    }

    @Override
    public void removeUser(Long id) {
        userDao.removeUser(id);
    }

    @Override
    public User findUserBuyUsername(String username) {
        return userDao.findUserByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        User user = userDao.findUserByUsername(s);
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getRoles()
        );
    }
}

