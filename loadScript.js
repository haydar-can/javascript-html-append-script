'use strict';
/**
 * Sayfaya istenilen script link dosyalarını yüklemeye yarar.
 *
 * Örnek :
 * 	loadFile.files = [{fileSrc:'',waitTime:100,begin:function(){},complete:function(){},error:function(){},attr:{charset:'UTF-8'}}]
 * 	loadFile.loadFinish = function(obj){
 * 		console.log(obj.length + ' dosya yüklendi.'
 * 	}
 * 	loadFile.loadFiles();
 *
 * Bağımlılık : Browser'a bağlı olarak Object.key;
 * */

var loadFile = {
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
			return loadFile._loadFinish;
		},
		set:function(value){
			if(value instanceof Function){
				loadFile._loadFinish = value;
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
	loadFiles : function(orderNo){
		orderNo = orderNo || 0;
		var $this = this;
		if(this.arrayControl(this.files) && this.files.length>0){
			if(this.objectControl(this.files[orderNo])){
				if(!this.fileExist(this.files[orderNo]['fileSrc'])){
					var ifJS = Boolean(this.files[orderNo]['fileSrc'].match(/(\.js)/gmi)), scriptTag, order = 0;
					switch(true){
						case ifJS:
							scriptTag = document.createElement('script');
							scriptTag.setAttribute('src',loadFile.files[orderNo]['fileSrc']);
							break;
						default:
							scriptTag = document.createElement('link');
							scriptTag.setAttribute('src',loadFile.files[orderNo]['fileSrc']);
							break;
					}

					if(this.files[orderNo].begin instanceof Function)this.files[orderNo].begin.call(scriptTag);

					scriptTag.onerror = function(){
						if($this.files[orderNo]['error'] instanceof Function)$this.files[orderNo].error.call(scriptTag);
						$this.removeFile(this.getAttribute('src'));
						scriptTag = null;
					};

					scriptTag.onload = scriptTag.onreadystatechange = function(){
						if(!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'){
							if($this.files[orderNo]['complete'] instanceof Function)$this.files[orderNo].complete.call(scriptTag);
						}else{
							if($this.files[orderNo]['complete'] instanceof Function)$this.files[orderNo].complete.call(scriptTag);
						}
					};

					var keys = Object.keys(this.files[orderNo]['attr']);

					if(this.files[orderNo]['attr'] && keys.length>0 && scriptTag){
						for(order = 0; order < keys.length; order++)scriptTag.setAttribute(keys[order],this.files[orderNo]['attr'][keys[order]]);
					}

					setTimeout(function(){
						if(scriptTag){
							document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
							if($this.files.length>(orderNo+1))$this.loadFiles(++orderNo);
							else if($this.files.length == (orderNo+1)){
								if($this._loadFinish instanceof Function)
									$this._loadFinish.call($this.files, this);
							}
						}
					}, this.files[orderNo]['waitTime'] || 250);
				}else{
					setTimeout(function(){
						if($this.files.length>(orderNo+1))$this.loadFiles(++orderNo);
						else if($this.files.length == (orderNo+1)){
							if($this._loadFinish instanceof Function)
								$this._loadFinish.call($this.files, this);
						}
					}, this.files[orderNo]['waitTime'] || 250);
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
			if(this.addedFiles.indexOf(source)<0){
				var head = document.getElementsByTagName('HEAD')[0],
						order = 0, cacheFiles = [],
						scripts = head.getElementsByTagName('script'),
						scriptLength = scripts.length,
						linkFiles = head.getElementsByTagName('link'),
						linkFilesLength = linkFiles.length;
				for(order = 0; order < scriptLength; order++){
					if(this.addedFiles.indexOf(scripts[order].getAttribute('src'))==-1)cacheFiles.push(scripts[order].getAttribute('src'));
				}
				for(order = 0 ; order < linkFilesLength; order++){
					if(this.addedFiles.indexOf(linkFiles[order].getAttribute('href'))==-1)cacheFiles.push(linkFiles[order].getAttribute('href'));
				}
				if(cacheFiles.length>0)this.addedFiles.push(cacheFiles,source);
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