<?php
/**
 * Template Name: Sidebar Left
 *
 * @package Academica
 */

get_header(); ?>

<div id="content">

	<div class="wrap">

		<div class="sep sepinside">&nbsp;</div>


	 	<div class="column column-narrow">&nbsp;</div><!-- end .column-narrow -->

		<div class="column column-double column-last column-content single">

			<?php get_template_part( 'title', 'page' );?>

		</div><!-- end .column-content -->

		<div class="column column-narrow">
			<?php dynamic_sidebar( 'sidebar-1' ); ?>
		</div><!-- end .column-narrow -->

		<div class="clear">&nbsp;</div>

		<div class="column column-double column-last column-content single">

			<?php while ( have_posts() ) : the_post(); ?>

		</div><!-- end .column-content -->

		<?php endwhile; ?>
	</div><!--end .wrap -->

</div><!-- end #content -->

<?php get_footer(); ?>