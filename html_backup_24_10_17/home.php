
<!--
<style>
 #pusher_state {
                background-color: darkgreen;
                color: whitesmoke;
                padding: 3px;
                width: 356px;
                text-align: center;
                font-size: x-large;
            }
</style>
-->
<div class="dashbaord-section" ng-init="dynamicPopover.content = 'This is demo popover content'" ng-init="dynamicPopover.title='this is demo popover title'">
    <div>
        <h1 class="alert alert-info">DASHBOARD</h1>
		
<!--
        <div id="pusher_state">
                Pusher State
        </div>
        
-->
		<p>
			<?php 
				
				echo 'Login System IP: '. $_SERVER['REMOTE_ADDR'];
			?>
		</p>
</div>
</div>
       

       <?php  
       
//        24 hour to 12 hour conversion
       echo date("g:i a", strtotime("13:30")); 

//        12 hour to 24 hour format conversion
       echo date("H:i a", strtotime("5:30 pm"));

       $email = "john.doe@example.com";

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                echo("$email is not a valid email address");
        }

       ?>
