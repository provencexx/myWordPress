<?php
/**
 * @package Academica
 */

get_header(); ?>

<div id="content" class="clearfix">
	
    <?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
    	<div class="column column-narrow" style="margin-top:58px;">
    		<?php dynamic_sidebar( 'sidebar-1' ); ?>
    	</div><!-- end .column-narrow -->
    <?php endif; ?>

	<div id="column-content" class="column column-content posts">
		<?php
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				get_template_part( 'content', get_post_format() );
			endwhile;
			academica_content_nav();
		 endif; ?>

	</div><!-- end .column-content -->



	<?php if ( is_active_sidebar( 'sidebar-2' ) ) : ?>
		<div class="column column-narrow column-last" style="margin-top:58px;">
			<?php dynamic_sidebar( 'sidebar-2' ); ?>
		</div><!-- end .column-narrow -->
	<?php endif; ?>

</div><!-- end #content -->

<?php get_footer(); ?>