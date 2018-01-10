---
layout: page
title: Home
---

<section class="list">
	<h2 class="text-center">Recent Posts</h2>
	{% for post in site.posts limit:3 %}
		{% if post.category == 'blog' %}
			{% if post.hidden != true %}
				{% include blog-post.html %}
			{% endif %}
		{% endif %}
	{% endfor %}
</section>
