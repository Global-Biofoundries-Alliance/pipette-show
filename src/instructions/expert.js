//Creates instructions according to the expert instructions generation algorithm
function expertInstructions(brokenDownSubstances)
{
  for(let i = 0; i < brokenDownSubstances.length; i++)
  {
    let grouped = groupAmountsAsObject(brokenDownSubstances[i]);
    let counts = getVolumeWellCounts(grouped);

    //let res = eliminateRarelyUsedVolumes(grouped, 3);

    //findOptimalVolumes();

    findOptimalVolumes(counts, 3);
  
  }



  return brokenDownSubstances;
}



//1. Preprocess wells to split rarely used volumes if useful
  //Group all wells by volumes
  //Identify all volumes that don't justify an own pipetting iteration
  //Split these volumes and sort them into the original array

//2. Group similar instructions to matching multi-channel-instructions

//3. Normal advanced instruction generation




/*

//Flattens the complex sorted and grouped instruction-object into an array of arrays, where each sub-array contains all the pipetting-instructions for one substance
function flattenedInstructionsPerSubstance($store) {
  let res = [];
  let groupedInstructionsList = groupedInstructions($store);

  for (let s = 0; s < groupedInstructionsList.length; s++) {
    let substanceArray = groupedInstructionsList[s];
    let substanceInstructions = [];
    for (let v = 0; v < substanceArray.length; v++) {
      let valueList = substanceArray[v];
      for (let i = 0; i < valueList.length; i++) {
        substanceInstructions.push(valueList[i]);
      }
    }

    res.push(substanceInstructions);
  }
  return res;
}*/

//Creates a multidimensional instructions-array where similar volumes are grouped while instructions are still sorted by ascending well-number if possible
/*function groupedInstructions(brokenDownSubstances) {  
  let res = [];
  for (let s = 0; s < brokenDownSubstances.length; s++) {
    res.push(groupAmountsAsObject(brokenDownSubstances[s]));
  }
  return res;
}*/


//Splits all volumes that are easier split than the pipetting volume is adjusted
//adjustmentWork: Penalty for adjusting the pipetting volume. Typically: 3
/*function eliminateRarelyUsedVolumes(singleSubstanceDictionary, adjustmentWork) 
{
  //Save all volumes that will NOT be splitted.
  let unit = getSmallestUnit(singleSubstanceDictionary);
  let allowedVolumes = [unit];

  for(let key in singleSubstanceDictionary)
  {
    //Always inlude the smallest volume
    if(key === unit)
    {
      console.log('unit', key);
      continue;
    }

    //Calculate the number of pipetting operations that would be necessary to fill the current volume using only the already allowed volumes
    let operations = splitVolume(key, allowedVolumes);
    
    //Find the number of wells that need this volume
    let wells = singleSubstanceDictionary[key].length;
    
    //Calculate the total number of operations to fill all wells with this volume using only the already allowed volumes
    let totalOperations = operations * wells;

    //If the total number of operations is smaller than the threshold => make the split
    if(totalOperations < adjustmentWork)
    {
      //Split the volumes
      //TODO
      console.log('split', key);
    }
    else //Don't split the volume => add it to the list of allowed volumes
    {
      console.log('add', key);
      allowedVolumes.push(key);
    }
  }
}

//Finds out how the given volume is best split into the allowed volumes. Assumes that the allowed volumes are sorted ascendingly.
//Returns: Number of volumes the given volume is split into.
function splitVolume(volume, allowedVolumes)
{
  let i = allowedVolumes.length - 1;
  let numSplits = 0;
  while(volume > 0)
  {
    if(volume >= allowedVolumes[i])
    {
      volume -= allowedVolumes[i];      
      numSplits++;
    }
    else
    {
      i--;
    }
  };

  return numSplits;
}


*/

//30, 80, 90, 100

//10, 20, 80      => 2, 1, 2, 2
//30, 80, 90, 100 => 1, 1, 1, 1

//30, 60, 90

//30, 60, 90      => 1, 1, 1      => 3 + 3x   => 12  9  6
//30, 60          => 1, 1, 2      => 4 + 2x   => 10  8  6
//30              => 1, 2, 3      => 6 + x    => 9   8  7
//==> Es ist auch super wichtig, wie oft ein volume vorkommt!!!

/*  Gegeben: volume => #wells Objekt
    Gibt aus: array(volumes)
*/



//1. Find very frequent volumes that will be included in any case 

//2. Calculate The costs of a binary decomposition of the remaining volumes

//3. Try all combinations that may be cheaper than the binary decomposition
function findOptimalVolumes(singleSubstanceVolumeWellCounts, newVolumePenalty)
{

  //Find all volumes that are so frequent that they will be included in any case
  let allowedVolumes = [];
  let otherVolumes = [];
  for(let key in singleSubstanceVolumeWellCounts)
  {
    //If  there are more wells with this volume than a new volume costs, always keep this volume
    if(singleSubstanceVolumeWellCounts[key] > newVolumePenalty)
    {
      allowedVolumes.push(Number(key));
    }
    else
    {
      otherVolumes.push(Number(key));
    }
  }

  //Get the smallest unit that can be used to build all other volumes. This is the basis element (=1) for the following binary decomposition.
  let unit = getSmallestUnit(singleSubstanceVolumeWellCounts);
  
  //Find all values needed for a binary decomposition of otherVolumes
  let binaryElements = [];
  let el = unit;
  let maxVolume = otherVolumes[otherVolumes.length - 1];
  while(el < maxVolume)
  {
    binaryElements.push(el);
    el *= 2;
  }


  
  //Combine the binary values with the allowed volumes to get a candidate list for the split volumes
  let candidateVolumes = allowedVolumes.concat(binaryElements);

  //Remove duplicates and sort
  candidateVolumes = [...new Set(candidateVolumes)];
  candidateVolumes = candidateVolumes.sort((a, b) => a-b);


  let costs = calculatePipettingCosts(singleSubstanceVolumeWellCounts, candidateVolumes, newVolumePenalty);






  //Combine the binary values with the volumes to split to get a candidate list for the split volumes
  /*let candidateVolumes = otherVolumes.concat(binaryElements);

  //Remove duplicates and sort
  candidateVolumes = [...new Set(candidateVolumes)];
  candidateVolumes = candidateVolumes.sort((a, b) => a-b);

*/
  //let sublists = generateSublists([1,2,3]);

  console.log('split into (allow, other)', allowedVolumes, otherVolumes, binaryElements, candidateVolumes, costs);


  //TODO: process all other volumes...


}


/*  
  
  [10, 20, 50] -> [80, 20, 30, 40] 

  //Erstmal alle rauswerfen, die man bereits darstellen kann

  -> [40]

  //
    
*/


//1,2,3,4,...,384




/*
// Generates all possible sublists of the given list. Also includes sublists where elements in the middle are missing.
// Example: (1, 2, 3) => ((1), (2), (3), (1,2), (1,3), (2,3), (1,2,3))
function generateSublists(list)
{
  let res = [];
  for(let s = 0; s < list.length; s++)
  {
    for(let e = s; e < list.length; e++)
    {
      res.push(list.slice(s, e + 1));
    }
  }

  return res;
}
*/


// Calculates the pipetting costs for the given volume-well-counts. Always splits wells into the volumes specified in allowedVolumes even if this is more expensive. If any volume can not be split into the given allowed volumes, the method aborts and returns false.
// singleSubstanceVolumeWellCounts: (volume, #wells) object
// allowedVolumes: Array with all allowed pipetting volumes in which the wells will be split if cheaper
// newVolumePenalty: Penalty per volume
// maxValue: If the costs are larger than maxValue, the calculation aborts and returns undefined (saves performance)
function calculatePipettingCosts(singleSubstanceVolumeWellCounts, allowedVolumes, newVolumePenalty, maxValue)
{
  //Base-costs per substance
  let costs = allowedVolumes.length * newVolumePenalty;  
  if(maxValue !== undefined && costs > maxValue)
    return;

  //Costs for pipetting
  for(let volume in singleSubstanceVolumeWellCounts)
  {
    //Determine how the current volume can be split
    let split = splitVolume(volume, allowedVolumes);

    if(split === false)
      return false;

    //Costs are given by the number of split-volumes times the number of wells where this split is used
    costs += split.length * singleSubstanceVolumeWellCounts[volume];

    if(maxValue !== undefined && costs > maxValue)
      return;
  }

  return costs;
}


// Returns how the given volume can be split into the given allowed volumes whitout using a volume twice. (This restriction is in place to prevent confusion during the pipetting process which stems from having to pipette the same volume into the same well twice)
// allowedVolumes: Allowed volumes to split the given volume, in ascending order
// returns: array of volumes that are needed to split the given volume or false if the volume can not be split using the fiven basis

//TODO: Backtracking!!
function splitVolume(volume, allowedVolumes)
{
  let res = [];
  for(let i = allowedVolumes.length - 1; i >= 0; i--)
  {
    let vol = allowedVolumes[i];
    if(volume >= vol)
    {
      volume -= vol;
      res.push(vol);
    }

    if(volume == 0)
    {
      return res;
    }
  }

  return false;
}


//Determines wether all volumes in splitVolumes are splittable using the given allowedVolumes (see isSplittable for details)
/*function isCompleteBasis(splitVolumes, allowedVolumes)
{
  for(let i = 0; i < splitVolumes.length; i++)
  {
    if(!isSplittable(splitVolumes[i], allowedVolumes))
      return false;
  }

  return true;
}


//Returns wether the given volume can be split into the given allowed volumes whitout using a volume twice. (This restriction is in place to prevent confusion during the pipetting process which stems from having to pipette the same volume into the same well twice)
//allowedVolumes: Allowed volumes to split the given volume, in ascending order
function isSplittable(volume, allowedVolumes)
{
  for(let i = allowedVolumes.length; i >= 0; i--)
  {
    if(volume >= allowedVolumes[i])
      volume -= allowedVolumes[i];

    if(volume == 0)
      return true;
  }

  return false;
}*/

// Returns the smallest volume that is a divider of every volume used in this experiment
function getSmallestUnit(singleSubstanceDictionary)
{
  let keys = Object.keys(singleSubstanceDictionary);
  let unit = keys[0];

  for(let i = 0; i < keys.length; i++)
  {
    if(keys[i] % unit !== 0)
    {
      unit = gcd(unit, keys[i]);
    }
  }

  return Number(unit);
}


//Returns an object in the form (volume, #wells) that tells in how many wells the different volumes should be filled
function getVolumeWellCounts(groupedSubstance)
{
  let ret = [];
  for(let key in groupedSubstance)
  {
    ret[key] = groupedSubstance[key].length;
  }
  return ret;
}


//Groups together all pipetting operations inside the given substance where the same amount of liquid is transferred
//Returns an object of the form (volume => array of pipetting instructions)
function groupAmountsAsObject(singleSubstanceArray) {
  //Group everything in an object (map) where keys are the substance-amounts
  let res = {};
  for (let i = 0; i < singleSubstanceArray.length; i++) {
    let key = volumeToKey(singleSubstanceArray[i].value);

    if (res[key] === undefined) {
      res[key] = [];        
    }

    res[key].push(singleSubstanceArray[i]);
  }
  
  return res;
}

//Makes a key out of the given volume (multiplies by 10 and removes all remaining decimal values)
function volumeToKey(volume)
{
  return Number((volume*10).toFixed(0));
}


//Returns the greatest common divider of the given numbers
function gcd(num1, num2)
{  
  //Loop till both numbers are not equal
  while(num1 != num2){
    
    //check if num1 > num2
    if(num1 > num2){
      //Subtract num2 from num1
      num1 = num1 - num2;
    }else{
      //Subtract num1 from num2
      num2 = num2 - num1;
    }
  }
  
  return num2;
}


export {expertInstructions};