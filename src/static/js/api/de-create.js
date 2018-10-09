j$ = jQuery.noConflict();

/**
 * Tab selection
 */
j$('.slds-tabs_scoped__item').click(function () {
    // hide
    var active = j$('.slds-is-active');
    active.removeClass("slds-is-active");
    var activeId = active.find("a").attr("aria-controls");
    console.log(activeId);
    j$('#' + activeId).addClass("slds-hide");
    // show
    j$(this).addClass("slds-is-active");
    var newId = j$(this).find("a").attr("aria-controls");
    console.log(newId);
    j$('#' + newId).removeClass("slds-hide");
});

/**
 * Move to next/prev step
 */
j$('button.slds-button_brand').click(function () {
    // get action
    var action = j$(this).attr("value");
    console.log("button: " + action);

    if (action == "save") {
        // save de here
    }
    else { // back/next
        // hide active item
        var activeLi = j$('.slds-is-active');
        var step = activeLi.attr("id");
        console.log("step: " + step);
        validateStep(step);
        activeLi.removeClass("slds-is-active");
        var activeId = activeLi.find("a").attr("aria-controls");
        console.log("activeId: " + activeId);
        j$('#' + activeId).addClass("slds-hide");
        // show next item
        var nextLi = action == "next" ? activeLi.next() : activeLi.prev();
        var nextId = nextLi.find("a").attr("aria-controls");
        console.log("nextId: " + nextId);
        nextLi.addClass("slds-is-active");
        var newId = nextLi.find("a").attr("aria-controls");
        j$('#' + newId).removeClass("slds-hide");
    }
});

/**
 * Handle SLDS checkbox
 */
j$('#deForm').on('click', 'input[type=checkbox]', function () {
    var id = j$(this).attr("id");
    console.log(id + " click: " + this.checked);
    var hidden = j$("input:hidden[name='" + id + "']");
    hidden.val(this.checked);
    console.log("hidden: " + hidden.val());
});

/**
 * Add new row
 */
j$('#addRowBtn').click(function () {
    console.log('add clicked');
    //if (isDisabled(this))
    //    return;
    //j$(this).attr("disabled", "");
    createRowTemplate();
});

j$('#deColumns').on('click', '[id^=deleteColumnBtn]', function () {
//j$("#deleteColumnBtn").click(function () {
    console.log('delete clicked');
    if (isDisabled(this))
        return;
    var selectedRow = j$(this).closest("tr");
    selectedRow.remove();
});

/**
 * Create new row template
 */
function createRowTemplate() {
    var rowCount = j$('#deColumns tr').length - 2;
    console.log('number of columns: ' + rowCount);
    var temp = j$("#templateDeColumn tr.row").clone();
    temp.attr("id", "newColumn" + rowCount);

    var name = temp.find('#colName');
    name.attr("id", "Columns"+ rowCount + ".Name");
    name.attr("name", "de[Columns]["+ rowCount + "][Name]");
    var type = temp.find('#colType');
    type.attr("id", "columns"+ rowCount + ".FieldType");
    type.attr("name", "de[Columns]["+ rowCount + "][FieldType]");
    var length = temp.find('#collength');
    length.attr("id", "columns"+ rowCount + ".MaxLength");
    length.attr("name", "de[Columns]["+ rowCount + "][MaxLength]");

    var isPrimaryKey = temp.find('#colIsPrimaryKey');
    isPrimaryKey.attr("id", "de[Columns]["+ rowCount + "][IsPrimaryKey]");
    //isPrimaryKey.attr("name", "de[Columns]["+ rowCount + "][isPrimaryKey]");
    var forIsPrimaryKey = temp.find('#forIsPrimaryKey');
    forIsPrimaryKey.attr("for", "de[Columns]["+ rowCount + "][IsPrimaryKey]");
    var hiddenIsPrimaryKey = temp.find('#colHiddenIsPrimaryKey');
    hiddenIsPrimaryKey.attr("id", "de[Columns]["+ rowCount + "][IsPrimaryKey]");
    hiddenIsPrimaryKey.attr("name", "de[Columns]["+ rowCount + "][IsPrimaryKey]");

    var isRequired = temp.find('#colIsRequired');
    isRequired.attr("id", "de[Columns]["+ rowCount + "][IsRequired]");
    //isRequired.attr("name", "de[Columns]["+ rowCount + "][IsRequired]");
    var hiddenIsRequired = temp.find('#colHiddenIsRequired');
    hiddenIsRequired.attr("id", "de[Columns]["+ rowCount + "][IsRequired]");
    hiddenIsRequired.attr("name", "de[Columns]["+ rowCount + "][IsRequired]");
    var forIsPrimaryKey = temp.find('#forIsRequired');
    forIsPrimaryKey.attr("for", "de[Columns]["+ rowCount + "][IsRequired]");

    var name = temp.find('#colDefault');
    name.attr("id", "columns"+ rowCount + ".DefaultValue");
    name.attr("name", "de[Columns]["+ rowCount + "][DefaultValue]");

    var btnDelete = temp.find('#deleteColumnBtn');
    btnDelete.attr("id", "deleteColumnBtn" + rowCount);

    j$(temp).appendTo("table#deColumns > tbody");
}

function validateStep(step) {
    console.log(step + " validation");
    if (step == "step1") {

    }
    else if (step == "step2") {
    }
    else {
    }
    return true;
}

/**
 * Checks if element has disable attribute
 * @param element
 */
function isDisabled(element) {
    var attr = j$(element).attr('disabled');
    if (typeof attr !== typeof undefined && attr !== false) {
        return true;
    }
    return false;
}