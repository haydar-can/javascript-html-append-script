HEAD tagın içine script ve link tagları ekler.


 Sayfaya istenilen script link dosyalarını yüklemeye yarar.

	
 	loadFile.defaultTime = 10;
	loadFile.scriptURL = './js/libs/';
	loadFile.linkURL = './css/';
	loadFile.files = [
		{'fileSrc':'global.css','attr':{'media':'all'},
			'load':function(){
				loadFile.files.unshift(
					{fileSrc :'materials/preloading.css',attr:{media:'all'},
						load:function(){
							loadFile.files.unshift(
								{fileSrc : 'jquery/jquery.min.js',
									load : function(){
										jQuery.noConflict();
										if ((/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i).test(navigator.userAgent)) {
											var $tag = document.getElementsByTagName("meta"),$element,i;
											for (i = 0; i < $tag.length; i++) if ($tag[i].name=="viewport")$element = $tag[i];
											jQuery('body').addClass('mobile');
											$tag = null, $element = null;
										}else{
											var $tag = document.getElementsByTagName("meta"),$element,i;
											for (i = 0; i < $tag.length; i++) if ($tag[i].name=="viewport")$element = $tag[i];
											jQuery($element).remove();
										}
										loadFile.files.unshift(
											{fileSrc : '../jquery-mobile-config.js',attr:{charset:'UTF-8',async:false},cache:false,
											load:function(){
												loadFile.files.unshift({fileSrc : 'jquery-mobile-bower/js/jquery.mobile-1.4.5.min.js',waitTime : 50,attr:{charset:'UTF-8',async:false},
												load:function(){
													loadFile.files.unshift({
														fileSrc:'pages/mainPage.css',
														load:function(){
															loadFile.files.unshift({
																fileSrc:'../views/pages/mainpage.js',
																waitTime:100,
																cache:false,
																attr:{
																	charset:'UTF-8',
																	async:false
																},
																load:function(){
																	loadFile.files.unshift({
																		fileSrc:'velocity/velocity.min.js',
																		waitTime:25,
																		attr:{
																			charset:'UTF-8',
																			async:false
																		},
																		load:function(){
																			loadFile.files.unshift({
																				fileSrc:'velocity/velocity.ui.min.js',
																				waitTime:25,
																				attr:{
																					charset:'UTF-8',
																					async:false,
																				},
																				load:function(){
																					loadFile.files.unshift({
																						fileSrc:'requireFunctions.js',
																						waitTime:50,
																						cache:false,
																						attr:{
																							charset : 'UTF-8',
																							async:false
																						},
																						load:function(){
																							jQuery.mobile.changePage('#mainPage',{transition:'none',chageHash:false});
																						}
																					})
																				}
																			})
																		}
																	});
																}
															})
														}
													})
												}});
											}},
											{fileSrc : 'jquery/jquery-migrate.js',attr:{charset:'UTF-8',async:false}},
											{fileSrc : 'jquery.cookie/jquery.cookie.js',attr:{charset:'UTF-8', async:false},
												load:function(){
													jQuery.cookie.json = true;
													jQuery.cookie.raw = false;
													loadFile.files.unshift({
														fileSrc:'../cookieFunctions.js', cache:false
													});
												}
											}
										)
									},
									attr:{charset:'UTF-8',async:false}
								},
								{fileSrc : 'underscore/underscore.js'},
								{
									fileSrc:'sweetalert/dist/sweetalert.min.js',
									cache:true,
									attr:{
										async:false,
										charset:'UTF-8'
									},
									load:function(){
										swal.setDefaults({
											html:true,
											confirmButtonColor: '#DD6B55',
											closeOnConfirm: false,
											closeOnCancel: false
										})
									}
								}
							)
						}
					}
				)
			}
		}
	];
	loadFile.loadFiles();


 Bağımlılık : Browser'a bağlı olarak Object.key;