<template>

  <page-layout class="manual">
        <header class="uk-text-center">
      <h1 class="uk-heading-primary serifs">
        Manual
      </h1>
    </header>
<div class="uk-container uk-container-small">
<div uk-grid>
<div id="offcanvasnav"  uk-offcanvas>
<div class="uk-offcanvas-bar">
 <ul ref="mobilenav" class="uk-nav uk-nav-default" uk-scrollspy-nav="closest: li; scroll: true">
<!-- li are autoinserted upon mount -->
    </ul>
            <button class="uk-offcanvas-close" type="button" uk-close></button>

        </div>
</div>
<aside id="manualnav" class="uk-width-1-4 uk-visible@m"> 
<div style="position: fixed;">
 <ul ref="nav" class="uk-nav uk-nav-default" uk-scrollspy-nav="closest: li; scroll: true">
<!-- li are autoinserted upon mount -->
    </ul>
</div>

</aside>
<div id="content" class="uk-width-expand">
<div class="uk-flex uk-flex-right">
<button class="uk-button uk-button-primary uk-hidden@m" uk-toggle="target: #offcanvasnav" type="button"><span uk-icon="icon: file-text"></span>
Open TOC
</button>
</div>
    <p class="uk-text-lead">
        Pipette Show is a web application that enhances the pipetting workflow by utilizing your tablet as visual pipetting guidance.
    </p> 
    <p>Pipette Show consists of two modules: Build and Show. The Build module allows to design or change experiments (usually done on a computer). On a tablet, these experiments can then be started in the Show module. After attaching a suitable well plate, the tablet provides visual guidance to make the pipetting job faster and less error-prone.</p>
 <p>  
Most functions of Pipette Show are self-explanatory. For this reasons in most cases, it should be sufficient to read the following Quick-Start Guide. For specific questions, you find detailed manuals for the Build and the Show module below.</p> 
    
<h2 id="quick">Quick Start</h2>

   <dl class="uk-description-list">
    <dt>Design Experiment</dt>
    <dd>Start the Build module to design your experiment. The Build module allows to start from scratch or to import data from different formats (e.g. CSV, XLS(X)). Rudementary import of files created by <a href=https://designer.opentrons.com/>Opentrons Protocol Designer</a> and a soon to be published LCR module of <a href=https://public-diva.jbei.org/>DIVA</a> are implemented to showcase the extensibility of Pipette Show. Within the Build module Substances and Amounts can be changed. Finally, the experiment can either be saved locally, on google drive or on the Pipette Show server (creating a QR Code).
  </dd>
       <dt>Conduct Experiment</dt>
    <dd>Start the Show module on a tablet and load your saved experiment into it. The Show module then asks to adjust the virtual well plate.  <router-link to="/plateholder"> Here, we provide 3D printing files
</router-link> to print a simple but functional plate holder that can be attached to the tablet with a rubber band. After confirming the correct adjustment, the pipetting job is started. In the lower part of the tablet, the module shows the current instruction while backlighting the corresponding well in the upper part of the display. 
  </dd>
       <dt>ENJOY Pipetting :-)</dt>
</dl>


If you have further questions, refer to the following in-detail description of all functions.
    
<h2 id="build">Build module</h2>
The Build module is used to create the experiment that is later loaded into the Show module.

<h3 id="startpage">Start Page</h3>
    On the Start Page, the user can choose whether she wants to create a new project, open a saved Pipette Show project (.pip file) or import data from other formats. Currently, Pipette Show supports the following data formats:
  
  <dl class="uk-description-list">
    <dt>CSV</dt>
    <dd>Please layout your tables using columns for the substance name i.e. Water, Template,... and rows with the desired volumes using a dot (i.e. 1.4) as the decimal separator. Use comma for seperating cells, as is the standard setting for CSV. You can import empty coloumns and use the back-fill option of Pipette Show to fill your total reaction volume to a desired value. 
  </dd>
       <dt>XLS(X)</dt>
      <dd>see description for CSV (which is the more fail-safe option anyway).</dd>
        <dt>JSON (from Diva)</dt>
      <dd>DIVA (Design, Implementation, and Validation Automation) is a web-based software that allows designing DNA constructs. A soon to be published LCR module allows to generate pipetting instructions for DNA assemblies. Pipette Show can import pipetting projects created in DIVA and exported as .json.</dd>
</dl>

    
<h3 id="propertiespage">Properties Page</h3>
This page allows setting the basic properties of an experiment, which includes the project name and the format of the well plate (24,96,384). Additionally, the user can select between two instruction generation algorithms.
    <dl class="uk-description-list">
    <dt>Simple</dt>
    <dd>This algorithm mimics the conventional pipetting workflow. Each substance is pipetted well by well, which means the pipetting volume may need to be changed often. However, the instructions are simple and easily comprehensible.
  </dd>
       <dt>Advanced</dt>
        <dd>This algorithm groups wells with the same volume, which means that fewer volume changes are necessary. This enables a significant speed-up of the work while also reducing the likeliness of volume changing errors.</dd>
</dl>
    
<h3 id="substancepage">Substance Page</h3>
On this page, the substances that are used during the experiment are defined. Besides naming and reordering, it is also possible to assign specific colours to each substance which allows for additional visual guidance. <br>
    To add a Substance, click the "+" button, to delete a Substance, click the trash symbol to the right of the name. To change the colour, click the respective square to the left of the name. To change the order of the substances, press and hold the arrow to the left of the coloured square and drag the substance to the new position.
    
<h3>Well Contents Page</h3>
    
This page is the main working unit of the Build module. It provides a spreadsheet to modify the amounts of each substance per well. The label on the left indicates for each line the corresponding well. For each substance that was added on the Substance Page, the spreadsheet provides a separate row. To modify the amount of a specific substance, click on the corresponding cell and change the value. As known from conventional spreadsheet programmes, the spreadsheet provides a fill handle that can be used to automatically generate data based on a defined pattern. <br>
    
Additionally, the page provides two elaborate functions to carry out frequently needed tasks:
 <dl class="uk-description-list">
    <dt>Apply Gradient</dt>
    <dd>This function is only available if a full column is selected by clicking on the respective substance name.<br>
 Upon selecting this function, a popup asks for a start value and an end value. The cells are auto-filled with a gradient, where the step size is auto-calculated based on the number of rows.
  </dd>
       <dt>Back-fill with substance</dt>
        <dd>
            This function is only available if a full column is selected by clicking on the respective substance name.<br>
            After having defined the number of specific ingredients, one often needs to back-fill the wells to the same volume. The back-fill function calculates the remaining volume of each well to reach a defined target volume (difference between target volume and sum over respective row). </dd>
</dl>   
<h3 id="summarypage">Summary Page</h3> 

The Summary Page provides three different tabs: The first tab lists some statistics about the experiment, like e.g. smallest and largest volume or the number of necessary pipetting operations. 
    The second tab shows a representation of the well plate with a colour-coded visualisation of the fraction of substances per well. 
    On the last tab, it is possible to preview the pipetting instructions that can later be loaded into the Show module. 
    
<h3 id="exportpage">Export Page</h3>
    
The last page (Export Page) offers different options to export the just created experiment. Currently, Pipette Show offers three different ways to export the experiment:
   <dl class="uk-description-list">
    <dt>Save as .PIP or .CSV file</dt>
    <dd>Using this option, the experiment can be downloaded as a .PIP (Pipette Show) or .CSV (comma separated values). This allows the user to save the file on the hard disk or e.g. removable media for readily repeating the same experiment at a later timepoint. 
  </dd>
       <dt>Save on google drive</dt>
        <dd>
            Using this option, the generated instructions can be saved on google drive. Saving the file on cloud storage simplifies the file transfer to a tablet device. Some permission need to granted.</dd>
       <dt>Create transfer-code</dt>
        <dd>
            This is the most convenient option to transfer an experiment to the show module. Using this option, the generated experiment is saved on the Pipette Show server and a QR-code generated. Scanning this QR code with the camera of a tablet allows to directly open the experiment within the show module. <b>Note that the experiment is only saved for three days. It might hence make sense to additionally save the experiment using one of the other export options.</b> </dd>
</dl>   
    
    
    
<h2 id="show">Show module</h2>
<p>
The Show module is usually opened on a tablet device and visualizes the experiments created in the Build module. 
</p>
    
After opening the Show module, it asks whether it should enter the fullscreen mode. It's recommended to start the fullscreen, since, after mounting the well plate, there is no possibility to run any other app anyway. <br>
If the tablet is in landscape orientation, Pipette Show now asks to rotate the tablet by 90°. Otherwise, the plate does not fit onto the screen.
<br>
<h3 id="loadexperiment">Load Experiment</h3>
    The module now asks for the source to load a protocol. As described in the manual for the Build module, there are currently three possible ways to transfer an experiment from the Build to the Show module. 
 <dl class="uk-description-list">
    <dt>Transfer Code (QR Code)</dt>
     <dd>
            This is the most convenient option to transfer an experiment to the show module, it, however, requires that a QR Code was generated during the build of the experiment. By scanning this QR code with the camera of a tablet the created experiment is directly loaded into the Show module. If it is not possible to scan the code, Pipette Show also allows to upload a figure of the code or to enter it manually.</dd>
     <dt>Load from google drive</dt>
        <dd>
            Using this option, the generated instructions can be loaded from google drive. </dd>
       <dt>Upload .PIP File</dt>
        <dd>Using this option, a locally saved experiment can be imported into the Show module. This means that the user needs to transfer the file from the device where the Build module was started to the tablet.
  </dd>
</dl>   
    
<h3 id="mountwellplate">Mounting the well plate</h3>
 After selecting and importing the correct file, Pipette Show shows the corresponding well-plate in the upper part of the display while showing the instructions in the lower part. It's now time to mount the well-plate to the tablet.
  The recommended way to do this is via a 3d-printed plate holder<router-link to="/plateholder"> (Download here)
</router-link>. 
    <br>
 Under the <b>Settings</b> icon (gears), Pipette Show offers a mode to adjust the virtual plate to the adjusted plate holder. After activating this mode, the virtual plate can be dragged until its dimensions match the actual plate. Upon a click on <b>Save</b>, the settings are stored locally and do not need to be readjusted even if the browser is closed.
  
  
    <h3 id="enjoypipetting">Enjoy Pipetting</h3>
    With this, everything is ready to start pipetting. Every time the <b>Next</b> button is pressed, the next instruction is shown and, if applicable, the corresponding well is highlighted. For left-handed users, there is also a mode to move the <b>Next</b> button to the right (can be found in the <b>Settings</b> menu. Pro-tip: If required, instead of hitting next, you can buy a bluetooth pedal to execute the next action with your feet. Just search the internet for "bluetooth pedal page turner".

<h2 id="citeus">Cite Pipette Show</h2>
If you like Pipette Show please consider citing our paper:  <br>
<p class="uk-alert uk-padding uk-alert-primary">
    Falk, J., Mendler, M., Kabisch, J., 2022. <cite>Pipette Show: An Open Source Web Application to Support Pipetting into Microplates</cite>. ACS Synth. Biol. <a href="https://doi.org/10.1021/acssynbio.1c00494">https://doi.org/10.1021/acssynbio.1c00494</a>
    </p>    
    
<h2 id="furtherquestions">Further Questions</h2>
<p>If anything is unclear please do not hesitate to contact the developers via mail (pipette-show@kabisch-lab.de) or open an issue on our developement page.</p>
    </div></div></div>

  </page-layout>
</template>

<script>
import PageLayout from "../components/home/PageLayout.vue";

export default {
  name: "manual",
  components: { PageLayout },

   mounted: function() {
    const nav = this.$refs.nav
    const mobilenav = this.$refs.mobilenav
    const headings = document.querySelectorAll(`#content h2, #content h3`);
    let lastli;
    let lastlimob;
    let lastul;
    let lastulmob;
      headings.forEach(value => {
        
        if (value.tagName === 'H2') {
          
          
          const li = document.createElement('li');

          lastul = undefined;
          lastulmob = undefined;
          const a = document.createElement('a');
          a.innerHTML = value.textContent;
          a.href = `#${value.id}`;
    
          li.appendChild(a);
          lastlimob = li.cloneNode(true);
          lastli = li;
          mobilenav.appendChild(lastlimob);
          nav.appendChild(lastli);
          
        } else if (value.tagName === 'H3') {
            if (lastli){ //Otherwise something is strange... 
                
                if(!lastul){//means there is not yet a sub-nav
                    lastul = document.createElement('ul');
                    lastul.classList.add("uk-nav-sub");
                    lastulmob = lastul.cloneNode(true);
                    lastli.appendChild(lastul);
                    lastli.classList.add("uk-parent");
                    lastlimob.appendChild(lastulmob);
                    lastlimob.classList.add("uk-parent");
                }
                
                
                const li = document.createElement('li'); 
                const a = document.createElement('a');
                a.innerHTML = value.textContent;
                a.href = `#${value.id}`;

                li.appendChild(a);

                lastul.appendChild(li.cloneNode(true));
                lastulmob.appendChild(li.cloneNode(true));
            //nav.appendChild(li);
            }
                
        }
      
});


    },

};
</script>

<style lang="scss">
.manual {
    line-height: 1.5;
}
</style>
