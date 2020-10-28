var scope = 'https://mail.google.com/';
var discovery_docs = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
var api_key = '';
var client_id = '';
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
    if(this.user.hasGrantedScopes(this.scope)){
        document.getElementById('cont').innerHTML = `
        <nav class="navbar navbar-dark bg-dark" style="border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;">
            <a class="navbar-brand">Gmail Clone</a>
            <button class="btn btn-warning mr-sm-2 my-2 my-sm-0" onclick="showCompose()">Compose</button>
            <form class="form-inline" onsubmit="return false;">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onchange="searchMail(this)">
            </form>
            <button class="btn btn-success" onclick="SignOut()">Sign Out</button>
        </nav>
        <br>
        <div class='row'>
        <div class='col-3' id='labels'>
            <button type="button" class="btn btn-light btn btn-block" onclick="setDom('INBOX')" style="padding: 10px;">Inbox</button>
            <button type="button" class="btn btn-light btn btn-block" onclick="setDom('SENT')" style="padding: 10px;">Sent Mails</button>
            <button type="button" class="btn btn-light btn-md btn-block" onclick="setDom('TRASH')" style="padding: 10px;">Trash Mails</button>
            <button type="button" class="btn btn-light btn-md btn-block" onclick="setDom('SPAM')" style="padding: 10px;">Spam Mails</button>
            <button type="button" class="btn btn-light btn btn-block" onclick="setDom('UNREAD')" style="padding: 10px;">Unread Mails</button>
        </div>
        <div class='col-8' id='mails' style="text-align:left"></div>
        </div>
        `
        setDom('INBOX');
    }
    else{
        document.getElementById('cont').innerHTML = `
        <nav class="navbar navbar-dark bg-dark" style="border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;">
            <a class="navbar-brand">Gmail Clone</a>
            <form class="form-inline" onsubmit="return false;">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
              <button class="btn btn-outline-success " type="submit">Search</button>
              
            </form>
        </nav>
        <div class="col-md-5 p-lg-5 mx-auto my-5">
            <h1 class="display-4 font-weight-normal">Gmail Clone a Daily Mail</h1>
            <p class="lead font-weight-normal">Gmail is a free, advertising-supported email service provided by Google. Users may access Gmail as secure webmail, now can access through REST API. </p>
            <button onclick="SignIn()" type='button' class='btn btn-warning btn-lg'>Sign In Google</button>
        </div>
        `
    }
}
start();
function SignIn(){
    google_auth.signIn();
}
function SignOut(){
    google_auth.signOut();
}
function setDom(label=undefined, query = undefined){
    let mails = document.getElementById('mails');
    mails.innerHTML = '';
    gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': label,
        'maxResults': 10,
        "q": query
    }).then(function(response){
        let co = 0;
        console.log(label, response);
        if(response.result.messages === undefined){
            alert("No responses for the search");
            return;
        }
        response.result.messages.forEach((item)=>{
            gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': item.id
            }).then(function(response){
                console.log(label, response);
                let subject, from;
                response.result.payload.headers.forEach((item)=>{if(item.name == "Subject"){subject=item.value}})
                
                mails.innerHTML += `
                <div class="card text-white bg-${themes[co%themes.length]} mb-3" onclick="showMail(this)" id=${item.id}>
                  <div class="card-header">${subject} :-  </div>
                  <div class="card-body">
                    <p class="card-text">${response.result.snippet}</p>
                  </div>
                </div>
                `;
            console.log(label, response);
            co++;
            })
            
        })
        // console.log(response);
    })
}
var themes = ['info', 'warning', 'danger', 'secondary', 'success', 'primary', 'dark' ];
function showCompose(){
    $("#Compose").modal("show");
    return false;
}
function mail_It(){
    var message = 'To: '+document.getElementById('send-to').value+"\r\n";
    message += 'Subject: '+document.getElementById('send-sub').value+"\r\n";
    message += "\r\n" + document.getElementById('send-message').value;
    console.log(message);
    gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
          'raw': window.btoa(message).replace(/\+/g, '-').replace(/\//g, '_')
        }
    }).then(function(response){
        alert("Email Sent Sucessfully");
        console.log(response);
    }).catch(function(response){
        alert(`Email Sent UnSucessfully with Error: ${response.result.error.status}`);
        console.log(response)
    });
    document.getElementById('send-to').value = '';
    document.getElementById('send-sub').value = '';
    document.getElementById('send-message').value = '';
    $("#Compose").modal("hide");
}
function searchMail(node){
    console.log(node.value);
    if(node.value == ""){
        setDom("INBOX", node.value);
        return;
    }
    setDom(undefined, node.value);
}

function showMail(node){
    var subject, from;
    gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': node.id
    }).then(function(response){        
        response.result.payload.headers.forEach((item)=>{if(item.name == "Subject"){subject=item.value}})
        response.result.payload.headers.forEach((item)=>{if(item.name == "From"){from=item.value}})
        let loc = from.search("<");
        if(loc>=0){
            from = from.slice(0, loc)+from.match(/<.+?>/g)[0].substr(1, from.match(/<.+?>/g)[0].length-2);
            
        }
        document.getElementById('show-sub').value = subject;
        document.getElementById('show-from').value = from;
        document.getElementById('show-message').value = response.result.snippet;
    });

    $("#ShowMail").modal("show");
}
