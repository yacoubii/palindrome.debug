/**
 * Return declare control types
 */
export function defaultControls() {
    return {
        // Palindrome configurations
        displayArea: { 
            name: "displayArea",
            
            description: "",
            control: "text",
        },
        palindromeSize: {
            name: "palindromeSize",
            
            description: "Resize the palindrome",
            control: "number",
            table: {
                category: "Palindrome"
            },
        },
        cameraOptions: {
            name: "cameraOptions",
            
            description: "Select camera vew options",
            control: {
                type: "check",
            },
            options: ["Fit", "Top"],
            table: {
                category: "Palindrome",
            },
        },

        //metrics
        metricMagnifier: {
            name: "metricMagnifier",
            
            description: "Resize the metrics",
            control: "number",
            table: {
                category: "Palindrome",
                subcategory: "Metrics"
            },
        },
        // layers
        layerDisplayMode: {
            name: "layerDisplayMode",
            
            description: "Configure the layers mode",
            control: "text",
            table: {
                category: "Palindrome",
                subcategory: "Layer"
            },
        },
        layerMidColor: {
            name: "layerMidColor",
            
            description: "Change the layer mid color",
            control: "color",
            table: {
                category: "Palindrome",
                subcategory: "Layer"
            },
        },
        displayLayers: {
            name: "displayLayers",
            
            description: "Display or not the layers of palindrome",
            control: "boolean",
            table: {
                category: "Palindrome",
                subcategory: "Layer"
            },
        },
        layerStatusControl: {
            name: "layerStatusControl",
            
            description: "Control the state of the layer",
            control: "boolean",
            table: {
                category: "Palindrome",
                subcategory: "Layer"
            },
        },
        // line
        lineOpacity: {
            name: "layerStatusControl",
            
            control: "number",
            description: "Change the line opacity",
            table: {
                category: "Palindrome",
                subcategory: "Line"
            },
        },
        lineWidth: {
            name: "lineWidth",
            
            control: "number",
            description: "Resize the line widht",
            table: {
                category: "Palindrome",
                subcategory: "Line"
            },
        },
        lineColor: {
            name: "lineColor",
            
            control: "color",
            description: "Change the line color",
            table: {
                category: "Palindrome",
                subcategory: "Line"
            },
        },
        //  sides
        displayMode: {
            name: "displayMode",
            
            control: "text",
            description: "Configure the sides mode",
            table: {
                category: "Palindrome",
                subcategory: "Sides"
            },
        },
        mainAppColor: {
            name: "mainAppColor",
            
            control: "color",
            description: "Change the main app color",
            table: {
                category: "Palindrome",
                subcategory: "Sides"
            },
        },
        subAppColor: {
            name: "subAppColor",
            
            control: "color",
            description: "Change the sub app color",
            table: {
                category: "Palindrome",
                subcategory: "Sides"
            },
        },
        displaySides: {
            name: "displaySides",
            
            control: "boolean",
            description: "Display or not the sides of palindrome",
            table: {
                category: "Palindrome",
                subcategory: "Sides"
            },
        },
        // grid
        gridSize: {
            name: "gridSize",
            
            control: "number",
            description: "Resize the grid",
            table: {
                category: "Palindrome",
                subcategory: "Grid"
            },
        },
        gridDivisions: {
            name: "gridDivisions",
            
            control: "number",
            description: "Define the divisions of the grid",
            table: {
                category: "Palindrome",
                subcategory: "Grid"
            },
        },
        displayGrid: {
            name: "displayGrid",
            
            control: "boolean",
            description: "Display or not the grid of the plan",
            table: {
                category: "Palindrome",
                subcategory: "Grid"
            },
        },
        // zPlane
        zPlaneInitial: {
            name: "zPlaneInitial",
            
            control: "number",
            description: "Resize the initial zPlane",
            table: {
                category: "Palindrome",
                subcategory: "Zplan"
            },
        },
        zPlaneHeight: {
            name: "zPlaneHeight",
            
            control: "number",
            description: "Resize the height zPlane",
            table: {
                category: "Palindrome",
                subcategory: "Zplan"
            },
        },
        zPlaneMultilayer: {
            name: "zPlaneMultilayer",
            
            control: "number",
            description: "Resize the multilayer zPlane",
            table: {
                category: "Palindrome",
                subcategory: "Zplan"
            },
        },
        // metrics labels configuration
        metricsLabelsRenderingMode: {
            name: "metricsLabelsRenderingMode",
            description: "Change the rendering style of metrics labels",
            
            control: {
                type: "select",
            },
            options: ["2D", "3D"],
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        metricsLabels3DRenderingMode: {
            name: "metricsLabels3DRenderingMode",
            description: "To change the metrics labels format",
            
            control: {
                type: "select",
            },
            options: ["Canvas", "Svg"],
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        metricsLabelsRenderingFormat: {
            name: "metricsLabelsRenderingFormat",
            description: "To change the metrics labels format",
            
            control: {
                type: "select",
            },
            options: ["Text", "Table", "Json"],
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        metricsLabelsStructure: {
            name: "metricsLabelsStructure",
            description: "To select the structure of the label to display",
            
            control: {
                type: "check",
            },
            options: ["Name", "Type", "Value", "Unit"],
            table: { category: "Labels", subcategory: "Metrics" }
        },
        metricsLabelsCharacterFont: {
            name: "metricsLabelsCharacterFont",
            
            description: "Change the characters of the metrics labels",
            control: {
                type: "select", 
            },
            options: ["Serif", "Sans-serif", "Arial", ],
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        metricsLabelsSize: {
            name: "metricsLabelsSize",
            
            description: "Change the size of the metrics labels",
            control: {
                type: "select",
                labels:{
                    12:'Small',
                    15:'Medium',
                    18:'Large'
                }
            },
            options: [
                12,
                15,
                18,
            ],
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        metricsLabelsColor: {
            name: "metricsLabelsColor",
            
            control: "color",
            description: "Change the color of metrics labels",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        metricsLabelsBackground: {
            name: "metricsLabelsBackground",
            
            control: "color",
            description: "Change the background color of metrics labels",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        metricsLabelsBold: {
            name: "metricsLabelsBold",
            
            control: "boolean",
            description: "Bold or not the metrics labels",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        metricsLabelsItalic: {
            name: "metricsLabelsItalic",
            
            description: "Italicize or not the metrics labels ",
            control: "boolean",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        displaysMetricsLabelsUnit: {
            name: "displayMetricsLabelsUnit",
            
            description: "Display or not the units of metrics labels",
            control: "boolean",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        displayMetricsLabels: {
            name: "displayMetricsLabels",
            
            description: "Display or not the metrics labels",
            control: "boolean",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        displayAllMetricsLabels: {
            name: "displayAllMetricsLabels",
            
            description: "Display or not all metrics labels",
            control: "boolean",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        displayMetricSpheres: {
            name: "displayMetricSpheres",
            
            description: "Display or not all metrics spheres",
            control: "boolean",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        displayValuesOnSphereHover: {
            name: "displayValuesOnSphereHover",
            
            description: "Display or not all metrics spheres",
            control: "boolean",
            table: {
                category: "Labels",
                subcategory: "Metrics"
            },
        },
        // layer label configuration
        layersLabelsRenderingMode: {
            name: "layersLabelsRenderingMode",
            description: "Change the rendering style of layers labels",
            
            control: {
                type: "select",  
            },
            options: ["2D", "3D"],
            table: {
                category: "Labels",
                subcategory: "Layers"
            },
        },
        layersLabelsOrientation: {
            name: 'layersLabelsOrientation',
            description: 'Change the orientation of layers label',
            
            control: {
                type: 'select',
            },
            options: ['Sticky', 'Free'],
            table: {
                category: 'Labels',
                subcategory: 'Layers'
            },
        },
        layersLabelsCharacterFont: {
            name: 'layersLabelsCharacterFont',
            
            description: 'Change the characters of layers label',
            control: {
                type: 'select', 
            },
            options: ['Arial', 'Serif', 'Sans-serif'],
            table: {
                category: 'Labels',
                subcategory: 'Layers'
            },
        },
        layersLabelsSize: {
            name: 'layersLabelsSize',
            
            description: 'Change the size of layers labels',
            control: {
                type: 'select',
                labels: {
                    12:'Small',
                    15:'Medium',
                    18:'Large',
                },
            },
            options: [
                12,
                15,
                18,
            ],
            table: {
                category: 'Labels',
                subcategory: 'Layers'
            },
        },
        layersLabelsColor: {
            name: 'layersLabelsColor',
            
            control: 'color',
            description: 'Change the color of layers label',
            table: {
                category: 'Labels',
                subcategory: 'Layers'
            },
        },
        layersLabelsBackground: {
            name: 'layersLabelsBackground',
            
            control: 'color',
            description: 'Change the background color of layers label',
            table: {
                category: 'Labels',
                subcategory: 'Layers'
            },
        },
        layersLabelsBold: {
            name: 'layersLabelsBold',
            
            control: 'boolean',
            description: 'Bold or not the layers label',
            table: {
                category: 'Labels',
                subcategory: 'Layers'
            },
        },
        layersLabelsItalic: {
            name: 'layersLabelsItalic',
            
            description: 'Italicize or not the layers label',
            control: 'boolean',
            table: {
                category: 'Labels',
                subcategory: 'Layers'
            },
        },
        displayLayersLabels: {
            name: 'displayLayersLabels',
            
            description: 'Display or not the layers label',
            control: 'boolean',
            table: {
                category: 'Labels',
                subcategory: 'Layers'
            },
        },
        // Frames
        frameShape: {
            name: "frameShape",
            description: 'Change the frames style',
            
            control: {
                type: 'select',
            },
            options: ['Rectangle', 'Dynamic'],
            table: {
                category: 'Frames',
            },
        },
        frameBackgroundColor: {
            name: 'frameBackgroundColor',
            
            control: 'color',
            description: 'Change the frame background color',
            table: {
                category: 'Frames',
            },
        },
        frameOpacity: {
            name: 'frameOpacity',
            
            control: 'number',
            description: 'Change the frame opacity',
            table: {
                category: 'Frames',
            },
        },
        framePadding: {
            name: 'framePadding',
            
            control: 'number',
            description: 'Change the frame padding',
            table: {
                category: 'Frames',
            },
        },
        frameLineColor: {
            name: 'frameLineColor',
            
            control: 'color',
            description: 'Change the frame line color',
            table: {
                category: 'Frames',
            },
        },
        frameLineWidth: {
            name: 'frameLineWidth',
            
            control: 'number',
            description: 'Change the frame line width',
            table: {
                category: 'Frames',
            },
        },
        frameDashLineSize: {
            name: 'frameDashLineSize',
            
            control: 'number',
            description: 'Change the frame dash line size',
            table: {
                category: 'Frames',
            },
        },
        displayFrames: {
            name: 'displayFrames',
            
            description: 'Display or not the frames',
            control: 'boolean',
            table: {
                category: 'Frames',
            },
        },
        displayFramesLine: {
            name: 'displayFramesLine',
            
            description: 'Display or not the frames Line',
            control: 'boolean',
            table: {
                category: 'Frames',
            },
        },
        displayFramesBackground: {
            name: 'displayFramesBackground',
            
            description: 'Display or not the frames background',
            control: 'boolean',
            table: {
                category: 'Frames',
            },
        },
        displayFramesArrow: {
            name: 'displayFramesArrow',
            
            description: 'Display or not the frames arrows',
            control: 'boolean',
            table: {
                category: 'Frames',
            },
        },
        // status configurations
        // color
        statusColorLow: {
            name: "statusColorLow",
            
            control: "color",
            description: "Change the low status color",
            table: {
                category: "Status",
                subcategory: "Sides Colors"
            },
        },
        statusColorMed: {
            name: "statusColorMed",
            
            control: "color",
            description: "change the med status color",
            table: {
                category: "Status",
                subcategory: "Sides Colors"
            },
        },
        statusColorHigh: {
            name: "statusColorHigh",
            
            control: "color",
            description: "Change the high status color",
            table: {
                category: "Status",
                subcategory: "Sides Colors"
            },
        },
        statusColorVeryHigh: {
            name: "statusColorVeryHigh",
            
            control: "color",
            description: "Change the very high status color",
            table: {
                category: "Status",
                subcategory: "Sides Colors"
            },
        },
        sphereColorLow: {
            name: "sphereColorLow",
            
            control: "color",
            description: "change the med status color",
            table: {
                category: "Status",
                subcategory: "Spheres Colors"
            },
        },
        sphereColorMed: {
            name: "sphereColorMed",
            
            control: "color",
            description: "Change the high status color",
            table: {
                category: "Status",
                subcategory: "Spheres Colors"
            },
        },
        sphereColorHigh: {
            name: "sphereColorHigh",
            
            control: "color",
            description: "Change the very high status color",
            table: {
                category: "Status",
                subcategory: "Spheres Colors"
            },
        },
        // range
        statusRangeLow: {
            name: "statusRangeLow",
            
            control: "number",
            description: "Resize the low status range",
            table: {
                category: "Status",
                subcategory: "Ranges"
            },
        },
        statusRangeMed: {
            name: "statusRangeMed",
            
            control: "number",
            description: "Resize the med status range",
            table: {
                category: "Status",
                subcategory: "Ranges"
            },
        },
        statusRangeHigh: {
            name: "statusRangeHigh",
            
            control: "number",
            description: "Resize the high status range",
            table: {
                category: "Status",
                subcategory: "Ranges"
            },
        },
        statusRangeVeryHigh: {
            name: "statusRangeVeryHigh",
            
            control: "number",
            description: "Resize the very high status range",
            table: {
                category: "Status",
                subcategory: "Ranges"
            },
        },
        // data configuration
        data: {
            name: "Data",
            
            control: "object",
            description: " The data we analyze ",
            table: {
                category: "Data"
            },
        },
        mockupData: {
            name: "mockupData",
            
            control: "boolean",
            description: "Make dynamic the data ",
            table: {
                category: "Data"
            },
        },
    }
}

export function defaultValues(){
    return { displayArea: 'palindrome',
    palindromeSize: 3,
    cameraOptions: [ 'Fit' ],
    metricMagnifier: 10,
    layerDisplayMode: 'dynamic',
    layerMidColor: '#DFDF0B',
    displayLayers: true,
    layerStatusControl: true,
    lineOpacity: 1,
    lineWidth: 0.5,
    lineColor: '#000000',
    displayMode: 'dynamic',
    mainAppColor: '#00FF06',
    subAppColor: '#9FC5E8',
    displaySides: true,
    gridSize: 100,
    gridDivisions: 100,
    displayGrid: true,
    zPlaneInitial: 0,
    zPlaneHeight: 40,
    zPlaneMultilayer: -20,
    metricsLabelsRenderingMode: '3D',
    metricsLabels3DRenderingMode: 'Canvas',
    metricsLabelsRenderingFormat: 'Text',
    metricsLabelsStructure: [ 'Name', 'Type', 'Value', 'Unit' ],
    metricsLabelsCharacterFont: 'Arial',
    metricsLabelsSize: 15,
    metricsLabelsColor: '#000000',
    metricsLabelsBackground: '#f0f0f0',
    metricsLabelsBold: true,
    metricsLabelsItalic: false,
    displaysMetricsLabelsUnit: true,
    displayMetricsLabels: true,
    displayAllMetricsLabels: false,
    displayMetricSpheres: true,
    displayValuesOnSphereHover: true,
    layersLabelsRenderingMode: '3D',
    layersLabelsOrientation: 'Sticky',
    layersLabelsCharacterFont: 'Arial',
    layersLabelsSize: 15,
    layersLabelsColor: '#000000',
    layersLabelsBackground: '#ffffff',
    layersLabelsBold: true,
    layersLabelsItalic: false,
    displayLayersLabels: true,
    frameShape: 'Rectangle',
    frameBackgroundColor: '#ffffff',
    frameOpacity: 0.5,
    framePadding: 2,
    frameLineColor: '#000000',
    frameLineWidth: 1,
    frameDashLineSize: 3,
    displayFrames: true,
    displayFramesLine: true,
    displayFramesBackground: false,
    displayFramesArrow: true,
    statusColorLow: '#319b31',
    statusColorMed: '#f3c60a',
    statusColorHigh: '#ff7300',
    statusColorVeryHigh: '#FF0000',
    sphereColorLow: '#319b31',
    sphereColorMed: '#f3c60a',
    sphereColorHigh: '#FF0000',
    statusRangeLow: 0,
    statusRangeMed: 25,
    statusRangeHigh: 50,
    statusRangeVeryHigh: 75,
    data: 'palindrome',
    mockupData: false }
}