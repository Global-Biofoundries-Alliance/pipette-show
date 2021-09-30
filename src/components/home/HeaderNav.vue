<template>
  <ul>
    <router-link
  to="/manual"
  v-slot="{ href, navigate, isActive}"
  custom
>
  <li
    :class="[isActive && 'uk-active']"
  >
    <a :href="href" @click="navigate">Manual</a>
  </li>
</router-link>


<li><a href="https://git.rwth-aachen.de/pipette-show/pipette-show" onclick="alert('Coming Soon.'); return false;">Developement (Git)<span uk-icon="icon: link; ratio: 0.9"></span></a></li>
    

<router-link
  to="/contact"
  v-slot="{ href, navigate, isActive}"
  custom
>
  <li
    :class="[isActive && 'uk-active']"
  >
    <a :href="href" @click="navigate">Contact</a>
  </li>
</router-link>

  </ul>
</template>

<script>
export default {
  name: "header-nav",
  components: {},

  methods: {
    openPage: function (page) {
      this.$router.push(page);
    },
  },


};
</script>

<style lang="scss"></style>
