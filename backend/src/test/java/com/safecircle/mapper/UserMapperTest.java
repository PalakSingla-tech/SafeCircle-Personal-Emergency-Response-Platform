package com.safecircle.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.safecircle.dto.SignUpRequestDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UserMapperTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void shouldMapNameAliasFromJsonPayload() throws JsonProcessingException {
        String payload = "{\"name\":\"Alice Johnson\",\"email\":\"alice@example.com\",\"password\":\"secret123\"}";

        SignUpRequestDTO dto = objectMapper.readValue(payload, SignUpRequestDTO.class);

        assertEquals("Alice Johnson", dto.getFullName());
    }
}
