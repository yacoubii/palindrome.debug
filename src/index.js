//import 'babel-polyfill';
import * as THREE from 'three';
import { CSS2DObject } from 'three-css2drender';
import { GradientedTriangle, Triangle, SimpleLine, DasheLine } from './ThreeGeometryObjects';
import { initThreeObjects } from './ThreeJSBasicObjects';
import { dataGenerator } from './dataGenerator';
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FontLoader, TextGeometry } from 'three';

/**
 * @param {HTMLElement} parentElement perent element of three's renderer element
 * @param {*} conf model's configuration
 */
export default (function(parentElement, conf) {
        var loader = new THREE.FontLoader();
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
    
        let debug = true;

        // data related
        let dataIterator, newData;

        // three.js related
        let lineMaterial, dashLineMaterial, lineMaterialTransparent;
        const meshs = {};
        const {
            scene,
            labelsRenderer,
            controls,
            renderer,
            camera
        } = initThreeObjects();


        var hoveredObjects = {};
        window.addEventListener('mousemove', 
		function (event) {
			
			event.preventDefault();

			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);

			var intersects = raycaster.intersectObjects(scene.children, true);
            var hoveredObjectUuids = intersects.filter(e => e.object.name.includes("_sphereHoverRegion")).map(el => el.object.uuid);
			for (var i = 0; i < intersects.length; i++) {
                
				if(intersects[i].object.name.includes("_sphereHoverRegion")){	
                    let name = intersects[i].object.name;
                    name = name.replace('_sphereHoverRegion','_text');
                    var hoveredObj = intersects[i].object;
                    meshs[name].visible=true;
                    if(conf.metricsLabelsRenderingMode === "2D"){
                        meshs[name].element.style.display="";
                    }
                    if (hoveredObjects[hoveredObj.uuid]) {
                        continue; // this object was hovered and still hovered
                    }
                    hoveredObjects[hoveredObj.uuid] = hoveredObj;
                    

					
				}
					
			}

            for (let uuid of Object.keys(hoveredObjects)) {
                let idx = hoveredObjectUuids.indexOf(uuid);
                if (idx === -1) {
                    // object with given uuid was unhovered
                    let unhoveredObj = hoveredObjects[uuid];
                    let name = unhoveredObj.name;
                    name = name.replace('_sphereHoverRegion','_text');
                    if(meshs[name]){
                        meshs[name].visible=false;
                        if(conf.metricsLabelsRenderingMode === "2D"){
                            meshs[name].element.style.display="none";
                        }
                    }
                        
                
                    delete hoveredObjects[uuid];
        
                }
            }
		}
	    );


        scene.background = new THREE.Color( "#e3e3e3" );
        //scene.background = new THREE.Color( "black");
        /*const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 2; //intensity of glow
        bloomPass.radius = 0;
        var bloomComposer = new EffectComposer(renderer);
        
        bloomComposer.setSize(window.innerWidth, window.innerHeight);
        bloomComposer.renderToScreen = true;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);*/

        
        let metricParameters = {},
            layerParameters = {},
            borderThickness = 4;
        //metrics
        metricParameters["displayUnits"] = conf.displaysMetricsLabelsUnit;
        metricParameters["characterFont"] = conf.metricsLabelsCharacterFont;
        metricParameters["labelSize"] = conf.metricsLabelsSize;
        metricParameters["labelColor"] = conf.metricsLabelsColor;
        metricParameters["labelBackground"] = conf.metricsLabelsBackground;
        metricParameters["labelBold"] = '';
        metricParameters["labelItalic"] = '';
        if (conf.metricsLabelsBold) {
            metricParameters["labelBold"] = 'bold'
        }
        if (conf.metricsLabelsItalic) {
            metricParameters["labelItalic"] = 'Italic'
        }
        // layers
        layerParameters["characterFont"] = conf.layersLabelsCharacterFont;
        layerParameters["labelSize"] = conf.layersLabelsSize;
        layerParameters["labelColor"] = conf.layersLabelsColor;
        layerParameters["labelBackground"] = conf.layersLabelsBackground;
        layerParameters["labelBold"] = '';
        layerParameters["labelItalic"] = '';
        if (conf.layersLabelsBold) {
            layerParameters["labelBold"] = 'bold'
        }
        if (conf.layersLabelsItalic) {
            layerParameters["labelItalic"] = 'Italic'
        }

        //3D related
        let labelDiv = [];
        if (conf.metricsLabelsRenderingMode === "3D") {
            metricParameters['labelSize'] = metricParameters['labelSize'] * 1.8;
        }
        if (conf.layersLabelsRenderingMode === "3D") {
            layerParameters['labelSize'] = layerParameters['labelSize'] * 1.8;
        }

        parentElement.appendChild(renderer.domElement);
        parentElement.appendChild(labelsRenderer.domElement);

        // TODO change this when we have a real data source
        const fileContent = new Request("default-data.json");

        var clock = new THREE.Clock();
        var time = 0;

        

        run(fileContent);




        /**
         * Main function
         *
         * @param {*} src source of the configuration, defaults to conf.data
         */
        async function run(src) {
            // init data
            //const result = await fetch(src);
            
            let data;
            try {
                data = await result.json();
            } catch (error) {
                data = conf.data;
            }
                        
            newData = data;
            dataIterator = dataGenerator(data);

            // init materials
            lineMaterial = new THREE.LineDashedMaterial({
                color: conf.lineColor,
                linewidth: conf.lineWidth,
                opacity: conf.lineOpacity,
            });
            var lineVertShader = `
                attribute float lineDistance;
                varying float vLineDistance;
                
                void main() {
                vLineDistance = lineDistance;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_Position = projectionMatrix * mvPosition;
                }
                `;
            var lineFragShader = `
                uniform vec3 diffuse;
                uniform float opacity;
                uniform float time; // added time uniform
            
                uniform float dashSize;
                uniform float gapSize;
                uniform float dotSize;
                varying float vLineDistance;
                
                void main() {
                    float totalSize = dashSize + gapSize;
                    float modulo = mod( vLineDistance + time, totalSize ); // time added to vLineDistance
                float dotDistance = dashSize + (gapSize * .5) - (dotSize * .5);
                
                if ( modulo > dashSize && mod(modulo, dotDistance) > dotSize ) {
                    discard;
                }
            
                gl_FragColor = vec4( diffuse, opacity );

                
                }
                `;

            dashLineMaterial = new THREE.ShaderMaterial({
                uniforms: {
                      diffuse: {value: new THREE.Color(conf.frameLineColor)},
                  dashSize: {value: conf.frameDashLineSize},
                  gapSize: {value: 1},
                  dotSize: {value: 0.1},
                  opacity: {value: 1.0},
                  time: {value: 0},
                   // added uniform
                },
                side: THREE.DoubleSide,
                vertexShader: lineVertShader,
                fragmentShader: lineFragShader,
                transparent: true
            });

            dashLineMaterial.linewidth=conf.frameLineWidth;
            lineMaterialTransparent = new THREE.LineDashedMaterial({
                color: conf.mainAppColor,
                linewidth: conf.lineWidth,
                opacity: conf.lineOpacity
            });

            // rendering
            if (conf.displayGrid) {
                displayGrid(conf.gridSize, conf.gridDivisions);
            }
            if (conf.displayMetricsLabels) {
                // configuration text parameters
                createLabels(data);
            }

            render(data);
            cameraVewOptions(meshs);
        }



        /**
         * Adds a grid at Z = 0
         *
         * @param {number} size  (conf.gridSize)
         * @param {number} divisions (conf.gridDivisions)
         */
        function displayGrid(size, divisions) {
            let gridHelper = new THREE.GridHelper(size, divisions);
            scene.add(gridHelper);
        }

        /**
         * Return a text in html balise p
         *
         * @param {string} labelText label text
         * @param {boolean} cardColor label card color
         * @param {boolean} cardBackground label card color
         * @param {*} parameters control label parameters
         */
        function createHtmlText(labelText, cardColor, cardBackground, parameters) {
            let p = document.createElement('p');
            p.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
            p.style.color = parameters['labelColor'];
            p.style.fontSize = parameters['labelSize'] + 'px';
            p.style.fontFamily = parameters['characterFont'];
            p.style.fontWeight = parameters["labelBold"];
            p.style.fontStyle = parameters["labelItalic"];
            p.style.padding = '5px';
            if (cardColor) {
                p.style.border = ' 2px ' + parameters['labelColor'] + ' dashed';
            }
            if (cardBackground) {
                p.style.background = parameters["labelBackground"];
            }
            p.innerText = labelText;
            return p;
        }

        /**
         * Return a canvas element
         *
         * @param {string} labelName label name
         * @param {string} labelText label text
         * @param {*} parameters control label parameters
         */
        function createLabelCanvas(labelName, labelText, parameters) {
            //prepare canvas
            let labelCanvas = document.createElement('canvas');
            labelCanvas.setAttribute("className", labelName);
            labelCanvas.setAttribute("width", 1200 + " px");
            labelCanvas.setAttribute("height", 600 + " px");
            
            //prepare context
            let labelContext = labelCanvas.getContext('2d');
            labelContext.font = parameters["labelItalic"] + " " + parameters["labelBold"] + " " + parameters['labelSize'] + "px " + parameters['characterFont'];
            labelContext.lineWidth = borderThickness;
            labelContext.textAlign = 'center';
            labelContext.fillStyle = parameters['labelColor'];        

            //reassign values (design pattern)
            let w = labelCanvas.width,
                h = labelCanvas.height;

            addTextBackground(labelContext, borderThickness / 2, borderThickness / 2, w + (borderThickness * parameters['labelSize']), h / 2 + (borderThickness * parameters['labelSize']), 'rgba(14,167,83,0)');
            addMultiLineText(labelText, w / 2, h / 2, parameters['labelSize'], w, labelContext);
            return labelCanvas;
        }

        /**
         * Return a html table
         *
         * @param {string} data table data
         * @param {*} parameters control label parameters
         */
        function createHtmlTable(data, parameters) {

            let tbl = document.createElement("Table");
            tbl.style.display = "table-cell";
            tbl.style.verticalAlign = 'middle';
            tbl.style.borderCollapse = 'collapse';
            tbl.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
            for (const [xKey, xValue] of Object.entries(data)) {
                let tRow = tbl.insertRow();
                tRow.style.border = '1px solid #dbdbdb';
                tRow.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
                let rgb = hexToRgb(parameters["labelBackground"]);
                tRow.style.backgroundColor = 'rgb(' + (rgb.r) + ',' + rgb.g + ',' + (rgb.b - 10) + ',' + 0.6 + ')';
                if (parseInt(xKey) === 0) {
                    tRow.style.backgroundColor = parameters["labelBackground"]
                }
                for (const [yKey, yValue] of Object.entries(xValue)) {
                    let tCel = tRow.insertCell();
                    tCel.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
                    tCel.style.color = parameters["labelColor"];
                    tCel.style.fontFamily = parameters["characterFont"];
                    tCel.style.fontWeight = parameters["labelBold"];
                    tCel.style.fontStyle = parameters["labelItalic"];
                    tCel.style.fontSize = parameters["labelSize"] + 'px;';
                    tCel.style.padding = '5px 8px';
                    tCel.style.lineHeight = '20px';
                    tCel.style.verticalAlign = 'middle';
                    tCel.style.border = '1px solid #dbdbdb';
                    tCel.appendChild(document.createTextNode(yValue));
                }
            }
            return tbl;
        }

        /**
         * Update table data
         *
         * @param {string} data label data
         * @param {*} htmlTable html object
         */
        function updateHtmlTable(htmlTable, data) {
            for (let i = 0; i < htmlTable.rows[0].cells.length; i++) {
                if (htmlTable.rows[0].cells[i].innerHTML == "Value") {
                    htmlTable.rows[1].cells[i].innerText = data[1][i];
                }
            }
        }

        /**
         * Return a rgb Color
         *
         * @param {string} hex hec color
         */
        function hexToRgb(hex) {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        /**
         * Return a svg img
         *
         * @param {*} htmlElement html element
         */
        function htmlToSvg(htmlElement) {
            const img = document.createElement('img');
            img.src = 'data:image/svg+xml,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600">' +
                '   <foreignObject  width="100%" height="100%">' +
                '       <body xmlns="http://www.w3.org/1999/xhtml" style="height:100%;display:flex;justify-content:center;align-items:center;">' +
                htmlElement.innerHTML +
                '       </body>' +
                '   </foreignObject>' +
                '</svg>');
            return img;
        }

        /**
         * Return a svg img
         *
         * @param {*} svg svg img
         * @param {*} htmlElement html element
         * @param {*} map material map
         */
        function updateSvgSrc(svg, htmlElement, map) {
            svg.onload = function() {
                map.needsUpdate = true;
                svg.src = 'data:image/svg+xml,' + encodeURIComponent(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600">' +
                    '   <foreignObject  width="100%" height="100%">' +
                    '       <body xmlns="http://www.w3.org/1999/xhtml" style="height:100%;display:flex;justify-content:center;align-items:center;">' +
                    htmlElement.innerHTML +
                    '       </body>' +
                    '   </foreignObject>' +
                    '</svg>');
            }
        }

        /**
         * To add a background color to a text field
         *
         * @param  {*} context canvas get 2D contexté
         * @param  {number} x  x position
         * @param  {number} y y position
         * @param  {number} width  background width
         * @param  {number} height  background height
         * @param  {string} color background color
         */
        function addTextBackground(context, x, y, width, height, color) {
            context.save();
            context.textBaseline = 'top';
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
            context.restore();
        }

        /**
         * Managing HTML5 text on multiple lines
         *
         *
         * @param  {string} text       label name
         * @param  {number} x          x position
         * @param  {number} y          y position
         * @param  {number} lineHeight row height
         * @param  {number} fitWidth   text width before line break
         * @param {*} oContext   canvas get 2D context
         */
        function addMultiLineText(text, x, y, lineHeight, fitWidth, oContext) {
            let draw = x != null && y != null;
            // for the management of manual line breaks
            text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
            let sections = text.split("\n");
            let str, wordWidth, currentLine = 0,
                maxHeight, maxWidth = 0;
            let printNextLine = function(str) {
                if (draw) {
                    oContext.fillText(str, x, y + (lineHeight * currentLine));
                    currentLine++;
                    wordWidth = oContext.measureText(str).width;
                }
                if (wordWidth > maxWidth) {
                    maxWidth = wordWidth;
                }
            };

            for (let i = 0; i < sections.length; i++) {
                let words = sections[i].split(' ');
                let index = 1;
                while (words.length > 0 && index <= words.length) {
                    str = words.slice(0, index).join(' ');
                    wordWidth = oContext.measureText(str).width;
                    if (wordWidth > fitWidth) {
                        if (index === 1) {
                            // Falls to this case if the first word in words[] is bigger than fitWidth
                            // so we print this word on its own line; index = 2 because slice is
                            str = words.slice(0, 1).join(' ');
                            words = words.splice(1);
                        } else {
                            str = words.slice(0, index - 1).join(' ');
                            words = words.splice(index - 1);
                        }

                        printNextLine(str);

                        index = 1;
                    } else
                        index++;
                }

                // The left over words on the last line
                if (index > 0)
                    printNextLine(words.join(' '));
            }

            maxHeight = lineHeight * (currentLine);
            if (!draw) {
                return {
                    height: maxHeight,
                    width: maxWidth
                };
            }
        }

        /**
         * return label data like classicData or jsonData, TableData
         *
         * @param {string} labelName label name
         * @param {string} labelType type of label
         * @param {string} labelValue label value
         * @param {string} labelUnit the unit of label
         */
        function getMetricsLabelsStructureData(labelName, labelType, labelValue, labelUnit, metricData) {
            if(metricData && labelUnit==='%'){
                //percentage handle
                labelValue=(labelValue/metricData.max)*100;
            }
            let data = '';
            if (conf.metricsLabelsRenderingFormat === "Text") {
                if (conf.metricsLabelsStructure.indexOf("Name") != -1) {
                    data += labelName;
                }
                if (conf.metricsLabelsStructure.indexOf("Type") != -1) {
                    data += ' - ' + labelType;
                }
                if (conf.metricsLabelsStructure.indexOf("Value") != -1) {
                    data += ' : ' + labelValue;
                }
                if (conf.metricsLabelsStructure.indexOf("Unit") != -1) {
                    data += ' ' + labelUnit;
                }
            } else if (conf.metricsLabelsRenderingFormat === "Json") {
                data += '{';
                if (conf.metricsLabelsStructure.indexOf("Name") != -1) {
                    data += '"Name" : "' + labelName + '", ';
                }
                if (conf.metricsLabelsStructure.indexOf("Type") != -1) {
                    data += '"Type" : "' + labelType + '", ';
                }
                if (conf.metricsLabelsStructure.indexOf("Value") != -1) {
                    data += '"Value" : "' + labelValue + '", ';
                }
                if (conf.metricsLabelsStructure.indexOf("Unit") != -1) {
                    data += '"Units" : "' + labelUnit + '"';
                }
                data += '}'
            } else if (conf.metricsLabelsRenderingFormat === "Table") {
                let tbody = [],
                    tHead = [];
                if (conf.metricsLabelsStructure.indexOf("Name") != -1) {
                    tbody.push("Name");
                    tHead.push(labelName);
                }
                if (conf.metricsLabelsStructure.indexOf("Type") != -1) {
                    tbody.push("Type");
                    tHead.push(labelType);
                }
                if (conf.metricsLabelsStructure.indexOf("Value") != -1) {
                    tbody.push("Value");
                    tHead.push(labelValue);
                }
                if (conf.metricsLabelsStructure.indexOf("Unit") != -1) {
                    tbody.push("Unit");
                    tHead.push(labelUnit);
                }
                data = { 0: tbody, 1: tHead };
            }
            return data;
        }

        /**
         * Create a label using CSS2DObject
         *
         * @param {string} key to keep track the label
         * @param {string} labelName label name
         * @param {string} labelType type of label
         * @param {string} labelValue label value
         * @param {number} metricIndex to keep track layers and metric inside
         * @param {string} labelUnit the unit of label3D
         */
        function create2DMetricsLabels(key, labelName, labelType, labelValue, metricIndex, labelUnit) {
            //console.log(labelValue);
            let data = getMetricsLabelsStructureData(labelName, labelType, labelValue, labelUnit,null),
                div = document.createElement('div');
            div.className = 'label ' + labelName;
            div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
            if (conf.metricsLabelsRenderingFormat === 'Text') {
                div.appendChild(createHtmlText(data, false, false, metricParameters));
            } else if (conf.metricsLabelsRenderingFormat === "Table") {
                div.appendChild(createHtmlTable(data, metricParameters));
            } else if (conf.metricsLabelsRenderingFormat === "Json") {
                div.appendChild(createHtmlText(data, false, true, metricParameters));
            }
            const metricsLabels = new CSS2DObject(div);
            
            metricsLabels.key = key;
            metricsLabels.name = labelName;
            metricsLabels.dataType = labelType;
            metricsLabels.metricIndex = metricIndex;
            metricsLabels.labelUnit = labelUnit;
            return metricsLabels;
        }

        /**
         * Return a 3d label with text sprite and webGL
         *
         * @param {string} key to keep track the label
         * @param {string} labelName label name
         * @param {string} labelType type of label
         * @param {string} labelValue label value
         * @param {number} metricIndex to keep track layers and metric inside
         * @param {string} labelUnit the unit of label
         */
        function create3DMetricsLabels(key, labelName, labelType, labelValue, metricIndex, labelUnit) {
            let texture = new THREE.Texture(),
                textureImage,
                data = getMetricsLabelsStructureData(labelName, labelType, labelValue, labelUnit,null);
            
            labelDiv[labelName] = document.createElement('div');
            labelDiv[labelName].className = 'label ' + labelName;
            labelDiv[labelName].setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
            if (conf.metricsLabelsRenderingFormat === 'Text') {
                // canvas contents will be used for a texture
                if (conf.metricsLabels3DRenderingMode === 'Canvas') {
                    // canvas contents will be used for a texture
                    
                    textureImage = createLabelCanvas(labelName, data, metricParameters);
                } else if (conf.metricsLabels3DRenderingMode === 'Svg') {
                    labelDiv[labelName].appendChild(createHtmlText(data, false, false, metricParameters));
                    textureImage = htmlToSvg(labelDiv[labelName]);
                }
            } else if (conf.metricsLabelsRenderingFormat === "Table") {
                labelDiv[labelName].appendChild(createHtmlTable(data, metricParameters));
                textureImage = htmlToSvg(labelDiv[labelName]);
            } else if (conf.metricsLabelsRenderingFormat === "Json") {
                labelDiv[labelName].appendChild(createHtmlText(data, false, true, metricParameters));
                textureImage = htmlToSvg(labelDiv[labelName]);
            }
            texture.image = textureImage;

            setTimeout( function () {
                    // assigning data to HTMLImageElement.src is asynchronous (see #15162)
                    // using setTimeout() avoids the warning "Texture marked for update but image is incomplete"
                    texture.needsUpdate = true;
            }, 0 );
                        
            texture.minFilter = THREE.NearestFilter;
            
            let spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthWrite: false, transparent: true }),
                metricsLabels = new THREE.Sprite(spriteMaterial);

            metricsLabels.scale.set(2 * metricParameters["labelSize"], 1 * metricParameters["labelSize"], metricParameters["labelSize"]);
            metricsLabels.key = key;
            metricsLabels.name = labelName;
            metricsLabels.dataType = labelType;
            metricsLabels.metricIndex = metricIndex;
            metricsLabels.labelUnit = labelUnit;
            //console.log("data",metricsLabels);
            
            return metricsLabels;

            //todo : reimplement so it does not interfere with 'text sprite' method
            //if (conf.labels3DRendering === 3) {
            //    let canvasWebGL = document.createElement('canvas');
            //    let gl = canvasWebGL.getContext('webgl');
            //    textureWebGL = gl.createTexture(texture);
            //    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            //    gl.bindTexture(gl.TEXTURE_2D, textureWebGL);
            //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            //    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            //    gl.generateMipmap(gl.TEXTURE_2D);
            //    gl.bindTexture(gl.TEXTURE_2D, null);
            //}
        }

        /**
         * Create 2D layer label using CSS2DObject
         *
         * @param {string} key to keep track the label
         * @param {string} labelName layer label name
         * @param {number} layerIndex to keep track layers and metric inside
         */
        function create2DLayersLabels(key, labelName, layerIndex) {
            let div = document.createElement('div');
            div.className = 'label ' + labelName;
            div.appendChild(createHtmlText(labelName, true, true, layerParameters));
            const layersLabels = new CSS2DObject(div);
            layersLabels.key = key;
            layersLabels.name = labelName;
            layersLabels.layerIndex = layerIndex;
            return layersLabels;
        }

        /**
         * Return 3d layer label with text sprite
         *
         * @param {string} key to keep track the label
         * @param {string} labelName layer label name
         * @param {number} layerIndex to keep track layers and metric inside
         */
        function create3DLayersLabels(key, labelName, layerIndex) {
            let texture = new THREE.Texture(),
                textureImage;
            labelDiv[labelName] = document.createElement('div');
            labelDiv[labelName].className = labelName;
            labelDiv[labelName].appendChild(createHtmlText(labelName, true, true, layerParameters));
            textureImage = htmlToSvg(labelDiv[labelName]);
            texture.image = textureImage;
            setTimeout( function () {
                // assigning data to HTMLImageElement.src is asynchronous (see #15162)
                // using setTimeout() avoids the warning "Texture marked for update but image is incomplete"
                texture.needsUpdate = true;
            }, 0 );
            texture.minFilter = THREE.NearestFilter;
            let spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthWrite: false, transparent: true }),
                layersLabels = new THREE.Sprite(spriteMaterial);
            layersLabels.scale.set(2 * layerParameters["labelSize"], 1 * layerParameters["labelSize"], layerParameters["labelSize"]);
            layersLabels.key = key;
            layersLabels.name = labelName;
            layersLabels.layerIndex = layerIndex;
            return layersLabels;

        }


        /**
         * Create labels for each metrics
         *
         * @param {*} data dataObject (conf.data)
         */
        function createLabels(data) {
            let zAxis = conf.zPlaneInitial,
                metricIndex = 0,
                layerIndex = 0;
            for (let layer in data) {
                let layers = data[layer].layer;
                let metrics = data[layer].metrics;
                let metricLabelsIds = [],
                    layersLabelsIds = [];
                //console.log(metrics);
                if (conf.displayMetricsLabels) {
                    for (const [key, value] of Object.entries(metrics)) {
                        if (metricLabelsIds.includes(key) === true) {
                            console.warn("This layer contains two times the same metric key", [layer]);
                            break;
                        } else {
                            metricLabelsIds.push(key)
                            let current = value.current;
                            let min = value.min;
                            let med = value.med;
                            let max = value.max;
                            if(value.unit==='%'){
                                current=(value.current/value.max)*100;
                                min=(value.min/value.max)*100;
                                med=(value.med/value.max)*100;
                                max=(value.max/value.max)*100;
                                
                            }
                            if (conf.metricsLabelsRenderingMode === "2D") {
                                scene.add(create2DMetricsLabels(key, value.label, 'current', current, metricIndex, value.unit));
                                if (conf.displayAllMetricsLabels) {
                                    scene.add(create2DMetricsLabels(key, value.label, 'min', min, metricIndex, value.unit));
                                    scene.add(create2DMetricsLabels(key, value.label, 'med', med, metricIndex, value.unit));
                                    scene.add(create2DMetricsLabels(key, value.label, 'max', max, metricIndex, value.unit));
                                }
                            } else if (conf.metricsLabelsRenderingMode === "3D") {
                                scene.add(create3DMetricsLabels(key, value.label, 'current', current, metricIndex, value.unit));
                                

                                if (conf.displayAllMetricsLabels) {
                                    scene.add(create3DMetricsLabels(key, value.label, 'min', min, metricIndex, value.unit));
                                    scene.add(create3DMetricsLabels(key, value.label, 'med', med, metricIndex, value.unit));
                                    scene.add(create3DMetricsLabels(key, value.label, 'max', max, metricIndex, value.unit));
                                }
                            }
                        }
                    }
                }
                if (conf.displayLayersLabels && conf.displayMetricsLabels) {
                    for (const [key, value] of Object.entries(layers)) {
                        if (layersLabelsIds.includes(key) === true) {
                            console.warn("This layer contains two times the same metric key", [layer]);
                            break;
                        } else {
                            layersLabelsIds.push(key);
                            if (conf.layersLabelsRenderingMode === "2D") {
                                scene.add(create2DLayersLabels(key, value.label, layerIndex));
                            } else if (conf.layersLabelsRenderingMode === "3D") {
                                layersLabelsIds.push(key);
                                
                                scene.add(create3DLayersLabels(key, value.label, layerIndex));
                            }
                        }
                    }
                }
                zAxis -= conf.zPlaneHeight;
                layerIndex++;
                metricIndex++;
            }
        }

        /**
         * Create and update every mesh to match the latest data
         */
        function updateMeshs() {

            if (conf.mockupData) {
                newData = dataIterator.next().value;
            }
            let zAxis = conf.zPlaneInitial,
                previousMetric = null,
                previousLayer = null,
                previousLayerStatus=null,
                metricIndex = 0,
                layerIndex = 0;
            for (let layer in newData) {
                //Declaration of metrics variables
                //this is the updated layer metrics
                const metrics = newData[layer].metrics,
                    layers = newData[layer].layer,
                    metricsNumber = Object.values(metrics).length;
                //this is the new total of current's
                const metricCurrentTotal = Object.values(metrics).map(item => item.current).reduce((a, b) => a + b, 0);
                //this is the new total of max's
                const metricMaxTotal = Object.values(metrics).map(item => item.max).reduce((a, b) => a + b, 0);
                //todo : status colors shall map with default colors
                const layerStatus = ((metricCurrentTotal / metricMaxTotal) * 100);
                //console.log(layer,layerStatus);
                let metricsDivider, metricValue = {};
                metricValue.max = layerPoints(Object.values(metrics).map(item => (conf.palindromeSize / item.max) * item.max), zAxis);
                metricValue.med = layerPoints(Object.values(metrics).map(item => (conf.palindromeSize / item.max) * item.med), zAxis);
                metricValue.min = layerPoints(Object.values(metrics).map(item => (conf.palindromeSize / item.max) * item.min), zAxis);
                metricValue.current = layerPoints(Object.values(metrics).map(item => (conf.palindromeSize / item.max) * item.current), zAxis);
                const metricsPositions = [metricValue.max, metricValue.med, metricValue.min];
                
                // displayMode
                if (conf.displayMode === "dynamic") {
                    metricsDivider = "current";
                } else if (conf.displayMode === "static") {
                    metricsDivider = "max";
                } else if (conf.displayMode === "debug") {} else {
                    break;
                }

                //draws and update layers outline
                if (conf.displayLayersLines) {
                    for (let i = 0; i < metricsNumber; i++) {
                        for (let [index, metricsPosition] of metricsPositions.entries()) {
                            //draws outside lines
                            drawLayerOutline(layer + '_layerShapesEdges', metricsPosition, i, metricsNumber, lineMaterial, index);
                        }
                    }
                }

                let xTab = [],
                    yTab = [],
                    zTab = [];
                //update metrics label, layers label and their positions
                let sortedMetricsLabels = scene.children.filter((item) => item.metricIndex === metricIndex),
                    sortedLayersLabels = scene.children.filter((item) => item.layerIndex === layerIndex);
                
                

                // update metrics
                if (conf.displayMetricsLabels) {
                    for (let i = 0; i < sortedMetricsLabels.length; i++) {
                        const metricsLabels = sortedMetricsLabels[i];
                        if (metrics[metricsLabels.key]) {
                            const metricData = metrics[metricsLabels.key];
                            const metricsLabelsName = metricData.label;
                            const metricsLabelsType = metricsLabels.dataType;
                            let metricsLabelsUnit = metricsLabels.labelUnit;
                            const metricsLabelsIndex = Object.keys(metrics).indexOf(metricsLabels.key);
                            const metricsLabelsValue = Object.values(metrics)[metricsLabelsIndex][metricsLabelsType].toFixed();
                            const labelPositions = metricValue[metricsLabelsType][metricsLabelsIndex];
                            if (debug === true) {
                                debug = false;
                            }
                            // update label data
                            
                            
                            metricsLabels.data = getMetricsLabelsStructureData(metricsLabelsName, metricsLabelsType, metricsLabelsValue, metricsLabelsUnit, metricData)
                            let x = labelPositions[0],
                                y = labelPositions[2],
                                z = labelPositions[1];
                            if (conf.metricsLabelsRenderingMode === "2D") {
                                if (conf.metricsLabelsRenderingFormat === "Text") {
                                    // update text label
                                    metricsLabels.element.getElementsByTagName('p').item(0).textContent = metricsLabels.data;
                                } else if (conf.metricsLabelsRenderingFormat === "Table") {
                                    // update table
                                    updateHtmlTable(metricsLabels.element.getElementsByTagName('table').item(0), metricsLabels.data);
                                } else if (conf.metricsLabelsRenderingFormat === "Json") {
                                    // update json
                                    metricsLabels.element.getElementsByTagName('p').item(0).textContent = metricsLabels.data;
                                }
                            } else if (conf.metricsLabelsRenderingMode === "3D") {
                                //get the label texture from the material map
                                let metricsLabelsTexture = metricsLabels.material.map.image;
                                if (conf.metricsLabelsRenderingFormat === "Text") {
                                    if (conf.metricsLabels3DRenderingMode === "Canvas") {
                                        //here metricsLabelsTexture is a canvas
                                        let labelContext = metricsLabelsTexture.getContext('2d')
                                            //clear the canvas
                                        labelContext.clearRect(0, 0, metricsLabelsTexture.width, metricsLabelsTexture.height);
                                        //update the canvas
                                        addMultiLineText(metricsLabels.data, metricsLabelsTexture.width / 2, metricsLabelsTexture.height / 2, metricsLabelsTexture.style.fontSize, metricsLabelsTexture.width, labelContext);
                                        //update the three.js object material map
                                        metricsLabels.material.map.needsUpdate = true;
                                        y = y + 0.4;
                                    } else if (conf.metricsLabels3DRenderingMode === "Svg") {
                                        // here metricLabelTexture is a table svg
                                        labelDiv[metricsLabelsName].getElementsByTagName('p').item(0).innerHTML = metricsLabels.data;
                                        updateSvgSrc(metricsLabelsTexture, labelDiv[metricsLabelsName], metricsLabels.material.map);
                                        y = y + 1;
                                    }
                                } else if (conf.metricsLabelsRenderingFormat === "Table") {
                                    // here metricsLabelsTexture is a table svg
                                    updateHtmlTable(labelDiv[metricsLabelsName].getElementsByTagName('table').item(0), metricsLabels.data);
                                    updateSvgSrc(metricsLabelsTexture, labelDiv[metricsLabelsName], metricsLabels.material.map);
                                    y = y + 1.8;
                                } else if (conf.metricsLabelsRenderingFormat === "Json") {
                                    // here metricsLabelsTexture is a json svg
                                    labelDiv[metricsLabelsName].getElementsByTagName('p').item(0).innerHTML = metricsLabels.data;
                                    updateSvgSrc(metricsLabelsTexture, labelDiv[metricsLabelsName], metricsLabels.material.map);
                                    y = y + 1;
                                }
                            }
                            if(x>=0){
                                x+=2;
                            }else{
                                x-=2;
                            }
                            metricsLabels.position.set(x, y, z);
                            // top x
                            xTab.push(labelPositions[0]);
                            zTab.push(labelPositions[2]);
                            yTab.push(labelPositions[1]);
                        }
                    }
                }

                // display layer
                let layersLabels = sortedLayersLabels[sortedLayersLabels.length - 1],
                    resize = 0.5;
                if (conf.displayLayersLabels && conf.displayMetricsLabels) {
                    if (conf.layersLabelsRenderingMode === "2D") {
                        resize = -1
                    }
                    // set label position
                    if (conf.layersLabelsOrientation === "Sticky") {
                        layersLabels.position.set(((xTab[xTab.length - 1][0] + xTab[xTab.length - 2][0]) / 2), ((zTab[zTab.length - 1][2])), (yTab[yTab.length - 1][1] + yTab[yTab.length - 2][1]) / 2);
                    } else if (conf.layersLabelsOrientation === "Free") {
                        layersLabels.position.set(((xTab[xTab.length - 1][0] + xTab[xTab.length - 2][0]) / 2), ((zTab[zTab.length - 1][2])), ((yTab[yTab.length - 1][1] + yTab[yTab.length - 2][1]) / 2) - (conf.framePadding + conf.framePadding * conf.framePadding));
                    }
                }

                // frame variable
                let positions = [],
                    arrowPositions = [],
                    frameName;
                if (conf.frameShape === 'Dynamic') {
                    // set frame name
                    frameName = layer + '_Dynamic_Frame';
                    // create dynamic frame positions
                    positions = layerPoints(Object.values(metrics).map(item => (conf.palindromeSize / item.max) * ((item.current * conf.framePadding) / 1.5)), zAxis);
                    // set arrow position
                    if (conf.displayLayersLabels) {
                        let x = positions[positions.length - 1][0],
                            z = positions[positions.length - 1][1],
                            y = positions[positions.length - 1][2];
                        arrowPositions.push([x, z, y]);
                        if (conf.layersLabelsOrientation === "Sticky") {
                            arrowPositions.push([x, z - (4 * conf.framePadding), y]);
                            // set layer label position
                            layersLabels.position.set(x, y + 0.5, z - (4 * conf.framePadding));
                        } else if (conf.layersLabelsOrientation === "Free") {
                            arrowPositions.push([x, z - (4 * conf.framePadding), y + conf.framePadding]);
                            // set layer label position
                            layersLabels.position.set(x, y + conf.framePadding, z - (4 * conf.framePadding));
                        }
                    }
                } else if (conf.frameShape === 'Rectangle') {
                    // set frame name
                    frameName = layer + '_Rectangle_Frame';
                    // create rectangle frame positions
                    positions.push([Math.max.apply(Math, xTab) + (conf.framePadding * conf.framePadding), Math.max.apply(Math, yTab) + (conf.framePadding * conf.framePadding), Math.max.apply(Math, zTab)]);
                    positions.push([Math.max.apply(Math, xTab) + (conf.framePadding * conf.framePadding), Math.min.apply(Math, yTab) - (conf.framePadding * conf.framePadding), Math.max.apply(Math, zTab)]);
                    positions.push([Math.min.apply(Math, xTab) - (conf.framePadding * conf.framePadding), Math.min.apply(Math, yTab) - (conf.framePadding * conf.framePadding), Math.max.apply(Math, zTab)]);
                    positions.push([Math.min.apply(Math, xTab) - (conf.framePadding * conf.framePadding), Math.max.apply(Math, yTab) + (conf.framePadding * conf.framePadding), Math.max.apply(Math, zTab)]);
                    // set arrow position
                    if (conf.displayLayersLabels) {
                        arrowPositions.push([(Math.max.apply(Math, xTab) + (conf.framePadding * conf.framePadding)), 0, Math.min.apply(Math, zTab)]);
                        if (conf.layersLabelsOrientation === "Sticky") {
                            arrowPositions.push([(Math.max.apply(Math, xTab) + (conf.framePadding * conf.framePadding)) * conf.framePadding, 0, Math.max.apply(Math, zTab)]);
                            layersLabels.position.set((Math.max.apply(Math, xTab) + (conf.framePadding * conf.framePadding)) * conf.framePadding, Math.max.apply(Math, zTab) + (resize), 0);
                        } else if (conf.layersLabelsOrientation === "Free") {
                            arrowPositions.push([(Math.max.apply(Math, xTab) + (conf.framePadding * conf.framePadding)) * conf.framePadding, 0, Math.max.apply(Math, zTab) + (conf.framePadding * conf.framePadding)]);
                            layersLabels.position.set((Math.max.apply(Math, xTab) + (conf.framePadding * conf.framePadding)) * conf.framePadding, Math.max.apply(Math, zTab) + (conf.framePadding * conf.framePadding), 0);
                        }
                    }
                }

                // display frames and arrow
                if (conf.displayFrames) {
                    // display frame line
                    if (conf.displayFramesLine) {
                        drawFrames([positions], frameName);
                    }
                    // display frame background
                    if (conf.displayFramesBackground) {
                       drawFramesBackground(positions, frameName, conf.frameBackgroundColor, conf.frameOpacity);
                    }
                    // display arrow Line
                    if (conf.displayFramesArrow) {
                        drawFrames([arrowPositions], layer + '_arrow')
                    }
                }

                //extract into create / update functions
                //draw and update sides lines and panels
                if (conf.displaySides === true) {
                    if (previousMetric !== null) {
                        const previousValueMax = layerPoints(Object.values(previousMetric).map(item => (conf.palindromeSize / item.max) * item[metricsDivider]), zAxis + conf.zPlaneMultilayer);
                        const previousPlaneLength = Object.values(previousMetric).length;
                        //adds side texture if the palindrome is more than 1 plane

                        //check if actual layer points is higher than previous ones to determine if the sides should be drawn from few to many OR from many to few
                        //for the number of sides
                        const sideDividerOdd = (metricsNumber >= previousPlaneLength) ? previousPlaneLength : metricsNumber;
                        const sideDividerEven = (metricsNumber >= previousPlaneLength) ? metricsNumber : previousPlaneLength;
                        //for the lengths of sides
                        const sideSizeOdd = (metricsNumber >= previousPlaneLength) ? metricValue[metricsDivider] : previousValueMax;
                        const sideSizeEven = (metricsNumber >= previousPlaneLength) ? previousValueMax : metricValue[metricsDivider];

                        for (let i = 0; i < sideDividerEven; i++) {
                            //todo : refactor this part with better variable names ?
                            let a = sideSizeEven[(i + 1) % sideDividerOdd];
                            let b = sideSizeOdd[(i + 1) % sideDividerEven];
                            let c = sideSizeEven[(i) % sideDividerOdd];
                            let d = sideSizeOdd[(i) % sideDividerEven];

                            let colorA = layerColorDecidedByLayerStatus(previousLayerStatus);
                            let colorB = layerColorDecidedByLayerStatus(layerStatus);

                            if (meshs['side-bias-line' + layer + i]) {
                                // if init done, update
                                meshs['side-bias-line' + layer + i].update(sideSizeOdd[i], a);
                                meshs['side-straight-line' + layer + i].update(b, a, lineMaterial);

                                meshs['side-top-left-pane' + layer + i].update(c, a, d, colorA, colorB)
                                meshs['side-bottom-right-pane' + layer + i].update(d, b, a, colorA, colorB);
                            } else {
                                //init objects
                                
                                meshs['side-bias-line' + layer + i] = new SimpleLine(sideSizeOdd[i], a, lineMaterialTransparent);
                                scene.add(meshs['side-bias-line' + layer + i]);
                                meshs['side-straight-line' + layer + i] = new SimpleLine(b, a, lineMaterial);
                                scene.add(meshs['side-straight-line' + layer + i]);

                                meshs['side-top-left-pane' + layer + i] = new GradientedTriangle(c, a, d, colorA,colorB);
                                scene.add(meshs['side-top-left-pane' + layer + i]);
                                meshs['side-bottom-right-pane' + layer + i] = new GradientedTriangle(d, b, a, colorA,colorB);
                                scene.add(meshs['side-bottom-right-pane' + layer + i]);
                            }
                        }
                    } else {
                        //todo : describe this case
                    }
                }

                //draws and update layers
                //todo number of shapes shall be dynamic
                //todo outer lines shall be optional and for all the shapes
                if (conf.displayLayers) {
                    
                    for (let i = 0; i < metricsNumber; i++) {
                        //draws innner layer shapes
                        if (conf.layerDisplayMode === "static") {
                            //console.log(layerStatus);
                            //drawTrianglesInALayer(layer + '_mintoMedLayerShape', metricValue.min, metricValue.med, i, metricsNumber, conf.layerMidColor);
                            drawTrianglesInALayer(layer + '_medtoMaxLayerShape', metricValue.med, metricValue.max, i, metricsNumber, layerColorDecidedByLayerStatus(layerStatus));
                        } else if (conf.layerDisplayMode === "mixed") {
                            drawTrianglesInALayer(layer + '_mintoCurLayerShape', metricValue.min, metricValue.current, i, metricsNumber, conf.layerMidColor);
                            drawTrianglesInALayer(layer + '_curtoMaxLayerShape', metricValue.current, metricValue.max, i, metricsNumber, layerColorDecidedByLayerStatus(layerStatus));
                        }
                        //todo : implement better behavior to see ranges
                        else if (conf.layerDisplayMode === "dynamic") {
                            drawTrianglesInALayer(layer + '_mintoCurLayerShape', metricValue.min, metricValue.current, i, metricsNumber, layerColorDecidedByLayerStatus(layerStatus));
                        }
                    }
                }

                if(conf.displayMetricSpheres){
                    makeShereContextsStatus(metricValue, layer, Object.values(metrics));
                }

                zAxis -= conf.zPlaneMultilayer;
                previousMetric = metrics;
                previousLayer = layers;
                previousLayerStatus = layerStatus;
                layerIndex++;
                metricIndex++;
            }
        }

        /**
         * Draw a line in a plane (layer)
         *
         * @param {string} layerName layer name
         * @param {number[]} planePoints coordinates of the line
         * @param {number} layerMetricIndex index of the line in the plane
         * @param {number} planePointLength number of points in the plane
         * @param {THREE.Material} material material to apply to the line
         * @param {number} layerMetricRangeIndex index of layer metric range
         */
        function drawLayerOutline(layerName, planePoints, layerMetricIndex, planePointLength, material, layerMetricRangeIndex) {
            if (meshs['_rangeOutline' + layerName + layerMetricIndex + layerMetricRangeIndex]) {
                // if init done
                meshs['_rangeOutline' + layerName + layerMetricIndex + layerMetricRangeIndex].update(planePoints[layerMetricIndex], planePoints[(layerMetricIndex + 1) % planePointLength])
            } else {
                //init objects
                meshs['_rangeOutline' + layerName + layerMetricIndex + layerMetricRangeIndex] = new SimpleLine(planePoints[layerMetricIndex], planePoints[(layerMetricIndex + 1) % planePointLength], material);
                scene.add(meshs['_rangeOutline' + layerName + layerMetricIndex + layerMetricRangeIndex]);
            }
        }

        /**
         * Return the color corresponding to a given metric value
         *
         * @param {number} value
         */
        function layerColorDecidedByLayerStatus(value) {
            let layerStatusColor = conf.statusColorLow;
            if (conf.layerStatusControl) {
                if (value >= conf.statusRangeLow && value <= conf.statusRangeMed) {
                    return layerStatusColor;
                } else if (value > conf.statusRangeMed && value <= conf.statusRangeHigh) {
                    layerStatusColor = conf.statusColorMed;
                    return layerStatusColor;
                } else if (value > conf.statusRangeHigh && value <= conf.statusRangeVeryHigh) {
                    layerStatusColor = conf.statusColorHigh;
                    return layerStatusColor;
                } else {
                    layerStatusColor = conf.statusColorVeryHigh;
                    return layerStatusColor;
                }
            }
        }


        

        /**
         * Draw the triangles in a layer
         *
         * @param {string} layer layerId
         * @param {number[]} planePointOne
         * @param {number[]} planePointTwo
         * @param {number} i layer index in the plane
         * @param {number} planePointLength metric count in the layer
         * @param {string} color material color
         */
        function drawTrianglesInALayer(layer, planePointOne, planePointTwo, i, planePointLength, color) {

            if (meshs['19' + layer + i]) { // if init done
                
                meshs['19' + layer + i].update(planePointOne[i], planePointTwo[i], planePointTwo[(i + 1) % planePointLength])
                meshs['20' + layer + i].update(planePointTwo[(i + 1) % planePointLength], planePointOne[(i + 1) % planePointLength], planePointOne[(i) % planePointLength])
                meshs['19' + layer + i].material.color.set( color );
                meshs['20' + layer + i].material.color.set( color );
            }
            //init objects
            else {
                
                meshs['19' + layer + i] = new Triangle(planePointOne[i], planePointTwo[i], planePointTwo[(i + 1) % planePointLength], color);
                scene.add(meshs['19' + layer + i]);
                meshs['20' + layer + i] = new Triangle(planePointTwo[(i + 1) % planePointLength], planePointOne[(i + 1) % planePointLength], planePointOne[(i) % planePointLength], color);
                scene.add(meshs['20' + layer + i]);
            }
        }

        function animateFrameDashedLine(){
            for (const [key, value] of Object.entries(meshs)) {
                if(key.includes("_rangeDasheline")){
                   time += clock.getDelta()*3;
                   meshs[key].material.uniforms.time.value = time;
                }
            }
        }

        /**
         * Rendering loop
         */
        function render() {
            updateMeshs();
            controls.update();
            renderer.render(scene, camera);
            labelsRenderer.render(scene, camera);
            requestAnimationFrame(render);
            animateFrameDashedLine();
        }



        /**
         * Transform a metric value into a 3d point
         *
         * @param {*} metricValue value is required from to data to map on x,y plane
         * @param {*} zPlaneValue adding z plane for 3D respresentation
         */
        function layerPoints(metricValue, zPlaneValue) {
            const planepoints = [];
            for (let i = 0; i < metricValue.length; i++) {
                const points = polarTo3DPoint(i * Math.PI * 2 / metricValue.length, metricValue[i] * conf.metricMagnifier, zPlaneValue);
                planepoints.push(points);
            }
            return planepoints;
        }

        /**
         * Return a 3d point from polar coordinates in the z plane
         *
         * @param {number} angle
         * @param {number} radius
         * @param {number} zPlaneValue
         */
        function polarTo3DPoint(angle, radius, zPlaneValue) {
            return [radius * Math.cos(angle), radius * Math.sin(angle), zPlaneValue];
        }

        /**
         * Camera vew options
         * @param {*} meshs three.js mesh
         */
        function cameraVewOptions(meshs) {
           
            let tabX = [],
                tabY = [],
                tabZ = [];
            //get min fov
            let vFoV = camera.getEffectiveFOV(),
                hFoV = camera.fov * camera.aspect,
                FoV = Math.min(vFoV, hFoV) / 2;

            //get the center of position of objects
            for (let key in meshs) {
                if(!key.includes("_text"))
                    if(meshs[key].visible){
                        let object = meshs[key],
                        bs = object.geometry.boundingSphere,
                        vector = bs.center.clone();
                        tabX.push(vector.x);
                        tabY.push(vector.y);
                        tabZ.push(vector.z);
                    }
            }
            // calculate the center of objects
            let xMax = (Math.max.apply(Math, tabX)),
                xMin = (Math.min.apply(Math, tabX)),
                yMax = (Math.max.apply(Math, tabY)),
                yMin = (Math.min.apply(Math, tabY)),
                zMax = (Math.max.apply(Math, tabZ)),
                zMin = (Math.min.apply(Math, tabZ));

            let cameraDir = new THREE.Vector3(),
                centerMaxVector = new THREE.Vector3(xMax, yMax, zMax),
                centerMinVector = new THREE.Vector3(xMin, yMin, zMax),
                dis = centerMaxVector.distanceTo(centerMinVector),
                sin = Math.sin(FoV * Math.PI / 160);
            if (dis < 36) {
                dis = 36
            }
            let scale = dis / sin;
            // calculate the center of objects
            if (conf.cameraOptions.indexOf("Fit") != -1) {
                camera.getWorldDirection(cameraDir);
                let cameraOffs = cameraDir.clone();
                cameraOffs.multiplyScalar(-scale);
                let newCameraPos = centerMaxVector.clone().add(cameraOffs);
                camera.position.copy(newCameraPos);
            }
            if (conf.cameraOptions.indexOf("Top") != -1) {
                // set camera position
                camera.position.set(0, scale, 0);
                camera.lookAt(0, 0, 0);
            }
        }


        /**
         * Draw a frame in a plane (layer)
         * @param {[]} framePoints frame points position
         * @param {string} frameName frame name
         */
        function drawFrames(framePoints, frameName) {
            // card around metrics
            for (let i = 0; i < framePoints[0].length; i++) {
                for (let [index, point] of framePoints.entries()) {
                    //draws outside lines
                    if (conf.frameDashLineSize > 0) {
                        drawLayerDashLine(frameName, point, i, framePoints[0].length, dashLineMaterial, index)
                    } else {
                        drawLayerOutline(frameName, point, i, framePoints[0].length, lineMaterial, index);
                    }
                }
            }
        }

        /** Draw a frame background
         * @param {[]} framePoints frame points position
         * @param {string} frameName frame name
         * @param {string} backgroundColor frame background color
         * @param {int} opacity frame opacity
         */
        function drawFramesBackground(framePoints, frameName, backgroundColor, opacity) {
            let j = 0
            for (let i = 0; i < framePoints.length; i++) {
                if (framePoints[j + 1]) {
                    if (framePoints[j + 2]) {
                        let a = [framePoints[0][0], framePoints[0][1], framePoints[0][2] - 0.005];
                        let b = [framePoints[j + 1][0], framePoints[j + 1][1], framePoints[j + 1][2] - 0.005];
                        let c = [framePoints[j + 2][0], framePoints[j + 2][1], framePoints[j + 2][2] - 0.005];
                        if (meshs['side-top-left-pane' + frameName + i]) {
                            meshs['side-top-left-pane' + frameName + i].update(a, b, c);
                            meshs['side-bottom-right-pane' + frameName + i + 1].update(a, b, c);
                        } else {
                            meshs['side-top-left-pane' + frameName + i] = new Triangle(a, b, c, backgroundColor, opacity);
                            scene.add(meshs['side-top-left-pane' + frameName + i]);
                            meshs['side-bottom-right-pane' + frameName + i + 1] = new Triangle(a, b, c, backgroundColor, opacity);
                            scene.add(meshs['side-bottom-right-pane' + frameName + i + 1]);
                        }
                        j = i + 1;
                    }
                }
            }
        }

        function makeShereContextsStatus(sphereCoords, layerName, metrics) {
            for (var i = 0; i < sphereCoords.current.length; i++){
                makeShereContext(sphereCoords.current[i],layerName,i.toString(),metricColor(metrics[i]),metrics[i]);
            }
        }

        function metricColor (value) {
            let cur = value.current;
            let min =  value.min;
            let max = value.max;
            let med = value.med;
            let color = conf.sphereColorLow ;
            if (conf.layerStatusControl) {
                if (cur >= min && cur <= med) {
                    return color;
                } else if (cur > med && cur <= max) {
                    color = conf.sphereColorMed;                    ;
                    return color;
                } else {
                    color = conf.sphereColorHigh;
                    return color;
                }
            }
        }
        
        
        function makeText( labelName, x,y,z,data) {
            if(conf.metricsLabelsRenderingMode === "3D") {
                let texture = new THREE.Texture(),
                    textureImage;
                labelDiv[labelName] = document.createElement('div');
                labelDiv[labelName].className = labelName;
                labelDiv[labelName].appendChild(createCardText(labelName, false, "DimGray", layerParameters));
                textureImage = htmlToSvg(labelDiv[labelName]);
                texture.image = textureImage;
                setTimeout( function () {
                    // assigning data to HTMLImageElement.src is asynchronous (see #15162)
                    // using setTimeout() avoids the warning "Texture marked for update but image is incomplete"
                    texture.needsUpdate = true;
                }, 0 );
                texture.minFilter = THREE.NearestFilter;
                let spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthWrite: false, transparent: true }),
                    layersLabels = new THREE.Sprite(spriteMaterial);
                layersLabels.scale.set(2 * layerParameters["labelSize"], 1 * layerParameters["labelSize"], layerParameters["labelSize"]);
                layersLabels.name = labelName;
                layersLabels.position.set(x,y,z);
                return layersLabels;
            } else if(conf.metricsLabelsRenderingMode === "2D"){
                let div = document.createElement('div');
                div.className = 'label ' + labelName;
                if (conf.metricsLabelsRenderingFormat === "Text"){
                    div.appendChild(createCardText(labelName, false, "DimGray", layerParameters));
                }
                else if (conf.metricsLabelsRenderingFormat === "Table") {
                    div.appendChild(createHtmlTable(data, layerParameters));
                }
                else if (conf.metricsLabelsRenderingFormat === "Json") {
                   
                    div.appendChild(createCardText(data, false, "DimGray", layerParameters));
                }
                const layersLabels = new CSS2DObject(div);
                layersLabels.name = labelName;
                layersLabels.position.set(x,y,z);
                return layersLabels;
            }


        }

        function createCardText(labelText, cardColor, cardBackground, parameters) {
            let p = document.createElement('p');
            p.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
            p.style.color = 'white';
            p.style.fontSize = '20px';
            p.style.backgroundColor=cardBackground;
            p.style.padding="8px"
            p.style.fontFamily = parameters['characterFont'];
            p.innerText = labelText;
            return p;
        }

        /**
         * Draw a dash line in a plane (layer)
         *
         * @param {string} layerName layer name
         * @param {number[]} planePoints coordinates of the line
         * @param {number} layerMetricIndex index of the line in the plane
         * @param {number} planePointLength number of points in the plane
         * @param {THREE.Material} material material to apply to the line
         * @param {number} layerMetricRangeIndex index of layer metric range
         */
        function drawLayerDashLine(layerName, planePoints, layerMetricIndex, planePointLength, material, layerMetricRangeIndex) {
            if (meshs['_rangeDasheline' + layerName + layerMetricIndex + layerMetricRangeIndex]) {
                // if init done
                meshs['_rangeDasheline' + layerName + layerMetricIndex + layerMetricRangeIndex].update(planePoints[layerMetricIndex], planePoints[(layerMetricIndex + 1) % planePointLength])
            } else {
                //init objects
                meshs['_rangeDasheline' + layerName + layerMetricIndex + layerMetricRangeIndex] = new DasheLine(planePoints[layerMetricIndex], planePoints[(layerMetricIndex + 1) % planePointLength], material);
                scene.add(meshs['_rangeDasheline' + layerName + layerMetricIndex + layerMetricRangeIndex]);
            }
        }

        
        function makeSphereFieldOfHover(layerName,metricIndex,planePoints){
            const planeGeometry = new THREE.SphereGeometry( 2, 32, 16 );
            const planeMaterial = new THREE.MeshBasicMaterial( {color: "grey", side: THREE.DoubleSide, transparent: true, opacity:1} );
            const mesh = new THREE.Mesh( planeGeometry, planeMaterial );
            mesh.name = '_sphereHoverRegion'+layerName+metricIndex;
            mesh.position.set(planePoints[0], planePoints[2], planePoints[1]);
            mesh.visible = false;
            mesh.quaternion.copy(camera.quaternion);
            return mesh;
        }

        function makeSphereText(planePoints, metricValues){
            const text = "Min = "+metricValues.min+". Max= "+metricValues.max+". Med= "+metricValues.med;
            const obj = {0:['Min','Max','Med'],1:[metricValues.min, metricValues.max, metricValues.med]};
            const json = {'Min':metricValues.min, 'Max':metricValues.max,'Med':metricValues.med}
            let mesh;
            if(conf.metricsLabelsRenderingFormat === "Json"){
                mesh= makeText(text,planePoints[0], planePoints[2]+3, planePoints[1],JSON.stringify(json));
            }
            else {
                mesh = makeText(text,planePoints[0], planePoints[2]+3, planePoints[1],obj);
            }
            mesh.visible=false;
            if(conf.metricsLabelsRenderingMode === "2D"){
                mesh.element.style.display="none";
            }
            return mesh;
        }

        function makeShereContext (planePoints,layerName,metricIndex,metricColor, metricValues) {
            
            if(meshs['_sphere'+layerName+metricIndex]){
                meshs['_sphere'+layerName+metricIndex].material.color.set( metricColor );
                meshs['_sphere'+layerName+metricIndex].position.set(planePoints[0], planePoints[2], planePoints[1]);
                if(meshs['_sphereHoverRegion'+layerName+metricIndex]){
                    meshs['_sphereHoverRegion'+layerName+metricIndex].position.set(planePoints[0], planePoints[2], planePoints[1])
                }
                if(meshs['_text'+layerName+metricIndex]){
                    meshs['_text'+layerName+metricIndex].position.set(planePoints[0], planePoints[2]+3, planePoints[1]);
                }
            }else{
                const geometry = new THREE.SphereGeometry( 0.8, 32, 16 );
                const material = new THREE.MeshBasicMaterial( { color: metricColor} );
                material.transparent = true;
                material.opacity=1;
                meshs['_sphere'+layerName+metricIndex]=new THREE.Mesh( geometry, material );
                //x,z,y
                meshs['_sphere'+layerName+metricIndex].position.set(planePoints[0], planePoints[2], planePoints[1]);
                scene.add( meshs['_sphere'+layerName+metricIndex] );
                
                meshs['_sphereHoverRegion'+layerName+metricIndex]= makeSphereFieldOfHover(layerName,metricIndex,planePoints);
                scene.add( meshs['_sphereHoverRegion'+layerName+metricIndex] );
                
                meshs['_text'+layerName+metricIndex] = makeSphereText(planePoints, metricValues);
                scene.add(meshs['_text'+layerName+metricIndex]);
    
            }
            
        }


    }

);