<?php
/**
 * @package Academica
*/
?>

<div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php the_title( '<h1 class="title-header">', '</h1>' ); ?>
	<!-- 隐藏作者时间等信息
	<div class="entry-meta">
		<?php
		academica_entry_meta();
		edit_post_link( __( 'Edit', 'academica' ), '<span class="edit-link"> / ', '</span>' ); ?>
	</div><!-- end .entry-meta -->

	<div class="entry-content clearfix">
		<?php
		the_content();
		wp_link_pages( array(
			'before' => '<p class="pages"><strong>' . __( 'Pages:', 'academica' ) . '</strong>',
			'after' => '</p>',
			'next_or_number' => 'number'
		) ); ?>
	</div><!-- end .entry-content -->

    <!--<div class="entry-meta">
        <?php
        the_tags( '<p class="tags"><strong>' . __( 'Tags:', 'academica' ) . '</strong> ', ', ', '</p>' ); ?>
    </div>-->
    <!-- end .entry-meta -->

</div><!-- end #post-## -->