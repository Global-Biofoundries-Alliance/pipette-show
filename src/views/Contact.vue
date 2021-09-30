<template>
  <page-layout class="contact">
    


    <contact-information />
  </page-layout>
</template>

<script>
import ContactInformation from '../components/common/ContactInformation.vue';
import PageLayout from "../components/home/PageLayout.vue";

export default {
  name: "contact",
  components: { PageLayout, ContactInformation },

};
</script>

<style lang="scss">
.contact {
  
}
</style>
