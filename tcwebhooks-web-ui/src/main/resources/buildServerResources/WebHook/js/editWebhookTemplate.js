WebHooksPlugin = {
	handleAjaxError: function(dialog, response) {
		dialog.cleanErrors();
		if (response.status === 422) {
			if (response.responseJSON.errored) {
				$j.each(response.responseJSON.errors, function(index, errorMsg){
					dialog.ajaxError(errorMsg)
				});
			}
		} else {
		  alert(response);
		}
	},
    editBuildEventTemplate: function(data) {
    	if (!restApiDetected) {
    		WebHooksPlugin.NoRestApiDialog.showDialog();
    	} else {
    		WebHooksPlugin.TemplateEditBuildEventDialog.showDialog("Edit Build Event Template", 'editBuildEventTemplate', data);
    	}
    },
    copyBuildEventTemplate: function(data) {
    	if (!restApiDetected) {
    		WebHooksPlugin.NoRestApiDialog.showDialog();
    	} else {
    		WebHooksPlugin.TemplateEditBuildEventDialog.showDialog("Copy Build Event Template", 'copyBuildEventTemplate', data);
    	}
    },
    addBuildEventTemplate: function(data) {
    	if (!restApiDetected) {
    		WebHooksPlugin.NoRestApiDialog.showDialog();
    	} else {
    		WebHooksPlugin.TemplateEditBuildEventDialog.showDialogAddEventTemplate("Add Build Event Template", 'addBuildEventTemplate', data);
    	}
    },
    createDefaultTemplate: function(data) {
    	if (!restApiDetected) {
    		WebHooksPlugin.NoRestApiDialog.showDialog();
    	} else {
    		WebHooksPlugin.TemplateEditBuildEventDialog.showDialogCreateDefaultTemplate("Add Default Template", 'addDefaultTemplate', data);
    	}
    },
    editTemplateDetails: function(data) {
    	if (!restApiDetected) {
    		WebHooksPlugin.NoRestApiDialog.showDialog();
    	} else {
    		WebHooksPlugin.EditTemplateDialog.showDialog("Edit Template", 'editTemplate', data);
    	}
    },
    copyTemplate: function(data) {
    	if (!restApiDetected) {
    		WebHooksPlugin.NoRestApiDialog.showDialog();
    	} else {
    		WebHooksPlugin.EditTemplateDialog.showDialog("Copy Template", 'copyTemplate', data);
    	}
    },
    disableTemplate: function(data) {
    	alert("This is not implemented yet.");
    },
    deleteBuildEventTemplate: function(data) {
    	if (!restApiDetected) {
    		WebHooksPlugin.NoRestApiDialog.showDialog();
    	} else {
    		WebHooksPlugin.DeleteTemplateItemDialog.showDialog("Delete Build Event Template", 'deleteBuildEventTemplate', data);
    	}
    },
    deleteTemplate: function(data) {
    	if (!restApiDetected) {
    		WebHooksPlugin.NoRestApiDialog.showDialog();
    	} else {
    		WebHooksPlugin.DeleteTemplateDialog.showDialog("Delete Template", 'deleteTemplate', data);
    	}
    },
    TemplateEditBuildEventDialog: OO.extend(BS.AbstractWebForm, OO.extend(BS.AbstractModalDialog, {
        getContainer: function () {
            return $('editTemplateItemDialog');
        },

        formElement: function () {
            return $('editTemplateItemForm');
        },

        showDialogCreateDefaultTemplate: function (title, action, data) {
        	
        	//this.getWebHookTemplateData(data.templateId, data.templateNumber, action);
        	this.getParentTemplateData(data.templateId, data.templateNumber, action)
			this.disableCheckboxes();
			this.clearEditor();

            $j("input[id='WebhookTemplateaction']").val(action);
            $j(".dialogTitle").html(title);
            this.cleanFields(data);
            this.cleanErrors();
            this.showCentered();
        },
        
        showDialogAddEventTemplate: function (title, action, data) {
        	
        	this.getTemplateDataOrGetParentOnFailure(data.templateId, data.templateNumber, action)
        	
        	$j("input[id='WebhookTemplateaction']").val(action);
        	$j(".dialogTitle").html(title);
        	this.cleanFields(data);
        	this.cleanErrors();
        	this.showCentered();
        },
        
        showDialog: function (title, action, data) {
        	
        	this.getWebHookTemplateData(data.templateId, data.templateNumber, action);
        	
            $j("input[id='WebhookTemplateaction']").val(action);
            $j(".dialogTitle").html(title);
            this.cleanFields(data);
            this.cleanErrors();
            this.showCentered();
        },

        cleanFields: function (data) {
            $j("#repoEditFilterForm input[id='debrepo.uuid']").val(data.uuid);
            $j("#repoEditFilterForm input[id='debrepofilter.id']").val(data.id);
            $j(".runnerFormTable input[id='debrepofilter.regex']").val(data.regex);
            $j(".runnerFormTable input[id='debrepofilter.dist']").val(data.dist);
            $j(".runnerFormTable input[id='debrepofilter.component']").val(data.component);
            $j(".runnerFormTable select[id='debrepofilter.buildtypeid']").val(data.build);
            $j("#repoEditFilterForm input[id='projectId']").val(data.projectId);

            this.cleanErrors();
        },

        cleanErrors: function () {
            $j("#editTemplateItemForm .error").remove();
        },

        error: function($element, message) {
            var next = $element.next();
            if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
                next.text(message);
            } else {
                $element.after("<p class='error'>" + message + "</p>");
            }
        },
        
        ajaxError: function(message) {
        	var next = $j("#ajaxTemplateItemEditResult").next();
        	if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
        		next.text(message);
        	} else {
        		$j("#ajaxTemplateItemEditResult").after("<p class='error'>" + message + "</p>");
        	}
        },

        doValidate: function() {
            var errorFound = false;

            var name = $j('input[id="debrepo.name"]');
            if (name.val() == "") {
                this.error(name, "Please set the repository name");
                errorFound = true;
            }

            return !errorFound;
        },
        
		getWebHookTemplateData: function (templateId, buildTemplateId, action) {
			this.disableCheckboxes();
			this.clearEditor();
			this.getTemplateData(templateId, buildTemplateId, action);
		},
		putWebHookTemplateData: function () {
			this.disableCheckboxes();
			this.updateJsonDataFromForm();
			this.putTemplateData();
		},
		postWebHookTemplateData: function () {
			this.updateJsonDataFromForm();
			this.postTemplateData();
		},
		disableCheckboxes: function () {
			$j("#editTemplateItemForm input.buildState").prop("disabled", true);
			$j("#editTemplateItemForm label").addClass("checkboxLooksDisabled");
		},
		enableCheckboxes: function () {
			$j("#editTemplateItemForm input.buildState").prop("disabled", false);
		},
		updateJsonDataFromForm: function () {
			myJson.templateText.content = editor.getValue();
			myJson.templateText.useTemplateTextForBranch = $j("#editTemplateItemForm input#useTemplateTextForBranch").is(':checked');
			myJson.branchTemplateText.content = editorBranch.getValue();
			
    		$j(myJson.buildState).each(function() {
    			//console.log(this.type + " :: "+ this.enabled);
    			this.enabled = $j("#editTemplateItemForm input[id='" + this.type + "']").prop( "checked");
    		});

		},
		clearEditor: function () {
			editor.session.setValue("Loading...");
			editorBranch.session.setValue("Loading...");
		},
		getParentTemplateData: function (templateId, buildTemplateId, action) {
			/* This method is used if the payload template does not have a default template.
			 * In that case, we don't have info about the parent template, so we request it here
			 * and graft it into the json request. 
			 * 
			 * Next we initialise the buildStates as all editable and then iterate over any
			 * Build Event Templates  in the templateItem[] and set editable:false for any buildStates 
			 * which already have a template defined. 
			 */
			var dialog = this;
			$j.ajax ({
				url: window['base_uri'] + '/app/rest/webhooks/templates/id:' + templateId,
				type: "GET",
				headers : {
					'Accept' : 'application/json'
				},
				success: function (response) {
					myJson = { 
							parentTemplate : response,
							templateText : { content: "" },
							branchTemplateText :  { content: "" },
							buildState : [ 
										{ type: "buildStarted", 		 enabled : false, editable: true },
										{ type: "changesLoaded", 		 enabled : false, editable: true },
										{ type: "buildInterrupted", 	 enabled : false, editable: true },
										{ type: "beforeBuildFinish", 	 enabled : false, editable: true },
										{ type: "buildSuccessful", 		 enabled : false, editable: true },
										{ type: "buildFailed", 			 enabled : false, editable: true },
										{ type: "buildFixed", 			 enabled : false, editable: true },
										{ type: "buildBroken", 			 enabled : false, editable: true },
										{ type: "responsibilityChanged", enabled : false, editable: true }
									]					
					};
					
					// If we have the pluralised name, pass the reference to a singular form.
					// This works around Jackson 2.x using singular names, and Jackson 1.x using plural.
					if (typeof myJson.parentTemplate.templateItems !== 'undefined' 
						&& myJson.parentTemplate.templateItems != null 
						&& myJson.parentTemplate.templateItems.length > 0) 
					{
						myJson.parentTemplate.templateItem = myJson.parentTemplate.templateItems;
					}
					
					if (typeof myJson.parentTemplate.templateItem !== 'undefined' 
						&& myJson.parentTemplate.templateItem != null 
						&& myJson.parentTemplate.templateItem.length > 0) 
					{
						$j(myJson.parentTemplate.templateItem).each(function(thing, templateItem) {
							//console.log(templateItem);
							//console.log(templateItem.enabled);
							if (typeof templateItem.buildStates !== 'undefined' 
								&& templateItem.buildStates != null 
								&& templateItem.buildStates > 0)
							{
								templateItem.buildState = templateItem.buildStates;
							}
							$j(templateItem.buildState).each(function(index, itembuildState){
								if (itembuildState.enabled) {
									$j(myJson.buildState).each(function(thang, buildState) {
										//console.log(buildState);
										if (buildState.type == itembuildState.type) {
											//console.log("they match " + buildState + templateItem);
											buildState.editable = false;
										}
									});
								}
							});
						});
					}
					
					//console.log(myJson);
					dialog.handleGetSuccess(action);
				}
			});
		}, 
		getTemplateData: function (templateId, buildTemplateId, action) {
			var dialog = this;
    		$j.ajax ({
    			url: window['base_uri'] + '/app/rest/webhooks/templates/id:' + templateId + '/templateItems/' + buildTemplateId + '?fields=**',
    		    type: "GET",
    		    headers : {
    		        'Accept' : 'application/json'
    		    },
    		    success: function (response) {
    				myJson = response;
    				//console.log(myJson);
    				dialog.handleGetSuccess(action);
    		    }
    		});
		}, 
		getTemplateDataOrGetParentOnFailure: function (templateId, buildTemplateId, action) {
			var dialog = this;
			$j.ajax ({
				url: window['base_uri'] + '/app/rest/webhooks/templates/id:' + templateId + '/templateItems/' + buildTemplateId + '?fields=**',
				type: "GET",
				headers : {
					'Accept' : 'application/json'
				},
				success: function (response) {
					myJson = response;
					//console.log(myJson);
					dialog.handleGetSuccess(action);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					if (xhr.status == 404) {
						dialog.getParentTemplateData(templateId, buildTemplateId, action);
					} else {
						console.log(xhr);
						console.log(ajaxOptions);
						console.log(thrownError);
					}
				}
			});
		}, 
		handleGetSuccess: function (action) {
			$j("#templateHeading").html(myJson.parentTemplate.description);
			// If we have the pluralised name, pass the reference to a singular form.
			// This works around Jackson 2.x using singular names, and Jackson 1.x using plural.
			if (typeof myJson.parentTemplate.templateItems !== 'undefined' 
				&& myJson.parentTemplate.templateItems != null 
				&& myJson.parentTemplate.templateItems.length > 0) 
			{
				myJson.parentTemplate.templateItem = myJson.parentTemplate.templateItems;
			}			
			if (typeof myJson.buildStates !== 'undefined' 
				&& myJson.buildStates != null 
				&& myJson.buildStates.length > 0) 
			{
				myJson.buildState = myJson.buildStates;
			}			
			this.updateCheckboxes(action);
			this.updateEditor(action);
		},
		putTemplateData: function () {
			var dialog = this;
			$j.ajax ({
				url: myJson.href,
				type: "PUT",
				data: JSON.stringify(myJson),
				dataType: 'json',
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json'
				},
				success: function (response) {
					//console.log(response);
					dialog.close();
					$("buildEventTemplatesContainer").refresh();
				},
				error: function (response) {
					console.log(response);
					WebHooksPlugin.handleAjaxError(dialog, response);
				}
			});
		}, 
		postTemplateData: function () {
			var dialog = this;
			//console.log($j("input[id='WebhookTemplateaction']").val());
			var templateSubUri = "/templateItem";
			if ($j("input[id='WebhookTemplateaction']").val() === "addDefaultTemplate") {
				templateSubUri = "/defaultTemplate";
			}
			$j.ajax ({
				url: myJson.parentTemplate.href + templateSubUri,
				type: "POST",
				data: JSON.stringify(myJson),
				dataType: 'json',
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json'
				},
				success: function (response) {
					dialog.close();
					$("buildEventTemplatesContainer").refresh();
				},
				error: function (response) {
					console.log(response);
					WebHooksPlugin.handleAjaxError(dialog, response);
				}
			});
		}, 
		handlePutSuccess: function () {
			$j("#templateHeading").html(myJson.parentTemplateDescription);
			this.updateCheckboxes();
			this.updateEditor();
		},
		updateCheckboxes: function (action) {
			
        	if (action === 'copyBuildEventTemplate' || action === 'addBuildEventTemplate') {
        		if (myJson.id == 'defaultTemplate') {
            		$j(myJson.buildState).each(function() {
            			//console.log(this.type + " :: "+ this.enabled);
            			$j("#editTemplateItemForm input[id='" + this.type + "']").prop( "checked", false).prop( "disabled", ! this.enabled);
            			if (this.enabled) {
            				$j("#editTemplateItemForm td[class='" + this.type + "'] label").removeClass("checkboxLooksDisabled");
            			}
            		});
        		} else {
            		$j(myJson.buildState).each(function() {
            			//console.log(this.type + " :: "+ this.enabled);
            			$j("#editTemplateItemForm input[id='" + this.type + "']").prop( "checked", false).prop( "disabled", ! this.editable && ! this.enabled);
            			if (this.editable && ! this.enabled) {
            				$j("#editTemplateItemForm td[class='" + this.type + "'] label").removeClass("checkboxLooksDisabled");
            			}
            		});
        		}
        		myJson.id = '_new';
        	} else {
	    		$j(myJson.buildState).each(function() {
	    			//console.log(this.type + " :: "+ this.enabled);
	    			if (action === 'addDefaultTemplate') {
	    				$j("#editTemplateItemForm input[id='" + this.type + "']").prop( "checked", this.editable).prop( "disabled", true);
	    			} else {
		    			$j("#editTemplateItemForm input[id='" + this.type + "']").prop( "checked", this.enabled).prop( "disabled", ! this.editable);
		    			if (this.editable) {
		    				$j("#editTemplateItemForm td[class='" + this.type + "'] label").removeClass("checkboxLooksDisabled");
		    			}
	    			}
	    		});
        	}
        	
        	if (action === 'addDefaultTemplate' || action === 'addBuildEventTemplate') {
	    		$j("#editTemplateItemForm input[id='useTemplateTextForBranch']").prop( "checked", false).prop( "disabled", false);
				$j("label.useTemplateTextForBranch").removeClass("checkboxLooksDisabled");
				myJson.id = '_new';
        	} else {
	    		$j("#editTemplateItemForm input[id='useTemplateTextForBranch']").prop( "checked", myJson.templateText.useTemplateTextForBranch).prop( "disabled", false);
				$j("label.useTemplateTextForBranch").removeClass("checkboxLooksDisabled");
			}
		},
		updateEditor: function (action) {
			if (action === 'addDefaultTemplate' || action === 'addBuildEventTemplate') {
				editor.session.setValue("");
				editorBranch.session.setValue("");				
			} else {
				//console.log(myJson.templateText.content);
				editor.session.setValue(myJson.templateText.content);
				editorBranch.session.setValue(myJson.branchTemplateText.content);
			}
		},
		
		doPost: function() {
			//console.log(myJson);
			if (myJson.id == '_new' || myJson.id == '_copy') {
				this.postWebHookTemplateData();
			} else {
				this.putWebHookTemplateData();
			}
			return false;
		},
		
		openPreviewDialog: function() {
			WebHooksPlugin.PreviewTemplateItemDialog.showDialog();
		}
		
    })),
    
    PreviewTemplateItemDialog: OO.extend(BS.AbstractWebForm, OO.extend(BS.AbstractModalDialog, {
    	getContainer: function () {
    		return $('previewTemplateItemDialog');
    	},
    	
    	formElement: function () {
    		return $('previewTemplateItemForm');
    	},
    	
    	loadProjectList: function () {
    		$j("#previewTemplateItemDialogProjectSelect").append($j('<option></option>').val(null).html("Loading project list..."))
			$j.ajax ({
				url: window['base_uri'] + '/app/rest/projects',
				type: "GET",
				headers : {
					'Accept' : 'application/json'
				},
				success: function (response) {
					var myselect = $j('<select>');
					myselect.append( $j('<option></option>').val(null).html("Choose a Project...") );
					$j(response.project).each(function(index, project) {
						//console.log(project);
						if (project.id === '_Root') { 
							myselect.append( $j('<option></option>').val(project.id).html(project.id) );
						} else {
							myselect.append( $j('<option></option>').val(project.id).html(project.name) );
						}
					});
					$j("#previewTemplateItemDialogProjectSelect").empty().append(myselect.html()).off().change(
							function() {
								WebHooksPlugin.PreviewTemplateItemDialog.loadBuildList( $j(this).val() );
								WebHooksPlugin.PreviewTemplateItemDialog.loadWebHookList( $j(this).val() );
							});
				},
				error: function (response) {
					console.log(response);
					alert(response);
				}
			});
    	},
    	
    	loadBuildList: function (projectId) {
    		if (!projectId) { // We got a null or undefined projectId. Empty the build list and return
    			$j("#previewTemplateItemDialogBuildSelect").empty();
    			return;
    		}
    		
    		var locator = 'project:' + projectId + ',';
    		
	   		if (projectId === '_Root') { // If _Root, don't specify project in locator
	   			locator = '';
	   		}
    		
    		$j("#previewTemplateItemDialogBuildSelect").empty().append($j('<option></option>').val(null).html("Loading build history..."))
    		$j.ajax ({
    			url: window['base_uri'] + '/app/rest/builds?locator=' + locator
    					+ "state:finished&fields=build(id,number,status,finishDate,buildType(id,name))",
    			type: "GET",
    			headers : {
    				'Accept' : 'application/json'
    			},
    			success: function (response) {
    				var myselect = $j('<select>');
    				myselect.append( $j('<option></option>').val(null).html("Choose a Build...") );
    				$j(response.build).each(function(index, build) {
    					//console.log(build);
    					var desc = build.buildType.name 
    							  + "#" + build.number 
    							  + " - " + build.status + " ("
    							  + moment(build.finishDate, moment.ISO_8601).fromNow()
    							  + ")";
    					
						myselect.append( $j('<option></option>').val(build.id).html(desc) );
    				});
    				$j("#previewTemplateItemDialogBuildSelect").empty().append(myselect.html());
    	    		$j("#previewTemplateItemDialogBuildSelect").off().change( function() {
        				WebHooksPlugin.PreviewTemplateItemDialog.renderPreview();
    	    		});
    			},
    			error: function (response) {
    				if (response.status == 404) {
    					$j("#previewTemplateItemDialogBuildSelect").empty().append(
    							$j('<option></option>').val(null).html("No builds found. Choose a different project")
    						);
    				} else {
	    				console.log(response);
	    				alert(response);
    				}
    			}
    		});
    	},
    	
    	loadBuildEventList: function () {
    		var selectedItem = $j("#previewTemplateItemDialogBuildStateSelect").val();
			var myselect = $j('<select>');
			myselect.append( $j('<option></option>').val(null).html("Choose a Build Event to simulate...") );
    		$j("#editTemplateItemForm input.buildState[type=checkbox]").each(function (index, checkbox) {
    			var label = checkbox.nextSibling.nodeValue;
    			var isChecked = $j('input#' + checkbox.id).is(':checked');
    			if (isChecked) {
    				myselect.append( $j('<option></option>').val(checkbox.id).html(label) );
    			} else {
    				myselect.append( $j('<option></option>').val(checkbox.id).html(label).attr("disabled", "disabled") );
    				if (checkbox.id === selectedItem) {
    					//
    					// The previously selected item is now disabled, so clear the selection
    					// 
    					selectedItem = null;
    				}
    			}
    			console.log("Found checkbox: " + checkbox.name + " : " + label + " : " + isChecked);
    		});
    		$j("#previewTemplateItemDialogBuildStateSelect").empty().append(myselect.html());
    		$j("#previewTemplateItemDialogBuildStateSelect").val(selectedItem);
    		$j("#previewTemplateItemDialogBuildStateSelect").off().change( function() {
    				WebHooksPlugin.PreviewTemplateItemDialog.renderPreview();
    		});
    	},
    	
    	loadWebHookList: function( projectId ) {
    		
    		if (!projectId) { // We got a null or undefined projectId. Empty the build list and return
    			$j("#previewTemplateItemDialogWebHookSelect").empty();
    			return;
    		}
    		$j("#previewTemplateItemDialogWebHookSelect").empty().append($j('<option></option>').val(null).html("Loading project WebHooks ..."))
    		$j.ajax ({
    			url: window['base_uri'] + '/app/rest/webhooks/' + projectId + "?fields=$short",
    			type: "GET",
    			headers : {
    				'Accept' : 'application/json'
    			},
    			success: function (response) {
    				if (response.count === 0) {
    					$j("#previewTemplateItemDialogWebHookSelect").empty().append(
    							$j('<option></option>').val(null).html("No webhooks found. Choose a different project or specify URL")
    						);
    					WebHooksPlugin.PreviewTemplateItemDialog.handleWebHookListChange(null); // Enable the URL input box.
    				} else {
	    				var myselect = $j('<select>');
	    				myselect.append( $j('<option></option>').val(null).html("Choose a WebHook... (or enter a URL below)") );
	    				$j(response.webhooks).each(function(index, webhook) {
	    					//console.log(webhook);
	    					var desc = WebHooksPlugin.PreviewTemplateItemDialog.elipsizeUrl(webhook.url)
	    							  + " ("
	    							  + webhook.format + " :: " + webhook.template
	    							  + ")";
	    					
							myselect.append( $j('<option></option>').val(webhook.id).html(desc) );
	    				});
	    				$j("#previewTemplateItemDialogWebHookSelect").empty().append(myselect.html()).off().change(
								function() {
									WebHooksPlugin.PreviewTemplateItemDialog.handleWebHookListChange( $j(this).val() );
									WebHooksPlugin.PreviewTemplateItemDialog.renderPreview();
								});
    				}
    			},
    			error: function (response) {
    				if (response.status == 404) {
    					$j("#previewTemplateItemDialogWebHookSelect").empty().append(
    							$j('<option></option>').val(null).html("No webhooks found. Choose a different project or specify URL")
    						);
    					WebHooksPlugin.PreviewTemplateItemDialog.handleWebHookListChange(null); // Enable the URL input box.
    				} else {
	    				console.log(response);
	    				alert(response);
    				}
    			}
    		});    		
    		
    	},
    	
    	handleWebHookListChange: function ( webhookId ) {

    	},
    	
    	elipsizeUrl: function(url) {
    		if (url.length > 50) {
    			return url.substr(0,40) + "..."
    		} else {
    			return url;
    		}
    	},
    	
    	renderPreview: function () {
    		if (
    				$j("#previewTemplateItemDialogProjectSelect").val() &&
    				$j("#previewTemplateItemDialogBuildSelect").val() &&
    				$j("#previewTemplateItemDialogBuildStateSelect").val()
    			)
    		{
        		var jsonRequest = {};
        		jsonRequest.templateText = editor.getValue();
        		jsonRequest.useTemplateTextForBranch = $j("#editTemplateItemForm input#useTemplateTextForBranch").is(':checked');
        		jsonRequest.branchTemplateText = editorBranch.getValue();
        		jsonRequest.buildId = $j("#previewTemplateItemDialogBuildSelect").val();
        		jsonRequest.projectExternalId = $j("#previewTemplateItemDialogProjectSelect").val();
        		jsonRequest.format = "jsontemplate";
        		jsonRequest.buildStateName = $j("#previewTemplateItemDialogBuildStateSelect").val();
        		jsonRequest.url = "";
        		
    			$j.ajax ({
    				url: window['base_uri'] + '/app/rest/webhooks/test/template/preview',
    				type: "POST",
    				data: JSON.stringify(jsonRequest),
    				dataType: 'json',
    				headers : {
    					'Content-Type' : 'application/json',
    					'Accept' : 'text/html'
    				},
    				success: function (response) {
    					console.log(response.responseText);
						$j('#currentTemplatePreview').html(response.responseText);
						hljs.highlightBlock($j('#currentTemplatePreview pre code'));
    					$j('pre code').each(function(i, block) {
    					    hljs.highlightBlock(block);
    					  });						
    				},
    				error: function (response) {
    					console.log(response);
    					if (response.status === 422) {
    						$j('#currentTemplatePreview').html(response.responseText);
    					} else {
    					
	    					$j('#currentTemplatePreview').html(response.responseText);
	    					//hljs.highlightBlock($j('#currentTemplatePreview pre code'));
	    					
	    					$j('pre code').each(function(i, block) {
	    						console.log("blah " + block);
	    					    hljs.highlightBlock(block);
	    					  });
    					}
    				}
    			});        		
    		} else {
    			$j('#currentTemplatePreview').empty();
    		}
    	},
    	
    	doPost: function() {
    		
			var dialog = this;
    		
    		var jsonRequest = {};
    		jsonRequest.templateText = editor.getValue();
    		jsonRequest.useTemplateTextForBranch = $j("#editTemplateItemForm input#useTemplateTextForBranch").is(':checked');
    		jsonRequest.branchTemplateText = editorBranch.getValue();
    		jsonRequest.buildId = $j("#previewTemplateItemDialogBuildSelect").val();
    		jsonRequest.projectExternalId = $j("#previewTemplateItemDialogProjectSelect").val();
    		jsonRequest.format = "jsontemplate";
    		jsonRequest.webhookId = $j("#previewTemplateItemDialogWebHookSelect").val();
    		jsonRequest.url = $j("#previewTempleteItemDialogUrl").val();
    		jsonRequest.buildStateName = $j("#previewTemplateItemDialogBuildStateSelect").val();
    		
    		dialog.cleanErrors();
    		$j('#webhookTestProgress').css("display","block");
    		
			$j.ajax ({
				url: window['base_uri'] + '/app/rest/webhooks/test/template/execute',
				type: "POST",
				data: JSON.stringify(jsonRequest),
				dataType: 'json',
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json'
				},
				success: function (response) {
					
					$j('#webhookTestProgress').css("display","none");
					var ul = $j('<ul>');
					
					if (response.error) {
						ul.append($j('<li/>').html("Error: " + response.error.message + " (" + response.error.errorCode + ")"));
					} else {
						ul.append($j('<li/>').html("Success: " + response.statusReason + " (" + response.statusCode + ")"));
					}
					ul.append($j('<li/>').html("URL: " + response.url));
					ul.append($j('<li/>').html("Duration: " + response.executionTime + " @ " + moment(response.dateTime, moment.ISO_8601).format("dddd, MMMM Do YYYY, h:mm:ss a")));
					
					$j("#previewTempleteItemDialogAjaxResult").empty().append(ul.html());
					console.log(response);
				},
				error: function (response) {
					$j('#webhookTestProgress').css("display","none");
					console.log(response);
					WebHooksPlugin.handleAjaxError(dialog, response);
				}
			});
    		
    		return false;
    	},
    	
        ajaxError: function(message) {
        	var next = $j("#previewTempleteItemDialogAjaxResult").next();
        	if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
        		next.text(message);
        	} else {
        		$j("#previewTempleteItemDialogAjaxResult").after("<p class='error'>" + message + "</p>");
        	}
        },  
        
        cleanErrors: function () {
            $j("#previewTemplateItemForm .error").remove();
            $j("#previewTempleteItemDialogAjaxResult").empty();
        },        
    	
    	showDialog: function () {
    		this.cleanErrors();
    		this.showCentered();
    		
    		$j("#previewTemplateItemDialog h3.dialogTitle").html("Preview &amp; Test Build Event Template");
    		
    		if ( ! $j("#previewTemplateItemDialogProjectSelect").val()) {
    			this.loadProjectList();
    		}
    		this.loadBuildEventList();
    		this.renderPreview();
    	}
    	
    })),
    
    NoRestApiDialog: OO.extend(BS.AbstractWebForm, OO.extend(BS.AbstractModalDialog, {
    	getContainer: function () {
    		return $('noRestApiDialog');
    	},
    	
    	formElement: function () {
    		return $('noRestApiForm');
    	},
    	
    	showDialog: function () {
    		this.showCentered();
    	}
 
    })),
    DeleteTemplateItemDialog: OO.extend(BS.AbstractWebForm, OO.extend(BS.AbstractModalDialog, {
    	getContainer: function () {
    		return $('deleteTemplateItemDialog');
    	},
    	
    	formElement: function () {
    		return $('deleteTemplateItemForm');
    	},
    	
    	showDialog: function (title, action, data) {
    		$j("input[id='WebhookTemplateaction']").val(action);
    		$j(".dialogTitle").html(title);
    		this.cleanFields(data);
    		this.cleanErrors();
    		this.showCentered();
    	},
    	
    	cleanFields: function (data) {
    		$j("#deleteTemplateItemForm input[id='templateId']").val(data.templateId);
    		$j("#deleteTemplateItemForm input[id='templateNumber']").val(data.templateNumber);
    		this.cleanErrors();
    	},
    	
    	cleanErrors: function () {
    		$j("#deleteTemplateItemForm .error").remove();
    	},
    	
    	error: function($element, message) {
    		var next = $element.next();
    		if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
    			next.text(message);
    		} else {
    			$element.after("<p class='error'>" + message + "</p>");
    		}
    	},
    	
    	ajaxError: function(message) {
    		var next = $j("#ajaxDeleteResult").next();
    		if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
    			next.text(message);
    		} else {
    			$j("#ajaxDeleteResult").after("<p class='error'>" + message + "</p>");
    		}
    	},
    	
    	doPost: function() {
    		this.cleanErrors();
    		
			var dialog = this;
			//console.log($j("input[id='WebhookTemplateaction']").val());
			
			var templateId = $j("#deleteTemplateItemForm input[id='templateId']").val()
			var templateNumber = $j("#deleteTemplateItemForm input[id='templateNumber']").val()
			
			$j.ajax ({
				url: window['base_uri'] + '/app/rest/webhooks/templates/id:' + templateId + '/templateItems/' + templateNumber,
				type: "DELETE",
				headers : {
					'Content-Type' : 'application/json',
					'Accept' : 'application/json'
				},
				success: function (response) {
					dialog.close();
					$("buildEventTemplatesContainer").refresh();
				},
				error: function (response) {
					console.log(response);
					alert(response);
				}
			});
    		
    		return false;
    	}
    })),
    
    DeleteTemplateDialog: OO.extend(BS.AbstractWebForm, OO.extend(BS.AbstractModalDialog, {
    	getContainer: function () {
    		return $('deleteTemplateDialog');
    	},
    	
    	formElement: function () {
    		return $('deleteTemplateForm');
    	},
    	
    	showDialog: function (title, action, data) {
    		$j("input[id='WebhookTemplateaction']").val(action);
    		$j(".dialogTitle").html(title);
    		this.cleanFields(data);
    		this.cleanErrors();
    		this.showCentered();
    	},
    	
    	cleanFields: function (data) {
    		$j("#deleteTemplateForm input[id='templateId']").val(data.templateId);
    		this.cleanErrors();
    	},
    	
    	cleanErrors: function () {
    		$j("#deleteTemplateForm .error").remove();
    	},
    	
    	error: function($element, message) {
    		var next = $element.next();
    		if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
    			next.text(message);
    		} else {
    			$element.after("<p class='error'>" + message + "</p>");
    		}
    	},
    	
    	ajaxError: function(message) {
    		var next = $j("#ajaxDeleteResult").next();
    		if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
    			next.text(message);
    		} else {
    			$j("#ajaxDeleteResult").after("<p class='error'>" + message + "</p>");
    		}
    	},
    	
    	doPost: function() {
    		this.cleanErrors();
    		
    		var dialog = this;
    		console.log($j("input[id='WebhookTemplateaction']").val());
    		
    		var templateId = $j("#deleteTemplateForm input[id='templateId']").val()
    		
    		$j.ajax ({
    			url: window['base_uri'] + '/app/rest/webhooks/templates/id:' + templateId,
    			type: "DELETE",
    			headers : {
    				'Content-Type' : 'application/json',
    				'Accept' : 'application/json'
    			},
    			success: function (response) {
    				dialog.close();
    				window.location = window['base_uri'] + '/webhooks/templates.html';
    			},
    			error: function (response) {
    				console.log(response);
    				alert(response);
    			}
    		});
    		
    		return false;
    	}
    })),
    
    EditTemplateDialog: OO.extend(BS.AbstractWebForm, OO.extend(BS.AbstractModalDialog, {
    	getContainer: function () {
    		return $('editTemplateDialog');
    	},
    	
    	formElement: function () {
    		return $('editTemplateForm');
    	},
    	
    	showDialog: function (title, action, templateId) {
    		
    		console.log(templateId);
    		this.getTemplateData(templateId, action);
    		
    		$j("input[id='WebhookTemplateaction']").val(action);
    		$j(".dialogTitle").html(title);
    		
    		if (action == 'copyTemplate') {
	    		$j("#editTemplateForm .templateEdit").hide();
	    		$j("#editTemplateForm .templateCopy").show();
    		} else {
    			$j("#editTemplateForm .templateCopy").hide();
    			$j("#editTemplateForm .templateEdit").show();
    		}
    		this.cleanFields();
    		this.cleanErrors();
    		this.showCentered();
    	},

		handleGetSuccess: function (action) {
			if (action == 'copyTemplate') {
				$j("#editTemplateForm input[id='template.id']").val("").prop( "disabled", false );
			} else {
				$j("#editTemplateForm input[id='template.id']").val(myJson.id).prop( "disabled", true );
			}
			$j("#editTemplateForm input[id='template.description']").val(myJson.description);
			$j("#editTemplateForm input[id='template.tooltip']").val(myJson.toolTip);
			$j("#editTemplateForm input[id='template.rank']").val(myJson.rank);
			$j("#editTemplateForm input[id='template.dateFormat']").val(myJson.preferredDateFormat);
			console.log(myJson);
		},    	
    	
    	cleanFields: function () {
    		this.cleanErrors();
    	},
    	
    	cleanErrors: function () {
    		$j("#editTemplateForm .error").remove();
    	},
    	
    	error: function($element, message) {
    		var next = $element.next();
    		if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
    			next.text(message);
    		} else {
    			$element.after("<p class='error'>" + message + "</p>");
    		}
    	},
    	
    	ajaxError: function(message) {
    		var next = $j("#ajaxTemplateEditResult").next();
    		if (next != null && next.prop("class") != null && next.prop("class").indexOf('error') > 0) {
    			next.text(message);
    		} else {
    			$j("#ajaxTemplateEditResult").after("<p class='error'>" + message + "</p>");
    		}
    	},

		getTemplateData: function (templateId, action) {
			var dialog = this;
			var URL = window['base_uri'] + '/app/rest/webhooks/templates/id:' + templateId  + '?fields=**';
			
			if (action == "editTemplate") {
				URL = window['base_uri'] + '/app/rest/webhooks/templates/id:' + templateId  + '?fields=$short'
			}
			
    		$j.ajax ({
    			//url: window['base_uri'] + '/app/rest/webhooks/templates/id:' + templateId  + '?fields=$long,useTemplateTextForBranch,href,parentTemplate,content',
    			url: URL,
    		    type: "GET",
    		    headers : {
    		        'Accept' : 'application/json'
    		    },
    		    success: function (response) {
    				myJson = response;
    				//console.log(myJson);
    				dialog.handleGetSuccess(action);
    		    }
    		});
		},
    	
    	doPost: function() {
    		this.cleanErrors();
    		
    		var dialog = this;
    		//console.log($j("input[id='WebhookTemplateaction']").val());
    		
    		var action = $j("input[id='WebhookTemplateaction']").val();
    		var httpMethod = "POST";
    		var URL  = window['base_uri'] + '/app/rest/webhooks/templates';
    		
    		if (action === "editTemplate") {
    			URL = URL + "/id:" + myJson.id + "/patch";  
    		} else if (action === "copyTemplate") {
    			myJson.id = $j("#editTemplateForm input[id='template.id']").val();
    		} else {
    			alert("eeek. I can't tell what action we are performing. Please report bug for tcWebhooks");
    		}
    		
    		myJson.description = $j("#editTemplateForm input[id='template.description']").val();
			myJson.toolTip = $j("#editTemplateForm input[id='template.tooltip']").val();
			myJson.rank = $j("#editTemplateForm input[id='template.rank']").val();
			myJson.preferredDateFormat = $j("#editTemplateForm input[id='template.dateFormat']").val();
			
			
    		console.log(myJson);
    		
    		$j.ajax ({
    			url: URL,
    			type: httpMethod,
				data: JSON.stringify(myJson),
				dataType: 'json',
    			headers : {
    				'Content-Type' : 'application/json',
    				'Accept' : 'application/json'
    			},
    			success: function (response) {
    				var action = $j("input[id='WebhookTemplateaction']").val();
    				dialog.close();
    				console.log(action);
    				if (action === "editTemplate") {
    					$("templateInfoContainer").refresh();
    				} else {
    					window.location = window['base_uri'] + '/webhooks/template.html?template=' + myJson.id;
    				}
    				
    			},
    			error: function (response) {
    				console.log(response);
    				WebHooksPlugin.handleAjaxError(dialog, response);
    			}
    		});
    		
    		return false;
    	}
    }))
};
