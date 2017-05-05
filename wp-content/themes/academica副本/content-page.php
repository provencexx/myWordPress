<?php
/**
 * @package Academica
*/
?>
		<?php
		the_content();
		wp_link_pages( array(
			'before' => '<p class="pages"><strong>' . __( 'Pages:', 'academica' ) . '</strong>',
			'after' => '</p>',
			'next_or_number' => 'number'
		) ); ?>
