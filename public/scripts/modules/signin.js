(function(){
    var socket      = io(),
        signIn      = {el: $r('#signin')},
        signNext    = {},
        signUp      = {},
        data        = {};

    signIn.form     = signIn.el.find('#signin_form');
    signIn.error    = signIn.el.find('#signin_error');
    signIn.email    = signIn.form.find('#signin_email');
    signIn.password = signIn.form.find('#signin_password');

    signNext.form       = signIn.el.find('#signin_next_form');
    signNext.nextBtn    = signNext.form.find('#signin_next');
    signNext.backBtn    = signNext.form.find('#signin_back');

    signUp.form     = signIn.el.find('#signup_form');
    signUp.fullname = signUp.form.find('#signup_fullname');
    signUp.backBtn  = signUp.form.find('#signup_back');

    /**
     *
     */
    signIn.form.on('submit', function() {
        this.event.preventDefault();
        data.email = signIn.email.el.value;
        data.password = signIn.password.el.value;

        if(signIn.email.el.value != null && signIn.password.el.value != null) {
            socket.emit('authentication', {
                email: signIn.email.el.value,
                password: signIn.password.el.value
            });
        }
    });

    socket.on('authentication', function(data) {
        socket.emit('authentication', data);
    });

    /**
     * Display errors
     */
    socket.on('signin_errors', function(error) {
        signIn.error.html('');
        for(var i = 0; i < error.length; i++) {
            signIn.error.html('<p>' + error[i].message + '</p>', 'append');
        }
    });


    /**
     * Move to Sign Up stage
     */
    socket.on('new_user', function(data) {
        signIn.form.el.className    = 'hidden';
        signNext.form.el.className  = '';
        signUp.form.el.className     = 'hidden';
    });

    /**
     *
     */
    signUp.form.on('submit', function() {
        this.event.preventDefault();

        if(signUp.fullname.el.value != null) {
            data.fullname = signUp.fullname.el.value;
            socket.emit('sign_up_auth', data);
        }
    });

    /**
     *
     */
    signNext.nextBtn.on('click', function() {
        this.event.preventDefault();

        signIn.error.html('');
        signIn.form.el.className     = 'hidden';
        signNext.form.el.className   = 'hidden';
        signUp.form.el.className     = '';
    });

    /**
     *
     */
    signNext.backBtn.on('click', function() {
        this.event.preventDefault();

        signIn.error.html('');
        signIn.form.el.className     = '';
        signNext.form.el.className   = 'hidden';
        signUp.form.el.className     = 'hidden';
    });

    /**
     *
     */
    signUp.backBtn.on('click', function() {
        this.event.preventDefault();

        signIn.error.html('');
        signIn.form.el.className     = '';
        signNext.form.el.className   = 'hidden';
        signUp.form.el.className     = 'hidden';
    });


    /**
     * On authenticated event
     */
    socket.on('authenticated', function(data) {
        window.location = '';
    });

    return signIn;
})();