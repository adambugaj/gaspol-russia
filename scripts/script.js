formSent = 0;

$(document).ready(function(){

    if ($.cookie('gaspol_cookie') != '1') {
        $("#footer-wrapper").fadeIn('fast');
    }

    $('.cookie-close').click(function() {
        $.cookie('gaspol_cookie','1',{expires: 7});
        document.querySelector("body").classList.add("cookie");
        $("#footer-wrapper").fadeOut('fast');
        return false;
    });

    $(window).resize(function(){
        checkFooter();
        checkBubbles();
        checkTxt();
    });

    $("#show-agreement-1").click(function(){
        if (window.innerWidth <= 1080) {
            $("#full-agreement-1").fadeToggle();
        }
    });

    $("#show-agreement-2").click(function(){
        if (window.innerWidth <= 1080) {
            $("#full-agreement-2").fadeToggle();
        }
    });

    sendForm();
    checkFooter();
    checkBrowser();
    checkBubbles();
    checkTxt();
});




function checkFooter() {

    if (window.innerWidth > 1080) {

        $("#full-agreement-1").fadeOut();
        $("#full-agreement-2").fadeOut();
        var win = $(window).height();
        var form = $("#main-form").outerHeight() + $("#main-form").offset().top;
        var footer = $("#footer-wrapper").outerHeight();
        var footer2 = $("#footer-wrapper").height();
        if (form + footer + 10 > win) $("#footer-wrapper").css("position", "relative");
        else  $("#footer-wrapper").css({"position": "absolute", "bottom": "0"});

        $(".show-agreement").html("[...]");

        var piks = $("#main-form").outerHeight();

    }
    else {
        $(".show-agreement").html("[ROZWIŃ]");
        $("#footer-wrapper").css("position", "relative");
    }
}





function checkTxt() {
    if (window.innerWidth > 1080) {
        if ((window.innerWidth/window.innerHeight) < 1.6) {
            $("body").addClass("ratio");
        } else $("body").removeClass("ratio");
    } else {
        $("body").removeClass("ratio");
    }
}


function checkBrowser() {
    if (navigator.userAgent.match(/msie|trident/i) || navigator.userAgent.match(/Version\/[\d\.]+.*Safari/i)) {
        //$("#header-blend, #form-blend").css("background-color", "#133b71");
    }
}

function checkBubbles() {

    var x = $("#form-blend").width();
    var bubbles = $(".bubble");
    bubbles.css("right", x + "px");

    for(var i = 0; i < bubbles.length; i++) {
       
        var nm = bubbles[i].id.split("_");
        nm = nm[1];
        var inp = $("input[name=" + nm + "]");
        var offt = 0;
        if(inp[0].type == "checkbox") {
            offt = $("input[name=agreement-1] + label + div").offset().top; 
        }
        else offt = $("input[name=" + inp[0].name + "]").offset().top + 4;
        $("#" + bubbles[i].id).css("top", offt + "px");
    }

}


function sendForm() {
    $("#cta-form").click(function(){

        var data = {},
        inputs = $('#gaspol-form').find('input[type=text], input[type=email]');
        data['agreement1'] = $('#main-form input[name=agreement-1]').is(":checked") ? 1 : 0;
        data['agreement2'] = $('#main-form input[name=agreement-2]').is(":checked") ? 1 : 0;

        $.each(inputs,function(i,e){
            data[e.name] = $(e).val();
        });
        console.log(data);
        var status = true,
            hand = $("#gaspol-form"),
            nameTest = /^[a-zA-ZżółćęśąźńŻÓŁĆĘŚĄŹŃ\-\s]{0,}$/,
            emailTest = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}){0,}$/,
            phoneTest = /^(([0-9]{3})[ \-\/]?([0-9]{3})[ \-\/]?([0-9]{3}))|([0-9]{9})|([\+]?([0-9]{2})[ \-\/]?([0-9]{3})[ \-\/]?([0-9]{3})[ \-\/]?([0-9]{3}))$/;
            
            $("input, label, div").removeClass("error");
            $(".bubble").hide();
        

        hand.find('input[name=name]').each(function(){
            if (!nameTest.test($(this).val())) { $(this).addClass('error'); status = false;   }
        });
        hand.find('input[name=email]').each(function(){
            if (!emailTest.test($(this).val())) { $(this).addClass('error'); status = false;   }
        });
        hand.find('input[name=phone]').each(function(){
            if (!phoneTest.test($(this).val())) { $(this).addClass('error'); status = false;  $("#bubble_phone").show(); }
        });

        hand.find('input[type=checkbox]').each(function() {
            if(!$(this).prop("checked")) {
                status = false;
                $("label[for="+$(this).attr("id")+']+div').addClass("error");
                 $("#bubble_agreement-1").show();
            }
        });

        if(!status) return 0;
        if(formSent) return 0;
        $.ajax({
            url: './core/file.php',
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (json) {
                formSent = 1;
                dataLayer.push({
                    'event': 'Sent'
                });
                var typ1 = "Dziękujemy!";
                var typ2 = "Twój formularz został wysłany.";
                $("#form-helper h1").html(typ1);
                $("#form-helper h2").html(typ2);
                $("#form-helper h3, #form-helper h4").css('display','none');
                $("#form-helper > span,#form-helper > .line").css('display','none');
                $("#form-helper h1").addClass("thx");
                $("#form-helper h2, #form-helper h4.mobile").addClass("thx");
                $("#gaspol-form").html("");

            },
            error: function (json) {
            }
        });



    });
}