function openForm() {
    document.getElementById("art_form_div").style.display = "block";
}

function closeForm() {
    document.getElementById("art_form_div").style.display = "none";
}

function loadPage() {
    // Print all artists to the screen
    getArtists();

    // Adding a click listener to open the form
    $(".new_artist_btn").click(function(e) {
        openForm()
        formValidation();
    });
    // Adding a click listener to submit the form values
    $("#art_form").submit(function(event) {
        if (!$("#art_form").valid()) return;

        // Get the artist detailes from the form
        var art_details = [$("#id").val(), $("#name").val(), $("#birth_year").val(), $("#link_profile_picture").val()];
        addArtist(art_details); // Add the new artist

        event.preventDefault();
        closeForm() // Close the form
    });
}
// ** Custom methods dedicated for the validation of the form **

// Check if the value contains only letters in hebrew or english
jQuery.validator.addMethod("letters", function(value, element) {
    return this.optional(element) || /^[a-z\u05D0-\u05EA' ]+$/i.test(value);
}, "enter only Hebrew / English letters.");

// Check if the value isn't larger than the current year
jQuery.validator.addMethod("until_this_year", function(value, element) {
    return this.optional(element) || value <= new Date().getFullYear();
}, "enter a relevent birth year.");

// Validation of the form
function formValidation() {
    $('#art_form').validate({
        rules: {
            id: {
                required: true,
                digits: true,
                minlength: 9,
                maxlength: 9
            },
            name: {
                letters: true,
            },
            birth_year: {
                required: true,
                digits: true,
                minlength: 4,
                maxlength: 4,
                until_this_year: true
            },
            link_profile_picture: {
                url: true
            }
        }
    });
}

// Send the artist information to the function associated with the server side
function addArtist(art_details) {
    $.ajax({
        type: 'POST', // Define the type of HTTP verb we want to use (POST for our form)
        url: 'http://localhost:3001/artists', // The url where we want to POST
        contentType: 'application/json',
        data: JSON.stringify({
            "id": art_details[0],
            "name": art_details[1],
            "birth_year": art_details[2],
            "link_profile_picture": art_details[3],
            "songs": []
        }),
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            document.getElementById("art_form").reset();
            if (data == "ID already exists, No changes were made")
                alert(data);
            getArtists();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

// Get the sorted artists list
function getArtists() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3001/artists',
        contentType: 'application/json',
        success: function(data) {
            print_art(data);
        },
        error: function(data) {
            alert(data);
        }
    });
}

// Send DELETE request to delete an artist
function delArtist(e) {
    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3001/artists/' + e.target.id,
        contentType: 'application/json',
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            getArtists();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

// Send PUT request to add song to an exist artist
function addSong(e) {
    $.ajax({
        type: 'PUT',
        url: 'http://localhost:3001/songs/' + e.target.id,
        dataType: 'text',
        data: $("#in" + e.target.id).val(),
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            getArtists();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

// Send DELETE request to delete song of an artist
function delSong(e) {
    var deleateBtnID = e.target.id;

    matches = deleateBtnID.match(/\d+/g); // Retrieving the numbers from the ID of the button
    var artID = matches[0];
    var songID = matches[1];

    $.ajax({
        type: 'DELETE',
        url: 'http://localhost:3001/songs/' + artID,
        dataType: 'text',
        data: songID,
        processData: false,
        encode: true,
        success: function(data, textStatus, jQxhr) {
            getArtists();
        },
        error: function(jqXhr, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

// Print the artists list to the screen
function print_art(data) {
    var titles = ["ID", "Name", "Birth Year", "Profile Picture", "Songs"]
    $("table").remove(); // Remove the previous table

    // Create table for the artists in the Html page
    for (val in data) {
        var art_list = $("<table></table>");
        var del_art_btn = $('<input class="del_art" id="' + data[val].id + '" type="button" value="Delete Artist">');
        var add_song_btn = $('<input class="add_song" id="' + data[val].id + '" type="button" value="Add Song">');
        var song_input = $('<input class="song_input" id="in' + data[val].id + '" type="input" placeholder="New Song Name...">');

        art_list.append("<br>");
        art_list.append($("<tr></tr>"));
        art_list.append(del_art_btn);
        art_list.append(song_input);
        art_list.append(add_song_btn);
        art_list.append($("<tr></tr>"));

        let ind = -1;
        for (i in data[val]) {
            if (data[val][i] == data[val]._id || ind > 3) {
                continue;
            }
            ind++;
            art_list.append($("<tr></tr>"));
            art_list.append($("<th></th>").text(titles[ind]));

            if (data[val][i] == data[val].link_profile_picture) { // to see the image
                art_list.append('<img src="' + data[val][i] + '" alt="Artist Profile" width="50" height="50" >');
                continue;
            }
            if (Array.isArray(data[val][i])) {

                // Create table for the songs lists
                var song_list = $("<table></table>");
                for (j in data[val][i]) {
                    var del_song = $('<input class="del_song" id="' + data[val].id + "del" + j + '" type="button" value="Delete Song">');

                    song_list.append($("<tr></tr>"));
                    song_list.append($("<td></td>").text(data[val][i][j]));
                    song_list.append($("<td></td>"));
                    song_list.append(del_song);
                }

                continue;
            }
            art_list.append($("<td></td>").text(data[val][i]));
        }
        song_list.appendTo(art_list);
        art_list.append($("<tr></tr>"));
        art_list.append("<br>");
        art_list.appendTo($("#artists_list"));
    }

    // Add click listeners to the buttons
    $(".del_art").click(function(e) {
        delArtist(e);
    });
    $(".add_song").click(function(e) {
        if ($("#in" + e.target.id).val() == '') return;
        addSong(e);
    });
    $(".del_song").click(function(e) {
        delSong(e);
    });
}
$("document").ready(loadPage);