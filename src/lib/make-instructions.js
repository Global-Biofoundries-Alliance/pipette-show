//Creates instructions according to the simple instructions generation algorithm
function simpleInstructions(brokenDownSubstances)
{
  return brokenDownSubstances;  
}

//Creates instructions according to the advanced instructions generation algorithm
function advancedInstructions(brokenDownSubstances)
{
  return groupedInstructions(brokenDownSubstances);
}

//Creates instructions according to the expert instructions generation algorithm
function expertInstructions(brokenDownSubstances)
{
  return groupedInstructions(brokenDownSubstances);  
}

//Creates a multidimensional instructions-array where similar volumes are grouped while instructions are still sorted by ascending well-number if possible
function groupedInstructions(brokenDownSubstances) {  
  let res = [];
  for (let s = 0; s < brokenDownSubstances.length; s++) {
    res.push(sortBySmallestWell(groupAmounts(brokenDownSubstances[s])));
  }
  return res;
}

//Group together all pipetting operations inside the same substance where the same amount of liquid is transferred
function groupAmounts(singleSubstanceArray) {
  //Group everything in an object (map) where keys are the substance-amounts
  let res = {};
  for (let i = 0; i < singleSubstanceArray.length; i++) {
    if (res[singleSubstanceArray[i].value] === undefined) {
      res[singleSubstanceArray[i].value] = [
        { operation: "volume", value: singleSubstanceArray[i].value },
      ];
    }

    res[singleSubstanceArray[i].value].push(singleSubstanceArray[i]);
  }

  //Convert object (map) to array
  return Object.values(res);
}

//Sort the amount-grouped instructions for one substance by the smallest involved well (such that pipetting-order is in ascending well numbers if possible)
function sortBySmallestWell(singleGroupedSubstance) {
  singleGroupedSubstance.sort(function (a, b) {
    let smallestWellA = getSmallestWell(a);
    let smallestWellB = getSmallestWell(b);
    return smallestWellA - smallestWellB;
  });
  return singleGroupedSubstance;
}

//Returns the smallest used well in the given group of pipetting-instructions
function getSmallestWell(instructionGroup) {
  let ret = instructionGroup[0].well;
  for (let i = 0; i < instructionGroup.length; i++) {
    if (instructionGroup[i].well < ret) {
      ret = instructionGroup[i].well;
    }
  }
  return ret;
}


export {simpleInstructions, advancedInstructions, expertInstructions};