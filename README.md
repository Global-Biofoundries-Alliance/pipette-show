# Pipette Show - Because Pipetting is Complicated Enough
### Pipette Show is a small tool that enhances your pipetting workflow.

- If you find this work helpful please consider citing our paper:  

    Falk, J., Mendler, M., Kabisch, J., 2022. Pipette Show: An Open Source Web Application to Support Pipetting into Microplates. ACS Synth. Biol. [https://doi.org/10.1021/acssynbio.1c00494](https://doi.org/10.1021/acssynbio.1c00494)


![show_holder_tablet](https://user-images.githubusercontent.com/57171901/135596491-a7e8fa46-5130-4d96-ab4d-ebf7022cefc9.jpg)

- [Files for 3D printed holder](https://github.com/Global-Biofoundries-Alliance/pipette-show/tree/main/public/downloads)

- External link to the similiar ["iPipet" open source project](https://github.com/dinovski/ipipet) (Thanks [Yaniv Erlich](https://twitter.com/erlichya/status/1482398166930665476?cxt=HHwWiMC9uevRxJIpAAAA) for pointing this out)



## Project setup
For detailed instructions, see the file [Server-Setup.txt](https://github.com/Global-Biofoundries-Alliance/pipette-show/blob/main/Server-Setup.txt)

```
npm install
```
Remember to put your Google Drive API-Keys into a .env.local-file at project root level (see .env.local.example). **(The google drive feature might be depricated soon, since we do not have the time to keep the Oauth-requirements from Google up to date.)**

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
