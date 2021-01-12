package jm.kuzmenko.springboot_rest_jquery.dao;

import jm.kuzmenko.springboot_rest_jquery.models.Role;

public interface RoleDao {
    Role findRoleByName(String name);
}
