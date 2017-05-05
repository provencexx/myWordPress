<?php
/**
 * Template Name: Full Width
 *
 * @package Academica
 */

get_header(); ?>

<div id="content">
	<?php while ( have_posts() ) : the_post(); ?>
	<div class="wrap">

		<div class="sep sepinside">&nbsp;</div>
		啊四面佛

		<div class="column column-content column-full column-last">
        	<?php get_template_part( 'title', 'page' );?>
      	</div>

      	<div class="clear">&nbsp;</div>

		<div class="column column-content column-full column-last">
			<p style="text-align: center;">&nbsp;</p>

			<?php get_template_part( 'content', 'page' );?>

			<p>&nbsp;</p>
			<p style="text-align: justify;">&nbsp;</p>
			<p class="postmetadata"></p>

		</div><!-- end .column-content -->
		<div class="clear">&nbsp;</div>
	</div><!-- end .wrap -->

	<?php endwhile; ?>

</div><!-- end #content -->

<?php get_footer(); ?>


