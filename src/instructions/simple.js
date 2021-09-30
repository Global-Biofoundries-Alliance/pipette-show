//Creates instructions according to the simple instructions generation algorithm
function simpleInstructions(brokenDownSubstances)
{
  let res = [];
  for(let i = 0; i < brokenDownSubstances.length; i++)
  {
  	res.push(makeInstructionsForSubstance(brokenDownSubstances[i]));
  }

  return res;  
}

//Creates the instructions only for the given substance
function makeInstructionsForSubstance(singleSubstanceArray)
{ 
  let res = [];
  let lastVolume = -1;
  for(let i = 0; i < singleSubstanceArray.length; i++)
  {
  	let entry = singleSubstanceArray[i];

  	//If the volume is different than the last volume: Insert "change volume"-instruction
  	if(lastVolume !== entry.value)
  	{
  	  res.push({operation: "volume", value: entry.value});
  	}

  	res.push(entry);
  	lastVolume = entry.value;
  }

  return res;  
}

export {simpleInstructions};