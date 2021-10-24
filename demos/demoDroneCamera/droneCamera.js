
    function DroneCameraControl(initialPos){

        let MIN_Y=1;

        let DELTA_TRASLACION=0.5;        // velocidad de traslacion 
        let DELTA_ROTACION=0.02;         // velocidad de rotacion
        let FACTOR_INERCIA=0.05;

        let vec3=glMatrix.vec3;          // defino vec3 para no tener que escribir glMatrix.vec3
        let mat4=glMatrix.mat4;

        if (!initialPos) initialPos=[0,0,0];

        let position=vec3.fromValues(initialPos[0],initialPos[1],initialPos[2]);
        let rotation=vec3.create();

        let rotationMatrix=mat4.create();		

        let worldMatrix=mat4.create();

        let camInitialState={
            xVel:0,
            zVel:0,
            yVel:0,
            xVelTarget:0,
            zVelTarget:0,
            yVelTarget:0,

            yRotVelTarget:0,
            yRotVel:0,
            zRotVelTarget:0,
            zRotVel:0,
            xRotVelTarget:0,
            xRotVel:0,
            
            rightAxisMode:"move"
        }

        let camState=Object.assign({},camInitialState);

        
        // Eventos de teclado **********************************************

        document.addEventListener("keydown",function(e){
            //console.log(e.key);
                
            /*
                ASDWQE para rotar en 3 ejes en el espacio del objeto

                Flechas + PgUp/PgDw o HJKUOL para trasladar en el espacio del objeto

            */

            switch ( e.key ) {

                case "ArrowUp":  case "u": // up
                    camState.zVelTarget=DELTA_TRASLACION; break;
                case "ArrowDown": case "j": // down
                    camState.zVelTarget=-DELTA_TRASLACION; break; 

                case "ArrowLeft": case "h": // left
                    camState.xVelTarget=DELTA_TRASLACION;break;
                case "ArrowRight": case "k": // right
                    camState.xVelTarget=-DELTA_TRASLACION; break;   

                case "o": case "PageUp": // PgUp
                    camState.yVelTarget=DELTA_TRASLACION;break;
                case "l": case "PageDown":// PgDw
                    camState.yVelTarget=-DELTA_TRASLACION; break;        
   

                case "s":
                    camState.xRotVelTarget=DELTA_ROTACION;break;                                 
                case "w": 
                    camState.xRotVelTarget=-DELTA_ROTACION;break;


                case "a": 
                    camState.yRotVelTarget=DELTA_ROTACION; break;                
                case "d": 
                    camState.yRotVelTarget=-DELTA_ROTACION; break;         

            
                case "q":
                    camState.zRotVelTarget=DELTA_ROTACION;break;                                 
                case "e": 
                    camState.zRotVelTarget=-DELTA_ROTACION;break;            


                        
                case "r": 
                    rotation=vec3.create();
                    position=vec3.fromValues(initialPos[0],initialPos[1],initialPos[2]);
                    camState=Object.assign({},camInitialState);
                    rotationMatrix=mat4.create();
                    break;

                case "t": 
                    rotation=vec3.create();                    
                    camState=Object.assign({},camInitialState);
                    break;                    

            }               

        })

        document.addEventListener("keyup",function(e){

            switch ( e.key ) 
            {
                case "ArrowUp":  case "u": case "ArrowDown": case "j": 
                    camState.zVelTarget=0; break;
                
                case "ArrowLeft": case "h": case "ArrowRight": case "k": 
                    camState.xVelTarget=0; break;  

                case "o": case "l": 
                case "PageDown": case "PageUp":
                    camState.yVelTarget=0;break;
    
  
                case "a": 
                    camState.yRotVelTarget=0; break;
                case "d": 
                    camState.yRotVelTarget=0; break;
                    
                case "w": 
                    camState.xRotVelTarget=0;break; 
                case "s":
                    camState.xRotVelTarget=0;break;                           
            
                case "q": 
                    camState.zRotVelTarget=0;break; 
                case "e":
                    camState.zRotVelTarget=0;break;                           
                    
          
            }                 
            
        })
        

        this.update=function(){
            
            camState.xVel+=(camState.xVelTarget-camState.xVel)*FACTOR_INERCIA;
            camState.yVel+=(camState.yVelTarget-camState.yVel)*FACTOR_INERCIA;
            camState.zVel+=(camState.zVelTarget-camState.zVel)*FACTOR_INERCIA;

            camState.xRotVel+=(camState.xRotVelTarget-camState.xRotVel)*FACTOR_INERCIA;
            camState.yRotVel+=(camState.yRotVelTarget-camState.yRotVel)*FACTOR_INERCIA;
            camState.zRotVel+=(camState.zRotVelTarget-camState.zRotVel)*FACTOR_INERCIA;

            let translation=vec3.fromValues(-camState.xVel,camState.yVel,-camState.zVel);                        
            

            if (Math.abs(camState.xRotVel)>0) {		
                // este metodo aplica una rotacion en el eje AXIS en el espacio del objeto o respecto del eje "local", NO el eje de mundo
                mat4.rotate(rotationMatrix,rotationMatrix,camState.xRotVel,vec3.fromValues(1,0,0));                
            }

            if (Math.abs(camState.yRotVel)>0) {
                mat4.rotate(rotationMatrix,rotationMatrix,camState.yRotVel,vec3.fromValues(0,1,0));                
            }
            
            if (Math.abs(camState.zRotVel)>0) {
                mat4.rotate(rotationMatrix,rotationMatrix,camState.zRotVel,vec3.fromValues(0,0,1));                
            }
            

            vec3.transformMat4(translation,translation,rotationMatrix);
            vec3.add(position,position,translation);

            worldMatrix=mat4.create();
            mat4.translate(worldMatrix,worldMatrix,position);        
            mat4.multiply(worldMatrix,worldMatrix,rotationMatrix);
            
            
        }


        this.getViewMatrix=function(){

            let m=mat4.clone(worldMatrix);            
            mat4.invert(m,m);
            return m;
        }

        this.getMatrix=function(){

            return worldMatrix;

        }



    }
