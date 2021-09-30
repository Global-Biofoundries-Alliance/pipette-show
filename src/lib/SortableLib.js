import clone from "clone";

function resortArray(originalArray, startIndex, endIndex, finalIndex) {
    var array = clone(originalArray);

    //Retrieve the columns that are moved
    var cols = array.slice(startIndex, endIndex + 1);

    //Split target array into two parts: before and after the insertion
    var before = array.slice(0, finalIndex);
    var after = array.slice(finalIndex);

    //Remove moved columns from target array parts
    if (startIndex <= finalIndex) before.splice(startIndex, cols.length);
    else after.splice(startIndex - before.length, cols.length);

    //Rebuild array
    return before.concat(cols).concat(after);
}

function resortSubstances($store, startIndex, endIndex, finalIndex) {
    //Resort substances
    let resultSubstances = resortArray(
        $store.state.build.file.substances,
        startIndex,
        endIndex,
        finalIndex
    );

    //Resort values
    let resultValues = [];
    for (let i = 0; i < $store.state.build.file.values.length; i++) {
        resultValues.push(
            resortArray(
                $store.state.build.file.values[i],
                startIndex,
                endIndex,
                finalIndex
            )
        );
    }

    return { substances: resultSubstances, values: resultValues };
}

export { resortSubstances };
