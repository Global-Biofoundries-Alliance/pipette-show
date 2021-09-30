function calcColor(name) {
  let offset = "40";
  //let cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase().split('');
  let cleanName = name.split("");
  let charSum = 0;
  cleanName.forEach(function (char) {
    //charSum += char.charCodeAt(0) - 64;
    charSum += char.charCodeAt(0);
  });
  let sector = charSum % 6;
  charSum = charSum % 255;
  let sectorValue = charSum.toString(16);
  sectorValue = sectorValue.length == 2 ? sectorValue : "0" + sectorValue;
  
  //console.log("sector: " + sector + " sum " + sectorValue);
  
  switch (sector) {
    case 0:
      return "#" + "ff" + sectorValue + offset;
    case 1:
      return "#" + "ff" + offset + sectorValue;
    case 2:
      return "#" + sectorValue + offset + "ff";
    case 3:
      return "#" + sectorValue + "ff" + offset;
    case 4:
      return "#" + offset + sectorValue + "ff";
    case 5:
      return "#" + offset + "ff" + sectorValue;
  }
}

export { calcColor };