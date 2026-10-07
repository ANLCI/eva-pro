import { describe, it, expect } from 'vitest'
import {
  choixPourQuestion,
  scoresDuChoix,
  scoreMaxPourQuestion,
  detailPourQuestion,
} from './questionService'

const situation = 'diag_risques_entreprise'

const questionDiagnostic = {
  nom_technique: 'Q1IC02',
  choix: [
    { nom_technique: 'Q1IC02R01', intitule: '50 ans et plus', score: { risques: 2 } },
    { nom_technique: 'Q1IC02R02', intitule: 'Entre 30 et 50 ans', score: { risques: 0 } },
    { nom_technique: 'Q1IC02R03', intitule: 'Moins de 30 ans', score: { risques: 1 } },
  ],
}

const questionSaisie = { nom_technique: 'Q1IC04', type: 'saisie', choix: [] }

describe('#choixPourQuestion', () => {
  it('doit retourner le choix correspondant à la réponse', () => {
    expect(choixPourQuestion(questionDiagnostic, 'Q1IC02R03')).toEqual(
      expect.objectContaining({ nom_technique: 'Q1IC02R03', score: { risques: 1 } }),
    )
  })

  it('doit retourner undefined pour une réponse invalide', () => {
    expect(choixPourQuestion(questionDiagnostic, 'RéponseInvalide')).toBeUndefined()
  })

  it('doit retourner undefined pour une question sans choix', () => {
    expect(choixPourQuestion(questionSaisie, 'Lorem Ipsum')).toBeUndefined()
  })
})

describe('#scoresDuChoix', () => {
  it('doit transformer le score de risque en champ score', () => {
    expect(scoresDuChoix({ score: { risques: 2 } })).toEqual({ score: 2 })
  })

  it("doit transformer les scores de l'évaluation d'impact", () => {
    expect(scoresDuChoix({ score: { cout: 3, strategies: 0, numerique: 4 } })).toEqual({
      score_cout: 3,
      score_strategies: 0,
      score_numerique: 4,
    })
  })

  it('doit retourner un objet vide pour un choix sans score', () => {
    expect(scoresDuChoix({ score: null })).toEqual({})
    expect(scoresDuChoix(undefined)).toEqual({})
  })
})

describe('#scoreMaxPourQuestion', () => {
  it('doit retourner le score maximum correct pour une question', () => {
    expect(scoreMaxPourQuestion(questionDiagnostic)).toBe(2)
  })

  it('doit retourner 0 pour une question sans choix', () => {
    expect(scoreMaxPourQuestion(questionSaisie)).toBe(0)
  })

  it('doit retourner 0 pour une question sans score de risque', () => {
    const question = { choix: [{ score: { cout: 3 } }, { score: { cout: 0 } }] }
    expect(scoreMaxPourQuestion(question)).toBe(0)
  })
})

describe('#detailPourQuestion', () => {
  it('doit retourner les détails pour une question valide', () => {
    const questionDetails = detailPourQuestion(situation, 'Q1IC01')
    expect(questionDetails).toEqual(
      expect.objectContaining({
        nom_technique: 'Q1IC01',
      }),
    )
  })

  it('doit retourner les détails pour une question valide avec un variant', () => {
    const questionDetails = detailPourQuestion(situation, 'Q1IC01__variant')
    expect(questionDetails).toEqual(
      expect.objectContaining({
        nom_technique: 'Q1IC01',
      }),
    )
  })

  it('doit retourner undefined pour une question invalide', () => {
    const questionDetails = detailPourQuestion(situation, 'QuestionInvalide')
    expect(questionDetails).toBeUndefined()
  })

  it('doit retourner undefined pour une situation invalide', () => {
    const questionDetails = detailPourQuestion('situationInvalide', 'Q1IC01')
    expect(questionDetails).toBeUndefined()
  })
})
