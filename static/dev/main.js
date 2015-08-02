window.onload = function () {
      var blog = document.getElementById('blog');
      blog.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('blog-section').style.display = "block";
      }, false);
}