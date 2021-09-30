<template>
  <page-layout class="home" :show-buttons="false">
    <header class="uk-text-center">
      <h1 class="uk-heading-primary serifs">
        Opening File
      </h1>
      <div class="uk-text-lead uk-width-2xlarge uk-margin-auto">
        In which module do you want to open the file?        
      </div><br/>
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
          :href="buildHref"
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
          :href="showHref"
          slide_direction="right"
        >
          Load your experiment into the Show module, put a well plate on your
          tablet and start enjoying pipetting.
        </home-card>
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



  mounted: function() {
    //Check if a queryString from Google Drive is present
    if(this.$route.query !== undefined && this.$route.query.state !== undefined)
    {
      let state = JSON.parse(this.$route.query.state);

      if(state.action === "open")
      {
        //this.$store.commit("build/createNewfile", {name: "New_Google_Drive_Project"});
        //this.page = 'properties';        

        console.log('opening file', state);
      }      
    }      
  },

  computed: {
    buildHref: function() {
      return 'build?state='+this.$route.query.state;
    },

    showHref: function() {
      return 'show?state='+this.$route.query.state;
    }
  },

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

  p {
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
