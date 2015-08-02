window.onload = function () {
      var blog = document.getElementById('blog');
      blog.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('blog-section').style.display = "block";
      }, false);

      var contact = document.getElementById('contact');
      contact.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('contact-section').style.display = "block";
      }, false);
}