function getGithubInfo(user, callback) {
    //1. Create an instance of XMLHttpRequest class and send a GET request using it.
    // The function should finally return the object(it now contains the response!)
	var xhttp = new XMLHttpRequest();
	var info;
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200){
			if (typeof callback === "function") {
                callback.apply(xhttp);
            }
		}
	};
	gitURL = "https://api.github.com/users/"
	fullURL = gitURL.concat(user);
	xhttp.open("GET", fullURL, true);
	xhttp.send();
}

function showUser(user) {
    //2. set the contents of the h2 and the two div elements in the div '#profile' with the user content
	document.getElementById("avatar").innerHTML = '';
	var proPic = new Image();
	gitURL = "https://github.com/"
	fullURL = gitURL.concat(user.login);
	proPic.src = fullURL + ".png";
	
	
	document.getElementById("uname").innerHTML = user.name;
	
	document.getElementById("avatar").appendChild(proPic);
	document.getElementById("information").innerHTML = "User ID: " + user.id + "<br/><a href = " + fullURL + ">Link to Profile</a>";
}

function noSuchUser(username) {
    //3. set the elements such that a suitable message is displayed
}

$(document).ready(function () {
    $(document).on('keypress', '#username', function (e) {
        //check if the enter(i.e return) key is pressed
        if (e.which == 13) {
            //get what the user enters
            username = $(this).val();
            //reset the text typed in the input
            $(this).val("");
            //restructred code to account for async function of XMLHttpRequest
			getGithubInfo(username,
				function(){
					if (this.status == 200) {
						showUser(JSON.parse(this.responseText));
					} else {
						noSuchUser(username);
					}
				}
			);
        }
    })
});
