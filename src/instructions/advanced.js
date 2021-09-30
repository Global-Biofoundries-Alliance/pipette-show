//Creates instructions according to the advanced instructions generation algorithm
function advancedInstructions(brokenDownSubstances,$store)
{
  return flattenedInstructionsPerSubstance(brokenDownSubstances,$store);
}

//Flattens the complex sorted and grouped instruction-object into an array of arrays, where each sub-array contains all the pipetting-instructions for one substance
function flattenedInstructionsPerSubstance(brokenDownSubstances,$store) {
  let res = [];
  let groupedInstructionsList = groupedInstructions(brokenDownSubstances);

  for (let s = 0; s < groupedInstructionsList.length; s++) {
    let substanceArray = groupedInstructionsList[s];
    let substanceInstructions = [];
    for (let v = 0; v < substanceArray.length; v++) {
      let valueList = substanceArray[v];

      if ($store.state.build.multichannelpipette != 0) valueList = groupMultichannel(valueList,$store);
      
      for (let i = 0; i < valueList.length; i++) {
        substanceInstructions.push(valueList[i]);
      }
    }

    res.push(substanceInstructions);
  }
  return res;
}


function groupMultichannel(valueList,$store) {

    let usemulti = $store.state.build.multichannelpipette;
    if (![8,12].includes(usemulti)) return valueList;
    let multi = [];
    let rows = 8;
    let columns = 12;
    let rowarray = Array(rows).fill(0);
    let columnarray = Array(columns).fill(0);

    
    for (let i = 0; i < valueList.length; i++){
        if(valueList[i].operation === undefined){
            rowarray[Math.floor(valueList[i].well/columns)] += 1;
            columnarray[valueList[i].well%columns] += 1;
        }
    }
    
    //check if a row has #column same amounts -> multichannel is possible
    if (usemulti == 12){
      let currentValue = undefined;
        for (let i = 0; i < rows; i++){            
            if (rowarray[i] == columns){
                let tempValueList = [];
                let multiwells = [];
                let multientry;

                if (currentValue != valueList[0].value){
                  multi.push({ operation: "multichannelvolume", value: valueList[0].value });
                  currentValue = valueList[0].value;
                }
                
                for (let entry = 0; entry < valueList.length; entry++){
                    
                    if (valueList[entry].operation === undefined && Math.floor(valueList[entry].well/columns) == i){
                        multiwells.push(valueList[entry].well);
                        multientry = valueList[entry]; // we need only one correct entry
                        
                    }
                    else {
                        tempValueList.push(valueList[entry]);
                        
                    }
                }
                valueList = tempValueList;
                // now, we need to reduce the multi array to one single instruction
                            
                multientry.well = multiwells;
                multi.push(multientry);
               
            }
        }
    }
    else if (usemulti == 8){
      let currentValue = undefined;
    //check if a column has #row same amounts -> multichannel is possible
        for (let i = 0; i < columns; i++){
            if (columnarray[i] == rows){
                let tempValueList = [];
                let multiwells = [];
                let multientry;
                if (currentValue != valueList[0].value){
                  multi.push({ operation: "multichannelvolume", value: valueList[0].value });
                  currentValue = valueList[0].value;
                }
                
                for (let entry = 0; entry < valueList.length; entry++){
                    
                    if (valueList[entry].operation === undefined && Math.floor(valueList[entry].well%columns) == i){
                        multiwells.push(valueList[entry].well);
                        multientry = valueList[entry]; // we need only one correct entry
                        
                    }
                    else {
                        tempValueList.push(valueList[entry]);
                        
                    }
                }
                valueList = tempValueList;
                // now, we need to reduce the multi array to one single instruction
                            
                multientry.well = multiwells;
                multi.push(multientry);
            }
        }
    }

    if (valueList.length == 1) return multi;

    return multi.concat(valueList);
  

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


export {advancedInstructions};
