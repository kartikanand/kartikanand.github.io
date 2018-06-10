---
title: "Using an existing DB with Django"
layout: post
date: 2018-06-10 09:00
headerImage: false
tag:
- development
- programming
- python
- django
category: blog
author: kartikanand
description: A short post on how to use a legacy database with a new Django project
---

![](https://cdn-images-1.medium.com/max/1600/1*dhmxpJkkJ5cAlojP_hyxIg.png){: .center-image }

>Recently I had to move an existing CMS application to Django for a friend. The task involved using an existing database with Django, which led to me spending the whole weekend to get it just right. In this post I have laid out the steps that I did to make it work.

Start by creating an empty Django project, don’t create any apps for now, just open the `settings.py` file and change the path of database to your existing database.

Now, for all intents and purposes Django will use your existing DB. First, we’ll need to create models for the existing tables already present in the DB. To do this, use the following Django command and save it to a temporary file

    ./manage.py inspectdb > temp_models.py

If you open this file, you’ll see that Django would have created models for your existing schema. You’ll want to clean up this file a bit, the most important thing being, that every table should have a primary key. You may also want to change your primary key field to `models.AutoField` so that Django would automatically populate it. Also, you may want to change `managed = False` to `managed = True` for each model if you want Django to manage these tables (which you will want).

Now we want to migrate existing Django internal apps to the DB such as — auth, contenttypes, etc.

    ./manage.py migrate

The next step is to create an app for your project, you may want to create a single app and move all your models there, or you may create different apps and move some models to each one of them. It doesn’t matter what approach you prefer, you just need to follow the given steps to make sure everything works properly

    ./manage.py createapp myapp

Now move the temp_models.py to `myapp/models.py`, this assumes that you’ve already cleaned up the file.

Add your app to the list of `INSTALLED_APPS`, be sure to add it to the top of the list.

After this, we want to create migrations for these models, we want to create initial migrations since Django depends upon these to figure out changes. If we don’t create these, we won’t be able to do incremental migrations on our models.

    ./manage.py makemigrations myapp

If this were not an existing DB, we would have migrated the current app so that Django creates all the necessary tables and what not. But since the tables are already there, we’ll just tell Django to fake it.

    ./manage.py migrate myapp --fake-initial

And we’re done!

After this, we can start using the this project as is with Django, create new fields, alter fields, make migrations, and migrate them (don’t fake them this time)

References:

[Using Django with legacy databases](https://docs.djangoproject.com/en/2.0/howto/legacy-databases/)


### [Kartik Anand](https://medium.com/@exqu17)
