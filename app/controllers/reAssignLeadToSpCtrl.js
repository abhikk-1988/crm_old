/**
 * 
 */

//var app = app || {};

(function (app, $) {

    app.controller('reAssignLeadToSpCtrl', function ($scope, user_auth,$http, httpService, $location, baseUrl,$filter, $routeParams) {
    	
    	// Check reassign at the time of user deletion	
		$scope.onDelete = '';
	
		if($routeParams.user_id){
			
    		$scope.onDelete = 'Delete';	
		
			$scope.user_id = $routeParams.user_id;	
		
		}else{
			
			$scope.user_id = '';
		}

        $scope.leadsData = [];
        $scope.backupLeads = [];
        $scope.selectedLeads = [];
        $scope.selectedSingleLeads = [];
        $scope.sales_person = null;
        $scope.agent_list = null;
        
        $scope.isAgentDisabled = true;
        
        $scope.isCheckBox = false;
	    
		// pagination data 
		$scope.pagination = {
			current_page	: 1,
			pagination_size : 4,
			page_size		: 10,
			show_boundary_links : true,
			total_page		: 0,
			changePage : function (page){
				this.current_page = page;
			}
		};
		// End pagination
        
		//console.log(lead_response);
        $scope.filterData = function(item){
        	
    		if(item){
				var statusId = item;
			}else{
				var statusId = 3;
			}
			
    		var leads_config = {
	            url: baseUrl + 'apis/fetchReAssignSalePersonLeads.php',
	            method: 'POST',
	            data : {status : statusId, user_id: $scope.user_id}
	        };
    		var lead_response = httpService.makeRequest(leads_config);
			lead_response.then(function (response) {

	            if (response.data.success == 1 && response.data.http_status_code == 200) {
	                $scope.backupLeads = $scope.leadsData = response.data.data;
					$scope.isCheckBox = false;
					//console.log($scope.leadsData);
	            } else if (response.data.http_status_codes == 401) {
	                $location.path('/');
	            }
	        });
		};
		$scope.filterData();
        $scope.modal = {size: 'sm', title: 'Projects'};
        $scope.view_projects = function (data) {
            $scope.client_enquiry_projects = data;
            $('.bd-example-modal-sm').modal('show'); // Opening modal
        };
        
        // Check All Checkbox
        $scope.checkAll = function () {
        	$scope.selectedLeads = [];
        	var i = 0; 
	        angular.forEach($scope.leadsData, function (item) {
	        	if(i < $scope.pagination.page_size){
		        	if(item.Selected){
		         	   item.Selected = false;
		            }else{
						item.Selected = true;
						$scope.selectedLeads.push(item.enquiry_id);
					}
				}
				i++;
	        });
	        //console.log($scope.selectedLeads);
		};
		
		$scope.checkOneByOne = function () {
        	$scope.selectedLeads = [];
	        angular.forEach($scope.leadsData, function (item) {
	        	if(item.Selected){
	         	   $scope.selectedLeads.push(item.enquiry_id);
	            }
	        });
	        //console.log($scope.selectedLeads);
		};
		 
		// Open popup Of SP List
		$scope.popUpAsmList = function (enquiry_id, category){
         	$scope.enquiry_id_for_asm_assignment    = enquiry_id;
            $scope.lead_category_for_asm_assignment = category;
            
            // open popup of asm users list 
            $('#sp_users_list_popup').modal('show');
        };
        
        // Open popup Of History List
        $scope.popUpHistoryList = function (enquiry_id){
        	if(enquiry_id){
        		 $scope.history_enquiry_id = enquiry_id;
				var history_config = {
		            url: baseUrl + 'apis/getEnquiryHistory.php',
		            method: 'POST',
		            data : {enquiry_id : enquiry_id}
		        };
        		var history_response = httpService.makeRequest(history_config);
				history_response.then(function (response) {
					
		            if (response.data.length > 0) {
		                $scope.historyData = response.data;
		            }else{
						alert("No history available!");
		            }
		            // open popup of asm users list 
	           	 	$('#history_list_popup').modal('show');
				});
        	}
        };
        
        // Ressign lead to ASM
        $scope.manualLeadAssignToSp = function (dom_element, sp_id){
           	
           // $scope.enquiry_id_for_asm_assignment = enquiry_id;
            $scope.lead_category_for_asm_assignment = '';
            
            // Start button animation 
			var button_innerHTML = dom_element.target.innerHTML; // existing button html
			dom_element.target.innerHTML = 'Assigning <i class="fa fa-spinner faa-spin animated"></i>';	
			dom_element.target.disabled = true;
			if(confirm("Are you sure you want to re-assign lead ?")){
				if($scope.selectedLeads.length > 0){
					angular.forEach($scope.selectedLeads, function (item) {
						$scope.enquiry_id_for_sp_assignment = item;
						
						//console.log(http_call_data);
						
						$http({
							url : baseUrl + 'apis/reassign_manual_lead_assign_to_sp.php',
							method : 'POST',
							data : {enquiry_id: item, sp_id : sp_id},
							headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'}
						}).then(function (success){
							if(parseInt(success.data.success) === 1){
								
								dom_element.target.innerHTML   = 'Assigned';
			                    dom_element.target.disabled    = true;
			                    $('#sp_users_list_popup').modal('hide'); // hide asm popup modal
			                    alert(success.data.message);
			                    location.reload();                
							}else{
								// restore original button text 
								dom_element.target.innerHTML = button_innerHTML;
								dom_element.target.disabled = false;
								alert(success.data.message);
							}
						}, function (error){
							dom_element.target.innerHTML = button_innerHTML;
							dom_element.target.disabled = false;	
						});
					});
				}else{
					alert("Please check at least one lead!");
					dom_element.target.innerHTML = button_innerHTML;
					dom_element.target.disabled = false;
					$('#sp_users_list_popup').modal('hide'); 
				}
			}else{
				dom_element.target.innerHTML = button_innerHTML;
				dom_element.target.disabled = false;
				$('#sp_users_list_popup').modal('hide'); 
			}
		};
    	
    	
    	$scope.filterLeads  = function (item){
    		$scope.filterData(item);
        };
        
        $scope.selectedItem = {id:3,label:"Meeting Schedule"};
        $scope.meetingStatus = [];
        $scope.meetingStatus.push({id:3,label:"Meeting Schedule"});
        $scope.meetingStatus.push({id:6,label:"Site Visit Schedule"});
        
        //console.log($scope.selectedItem);
        $scope.$watch('selectedItem', function() {
        	$(".search-input").val('');
        	if($scope.selectedItem.id==3 || $scope.selectedItem.id==6){
				$scope.filterLeads($scope.selectedItem.id);
				$scope.isAgentDisabled = true;
				$scope.isAsmDisabled = false;
				$scope.selectedPage = {id:10, label:"10"};
				$scope.pagination.current_page = 1;
				// get List of ASM
		        httpService.makeRequest({
		            url		: baseUrl + 'apis/getSalesPersonList.php',
		            method	: 'POST',
		            data : {flag : $scope.onDelete}
		        }).then(function (successCallback){
		            $scope.sales_person = successCallback.data;
		        });
			}
	    });
	    
   		// Page Size
   		$scope.selectedPage = {id:10, label:"10"};
        $scope.PageSize = [];
        $scope.PageSize.push({id:10,label:"10"});
        $scope.PageSize.push({id:20,label:"20"});
        $scope.PageSize.push({id:30,label:"30"});
        $scope.PageSize.push({id:50,label:"50"});
        $scope.PageSize.push({id:100,label:"100"});
        $scope.PageSize.push({id:500,label:"500"});
        $scope.$watch('selectedPage', function() {
        	$scope.pagination.page_size = $scope.selectedPage.id;
        });
        
        $scope.$watch('search_lead_query',function(){
        	$scope.leadsData = $filter('filter')($scope.backupLeads, {$:$scope.search_lead_query});
        });
    });

})(app, jQuery);