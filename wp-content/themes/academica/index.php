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
			query_posts( 'p=52' );
			// 循环
			while (have_posts()) : the_post();
				the_title('<h1 class="title-header" style="margin-bottom:20px;">','</h1>');
				the_content();	
			endwhile;
		?>	
	
	<?php if ( is_active_sidebar( 'sidebar-4' ) ) : ?>
    		<div class="column column-narrow" style="margin-top:58px;">
    			<?php dynamic_sidebar( 'sidebar-4' ); ?>
    		</div><!-- end .column-narrow -->
    	<?php endif; ?>

	</div><!-- end .column-content -->



	<?php if ( is_active_sidebar( 'sidebar-2' ) ) : ?>
		<div class="column column-narrow column-last" style="margin-top:58px;">
			<?php dynamic_sidebar( 'sidebar-2' ); ?>
		</div><!-- end .column-narrow -->
	<?php endif; ?>

</div><!-- end #content -->

<?php get_footer(); ?>