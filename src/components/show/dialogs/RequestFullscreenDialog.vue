<template>
  <div v-if="!closed && instructionsLoaded" id="request-fullscreen-dialog">
    <p>PipetteShow works best in fullscreen mode.<br/> Start fullscreen mode now?</p>      
    <div>
      <vibration-button @click="ignore">Ignore</vibration-button>      
      <vibration-button @click="startFullscreen">Yes</vibration-button>      	  
    </div>
  </div>
</template>

<script>
import VibrationButton from "../VibrationButton.vue";
import { mapGetters } from "vuex";

export default {
  name: "request-fullscreen-dialog",
  components: {VibrationButton},

  data() {
    return {closed: false};
  },
  
  mounted: function() {
	document.onfullscreenchange = this.changedFullScreenMode;
	this.changedFullScreenMode();
	
	//Try launching fullscreen (does not work if this was not triggered by a user gesture...)
	//this.startFullscreen();
  //-> to disturbing...
  },

 computed: {
    ...mapGetters({      
      instructionsLoaded: "show/instructionsLoaded",
    }),
  },


  methods: {
    changedFullScreenMode: function() {
	  if(document.fullscreenElement === null)
	  {		
	    this.closed = false;
	  }
	  else
	  {
		this.closed = true;
	  }
	},
	
	ignore: function() {
      this.closed = true;
    },
	
	startFullscreen: function() {
		try
		{
			launchFullscreen(document.documentElement);	  
		}
		catch(_)
		{
			//Does not work if not triggered by a user gesture...
			console.log('Cant open fullscreen mode without user gesture...');
		}
	}
  },

};

// Launch full screen
function launchFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
</script>

<style lang="scss">
@import "./dialogs.scss";

#request-fullscreen-dialog {
  @include show-dialog;    
}

@media (display-mode: fullscreen) {
    #request-fullscreen-dialog {
        display: none;
    }
}
</style>
