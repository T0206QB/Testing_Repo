var params;

function getParams(url){
    params = {};
    var paramString = decodeURIComponent(url ? url.split('?')[1] : window.location.search.slice(1));
    if(paramString){
        paramString = paramString.split('#')[0];
        var paramArr = paramString.split('&');
        for(var i = 0; i<paramArr.length; i++){
            var a = paramArr[i].split('=');
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            if(paramName.match(/\[(\d+)?\]$/)){
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if(!params[key]){
                    params[key] = [];
                }
                if(paramName.match(/\[\d+\]$/)){
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    params[key][index] = paramValue;
                }
                else{
                    params[key].push(paramValue);
                }
            }
            else{
                if(!params[paramName]){
                    params[paramName] = paramValue;
                }
                else if(params[paramName] && typeof params[paramName] === 'string'){
                    params[paramName] = [params[paramName]];
                    params[paramName].push(paramValue);
                }
                else{
                    params[paramName].push(paramValue);
                }
            }
        }
    }
    console.log(params);
}