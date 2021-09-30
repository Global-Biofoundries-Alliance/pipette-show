<template>
  <div id="install-dialog" v-if="showInstallDialog">      
    <p>
      Seems like you're enjoying PipetteShow. Do you want to add it to your Home-Screen?
    </p>
    <div>
      <vibration-button @click="abortPipetting">No Thanks</vibration-button>
      <vibration-button @click="installPWA">Yes Please</vibration-button>      
    </div>  
  </div>  

  <div id="finished-dialog" v-else>
    <p>
      Finished!<br/>
      Do you want to repeat the experiment or load a new one?
    </p>
    <div>
      <vibration-button @click="restartPipetting">Repeat</vibration-button>
      <vibration-button @click="stopPipetting">Load new Experiment</vibration-button>
    </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";

export default {
  name: "finished-dialog",
  components: { VibrationButton },

  data() {
    return {deferredPrompt: undefined, showInstallDialog: false};
  },

  mounted: function() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;      
    });
  },

  methods: {
    restartPipetting: function() {
      this.$store.commit('show/openDialog', 'none');
    },

    installPWA: function() {
      // Show the install prompt
      this.deferredPrompt.prompt();      
      this.deferredPrompt = undefined;
    },

    abortPipetting: function() {
      this.deferredPrompt = undefined;
      this.showInstallDialog = false;
      this.$store.commit('show/abortPipetting');
    },

    stopPipetting: function() {
      if(this.deferredPrompt === undefined)
      {
        this.$store.commit('show/abortPipetting');    
      }
      else
      {
        this.showInstallDialog = true;
      }
    },
  }
};
</script>

<style lang="scss">
@import "./dialogs.scss";

#finished-dialog, #install-dialog {
  @include show-dialog;  
}
</style>
