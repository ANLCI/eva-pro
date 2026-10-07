import { thematiques } from './../data/thematiques'

// Correspondance entre les clés du score d'un choix (campagne) et les champs
// attendus par le serveur dans les données de l'évènement de réponse
const CHAMPS_SCORE = {
  risques: 'score',
  cout: 'score_cout',
  numerique: 'score_numerique',
  strategies: 'score_strategies',
}

export function thematiquePourQuestion(nomTechniqueSansVariantDeSituation, question) {
  const thematiquesPourSituation = thematiques[nomTechniqueSansVariantDeSituation]
  if (!thematiquesPourSituation) return undefined

  const question_sans_variant = question.split('__')[0]
  return Object.keys(thematiquesPourSituation).find((thematique) =>
    thematiquesPourSituation[thematique].includes(question_sans_variant),
  )
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
