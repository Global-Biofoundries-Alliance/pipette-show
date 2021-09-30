<template>
  <div class="home uk-height-1-1 uk-flex uk-flex-column">
    <!--HEADER-->
    <div class="uk-navbar-container uk-box-shadow-medium">
      <div class="uk-container">
        <nav class="uk-navbar" id="navbar" data-uk-navbar>
          <div class="uk-navbar-left">
            <router-link to="/" v-slot="{ href, navigate }" custom>
              <a class="uk-navbar-item uk-logo" @click="navigate" :href="href"
                ><img src="../../assets/logon2.png" alt="pipette-show logo"
              /></a>
            </router-link>
          </div>

          <div class="uk-navbar-right">
            <div
              :class="{
                'uk-visible@m': true,
                'uk-navbar-item': true,
                'uk-hidden': this.$route.name === 'Home',
              }"
            >
              <router-link
                v-if="showButtons"
                to="/build"
                :class="['uk-button', 'uk-button-small', 'uk-button-primary']"
              >
                Start Build </router-link
              >&nbsp;
              <router-link
                v-if="showButtons"
                to="/show"
                :class="['uk-button', 'uk-button-small', 'uk-button-primary']"
              >
                Start Show
              </router-link>
            </div>

            <header-nav class="uk-navbar-nav uk-visible@m" />
            <div class="uk-hidden@m">
              <a class="uk-navbar-toggle" href="#mobilenav" data-uk-toggle>
                <span data-uk-icon="icon: menu; ratio: 2"></span>
              </a>
              <div
                id="mobilenav"
                data-uk-offcanvas
                data-mode="push"
                data-overlay
              >
                <div class="uk-offcanvas-bar">
                  <button
                    class="uk-offcanvas-close"
                    type="button"
                    data-uk-close
                  ></button>
                  <div class="uk-panel">
                    <ul class="uk-nav uk-nav-primary">
                      <router-link
                        to="/"
                        v-slot="{ href, navigate, isActive }"
                        custom
                      >
                        <li :class="[isActive && 'uk-active']">
                          <a :href="href" @click="navigate">Home</a>
                        </li>
                      </router-link>
                    </ul>
                  </div>
                  <div class="uk-panel">
                    <header-nav class="uk-nav uk-nav-primary" />
                    <div
                      :class="{
                        'uk-margin-small': true,
                      }"
                    >
                      <router-link
                        to="/build"
                        :class="[
                          'uk-button',
                          'uk-button-default',
                          'uk-width-1-1',
                        ]"
                      >
                        Start Build
                      </router-link>
                    </div>
                    <div
                      :class="{
                        'uk-margin-small': true,
                      }"
                    >
                      <router-link
                        to="/show"
                        :class="[
                          'uk-button',
                          'uk-button-default',
                          'uk-width-1-1',
                          'uk-margin-small',
                        ]"
                      >
                        Start Show
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <!--/HEADER-->
    <!-- BODY -->
    <div class="body uk-flex-auto uk-section uk-section-small">
      <!-- data-uk-height-viewport="expand: true"-->
      <div class="uk-container">
        <slot />
      </div>
      <!-- container -->
    </div>
    <!-- section -->
    <!-- /BODY -->

    <!--FOOTER-->
    <pipetteshow-footer />
    <!--/FOOTER-->
  </div>
</template>

<script>
import HeaderNav from "../home/HeaderNav.vue";
import PipetteshowFooter from "../common/PipetteshowFooter.vue";

export default {
  name: "page-layout",
  components: { HeaderNav, PipetteshowFooter },

  props: {showButtons: {type: Boolean, default: true} },
};
</script>

<style lang="scss"></style>
