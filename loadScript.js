'use strict';

if (!Object.keys) {
	Object.keys = function(obj) {
		var keys = [];

		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				keys.push(i);
			}
		}

		return keys;
	};
}

/**
 * Object.defineProperty PollyFill
 * */
function defineProperties(obj, properties) {
	function convertToDescriptor(desc) {
		function hasProperty(obj, prop) {
			return Object.prototype.hasOwnProperty.call(obj, prop);
		}

		function isCallable(v) {
			// NB: modify as necessary if other values than functions are callable.
			return typeof v === "function";
		}

		if (typeof desc !== "object" || desc === null)
			throw new TypeError("bad desc");

		var d = {};

		if (hasProperty(desc, "enumerable"))
			d.enumerable = !!desc.enumerable;
		if (hasProperty(desc, "configurable"))
			d.configurable = !!desc.configurable;
		if (hasProperty(desc, "value"))
			d.value = desc.value;
		if (hasProperty(desc, "writable"))
			d.writable = !!desc.writable;
		if (hasProperty(desc, "get")) {
			var g = desc.get;

			if (!isCallable(g) && typeof g !== "undefined")
				throw new TypeError("bad get");
			d.get = g;
		}
		if (hasProperty(desc, "set")) {
			var s = desc.set;
			if (!isCallable(s) && typeof s !== "undefined")
				throw new TypeError("bad set");
			d.set = s;
		}

		if (("get" in d || "set" in d) && ("value" in d || "writable" in d))
			throw new TypeError("identity-confused descriptor");

		return d;
	}

	if (typeof obj !== "object" || obj === null)
		throw new TypeError("bad obj");

	properties = Object(properties);

	var keys = Object.keys(properties);
	var descs = [];

	for (var i = 0; i < keys.length; i++)
		descs.push([keys[i], convertToDescriptor(properties[keys[i]])]);

	for (var i = 0; i < descs.length; i++)
		Object.defineProperty(obj, descs[i][0], descs[i][1]);

	return obj;
};


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

var loadFile = {};
Object.defineProperties(loadFile,{
	/**
	 * Default Script URL
	 * */
	_scriptURL:{
		value:'./',
		enumerable:false,
		writable:true
	},
	scriptURL:{
		get:function(){
			return this._scriptURL;
		},
		set:function(value){
			if(value instanceof String || typeof value === 'string'){
				this._scriptURL = value;
			}
		}
	},
	/**
	 * Default link URL
	 * */
	_linkURL:{
		value:'./',
		enumerable:false,
		writable:true
	},
	linkURL:{
		get:function(){
			return this._linkURL;
		},
		set:function(value){
			if(value instanceof String || typeof value === 'string'){
				this._linkURL = value;
			}
		}
	},

	_defaultTime:{
		value:100,
		enumerable:false,
		writable:true
	},
	defaultTime:{
		get:function(){
			return this._defaultTime;
		},
		set:function(value){
			if(!isNaN(value) || typeof value === 'number'){
				this._defaultTime = value;
			}
		}
	},

	_finish:{
		value:null,
		enumerable:false,
		writable:true
	},
	/**
	 * Tüm yükleme bittiğinde çalıştırılacak olan callback function
	 * */
	finish:{
		get:function(){
			return this._finish;
		},
		set:function(value){
			if(value instanceof Function || typeof value === 'function'){
				this._finish = value;
			}
		}
	},
	/**
	 * Yüklenecek dosyalar
	 * */
	_files:{
		enumerable:false,
		writable:true,
		value:[]
	},
	files:{
		enumerable:true,
		get:function(){
			return this._files;
		},
		set:function(value){
			if(value instanceof Array){
				this._files = value;
			}
		}
	},
	/**
	 * nesne kontrolleri
	 * */
	_arrayControl: {
		enumerable :false,
		writable : false,
		value :function(variables){
			return variables instanceof Array || typeof variables === 'array';
		}
	},
	_objectControl : {
		enumerable:false,
		writable:false,
		value :function(variables){
			return variables instanceof Object || typeof variables === 'object';
		}
	},
	/**
	 * dosya yüklemek için kullanılanılacak devam fonksiyon
	 * */
	_continue :{
		enumerable:false,
		writable:false,
		value:function(cacheOrder){
			var $this = this;
			$this._files.shift();
			if(cacheOrder){
				var waitTime = Object.keys(cacheOrder).indexOf('waitTime')>-1?cacheOrder['waitTime']:$this.defaultTime;
				$this._addedFiles.push(cacheOrder);
				if(cacheOrder['load'] instanceof Function || typeof cacheOrder['load'] === 'function'){
					cacheOrder.load.call(undefined, $this,cacheOrder);
				}
				if($this._files.length == 0 && ($this._finish instanceof Function || typeof $this._finish == 'function')){
					$this._finish.call(undefined, $this, $this._addedFiles);
				}
				setTimeout(function(){
					if($this._files.length>0)$this.loadFiles();
				},waitTime);
			}else{
				$this.loadFiles();
			}
		}
	},
	/**
	 * Script tarafından eklenmiş olan dosyalar.
	 * */
	_addedFiles:{
		enumerable:false,
		writable:true,
		value : []
	},
	loadFiles:{
		writeable:false,
		enumerable:true,
		value: function(){
			var $this = this;
			if($this._files.length>0 && Object.keys($this._files[0]).length>0){
				var cache =($this._files[0]['cache'] == false)?'?_='+new Date().getTime():'';
				if($this._arrayControl($this._files) && $this._files.length>0){
					if($this._objectControl($this._files[0])){
						if(!$this._fileExist($this._files[0]['fileSrc'])){
							var ifJS = Boolean($this._files[0]['fileSrc'].match(/(\.js)/gmi)), scriptTag, order = 0;
							switch(true){
								case ifJS:
									scriptTag = document.createElement('script');
									scriptTag.setAttribute('type','text/javascript');
									scriptTag.setAttribute('src', $this._scriptURL + $this._files[0]['fileSrc'] + cache);
									break;
								default:
									scriptTag = document.createElement('link');
									scriptTag.setAttribute('href', $this._linkURL + $this._files[0]['fileSrc'] + cache);
									scriptTag.setAttribute('rel','stylesheet');
									break;
							}

							if($this.files[0].begin instanceof Function)$this.files[0].begin.call(undefined, scriptTag);

							scriptTag.onerror = function(){
								var cacheOrder = $this._files[0];
								if(cacheOrder['error'] instanceof Function)cacheOrder.error.call(undefined, scriptTag);
								$this._removeFile(this.nodeName.toLowerCase() == 'script'?this.getAttribute('src'):this.getAttribute('href'));
								scriptTag = null;
								$this._continue(cacheOrder);
								this.onerror = null;
							};

							scriptTag.onload = function(){
								var cacheOrder = $this._files[0];
								$this._continue(cacheOrder);
								this.onload = null;
							};

							var keys = Object.keys($this._files[0]['attr'] || []);

							if($this._files[0]['attr'] && keys.length>0 && scriptTag){
								for(order = 0; order < keys.length; order++)scriptTag.setAttribute(keys[order],$this._files[0]['attr'][keys[order]]);
							}
							document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);

						}else{
							setTimeout(function(){
								if($this._files.length>0){
									$this._files.unshift();
									$this.loadFiles();
								}
								else {
									if($this._finish instanceof Function)
										$this._finish.call(undefined, $this, $this._addedFiles);
								}
							}, $this._files[0]['waitTime'] || $this._defaultTime);
							console.log($this.files[0]['fileSrc'] + ' file is already added.');
						}
					}else{
						throw 'files element must be object';
					}
				}else{
					throw 'files must be array';
				}
			}else{
				console.log($this._files[0]);
				$this._files.shift();
			}

		}
	},

	/**
	 * Yükleme sırasıda hata olursa ilgili tag siliniyor...
	 * */
	_removeFile:{
		enumerable:false,
		writable:false,
		value:function(file){
			var $this = this;
			if(file){
				var head = document.getElementsByTagName('HEAD')[0],scriptFile = [], linkFile = [],
						scriptFile = head.getElementsByTagName('script'),
						linkFile = head.getElementsByTagName('link'),
						allFiles = $this._objectPush(scriptFile, linkFile);
				for(var x = 0; x<allFiles.length; x++){
					if(allFiles[x].nodeName == 'script'){
						if(allFiles[x].getAttribute('src') == file){
							allFiles[x].parentNode.removeChild(allFiles[x]);
						}
					}else{
						if(allFiles[x].getAttribute('href') == file){
							allFiles[x].parentNode.removeChild(allFiles[x]);
						}
					}
				}
			}
		}
	},
	_objectPush:{
		enumerable:false,
		writable:false,
		value:function(args){
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
		}
	},
	_loadedFiles:{
		enumerable:false,
		writable:true,
		value :[]
	},
	_fileExist:{
		enumerable:false,
		writable:false,
		value: function(source){
			var $this = this;
			if(source){
				$this._loadedFiles = [];
				var head = document.getElementsByTagName('HEAD')[0],
						order, cacheFiles = [],
						scripts = head.getElementsByTagName('script'),
						scriptLength = scripts.length,
						linkFiles = head.getElementsByTagName('link'),
						linkFilesLength = linkFiles.length;
				for(order = 0; order < scriptLength; order++){
					if($this._loadedFiles.indexOf(scripts[order].getAttribute('src'))==-1)$this._loadedFiles.push(scripts[order].getAttribute('src').split(/\?/g)[0]);
				}
				for(order = 0 ; order < linkFilesLength; order++){
					if($this._loadedFiles.indexOf(linkFiles[order].getAttribute('href'))==-1)$this._loadedFiles.push(linkFiles[order].getAttribute('href').split(/\?/g)[0]);
				}

				if($this._loadedFiles.indexOf(Boolean($this._files[0]['fileSrc'].match(/(\.js)/gmi))?($this._scriptURL + source):(source = $this._linkURL + source))<0){
					$this._loadedFiles.push(source);
					return false;
				}else{
					return true;
				}
			}else{
				console.log('fileSrc value is emtpy or null');
				return true;
			}
		}
	}
});
