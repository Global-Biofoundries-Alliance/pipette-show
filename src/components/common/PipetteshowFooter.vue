<template>
  <footer class="uk-section-secondary">
    <div
      class="uk-section uk-section-xsmall"
      style="background-color: rgba(0, 0, 0, 0.15)"
    >
      <div class="uk-container">
        <div
          class="uk-grid uk-child-width-1-2 uk-text-center uk-text-left@s uk-flex uk-flex-center"
          data-uk-grid
        > 

<div
            :class="{
              'uk-text-small': true,
              'uk-text-muted': true,
              'uk-text-center': true,              
              'uk-visible@s': small === true,
            }"
          >
            Created with <span data-uk-icon="heart"></span> by
            <a
              href="https://www.ipkm.tu-darmstadt.de/research_ipkm/team_ipkm/team_ipkm_details_45248.de.jsp"
              class="uk-link-muted"
              >Marc Mendler<span uk-icon="icon: link; ratio: 0.9"></span></a
            >,
            <a
              href="https://www.jacobs-university.de/directory/falk"
              class="uk-link-muted"
              >Johannes Falk<span uk-icon="icon: link; ratio: 0.9"></span></a
            >,
            <a href="http://kabisch-lab.de" class="uk-link-muted"
              >Johannes Kabisch<span uk-icon="icon: link; ratio: 0.9"></span
            ></a>
          </div>

            <div
            class="uk-text-small uk-text-muted uk-text-center uk-text-right@s"
          >
<router-link
  to="/imprint"
>
 Legal Notice / Impressum
</router-link><br>
<router-link
  to="/privacy"
>
 Privacy Policy / Datenschutzerklärung
</router-link>
<br>
<a href="licenses.html" class="uk-link"
              >Third Party Notice</a> 
          </div>


          
          </div>
          
        
<div
            :class="{
              'uk-child-width-1-3': true,

              'uk-width-1-2@l' : true,
              'uk-width-2-3@s' :true,
              'uk-width-1-1' : true,
              'uk-visible@s': small === true,
              'uk-margin-small':true
            }"
            data-uk-grid
          >
            <a class="uk-logo" href="https://www.tu-darmstadt.de/"
              ><img class="uk-logo" alt="" src="../../assets/tuda.png"
            /></a>
            <a class="uk-logo" href="https://www.jacobs-university.de"
              ><img class="uk-logo" alt="" src="../../assets/jacobs.jpg"
            /></a>
            <a class="uk-logo" href="https://www.ntnu.edu/"
              ><img class="uk-logo" alt="" src="../../assets/ntnu.png"
            /></a>
          </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "pipetteshow-footer",
  components: {},
  props: ["small"],
};
</script>

<style lang="scss"></style>
