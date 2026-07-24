package com.safecircle.security;

import com.safecircle.entity.User;
import com.safecircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        Optional<User> userByEmail = userRepository.findByEmail(identifier);
        if(userByEmail.isPresent()) return userByEmail.get();

        throw new UsernameNotFoundException("No user found with identifier: " + identifier);
    }
}
