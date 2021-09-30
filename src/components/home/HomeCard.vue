<template>
  <div
    @click="openPage(href)"
    class="uk-card uk-card-default uk-text-center"
    v-bind:data-uk-scrollspy="'cls: uk-animation-slide-' + slide_direction"
  >
    <div class="uk-padding-small uk-padding-remove-bottom">
      <span class="uk-label">{{ number }}</span>
    </div>
    <div class="uk-card-media-top">
      <img :src="src" alt="" />
    </div>
    <div class="uk-padding-small uk-padding-remove-top">
      <h2 class="uk-margin-small-bottom">{{ title }}</h2>
      <p class="card-text uk-margin-small uk-margin-remove-bottom">
        <slot />
      </p>

      <button
        
        class="uk-button uk-button-primary uk-position-small"
      >
        {{ caption }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "home-card",

  props: [
    "number",
    "title",
    "href",
    "caption",
    "description",
    "src",
    "slide_direction",
  ],

  methods: {
    openPage: function (page) {
      this.$router.push(page);
    },
  },
};
</script>

<style lang="scss" scoped>
.uk-card {
  cursor:pointer;
  background-color: #f8f8f8;
  color: #7d8284;
}

.first-step::after{
    cursor:auto;
}
</style>
