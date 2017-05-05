=== Category Thumbnail List ===
Contributors: Jonk
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9344931
Tags: category, categories, thumbnail, list, post, posts, image, images
Requires at least: 2.9.0
Tested up to: 3.2
Stable tag: 1.11

Lists a category with thumbnails.

== Description ==

These two rows must be in function.php in the theme for the plugin to work:

add_theme_support( 'post-thumbnails' );

set_post_thumbnail_size( form_option('thumbnail_size_w&&echo=false'), form_option('thumbnail_size_h&&echo=false'), true );

You'll also need to add thumbnails to the posts you want visible in the list.

After that, all you need to do is to add the hook [categorythumbnaillist 3] (where 3 is a categoy id) to your post.

== Installation ==

This section describes how to install the plugin and get it working.

1. Upload "categoy-thumbnail-list" to the "/wp-content/plugins/" directory
2. Add the following rows to your themes functions.php
add_theme_support( 'post-thumbnails' );
set_post_thumbnail_size( form_option('thumbnail_size_w&&echo=false'), form_option('thumbnail_size_h&&echo=false'), true );
3. Activate the plugin through the "Plugins" menu in WordPress
4. Add the hook in a post. Example: [categorythumbnaillist 3]

== Frequently Asked Questions ==

None, yet.

== Screenshots ==

1. The plugin in action.

== Changelog ==

= 0.1 =
* Creation

= 0.2 =
* The list uses only the category specified in the hook
* The list appears at the same place as the hook is added
* Multiple lists in a post is possible

= 0.3 =
* Bug fixes

= 0.4 =
* Bug fixes

= 0.9 =
* Unlimited number of thumbnails
* Doesn't feel like beta anymore
* Suggestions?

= 0.91 =
* Better tagging

= 1.01 =
* Settings page created
* Added aplhabetical sorting and the posibility to sort ascending or descending. Sorting by date is still available as in previous versions.
* Uses WordPress settings for Thumbnail size if you change the code in functions.php as stated in the description
* Tested for WordPress 3.0

= 1.02 =
* Fixed typo

= 1.1 =
* All posts are now visible in the list, not only the number of posts set in /wp-admin/options-reading.php

= 1.11 =
Update as suggested by alchymyth http://wordpress.org/support/topic/plugin-category-thumbnail-list-comments-show-up-on-page
