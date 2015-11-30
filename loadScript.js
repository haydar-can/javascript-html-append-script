'use strict';
/**
 * Sayfaya istenilen script link dosyalarını yüklemeye yarar.
 *
 * Örnek :
 * 	loadFile.defaultTime = 50;
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
 * 	loadFile.loadFinish = function(obj){
 * 		console.log(obj.length + ' dosya yüklendi.'
 * 	}
 * 	loadFile.loadFiles();
 *
 * Bağımlılık : Browser'a bağlı olarak Object.key;
 * */

var loadFile = {
	_defaultTime:{
		value:250,
		enumerable:false,
		writable:true,
	},
	defaultTime:{
		get:function(){
			return this._defaultTime;
		},
		set:function(){
			if(value instanceof Number){
				this._defaultTime = value;
			}
		}
	},
	_loadFinish:{
		value : null,
		enumerable:false,
		writable:true
	},
	/**
	 * Tüm yükleme bittiğinde çalıştırılacak olan callback function
	 * */
	loadFinish:{
		get:function(){
			return this._loadFinish;
		},
		set:function(value){
			if(value instanceof Function){
				this._loadFinish = value;
			}
		}
	},

	/**
	 * Yüklenecek dosyalar
	 * */
	files : [],
	arrayControl : function(variables){
		return variables instanceof Array;
	},
	objectControl : function(variables){
		return variables instanceof Object;
	},

	/**
	* çoklu dosya yüklemek için kullanılanılacak fonksiyon
	* */
	loadFiles : function(){
		var $this = this, cache =(this.files[0]['cache'] == false)?'?_='+new Date().getTime():'';
		if(this.arrayControl(this.files) && this.files.length>0){
			if(this.objectControl(this.files[0])){
				if(!this.fileExist(this.files[0]['fileSrc'])){
					var ifJS = Boolean(this.files[0]['fileSrc'].match(/(\.js)/gmi)), scriptTag, order = 0;
					switch(true){
						case ifJS:
							scriptTag = document.createElement('script');
							scriptTag.setAttribute('type','text/javascript');
							scriptTag.setAttribute('src',loadFile.files[0]['fileSrc']+cache);
							break;
						default:
							scriptTag = document.createElement('link');
							scriptTag.setAttribute('src',loadFile.files[0]['fileSrc']+cache);
							scriptTag.setAttribute('rel','stylesheet');
							break;
					}

					if(this.files[0].begin instanceof Function)this.files[0].begin.call(scriptTag);

					scriptTag.onerror = function(){
						var cacheOrder = $this.files[0];
						$this.files.shift();
						if(cacheOrder['error'] instanceof Function)cacheOrder.error.call(scriptTag);
						$this.removeFile(this.getAttribute('src'));
						scriptTag = null;
						setTimeout(function(){
							if($this.files.length>0)$this.loadFiles();
						},cacheOrder['waitTime'] || $this._defaultTime);
					};

					scriptTag.onload = scriptTag.onreadystatechange = function(){
						var cacheOrder = $this.files[0];
						$this.files.shift();
						if(!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'){
							if(cacheOrder['complete'] instanceof Function)cacheOrder.complete.call(scriptTag);
						}else{
							if(cacheOrder['complete'] instanceof Function)cacheOrder.complete.call(scriptTag);
						}
						setTimeout(function(){
							if($this.files.length>0)$this.loadFiles();
						},cacheOrder['waitTime'] || $this._defaultTime);
					};

					var keys = Object.keys(this.files[0]['attr'] || '');

					if(this.files[0]['attr'] && keys.length>0 && scriptTag){
						for(order = 0; order < keys.length; order++)scriptTag.setAttribute(keys[order],this.files[0]['attr'][keys[order]]);
					}
					document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);

					if($this.files.length == 0 && $this._loadFinish instanceof Function){
						$this._loadFinish.call($this.files, this);
					}

				}else{
					setTimeout(function(){
						if($this.files.length>0){
							$this.files.unshift();
							$this.loadFiles();
						}
						else {
							if($this._loadFinish instanceof Function)
								$this._loadFinish.call($this.files, this);
						}
					}, this.files[0]['waitTime'] || $this._defaultTime);
					console.log('file is already added.');
				}
			}else{
				throw 'files element must be object';
			}
		}else{
			throw 'files must be array';
		}
	},

	/**
	 * Yükleme sırasıda hata olursa ilgili tag siliniyor...
	 * */
	removeFile:function(file){
		if(file){
			var head = document.getElementsByTagName('HEAD')[0],scriptFile = [], linkFile = [],
				scriptFile = head.getElementsByTagName('script'),
				linkFile = head.getElementsByTagName('link'),
				allFiles = loadFile.objectPush(scriptFile, linkFile);
			for(var x = 0; x<allFiles.length; x++){
				if(allFiles[x].getAttribute('src') == file){
					allFiles[x].parentNode.removeChild(allFiles[x]);
				}
			}
		}
	},

	objectPush : function(args){
		var cache = [];
		if(arguments.length>0){
			for(var x = 0; x < arguments.length; x++){
				if(arguments[x] instanceof Object){
					for(var y = 0; y<arguments[x].length; y++){
						cache.push(arguments[x][y]);
					}
				}
			}
		}
		return cache;
	},
	/**
	 * daha önce yüklenmiş olan dosyaları cacheleyen değişken
	 * */
	addedFiles:[],

	/**
	 * yüklenmek istenen dosyanın daha önce yüklenip
	 * yüklenmediğini kontrol eden fonskiyon
	 * */
	fileExist : function(source){
		if(source){
			this.addedFiles = [];
			if(this.addedFiles.indexOf(source)<0){
				var head = document.getElementsByTagName('HEAD')[0],
						order = 0, cacheFiles = [],
						scripts = head.getElementsByTagName('script'),
						scriptLength = scripts.length,
						linkFiles = head.getElementsByTagName('link'),
						linkFilesLength = linkFiles.length;
				for(order = 0; order < scriptLength; order++){
					if(this.addedFiles.indexOf(scripts[order].getAttribute('src'))==-1)this.addedFiles.push(scripts[order].getAttribute('src'));
				}
				for(order = 0 ; order < linkFilesLength; order++){
					if(this.addedFiles.indexOf(linkFiles[order].getAttribute('href'))==-1)this.addedFiles.push(linkFiles[order].getAttribute('href'));
				}
				if(cacheFiles.length>0)this.addedFiles.push(source);
				return false;
			}else{
				return true;
			}
		}else{
			console.log('fileSrc value is emtpy or null');
			return true;
		}
	}
};