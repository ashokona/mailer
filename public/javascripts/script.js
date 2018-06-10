"use strict"
$(document).ready(function () {
    $('#alerts').hide();
    $(function () {
        $('input[type=file]').change(function () {
            var t = $(this).val();
            var labelText = 'File : ' + t.substr(12, t.length);
            // $(this).prev('label').text(labelText);
        })
    });
    $("#uploadfile").bind("click", function () {
        var $btn = $(this);
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.xlsx)$/;
        if (regex.test($("#file").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var rows = e.target.result.trim().split("\n");
                    // console.log(rows);
                    // var cells = e.target.result.split('\n').map(function (el) { return el.split(/\s+/); });
                    var cells = e.target.result.trim().split('\n').map(function (el) { return el.trim().split(','); });
                    var headings = ['email'];
                    // var obj = cells.map(function (el) {
                    //     var obj = {};
                    //     var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
                    //     for(var i=0; i < el.length; i++){
                    //         if(pattern.test(el[i])){
                    //             obj[headings[0]] = el[i];
                    //             return obj;
                    //         }
                    //     }
                    // });
                    var emails = [];
                    cells.forEach(el => {
                        var obj = {};
                        var pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
                        for (var i = 0; i < el.length; i++) {
                            if (pattern.test(el[i])) {
                                obj[headings[0]] = el[i];
                                emails.push(obj);
                            }
                        }
                    });
                    // console.log(emails);
                    // return false;
                    $.ajax({
                        type: 'POST',
                        url: "/uploadfile",
                        data: { data: emails },
                        beforeSend: function () {
                            $btn.button('loading');
                        },
                        success: function (response) {
                            document.getElementById("file").value = "";
                            hideOrShowAlerts(response);
                            $btn.button('reset');
                        },
                        error: function (error) {
                            document.getElementById("file").value = "";
                            hideOrShowAlerts(error);
                            $btn.button('reset');
                        }
                    });

                }
                reader.readAsText($("#file")[0].files[0]);
            }
            else {
                alert("This browser does not support HTML5.");
            }
        }
        else {
            alert("Please upload a valid CSV file.");
        }
    });
    $('#sendmails').bind("click", function () {
        var $btn = $(this);
        var subject = $('#subject').val();
        var body = $('#body').val();
        if (subject === '' || subject.length < 5) {
            alert("Mail subject should be atleast 5 charecters");
            return false;
        }
        if (subject === '' || subject.length < 5) {
            alert("Mail body should be atleast 10 charecters");
            return false;
        }
        var data = {
            subject: subject,
            body: body
        }
        $.ajax({
            type: 'POST',
            url: "/sendmails",
            data: { data: data },
            beforeSend: function () {
                $btn.button('loading');
            },
            success: function (response) {
                hideOrShowAlerts(response);
                $('#subject').val('');
                $('#body').val('');
                $btn.button('reset');
            },
            error: function (error) {
                hideOrShowAlerts(error);
                $btn.button('reset');
            }
        });
    })
    // $('#loading-image').bind('ajaxStart', function(){
    //     $(this).show();
    // }).bind('ajaxStop', function(){
    //     $(this).hide();
    // });
});

var hideOrShowAlerts = function (response) {
    $('#alerts').html('');
    var alertMessages = {
        success: 'alert-success',
        error: 'alert-danger',
        info: 'alert-info',
        warning: 'alert-warning'
    }
    var content = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><span><strong>' + response.status + '!</strong>' + response.message + '</span>';
    var errorClass = alertMessages[response.status];
    $('#alerts').append(content);
    $('#alerts').addClass(errorClass);
    $('#alerts').show();
    setTimeout(function () {
        $('#alerts').html('');
        $('#alerts').removeClass(errorClass);
        $('#alerts').hide();
    }, 20000)
}
