<?php
/**
 * @package Academica
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="profile" href="http://gmpg.org/xfn/11" />
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

	<?php wp_head(); ?>


<style type="text/css">
body { background-color: #f6f4f4; background-image: url('http://zhuweiteam.com/team/wp-content/uploads/2013/09/zhuweiB11.jpg'); background-repeat: repeat-y; background-position: top center; background-attachment: scroll; }
</style>
<script type="text/javascript">  
jQuery(document).ready(function() {   
jQuery("#menuhead ul").css({display: "none"}); // Opera Fix  
jQuery("#menuhead li").hover(function(){  
        jQuery(this).find('ul:first').css({visibility: "visible",display: "none"}).show(268);  
        },function(){  
        jQuery(this).find('ul:first').css({visibility: "hidden"});  
        });  
});  
</script>
     
</head>

<body cz-shortcut-listen="true">

<div id="wrap">
	 <div id="mainNav"><!-- nav -->
		<?php
	 
			$defaults = array(
				'theme_location'  => '',
				'menu'            => '',
				'container'       => 'div',
				'container_class' => 'wrap',
				'container_id'    => '',
				'menu_class'      => '',
				'menu_id'         => 'menuhead',
				'echo'            => true,
				'fallback_cb'     => 'wp_page_menu',
				'before'          => '',
				'after'           => '',
				'link_before'     => '',
				'link_after'      => '',
				'items_wrap'      => '<ul id="%1$s" class="%2$s">%3$s</ul>',
				'depth'           => 0,
				'walker'          => ''
			);
			 
			wp_nav_menu( $defaults );
		 
		?>
	  </div><!-- end #mainNav -->
  
  <div id="crumbs">
    <div class="wrap">
      <p></p>
    </div><!-- end .wrap -->
  </div>

  <div id="header">
    <div class="wrap">
      <div id="logo"><a href="http://zhuweiteam.com/team"><img src="http://zhuweiteam.com/team/wp-content/uploads/2013/09/zhuweilogo.png" alt="朱伟课题组"></a></div>
      <div id="search"> 
        <form method="get" action="http://localhost/">
         <input type="text" name="s" id="setop" onblur="if (this.value == '') {this.value = 'search';}" onfocus="if (this.value == 'search') {this.value = '';}" value="search">
         <input type="submit" id="searchsubmittop" class="submit" value="search">
        </form>  
      </div><!-- end #search -->
          <div id="social"><ul>
                        </ul></div>      <div class="clear">&nbsp;</div>
    </div><!-- end .wrap -->
  </div><!-- end #header -->