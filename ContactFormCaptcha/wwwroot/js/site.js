var site_key = '6LciXmIaAAAAACVsTADwTKbxo_sUFqdoIpXzxS9J';
var reCaptchaResponse = '';
var renderRecaptcha = function () {
    grecaptcha.render('ReCaptchContainer', {
        'sitekey': site_key,
        'callback': reCaptchaCallback,
        theme: 'light', //light or dark    
        type: 'image',// image or audio
        size: 'normal'//normal or compact    
    });
};

var reCaptchaCallback = function (response) {
    if (response !== '') {
        reCaptchaResponse = response;
    }
};

jQuery('button[type="button"]').click(function (e) {
    var message = 'Please checck the checkbox';
    if (typeof (grecaptcha) != 'undefined') {
        var response = grecaptcha.getResponse();
        (response.length === 0) ? (message = 'Captcha verification failed') : (message = 'Success!');
    }
});

$(function () {
    $(
        "#contactForm input,#contactForm textarea,#contactForm button"
    ).jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function ($form, event) {
            event.preventDefault(); // prevent default submit behaviour

            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var phone = $("input#phone").val();
            var message = $("textarea#message").val();
            var token = reCaptchaResponse;
            var firstName = name;
            if (firstName.indexOf(" ") >= 0) {
                firstName = name.split(" ").slice(0, -1).join(" ");
            }
            var contact = { "name": name, "phone": phone, "email": email, "message": message, "token": token }

            $this = $("#sendMessageButton");
            $this.prop("disabled", true);
            $.ajax({
                url: "/api/contact",
                type: "POST",
                data: JSON.stringify(contact),
                contentType: "application/json; charset=utf-8",
                cache: false,
                success: function () {
                    
                    $("#success").html("<div class='alert alert-success'>");
                    $("#success > .alert-success")
                        .html(
                            "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
                        )
                        .append("</button>");
                    $("#success > .alert-success").append(
                        "<strong>Your message has been sent. </strong>"
                    );
                    $("#success > .alert-success").append("</div>");
                    
                    $("#contactForm").trigger("reset");
                },
                error: function () {
                     
                    $("#success").html("<div class='alert alert-danger'>");
                    $("#success > .alert-danger")
                        .html(
                            "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;"
                        )
                        .append("</button>");
                    $("#success > .alert-danger").append(
                        $("<strong>").text(
                            "Sorry " +
                            firstName +
                            ", it seems that my mail server is not responding. Please try again later!"
                        )
                    );
                    $("#success > .alert-danger").append("</div>");
                    
                    $("#contactForm").trigger("reset");
                },
                complete: function () {
                    setTimeout(function () {
                        $this.prop("disabled", false);  
                    }, 1000);
                },
            });
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $('a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

 
$("#name").focus(function () {
    $("#success").html("");
});
