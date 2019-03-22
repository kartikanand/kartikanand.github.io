---
layout: page
title: ramblings
---

> think of these more as my experience with code rather than as tutorials to help you do something.

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
