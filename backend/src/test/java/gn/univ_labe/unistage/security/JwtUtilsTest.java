package gn.univ_labe.unistage.security;

import gn.univ_labe.unistage.model.RoleEnum;
import gn.univ_labe.unistage.model.Utilisateur;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class JwtUtilsTest {

    @Autowired
    private JwtUtils jwtUtils;

    private Authentication authentication;

    @BeforeEach
    void setUp() {
        Utilisateur user = new Utilisateur("Diallo", "Alpha", "test@demo.local", "password123", RoleEnum.ETUDIANT);
        user.setId(1L);
        CustomUserDetails userDetails = CustomUserDetails.build(user);
        authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Test
    void testGenerateAndValidateJwtToken() {
        String token = jwtUtils.generateJwtToken(authentication);
        assertNotNull(token, "Le jeton généré ne doit pas être nul");
        assertFalse(token.isBlank(), "Le jeton généré ne doit pas être vide");

        boolean isValid = jwtUtils.validateJwtToken(token);
        assertTrue(isValid, "Le jeton généré doit être validé avec succès");

        String username = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals("test@demo.local", username, "Le subject extrait doit correspondre à l'email");
    }

    @Test
    void testValidateInvalidJwtToken() {
        boolean isValid = jwtUtils.validateJwtToken("token_invalide_ou_malforme.signature.incorrecte");
        assertFalse(isValid, "Un jeton invalide ou corrompu doit être rejeté");
    }
}
