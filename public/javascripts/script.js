"use strict"
$(document).ready(function () {
    $('#alerts').hide();
    $(function () {
        $('input[type=file]').change(function () {
            var t = $(this).val();
            var labelText = 'File : ' + t.substr(12, t.length);
            $(this).prev('label').text(labelText);
        })
    });
    $("#uploadfile").bind("click", function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test($("#file").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                      var rows = e.target.result.trim().split("\n");
                      console.log(rows);
                    // var cells = e.target.result.split('\n').map(function (el) { return el.split(/\s+/); });
                    var cells = e.target.result.trim().split('\n').map(function (el) { return el.trim().split(','); });
                    var headings = ['email'];
                    console.log(cells);
                    var obj = cells.map(function (el) {
                        var obj = {};
                        var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                        for(var i=0; i < el.length; i++){
                            if(pattern.test(el[i])){
                                obj[headings[0]] = el[i];
                            }
                        }
                        return obj;
                    });
                    console.log(obj)
                    return false;
                    $.ajax({
                        type: 'POST',
                        url: "/uploadfile",
                        data: { data: obj },
                        beforeSend: function () {
                        },
                        success: function (response) {
                            console.log(response)
                            hideOrShowAlerts(response)
                            // console.log(response)
                        },
                        error: function (error) {
                            hideOrShowAlerts(error);
                            // console.log(error)
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
    $('#sendmails').bind("click", function(){
        var data = {
            subject: $('#subject').val(),
            body: $('#body').val()
        }
        console.log(data);
        $.ajax({
            type: 'POST',
            url: "/sendmails",
            data: { data: data },
            beforeSend: function () {
            },
            success: function (response) {
                console.log(response)
            },
            error: function (error) {
                console.log(error)
            }
        });
    })
    // $('#loading-image').bind('ajaxStart', function(){
    //     $(this).show();
    // }).bind('ajaxStop', function(){
    //     $(this).hide();
    // });
});

var hideOrShowAlerts = function(response){
    var alertMessages = {
        success: 'alert-success',
        error:'alert-danger',
        info: 'alert-info',
        warning: 'alert-warning'
    }
    var content = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><span><strong>'+ response.status +'!</strong>'+ response.message+'</span>';
    var errorClass = alertMessages[response.status];
    $('#alerts').append(content);
    $('#alerts').addClass(errorClass);
    $('#alerts').show();
    setTimeout(function(){
        $('#alerts').append('');
        $('#alerts').removeClass(errorClass);
        $('#alerts').hide(); 
    },10000)
}
