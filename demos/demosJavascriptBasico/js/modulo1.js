var APP =  APP || {};

// Modulo 1
(function(){
	
	var temp=1;
	var a=2;
	
	function Clasificador(){
		//
		//	
		console.log("se construyó un clasificador");
		
		this.metodo1=function(){
			return 0;
		}
		
		this.metodo2=function(){
			return 1;	
		}
	}
	
	APP.clasificador=new Clasificador();

}());






