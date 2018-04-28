// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='container article-pop'><h4 class ='news-title-link'data-id='" + data[i]._id + "'>" + data[i].title + "</h4><button class='btn btn-info'><a target='_blank' id='see-more' href='" + data[i].link + "'>Read Article</a></button></div>");
    }
  });


//Hide content
$("#wrapper").hide();
//show content
$("#get-news").on("click", function() {
  $("#wrapper").show();
})

$("#home-btn").on("click", function() {
  $("#wrapper").hide();
})

// Whenever someone clicks a p tag
$(document).on("click", ".news-title-link", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<div class='outline' id='note-title'><h2>" + data.title + "</h2></div>");
        // An input to enter a new title
        $("#notes").append("<br><input class='form-control' placeholder='Note Title' id='titleinput' name='title' ><br>");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' class='form-control' placeholder='Note Message' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<br><button class='btn btn-info' data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").append(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").append(data.note.body);
        }
      });
  });

  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
  
  