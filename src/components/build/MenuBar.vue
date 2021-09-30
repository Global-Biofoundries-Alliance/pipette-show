<template>
  <nav class="file-menu" uk-navbar="mode: click">
    <div class="uk-navbar-left">
      <ul class="uk-navbar-nav">
        <li v-for="(list, k) in menu" :key="k">
          <a href="#">{{ k }}</a>
          <div class="uk-navbar-dropdown" :id="'menu_' + k">
            <ul class="uk-nav uk-navbar-dropdown-nav">
              <li v-for="(m, i) in list" :key="i">
                <menu-bar-entry :m="m" :k="k" />
              </li>
            </ul>
          </div>
        </li>

        <!-- Disabled, submenu, lücke entfernen -->
      </ul>
    </div>
  </nav>
</template>

<script>
import MenuBarEntry from "./MenuBarEntry.vue";

export default {
  name: "menu-bar",
  props: ["menu"],

  components: { MenuBarEntry },
};
</script>

<style lang="scss">
.file-menu .uk-navbar-nav > li > a,
.file-menu .uk-navbar-item,
.file-menu .uk-navbar-toggle {
  min-height: 60px;
}
</style>
