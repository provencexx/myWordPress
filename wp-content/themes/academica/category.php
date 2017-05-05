<?php
/**
 * @package Academica
 */

get_header(); ?>

<div id="content" class="clearfix">

	<div class="column column-narrow category-column-narrow">
		<?php dynamic_sidebar( 'sidebar-4' ); ?>
	</div><!-- end .column-narrow -->

	<div id="column-content" class="column column-content column-double posts">

		<div class="column column-title">
		
		<!--<php get_template_part( 'breadcrumb' ); ?>-->
		
		<!-- 类目title -->
		<h1 class="title-header"><?php
			if ( is_category() ) {
				printf( __( '%s', 'academica' ), '<span>' . single_cat_title( '', false ) . '</span>' );

			} elseif ( is_tag() ) {
				printf( __( '%s', 'academica' ), '<span>' . single_tag_title( '', false ) . '</span>' );

			} elseif ( is_author() ) {
				$authordata = get_userdata( $author );
				printf( __( '%s', 'academica' ), '<span class="vcard"><a class="url fn n" href="' . get_author_posts_url( $authordata->ID, $authordata->user_nicename ) . '" title="' . esc_attr( $authordata->display_name ) . '" rel="me">' . $authordata->display_name . '</a></span>' );

			} elseif ( is_day() ) {
				printf( __( '%s', 'academica' ), '<span>' . get_the_date() . '</span>' );

			} elseif ( is_month() ) {
				printf( __( '%s', 'academica' ), '<span>' . get_the_date( 'F Y' ) . '</span>' );

			} elseif ( is_year() ) {
				printf( __( '%s', 'academica' ), '<span>' . get_the_date( 'Y' ) . '</span>' );

			} else {
				_e( 'Archives', 'academica' );

			}
		?></h1>
	</div>
		<!-- 类目title -->
		<?php
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();	
			//the_post_thumbnail();
			//	the_excerpt();
				get_template_part( 'category-content');
			endwhile;

			//分页
			academica_content_nav();

		else : ?>

			<p><?php _e( 'It seems we can&rsquo;t find what you&rsquo;re looking for. Perhaps searching can help.', 'academica' ); ?></p>
			<?php get_search_form(); ?>

		<?php endif; ?>


	</div><!-- end .column-content -->


</div><!-- end #content -->

<?php get_footer(); ?>