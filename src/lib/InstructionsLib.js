import { simpleInstructions } from '../instructions/simple.js';
import { advancedInstructions } from '../instructions/advanced.js';
import { expertInstructions } from '../instructions/expert.js';

//Calculates Statistics for all wells in the build module
function wellStatistics($store) {
  let wells = 0;
  let largestVolume = 0;
  let smallestVolume = 0;

  for (let w = 0; w < $store.state.build.file.values.length; w++) {
    let wellEmpty = true;
    let wellVolume = 0;
    let well = $store.state.build.file.values[w];
    for (let s = 0; s < well.length; s++) {
      //Only include substances that are not zero!
      if (well[s] > 0) {
        wellEmpty = false;
        wellVolume += well[s];
      }
    }

    if (!wellEmpty) {
      wells++;
      if (smallestVolume === 0 || wellVolume < smallestVolume) {
        smallestVolume = wellVolume;
      }
      if (wellVolume > largestVolume) {
        largestVolume = wellVolume;
      }
    }
  }
  return {
    wells: wells,
    largestVolume: largestVolume,
    smallestVolume: smallestVolume,
  };
}

//Breaks the values from the table down into separate instruction-arrays for every substance
function substanceBreakdown($store) {
  let res = [];
  for (let s = 0; s < $store.state.build.file.substances.length; s++) {
    res.push([]);
  }

  for (let w = 0; w < $store.state.build.file.values.length; w++) {
    let well = $store.state.build.file.values[w];
    for (let s = 0; s < well.length; s++) {
      //Only include substances that are not zero!
      if (well[s] > 0) res[s].push({ substance: s, well: w, value: well[s] });
    }
  }
  return res;
}

//Uses the algorithm set in $store.build.instructionsmode to generate pipetting instructions for the file currently opened in $store.build.file
//Returns: Array of Arrays. Each Sub-Array contains the pipetting-instructions for one substance.
function makeInstructions($store) {
  let brokenDownSubstances = substanceBreakdown($store); 

  let instructions;
  switch($store.state.build.instructionsmode)
  {
      case 1:
        instructions = simpleInstructions(brokenDownSubstances);
      break;

      case 2:
	  default:
        instructions = advancedInstructions(brokenDownSubstances,$store);
      break;

      case 3:
        instructions = expertInstructions(brokenDownSubstances);
      break;
  }  

  return instructions;
}

// Flattens the nested instruction-object from makeInstructions into a one-dimensional instructions-array. 
// Adds "change substance"-instructions between the flattened sub-arrays.
// Also adds a "Start"-instruction to the beginning.
function flattenedInstructions($store) {
  let res = [{ operation: "start", name: $store.state.build.file.name }];
  let groupedInstructionsList = makeInstructions($store);

  for (let s = 0; s < groupedInstructionsList.length; s++) {
    let substanceArray = groupedInstructionsList[s];
    console.log(substanceArray);
    res.push({ operation: "substance", substance: s });
    res = res.concat(substanceArray);
  }
  return res;
}

export {
  flattenedInstructions,
  makeInstructions,
  wellStatistics,
};
