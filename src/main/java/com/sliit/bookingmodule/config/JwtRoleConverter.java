package com.sliit.bookingmodule.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;

/**
 * Maps JWT claims into Spring Security authorities.
 * Expected claims (configurable in your OAuth provider):
 * - roles: ["ADMIN","STUDENT"] or ["ROLE_ADMIN", ...]
 * - scope/scp: standard OAuth scopes (optional)
 */
@Component
public class JwtRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        List<String> roles = jwt.getClaimAsStringList("roles");
        Stream<String> roleStream = roles == null ? Stream.empty() : roles.stream();

        Stream<String> scopeStream = Stream.empty();
        String scope = jwt.getClaimAsString("scope");
        if (scope != null && !scope.isBlank()) {
            scopeStream = Stream.of(scope.split(" "));
        } else {
            List<String> scp = jwt.getClaimAsStringList("scp");
            if (scp != null) {
                scopeStream = scp.stream();
            }
        }

        return Stream.concat(
                        roleStream.map(r -> r.startsWith("ROLE_") ? r : "ROLE_" + r),
                        scopeStream.map(s -> "SCOPE_" + s)
                )
                .distinct()
                .map(value -> (GrantedAuthority) new SimpleGrantedAuthority(value))
                .toList();
    }
}

