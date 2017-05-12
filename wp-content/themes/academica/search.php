<?php
/**
 * @package Academica
 */

get_header(); ?>

<div id="content" class="clearfix">

	<div class="column column-narrow category-column-narrow">
		<?php dynamic_sidebar( 'sidebar-4' ); ?>
	</div><!-- end .column-narrow -->

	

	<div class="column column-content column-double posts">

		<div class="column column-title">
			<h1 class="title-header"><?php printf( __( 'Search Results for: %s', 'academica' ), '<span>' . get_search_query() . '</span>' ); ?></h1>
		</div><!-- end .column-title -->

		<?php
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				get_template_part( 'category-content');
			endwhile;
			academica_content_nav();
		else : ?>

		<p><?php _e( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'academica' ); ?></p>
		<?php get_search_form(); ?>

		<?php endif; ?>

	</div><!-- end .column-content -->


</div><!-- end #content -->

<?php get_footer(); ?>