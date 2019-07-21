---
layout: page
title: ramblings
---

<section class="blog-posts">
	{% for post in site.posts %}
		{% if post.category == 'blog' %}
			{% if post.hidden != true %}
            <h6 class="blog-post">
                {{ post.date | date: "%b %d %Y" }} -
    			<a class="url" href="{{ site.url }}{{ post.url }}">
                    {{ post.title }}
                </a>
            </h6>
			{% endif %}
		{% endif %}
	{% endfor %}
</section>
