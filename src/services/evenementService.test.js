import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { getEvenementResponseParams } from './evenementService'

const situation = {
  nom_technique: 'diag_risques_entreprise',
  nom_technique_sans_variant: 'diag_risques_entreprise',
}

describe('#getEvenementResponseParams', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('doit envoyer le score du choix reçu avec la campagne', () => {
    const question = {
      nom_technique: 'Q1IC02',
      choix: [
        { nom_technique: 'Q1IC02R01', intitule: '50 ans et plus', score: { risques: 2 } },
        { nom_technique: 'Q1IC02R03', intitule: 'Moins de 30 ans', score: { risques: 1 } },
      ],
    }

    const params = getEvenementResponseParams(situation, question, 'Q1IC02R03')

    expect(params.nom).toBe('reponse')
    expect(params.donnees).toEqual({
      question: 'Q1IC02',
      reponse: 'Q1IC02R03',
      scoreMax: 2,
      nom_technique: 'Q1IC02R03',
      intitule: 'Moins de 30 ans',
      score: 1,
    })
  })

  it("doit envoyer les scores de l'évaluation d'impact", () => {
    const question = {
      nom_technique: 'Q2PC01',
      choix: [
        {
          nom_technique: 'Q2PC01R1',
          intitule: 'Oui',
          score: { cout: 3, strategies: 0, numerique: 0 },
        },
      ],
    }

    const params = getEvenementResponseParams(situation, question, 'Q2PC01R1')

    expect(params.donnees).toEqual(
      expect.objectContaining({ score_cout: 3, score_strategies: 0, score_numerique: 0 }),
    )
  })

  it('doit envoyer la réponse libre sans score', () => {
    const question = { nom_technique: 'Q1IC04', choix: [] }

    const params = getEvenementResponseParams(situation, question, 'Métallurgie')

    expect(params.donnees).toEqual({ question: 'Q1IC04', reponse: 'Métallurgie', scoreMax: 0 })
  })
})
