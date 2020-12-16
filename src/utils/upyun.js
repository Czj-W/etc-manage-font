import { uploadapi } from '@/utils/request'
import { v4 as uuidv4 } from 'uuid'

function Upyun(options) {
    this.bucket = options.bucket
    this.operator = options.operator
    this.getSignatureUrl = options.getSignatureUrl
}

Upyun.prototype.upload = async function(options = {}) {
    var self = this
    if (!options.remotePath) {
        options.remotePath = `images/${uuidv4()}.jpg`
    }
    var date = (new Date()).toGMTString()
    var opts = {
        'save-key': options.remotePath,
        bucket: self.bucket,
        expiration: Math.round(new Date().getTime() / 1000) + 3600,
        date: date
    }
    var policy = Base64.encode(JSON.stringify(opts))
    var data = ['POST', '/' + self.bucket, date, policy].join('&')
    const signature = await self.getSignature(data)

    options.append('authorization', `UPYUN ${self.operator}:${signature}`)
    options.append('policy', policy)
    options.append('bucket', this.bucket)

    const { url } = await uploadapi({
        url: `https://v0.api.upyun.com/${self.bucket}`,
        method: 'post',
        data: options
        // headers: {
        //     Authorization: `UPYUN ${self.operator}:${signature}`,
        //     policy: policy
        // }
    })

    return url
}

Upyun.prototype.getSignature = async function(data) {
    const { signature } = await uploadapi({
        url: this.getSignatureUrl,
        method: 'get',
        params: { data }
    })

    return signature
}

Upyun.prototype.url = function(obj) {
    return `${process.env.VUE_APP_UPYUN_BASE_URL}/${obj}`
}

Upyun.prototype.obj = function(obj) {
    return obj.replace(process.env.VUE_APP_UPYUN_BASE_URL, '')
}

/* eslint-disable */
var Base64 = {
        // private property
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        // public method for encoding
        encode: function(input) {
            var output = ''
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4
            var i = 0
            input = Base64._utf8_encode(input)
            while (i < input.length) {
                chr1 = input.charCodeAt(i++)
                chr2 = input.charCodeAt(i++)
                chr3 = input.charCodeAt(i++)
                enc1 = chr1 >> 2
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
                enc4 = chr3 & 63
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64
                } else if (isNaN(chr3)) {
                    enc4 = 64
                }
                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
            }
            return output
        },
        // public method for decoding
        decode: function(input) {
            var output = ''
            var chr1, chr2, chr3
            var enc1, enc2, enc3, enc4
            var i = 0
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++))
                enc2 = this._keyStr.indexOf(input.charAt(i++))
                enc3 = this._keyStr.indexOf(input.charAt(i++))
                enc4 = this._keyStr.indexOf(input.charAt(i++))
                chr1 = (enc1 << 2) | (enc2 >> 4)
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
                chr3 = ((enc3 & 3) << 6) | enc4
                output = output + String.fromCharCode(chr1)
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2)
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3)
                }
            }
            output = Base64._utf8_decode(output)
            return output
        },
        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, '\n')
            var utftext = ''
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n)
                if (c < 128) {
                    utftext += String.fromCharCode(c)
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192)
                    utftext += String.fromCharCode((c & 63) | 128)
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224)
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128)
                    utftext += String.fromCharCode((c & 63) | 128)
                }
            }
            return utftext
        },
        // private method for UTF-8 decoding
        _utf8_decode: function(utftext) {
            var string = ''
            var i = 0
            var c = c1 = c2 = 0
            while (i < utftext.length) {
                c = utftext.charCodeAt(i)
                if (c < 128) {
                    string += String.fromCharCode(c)
                    i++
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1)
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
                    i += 2
                } else {
                    c2 = utftext.charCodeAt(i + 1)
                    c3 = utftext.charCodeAt(i + 2)
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
                    i += 3
                }
            }
            return string
        }
    }
    /* eslint-enable */

export default new Upyun({
    bucket: 'img-gewu',
    operator: 'gewu',
    getSignatureUrl: `v1/upyun/signature`
})
