var gapi;
console.log(gapi.client);
class Gmail{
    scope = 'https://mail.google.com/';
    discovery_docs = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
    api_key = 'AIzaSyCVI-XUKFE8vScyWSD4Yt08_OhSYrYCBq4';
    client_id = '658791317962-i0ff8qpv14p5t4skr13a7gqagm0rfrbp.apps.googleusercontent.com';
    google_auth;
    user;
    constructor(){
        gapi.load('client:auth2', this.initializationClient);
    }

    initializationClient(){
        gapi.client.init({
            'apiKey': this.api_key,
            'clientId': this.client_id,
            discoveryDocs: this.discovery_docs,
            'scope': this.scope
        }).then(()=>{
            this.google_auth = gapi.auth2.getAuthInstance();
            console.log(gapi.auth2.getAuthInstance(), this.google_auth);
            this.google_auth.isSignedIn.listen(this.updateStatus);
            this.user = this.google_auth.currentUser.get();
            this.updateStatus();
        })
    }
    updateStatus(){
        if(this.user.hasGrantedScopes(this.scope)){
            gapi.client.gmail.users.labels.list({
                'userId': 'me'
              }).then(function(response) {
                var labels = response.result.labels;      
                if (labels && labels.length > 0) {
                  for (let i = 0; i < labels.length; i++) {
                    var label = labels[i];
                    console.log(label.name)
                  }
                } else {
                  console.log('No Labels found.');
                }
              });
        }
        else{
            document.getElementById('cont').innerHTML = `
            <nav class="navbar navbar-dark bg-dark" style="border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;">
                <a class="navbar-brand">Gmail Clone</a>
                <form class="form-inline">
                  <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </nav>
            <div class="col-md-5 p-lg-5 mx-auto my-5">
                <h1 class="display-4 font-weight-normal">Gmail Clone a Daily Mail</h1>
                <p class="lead font-weight-normal">Gmail is a free, advertising-supported email service provided by Google. Users may access Gmail as secure webmail, now can access through REST API. </p>
                <a href="{% url 'login' %}" type='button' class='btn btn-primary btn-lg'>Login</a>
                <a href="{% url 'signup' %}" type='button' class='btn btn-warning btn-lg'>Sign up</a>
            </div>`
        }
    }
}

let account = new Gmail();