package jm.kuzmenko.springboot_rest_jquery.service;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import jm.kuzmenko.springboot_rest_jquery.models.User;

import java.io.IOException;
import java.util.Set;

public class UserSerializer extends JsonSerializer<Set<User>> {

    @Override
    public void serialize(Set<User> users, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {

    }
}
