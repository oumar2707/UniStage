package gn.univ_labe.unistage.dto;

import jakarta.validation.constraints.NotBlank;

public class StatutUpdateRequest {

    @NotBlank(message = "Le statut est obligatoire")
    private String statut;

    public StatutUpdateRequest() {}

    public StatutUpdateRequest(String statut) {
        this.statut = statut;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}
