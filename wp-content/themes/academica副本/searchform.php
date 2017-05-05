<?php
/**
 * @package Academica
 */
?>
<form method="get" id="searchform" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label for="s" class="assistive-text hidden"><?php _e( 'Search', 'academica' ); ?></label>
	<input id="s" type="text" name="s" placeholder="<?php esc_attr_e( 'Search', 'academica' ); ?>">
	<button id="searchsubmit" name="submit" type="submit"><?php _e( 'Search', 'academica' ); ?></button>
</form>


<div id="search"> 
    <form method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
     <input type="text" name="s" id="setop" onblur="if (this.value == '') {this.value = 'search';}" onfocus="if (this.value == 'search') {this.value = '';}" value="search">
     <input type="submit" id="searchsubmittop" class="submit" value="search">
    </form>  
</div><!-- end #search -->