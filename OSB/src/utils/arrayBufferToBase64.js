function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

_arrayBufferToBase64.as = (buf, type = 'image/png') => {
    return `data:${type};base64,` + _arrayBufferToBase64(buf);
}

export default _arrayBufferToBase64; 
