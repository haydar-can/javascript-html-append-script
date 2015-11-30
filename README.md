HEAD tagın içine script ve link tagları ekler.


 Sayfaya istenilen script link dosyalarını yüklemeye yarar.

	
 	loadFile.defaultTime = 50;
	loadFile.files = [
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
					 cache:false,
					 waitTime:100,
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

	];	
 	loadFile.loadFinish = function(obj){
 		console.log(obj.length + ' dosya yüklendi.'
 	}
 	loadFile.loadFiles();

 Bağımlılık : Browser'a bağlı olarak Object.key;