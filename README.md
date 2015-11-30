HEAD tagın içine script ve link tagları ekler.


 Sayfaya istenilen script link dosyalarını yüklemeye yarar.

	
 	loadFile.defaultTime = 50;
	loadFile.files = [
		{
			fileSrc:'./css/global.css',
			attr:{
				media:'all'
			},
			complete:function(){
				loadFile.files.unshift(
					{
						fileSrc :'./css/materials/preloading.css',
						attr:{
							media:'all'
						},
						load:function(){
							loadFile.files.unshift(
								{
									fileSrc : './js/libs/jquery/jquery.min.js',
									complete : function(){
										loadFile.files.unshift(
											{
												fileSrc : './js/libs/jquery/jquery-migrate.js',
												attr:{
													charset:'UTF-8',
													async:false
												}
											},
											{
												fileSrc : './js/jquery-mobile-config.js',
												waitTime : 100,
												cache:false,
												attr:{
													charset:'UTF-8',
													async:false
												}
											}
										)
									},
									attr:{
										charset:'UTF-8',
										async:false
									}
								},
								{
									fileSrc : './js/libs/underscore/underscore.js'
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