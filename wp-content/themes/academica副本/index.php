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

		<div class="column column-double column-last column-content">

			<?php get_template_part( 'title', 'page' );?>

		</div><!-- end .column-content -->

		<div class="clear">&nbsp;</div>

		<div class="column column-narrow">
			<?php dynamic_sidebar( 'sidebar-1' ); ?>
		</div><!-- end .column-narrow -->

		<div class="column column-content">
			<?php
				query_posts( 'p=71' );
				// 循环
				while (have_posts()) : the_post();
					the_content();	
				endwhile;
			?>		

		</div><!-- end .column-content -->

		<div class="column column-narrow column-last">
			<?php dynamic_sidebar( 'sidebar-2' ); ?>
		</div><!-- end .column-narrow -->

		<div class="clear">&nbsp;</div>

		
	</div><!--end .wrap -->

</div><!-- end #content -->

<?php get_footer(); ?>