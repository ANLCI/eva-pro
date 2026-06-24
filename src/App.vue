<script setup>
import { RouterView } from 'vue-router'
import { useAlertStore } from './stores/alertStore'
import evaproSvg from './assets/evapro.svg'

const alertStore = useAlertStore()

const logoText = ['RÉPUBLIQUE', 'FRANÇAISE']
const operatorImgAlt = 'EVAPRO'
const serviceTitle = 'Evapro'
const operatorImgSrc = evaproSvg
const operatorImgStyle = { height: '4.5rem' }
const serviceDescription =
  'Outil d’évaluation des risques liés à une maîtrise insuffisante des compétences de base dans les structures'
const placeholder = ''
const homeTo = '/'
</script>

<template>
  <DsfrHeader :logo-text :operator-img-src :operator-img-alt :operator-img-style :service-title :service-description :placeholder :home-to />

  <div class="fr-container">
    <DsfrAlert
      v-if="alertStore.isVisible"
      :type="alertStore.type"
      :title="alertStore.title"
      :description="alertStore.description"
    />
  </div>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
