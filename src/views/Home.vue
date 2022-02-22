<template>
  <page-layout class="home" :show-buttons=true>
    <div class="uk-container">
     
    <header class="uk-text-center">
      <h1 class="serifs">
        Because Pipetting is Complicated Enough
      </h1>
      <div class="uk-text-lead uk-width-2xlarge uk-margin-auto">
        Pipette Show is a small tool that enhances your pipetting workflow. It
        consists of two modules: <b>Build</b> and <b>Show</b>.
      </div>
    </header>

    <div
      class="uk-margin-small-top uk-child-width-1-2@m"
      data-uk-height-match="target: .card-text"
      data-uk-grid
    >
      <div>
        <home-card
          class="first-step"
          number="1"
          :src="require('../assets/build.png').default"
          caption="Start Build Module"
          title="Build"
          href="build"
          slide_direction="left"
        >
          Design you experiments online or upload a spreadsheet, CSV or JSON and
          export it as a pip-file or transfer via 2D barcode.
        </home-card>
      </div>
      <div>
        <home-card
          number="2"
          :src="require('../assets/show.png').default"
          caption="Start Show Module"
          title="Show"
          href="show"
          slide_direction="right"
        >
          Load your experiment into the Show module, put a well plate on your
          tablet and start enjoying pipetting.
        </home-card>
      </div>
    </div>
    <div class="uk-section">
     <div class="uk-container uk-margin-top">
         <div class="uk-text-lead uk-text-center uk-margin-auto">
           If you like Pipette Show please consider citing our paper:  <br>
<p class="uk-alert uk-padding uk-alert-primary">
    Falk, J., Mendler, M., Kabisch, J., 2022. <cite>Pipette Show: An Open Source Web Application to Support Pipetting into Microplates</cite>. ACS Synth. Biol. <a href="https://doi.org/10.1021/acssynbio.1c00494">https://doi.org/10.1021/acssynbio.1c00494</a>
    </p>
          </div>
          <br>
         
         <div class="uk-text-lead uk-width-2xlarge uk-text-center uk-margin-auto">
           Download 3D printing files for simple plate holder
        <router-link
        to="/plateholder"
      >
      here
      </router-link>
         </div>
     </div>
     </div>
    
    <!--<div class="uk-section uk-section-large">
      <div class="uk-container">
         
      
      
     <div uk-grid>
        <div class="uk-width-1-3@s">
          


        </div>
               <div class="uk-width-2-3@s">
        </div>
      </div>
        </div>

    </div>-->

      </div>
      <div class="uk-container">
       <div class="uk-section uk-section-secondary uk-light uk-margin">
    <div class="uk-container">
      <h3 class="uk-text-center serifs uk-h2">Get an impression of Pipette Show's Features</h3>
<video class="uk-padding" src="../assets/pipette_show_demo_video.mp4" loop muted playsinline uk-video="autoplay: inview" controls></video>
</div>
    </div>
</div>
       
    
  </page-layout>
</template>

<script>
import PageLayout from "../components/home/PageLayout.vue";
import HomeCard from "../components/home/HomeCard.vue";

export default {
  name: "home",
  components: { PageLayout, HomeCard },

  methods: {
    openPage: function (page) {
      this.$router.push(page);
    },
  },
};
</script>

<style lang="scss">
.home {
  h1 {
    color: #7d8284;
  }

  p:not(.uk-alert) {
    color: #7d8284;
  }
  .uk-label {
    font-size: 20px;
  }

  .uk-logo > img {
    max-height: 70px;
  }

  @media (min-width: 960px) {
    .first-step::after {
      content: "";
      position: absolute;
      top: 50%;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline fill='none' stroke='%23000' stroke-width='1.03' points='7 4 13 10 7 16'%3E%3C/polyline%3E%3C/svg%3E")
        no-repeat;
      width: 50px;
      right: -40px;
    }
  }
}
</style>
