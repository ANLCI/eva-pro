import { thematiques } from './../data/thematiques'

// Correspondance entre les clés du score d'un choix (campagne) et les champs
// attendus par le serveur dans les données de l'évènement de réponse
const CHAMPS_SCORE = {
  risques: 'score',
  cout: 'score_cout',
  numerique: 'score_numerique',
  strategies: 'score_strategies',
}

export function thematiquePourQuestion(nomTechniqueSituation, nomTechniqueQuestion) {
  const thematiquesPourSituation = thematiques[nomTechniqueSituation]
  if (!thematiquesPourSituation) return undefined

  return Object.keys(thematiquesPourSituation).find((thematique) =>
    thematiquesPourSituation[thematique].includes(nomTechniqueQuestion),
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
