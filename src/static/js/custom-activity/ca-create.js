j$ = jQuery.noConflict();

j$(document).ready(function () {

    numOfSplits = Number(j$('#numOfSplits').val());
    numOfSteps = Number(j$('#numOfSteps').val());
    numOfSchemaArgs = Number(j$('#numOfSchemaArgs').val());


    handleType(j$("#typeSelect").val());
    if (numOfSteps > 1)
        j$('#removeStepBtn').removeAttr('disabled');
    if (numOfSteps > 4)
        j$('#addStepBtn').attr("disabled", "");
    if (numOfSplits > 2)
        j$('#removeSplitBtn').removeAttr('disabled');
    if (numOfSplits > 4)
        j$('#addSplitBtn').attr("disabled", "");
    if (numOfSchemaArgs > 0)
        j$('#removeSchemaArgBtn').removeAttr('disabled');
    if (numOfSchemaArgs > 4)
        j$('#addSchemaArgBtn').attr("disabled", "");
})

/**
 * Handle type change
 */
j$("#typeSelect").change(function () {
    handleType(j$(this).val());
});

/**
 * Handle add split
 */
j$('#addSplitBtn').click(function () {
    if (isDisabled(this))
        return;
    // add new line here
    if (numOfSplits < 5)
        createSplitTemplate();
    // disable add split button
    if (numOfSplits == 5)
        j$(this).attr("disabled", "");
    // enable remove spit button
    if (numOfSplits > 2)
        j$('#removeSplitBtn').removeAttr('disabled');
});

/**
 * Handle add step
 */
j$('#addStepBtn').click(function () {
    if (isDisabled(this))
        return;
    // add new line here
    if (numOfSteps < 5)
        createStepTemplate();
    // disable add split button
    if (numOfSteps > 4)
        j$(this).attr("disabled", "");
    // enable remove spit button
    if (numOfSteps > 1)
        j$('#removeStepBtn').removeAttr('disabled');
});

/**
 * Handle add schema argument
 */
j$('#addSchemaArgBtn').click(function () {
    if (isDisabled(this))
        return;
    // add new line here
    if (numOfSchemaArgs < 5)
        createSchemaArgTemplate();
    // disable add split button
    if (numOfSchemaArgs > 4)
        j$(this).attr("disabled", "");
    // enable remove spit button
    if (numOfSchemaArgs > 1)
        j$('#removeSchemaArgBtn').removeAttr('disabled');
});

/**
 * Handle remove split
 */
j$('#removeSplitBtn').click(function () {
    if (isDisabled(this))
        return;
    // remove last line
    if (numOfSplits > 2) {
        j$("#splitsGroup div.slds-form-element__row").last().remove();
        numOfSplits--;
    }
    // enable add split button
    if (numOfSplits < 5)
        j$('#addSplitBtn').removeAttr('disabled');
    // disable remove split button
    if (numOfSplits <= 2)
        j$(this).attr("disabled", "");
});

/**
 * Handle remove step
 */
j$('#removeStepBtn').click(function () {
    if (isDisabled(this))
        return;
    // remove last line
    if (numOfSteps > 1) {
        j$("#stepsGroup div.slds-form-element__row").last().remove();
        numOfSteps--;
    }
    // enable add split button
    if (numOfSteps < 5)
        j$('#addStepBtn').removeAttr('disabled');
    // disable remove split button
    if (numOfSteps <= 1)
        j$(this).attr("disabled", "");
});

/**
 * Handle remove schema argument
 */
j$('#removeSchemaArgBtn').click(function () {
    if (isDisabled(this))
        return;
    // remove last line
    if (numOfSchemaArgs > 0) {
        j$("#schemaArgsGroup div.slds-form-element__row").last().remove();
        j$("#schemaArgsGroup div.slds-form-element__row").last().remove();
        j$("#schemaArgsGroup div.slds-form-element__row").last().remove();
        numOfSchemaArgs--;
    }
    // enable add split button
    if (numOfSchemaArgs < 5)
        j$('#addSchemaArgBtn').removeAttr('disabled');
    // disable remove split button
    if (numOfSchemaArgs < 1)
        j$(this).attr("disabled", "");
});

/**
 * Checks if element has disable attribute
 * @param element
 */
function isDisabled(element) {
    var attr = j$(element).attr('disabled');
    if (typeof attr !== typeof undefined && attr !== false) {
        console.log('disabled');
        return true;
    }
    return false;
}

/**
 * Handle activity type
 * @param type
 */
function handleType(type) {
    if (type == 'RESTDECISION') {
        j$('#splitPanel').removeClass('slds-hide');
        if (numOfSplits == 0) {
            createSplitTemplate();
            createSplitTemplate();
        }
    }
    else
        j$('#splitPanel').addClass('slds-hide');
}

/**
 * Add split template
 */
function createSplitTemplate() {
    var temp = j$("#templateInputsRow div.slds-form-element__row").clone();
    var lbl = temp.find('#tempLabel');
    lbl.attr("id", "splits" + numOfSplits + ".label");
    lbl.attr("name", "config[splits][" + numOfSplits + "][label]");
    lbl.val("label path " + (numOfSplits + 1));
    var val = temp.find('#tempValue');
    val.attr("id", "splits" + numOfSplits + ".value");
    val.attr("name", "config[splits][" + numOfSplits + "][value]");
    val.val("key_path_" + (numOfSplits + 1));
    numOfSplits++;
    console.log(numOfSplits);
    //then add the new code to the holding area
    j$("#splitPlaceholder").before(temp);
}

/**
 * Add step template
 * config[step][1][value]
 */
function createStepTemplate() {
    var temp = j$("#templateInputsRow div.slds-form-element__row").clone();
    var lbl = temp.find('#tempLabel');
    lbl.attr("id", "steps" + numOfSteps + ".label");
    lbl.attr("name", "config[steps][" + numOfSteps + "][label]");
    lbl.val("Step " + (numOfSteps + 1));
    var val = temp.find('#tempValue');
    val.attr("id", "steps" + numOfSteps + ".key");
    val.attr("name", "config[steps][" + numOfSteps + "][key]");
    val.val("step_" + (numOfSteps + 1));
    numOfSteps++;
    console.log(numOfSteps);
    //then add the new code to the holding area
    j$("#stepPlaceholder").before(temp);
}

/**
 * Add schema arg template
 */
function createSchemaArgTemplate() {
    var temp = j$("#templateSchemaArgs div.template").clone();
    var argName = temp.find('#tempArgName');
    //argName.attr("id", "schemaArgs" + numOfSchemaArgs + ".name");
    argName.attr("name", "config[schemaArgs][" + numOfSchemaArgs + "][name]");
    argName.val("Argument_" + (numOfSchemaArgs + 1));

    var argDataType = temp.find('#tempArgDataType');
    //argDataType.attr("id", "schemaArgs" + numOfSchemaArgs + ".dataType");
    argDataType.attr("name", "config[schemaArgs][" + numOfSchemaArgs + "][dataType]");

    var argIsNullable = temp.find('#tempArgIsNullable');
    //argIsNullable.attr("id", "schemaArgs" + numOfSchemaArgs + ".isNullable");
    argIsNullable.attr("name", "config[schemaArgs][" + numOfSchemaArgs + "][isNullable]");

    var argDirection = temp.find('#tempArgDirection');
    //argIsNullable.attr("id", "schemaArgs" + numOfSchemaArgs + ".direction");
    argDirection.attr("name", "config[schemaArgs][" + numOfSchemaArgs + "][direction]");

    var argAccess = temp.find('#tempArgAccess');
    //argIsNullable.attr("id", "schemaArgs" + numOfSchemaArgs + ".access");
    argAccess.attr("name", "config[schemaArgs][" + numOfSchemaArgs + "][access]");

    numOfSchemaArgs++;
    console.log(numOfSchemaArgs);
    //then add the new code to the holding area
    j$("#schemaArgsPlaceholder").before(temp);
}