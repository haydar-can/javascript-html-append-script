HEAD tag�n i�ine script ve link taglar� ekler. 


 Sayfaya istenilen script link dosyalar�n� y�klemeye yarar.

 �rnek :
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
	 loadFile.loadFiles();
 	loadFile.loadFinish = function(obj){
 		console.log(obj.length + ' dosya y�klendi.'
 	}
 	loadFile.loadFiles();

 Ba��ml�l�k : Browser'a ba�l� olarak Object.key;