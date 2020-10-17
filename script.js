var scope = 'https://mail.google.com/';
var discovery_docs = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
var api_key = 'AIzaSyCVI-XUKFE8vScyWSD4Yt08_OhSYrYCBq4';
var client_id = '658791317962-i0ff8qpv14p5t4skr13a7gqagm0rfrbp.apps.googleusercontent.com';
var google_auth;
var user;

function start(){
    gapi.load('client:auth2', initializationClient);

}
function initializationClient(){
    console.log(1);
    gapi.client.init({
        'apiKey': api_key,
        'clientId': client_id,
        discoveryDocs: discovery_docs,
        'scope': scope
    }).then(()=>{
        google_auth = gapi.auth2.getAuthInstance();
        google_auth.isSignedIn.listen(updateStatus);
        user = google_auth.currentUser.get();
        updateStatus();
    })
}
function updateStatus(){
    console.log(2);
    if(this.user.hasGrantedScopes(this.scope)){
        document.getElementById('cont').innerHTML = `
        <nav class="navbar navbar-dark bg-dark" style="border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;">
            <a class="navbar-brand">Gmail Clone</a>
            <form class="form-inline">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
        </nav>
        <div class='col-4' id='labels'></div>`
        let label = document.getElementById('labels');
        gapi.client.gmail.users.labels.list({
            'userId': 'me'
          }).then(function(response) {
            var labels = response.result.labels;      
            if (labels && labels.length > 0) {
              for (let i = 0; i < labels.length; i++) {
                label.innerHTML += `<div>${labels[i].name}</div>`
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
start();