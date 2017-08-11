<?php
/**
 * @package Academica
 */
?>
			<div id="footer" class="clearfix">
				
			<?php if ( is_active_sidebar( 'sidebar-7' ) ) : ?>
    				<?php dynamic_sidebar( 'sidebar-7' ); ?>
    			<?php endif; ?>
				
			</div><!-- end #footer -->
		</div><!-- end #wrap -->

		<?php wp_footer(); ?>
	</body>
</html>