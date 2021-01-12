package jm.kuzmenko.springboot_rest_jquery.dao;

import jm.kuzmenko.springboot_rest_jquery.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    @Qualifier("bCryptPasswordEncoder")
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    @Transactional
    public void addUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        entityManager.persist(user);
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        entityManager.merge(user);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<User> listUser() {
        TypedQuery<User> users = entityManager.createQuery("from User", User.class);
        return users.getResultList();
    }

    @Override
    public User getUserById(Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    @Transactional
    public void removeUser(Long id) {
        entityManager.createQuery("delete from User where id = :id")
                .setParameter("id", id)
                .executeUpdate();
    }

    @Override
    public User findUserByUsername(String username) {
        return entityManager.createQuery("from User where username = :username", User.class)
                .setParameter("username", username)
                .getSingleResult();
    }
}

