<template>
  <page-layout class="plateholder">
    <header class="uk-text-center">
      <h1 class="uk-heading-primary serifs"> Plate Holder </h1>
      <div class="uk-text-lead uk-width-2xlarge uk-margin-auto"> Pipette Show provides a digital design file to print your own plate holder. </div></header>
      

      <div class="uk-container uk-container-small">
        <div class="uk-margin-top" uk-grid>
        <div class="uk-width-1-3@s uk-flex uk-flex-middle uk-flex-center">
          <div>
          <a href="/downloads/plate_holder.scad"
        
        class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom"
      >
        Download .scad File
      </a>
       <a href="/downloads/plate_holder.stl"
        
        class="uk-button uk-button-primary uk-width-1-1"
      >
        Download .stl File
      </a>
      <p>
   The easiest way to attach this holder is by means of a rubber band that is stretched along under the tablet. 
   </p>
          </div>
      </div>
        <div class="uk-width-2-3@s">
        <img class="uk-width-1-1" src="../assets/3dprint/plate_render.png" alt=""/>
        </div>
        </div>
      
</div>


  </page-layout>
</template>

<script>
import PageLayout from "../components/home/PageLayout.vue";

export default {
  name: "contact",
  components: { PageLayout },

};
</script>

<style lang="scss">
.plateholder {
  
}
</style>
