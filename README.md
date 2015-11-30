HEAD tagın içine script ve link tagları ekler.


 Sayfaya istenilen script link dosyalarını yüklemeye yarar.

	
 	loadFile.defaultTime = 50;
	loadFile.finish = function(obj){
		console.log(obj);
	}
	loadFile.files = [
		{
			fileSrc:'./css/globa.css',
			attr:{
				media:'all'
			},
			complete:function(obj){
				loadFile.files = [
					{
						fileSrc :'./css/materials/preloading.css',
						attr:{
							media:'all'
						},
						load:function(){
							loadFile.files = [
								{
									fileSrc : './js/libs/jquery/jquery.min.js',
									load : function(){
										jQuery.noConflict();
										loadFile.files = [
											{
												fileSrc:'./js/libs/jquery-mobile-bower/js/jquery.mobile-1.4.5.min.js',
												attr:{
													charset:'UTF-8',
													async:false
												},
												load:function(){
													loadFile.files = [
														{
															fileSrc : './js/jquery-mobile-config.js',
															waitTime : 100,
															cache:false,
															attr:{
																charset:'UTF-8',
																async:false
															}
														}
													]
												}
											},
											{
												fileSrc : './js/libs/jquery/jquery-migrate.js',
												attr:{
													charset:'UTF-8',
													async:false
												}
											}
										]
									},
									attr:{
										charset:'UTF-8',
										async:false
									}
								},
								{
									fileSrc : './js/libs/underscore/underscore.js'
								}
							]
						}
					}
				]
			}
		}
	];
	loadFile.loadFiles();


 Bağımlılık : Browser'a bağlı olarak Object.key;