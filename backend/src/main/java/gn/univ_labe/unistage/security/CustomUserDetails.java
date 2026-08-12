package gn.univ_labe.unistage.security;

import gn.univ_labe.unistage.model.RoleEnum;
import gn.univ_labe.unistage.model.Utilisateur;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String nom;
    private final String prenom;
    private final String email;
    private final String motDePasse;
    private final RoleEnum role;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(Long id, String nom, String prenom, String email, String motDePasse, RoleEnum role, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.role = role;
        this.authorities = authorities;
    }

    public static CustomUserDetails build(Utilisateur utilisateur) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name()));

        return new CustomUserDetails(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getMotDePasse(),
                utilisateur.getRole(),
                authorities
        );
    }

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public RoleEnum getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return motDePasse;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
