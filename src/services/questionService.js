import * as diagnosticRisques from './../data/situations/diagnostic_risques'
import * as evaluationImpact from './../data/situations/evaluation_impact'

const questions = {
  diag_risques_entreprise: diagnosticRisques,
  evaluation_impact_general: evaluationImpact,
}

// Correspondance entre les clés du score d'un choix (campagne) et les champs
// attendus par le serveur dans les données de l'évènement de réponse
const CHAMPS_SCORE = {
  risques: 'score',
  cout: 'score_cout',
  numerique: 'score_numerique',
  strategies: 'score_strategies',
}

export function detailPourQuestion(nomTechniqueSansVariantDeSituation, question) {
  const questionsPourSituation = questions[nomTechniqueSansVariantDeSituation]
  if (!questionsPourSituation) return undefined

  const question_sans_variant = question.split('__')[0]
  const questionDetails = questionsPourSituation[question_sans_variant]
  if (!questionDetails) return undefined

  return questionDetails
}

export function choixPourQuestion(question, reponse) {
  return question?.choix?.find((c) => c.nom_technique === reponse)
}

export function scoresDuChoix(choix) {
  if (!choix?.score) return {}

  return Object.fromEntries(
    Object.entries(choix.score).map(([cle, valeur]) => [
      CHAMPS_SCORE[cle] ?? `score_${cle}`,
      valeur,
    ]),
  )
}

export function scoreMaxPourQuestion(question) {
  const scores = (question?.choix ?? [])
    .map((choix) => scoresDuChoix(choix).score)
    .filter((score) => typeof score === 'number')
  if (!scores.length) return 0

  return Math.max(...scores)
}
