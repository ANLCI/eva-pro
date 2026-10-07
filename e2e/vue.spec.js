import { test, expect } from '@playwright/test';

import { mockApiCampagne } from './fixtures/campagne';
import {
  attendsEvenementReponse,
  goToCampagne,
  getQuestionnaireSelectors,
  mockAdminBaseRoute,
  mockCampagneRoutes,
  mockEvaluationResumptionRoutes,
} from './utils/testHelpers';

const beneficiaireId = "12345"

test('Complète le premier questionnaire', async ({ page }) => {
  const sousMenuThematiqueActif = '#diag_risques_entreprise .fr-sidemenu__item.fr-sidemenu__item--active'
  const evaluationId = 1;
  await mockCampagneRoutes(page, { evaluationId });
  await goToCampagne(page, { beneficiaireId });

  const selectors = getQuestionnaireSelectors(page);

  await expect(selectors.progressBar).toHaveAttribute('style', 'width: 50%;');
  await expect(page.locator(sousMenuThematiqueActif)).toHaveText("Identité & culture d'organisation")

  await expect(page).toHaveURL(`/situations/${mockApiCampagne.situations[0].id}`)

  await expect(selectors.legend).toHaveText('Quelle est la taille de votre entreprise/structure ?');

  await expect(selectors.labels.first()).toContainText('250 salariés et +');
  await expect(selectors.labels.nth(1)).toContainText('50 à 249 salariés');

  await selectors.labels.first().click();

  await page.waitForFunction(() => document.querySelector('label')?.textContent?.includes('A quelle branche votre structure est-elle rattachée ?'))
  await expect(page.locator(sousMenuThematiqueActif)).toHaveText("Profil des collaborateurs")

  await selectors.champTexte.fill('Finance');

  await page.locator('button:has-text("Valider")').click();

  const questionDeuxiemeSituation = "Avez-vous parfois l'impression de devoir prendre plus de temps que nécessaire pour vous assurer que vos collaborateurs ou collaboratrices ont bien compris certaines informations ?"
  await expect(page.locator('legend')).toHaveText(questionDeuxiemeSituation);
});

test('passe automatiquement la question radio puis affiche le bouton en revenant en arrière', async ({ page }) => {
  const sousMenuThematiqueActif = '#diag_risques_entreprise .fr-sidemenu__item.fr-sidemenu__item--active';
  const evaluationId = 2;
  await mockCampagneRoutes(page, { evaluationId });
  await goToCampagne(page, { beneficiaireId });

  const selectors = getQuestionnaireSelectors(page);

  await expect(page.locator(sousMenuThematiqueActif)).toHaveText("Identité & culture d'organisation");
  await expect(selectors.legend).toHaveText('Quelle est la taille de votre entreprise/structure ?');

  await selectors.labels.first().click();

  await selectors.boutonPrecedent.click();
  await expect(selectors.legend).toHaveText('Quelle est la taille de votre entreprise/structure ?');
  await expect(selectors.boutonContinuer).toBeVisible();
});

test('reprend le deuxième questionnaire', async ({ page }) => {
  const sousMenuThematiqueActif = '.fr-sidemenu__item.fr-sidemenu__item--active button[aria-controls=evaluation_impact_general__constructys]'
  const evaluationId = "evaluation-123456"
  const campagneId = "campagne-123456"
  await mockEvaluationResumptionRoutes(page, { evaluationId, campagneId });

  await page.goto(`/evaluation-impact?evaluation_id=${evaluationId}`);

  await expect(page.locator(sousMenuThematiqueActif)).toHaveText("Diagnostic des impacts sponsorisé par Constructys")
  await expect(page.locator('legend')).toHaveText("Avez-vous parfois l'impression de devoir prendre plus de temps que nécessaire pour vous assurer que vos collaborateurs ou collaboratrices ont bien compris certaines informations ?");

  const choicesList1 = page.locator('label');
  await expect(choicesList1.first()).toContainText('Oui');
  await choicesList1.first().click();
});

test('enregistre les scores des choix reçus avec la campagne', async ({ page }) => {
  const evaluationId = 3;
  await mockCampagneRoutes(page, { evaluationId });
  await goToCampagne(page, { beneficiaireId });

  const selectors = getQuestionnaireSelectors(page);

  const reponseQ1IC01 = attendsEvenementReponse(page, 'Q1IC01');
  await selectors.labels.nth(1).click();
  expect(await reponseQ1IC01).toEqual({
    question: 'Q1IC01',
    reponse: 'Q1IC01R02',
    scoreMax: 2,
    nom_technique: 'Q1IC01R02',
    intitule: '50 à 249 salariés',
    score: 2,
  });

  const reponseQ1PC01 = attendsEvenementReponse(page, 'Q1PC01');
  await selectors.champTexte.fill('Finance');
  await page.locator('button:has-text("Valider")').click();
  expect(await reponseQ1PC01).toEqual({ question: 'Q1PC01', reponse: 'Finance', scoreMax: 0 });

  await expect(selectors.legend).toContainText("Avez-vous parfois l'impression");
  const reponseQ2PC01 = attendsEvenementReponse(page, 'Q2PC01');
  await selectors.labels.first().click();
  expect(await reponseQ2PC01).toEqual(
    expect.objectContaining({
      reponse: 'Q2PC01R1',
      score_cout: 3,
      score_strategies: 0,
      score_numerique: 0,
    }),
  );
});

test("l'accueil redirige vers l'admin si le code campagne est manquant", async ({ page }) => {
  // eslint-disable-next-line no-undef
  await mockAdminBaseRoute(page, process.env.VITE_ADMIN_BASE_URL);

  await page.goto('/');
  // eslint-disable-next-line no-undef
  await expect(page).toHaveURL(process.env.VITE_ADMIN_BASE_URL);
});
