function polarTo3DPoint(angle, radius, zPlaneValue) {
    return [radius * Math.cos(angle), radius * Math.sin(angle), zPlaneValue];
}

function layerPoints(metricValue, zPlaneValue, metricMagnifier) {
    const planepoints = [];
    for (let i = 0; i < metricValue.length; i++) {
        const points = polarTo3DPoint(i * Math.PI * 2 / metricValue.length, metricValue[i] * metricMagnifier, zPlaneValue);
        planepoints.push(points);
    }
    return planepoints;
}

function init_zAxis(zPlaneMultilayer,zPlaneInitial,newData){
    let q = []
    let zAxisWorker = zPlaneInitial;
    q.push(zAxisWorker);
    for(let layer in newData){
        zAxisWorker -= zPlaneMultilayer;
        q.push(zAxisWorker);
    }
    
    return q;
}

onmessage = function(e){

    if(e.data.subject=="layer computations"){
        
        const metrics = e.data.newData[e.data.layer].metrics,
            metricsNumber = Object.values(metrics).length;
        const metricCurrentTotal = Object.values(metrics).map(item => item.current).reduce((a, b) => a + b, 0);
        const metricMaxTotal = Object.values(metrics).map(item => item.max).reduce((a, b) => a + b, 0);
        const layerStatus = ((metricCurrentTotal / metricMaxTotal) * 100);

        let max = Object.values(metrics).map(item => (e.data.psize / item.max) * item.max);
        let med = Object.values(metrics).map(item => (e.data.psize / item.max) * item.med);
        let min = Object.values(metrics).map(item => (e.data.psize / item.max) * item.min);
        let current = Object.values(metrics).map(item => (e.data.psize / item.max) * item.current);

        let metricValue = {};
        metricValue.max = layerPoints(max, e.data.zAxisWorker, e.data.metricMagnifier);
        metricValue.med = layerPoints(med, e.data.zAxisWorker, e.data.metricMagnifier);
        metricValue.min = layerPoints(min, e.data.zAxisWorker, e.data.metricMagnifier);
        metricValue.current = layerPoints(current, e.data.zAxisWorker, e.data.metricMagnifier); 
        postMessage({subject:e.data.subject,metricCurrentTotal, metricMaxTotal, layerStatus, metricValue, metricsNumber, layer:e.data.layer});
        
    }
}

