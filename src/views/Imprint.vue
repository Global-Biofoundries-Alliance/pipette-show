<template>
  <page-layout class="imprint">
   <div class="uk-container">
<h1>Legal Notice / Impressum </h1>

Angaben gemäß § 5 TMG / Information in accordance with § 5 TMG

<contact-information />

</div>
  </page-layout>
</template>

<script>
import PageLayout from "../components/home/PageLayout.vue";

import ContactInformation from '../components/common/ContactInformation.vue';


export default {
  name: "imprint",
  components: { PageLayout, ContactInformation },

};
</script>

<style lang="scss">
.imprint {
  
}
</style>
