j$ = jQuery.noConflict();
var selectedId;

//Modal Open
j$('[id^=deleteBtn_]').click(function () {
    j$('#backdropDelete').addClass('slds-backdrop_open');
    j$('#modalDelete').addClass('slds-fade-in-open');
    selectedId = j$(this).attr('name');
});

j$('[id^=jsonBtn_]').click(function () {
    selectedId = j$(this).attr('name');
    console.log('selectedId: ' + selectedId);

    // TODO bring json here
    j$.post("/ca/" + selectedId + "/config.json", function (data) {
        // insert json
        j$("#modalContentJson").html(JSON.stringify(data, null, '\t'));
        // highlight json
        j$('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });
    });
    // show modal
    j$('#backdropJson').addClass('slds-backdrop_open');
    j$('#modalJson').addClass('slds-fade-in-open');

});

//Modal Close
function closeModal() {
    j$('#modalDelete').removeClass('slds-fade-in-open');
    j$('#backdropDelete').removeClass('slds-backdrop_open');
    j$('#backdropJson').removeClass('slds-backdrop_open');
    j$('#modalJson').removeClass('slds-fade-in-open');
}

//Modal Confirm
j$('#deleteBtnConfirm').click(function () {
    j$('#modalDelete').removeClass('slds-fade-in-open');
    j$('#backdropDelete').removeClass('slds-backdrop_open');
    deleteConfig(selectedId);
});

// post to controller
function deleteConfig(id) {
    j$.post("/ca/delete/" + id, function (result) {
        if (result == true)
            j$('#config_' + id).remove();
    }).fail(function (response) {
        console.log('delete failed: ' + response.responseText);
    });
}

// copy endpoint url to clipboard
j$('[id^=copyToClipboard]').click(function () {
    var data = j$(this).attr("data");
    j$(this).attr("data-clipboard-text", data);
    var clipboard = new Clipboard("#" + j$(this).attr("id"));
    clipboard.on('success', function (e) {
        //console.log(e);
        createAlertTemplate(data);
    });
    clipboard.on('error', function (e) {
        //console.log(e);
    });
});

/**
 * Add alert template
 */
function createAlertTemplate(data) {
    j$('#copyAlert').remove();
    var temp = j$("#templateAlert div.slds-notify").clone();
    j$(temp).attr("id", "copyAlert");
    //console.log(temp.html());
    var lbl = temp.find('#alertTempLabel');
    lbl.html(data + ' copied to clipboard.');
    //console.log(lbl.html());
    //then add the new code to the holding area
    j$("#alertPlaceholder").before(temp);
}

function closeAlert() {
    console.log("close alert 1");
    j$('#copyAlert').remove();
}

//    j$('#closeAlert').click(function () {
//        console.log("close alert 3");
//    });
