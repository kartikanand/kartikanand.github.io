window.onload = function () {
      var blog = document.getElementById('blog');
      blog.addEventListener('click', function (event) {
        event.preventDefault();
        hideSections();
        document.getElementById('blog-section').style.display = "block";
      }, false);

      var contact = document.getElementById('contact');
      contact.addEventListener('click', function (event) {
        event.preventDefault();
        hideSections();
        document.getElementById('contact-section').style.display = "block";
      }, false);
}

function hideSections () {
    var sections = document.getElementsByTagName("section");

    for (var i=0; i<sections.length; i++) {
        sections[i].style.display = "none";
    }
}