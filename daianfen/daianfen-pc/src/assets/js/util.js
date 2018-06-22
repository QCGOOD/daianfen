/* 工具类函数 */
let Utils = {
  //加密
  sha1(str) {
    return Crypto.SHA1(str);
  },
  formatDate(date) {
    if (typeof date == 'string') {
      date = new Date(date);
    }
    return `${date.getFullYear()}-${date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() <= 9 ? '0' + (date.getDate()) : date.getDate()}`
  },
  // 循环遍历 格式化时间 成为 string
  formatTimeString(time) {
    var newTime = []
    for (var i = 0; i < time.length; i++) {
      newTime.push({
        startTime: `${time[i].startTime.toTimeString().substr(0, 5)}`,
        endTime: `${time[i].endTime.toTimeString().substr(0, 5)}`,
      })
    }
    return newTime;
  },
  //  循环遍历 格式化时间 成为 Date
  formatTimeDate(time) {
    var newTime = []
    for (var i = 0; i < time.length; i++) {
      newTime.push({
        startTime: new Date('2017', '08', '08', time[i].startTime.split(':').shift(), time[i].startTime.split(':').pop()),
        endTime: new Date('2017', '08', '08', time[i].endTime.split(':').shift(), time[i].endTime.split(':').pop()),
      })
    }
    return newTime;
  },
  // 开辟新的 内存空间赋值
  newMemorySpace(data) {
    return JSON.parse(JSON.stringify(data));
  },
  numToString(model) {
    for (var i in model) {
      if (typeof model[i] === 'number') {
        model[i] = model[i].toString();
      }
    }
    return model
  },
  getRad(d) {
    return d * Math.PI / 180.0;
  },
  getGreatCircleDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);
    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378137.0;
    s = Math.round(s * 10000) / 10000.0;
    return s;
  },

  //截取url 参数
  getUrlParam(name) {
    var result = "";
    var index = window.location.href.indexOf('?');
    var searchArr = window.location.href.slice(index + 1).split("&");
    searchArr.map(function (item) {
      var arr = item.split("=");
      if (arr[0] == name) {
        result = decodeURIComponent(arr[1]);
      }
    });
    return result
  },
  // 循环清空数据
  resetFields(data) {
    for (var item in data) {
      data[item] = ''
    }
    return data;
  },
  //当前时间
  nowDate(type, number) {
    var date = new Date();
    var currentdate;
    var seperator1 = "-";
    var seperator2 = "：";
    if (number) {
      var month = date.getMonth() + 1 - number;
    } else {
      var month = date.getMonth() + 1
    }
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }

    if (type == 'm') {
      currentdate = date.getFullYear() + seperator1 + month
    } else if (type == 't') {
      currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    } else {
      currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes();
    }
    return currentdate;
  },
  // 一段时间内 用于筛选  返回一个数组
  prevDay() {
    var today = new Date();
    var yesterday_milliseconds = today.getTime() - 1000 * 60 * 60 * 24;
    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);
    var strYear = yesterday.getFullYear();
    var strDay = yesterday.getDate();
    var strMonth = yesterday.getMonth() + 1;
    if (strMonth < 10) {
      strMonth = "0" + strMonth;
    }
    var strYesterday = strYear + "-" + strMonth + "-" + strDay;
    return strYesterday;
  },
  getXDay(v) {
    let myDate = new Date(); //获取今天日期
    myDate.setDate(myDate.getDate() - v);
    let dateArray = [];
    let dateTemp;
    let flag = 1;
    for (let i = 0; i < v; i++) {
      let month = (myDate.getMonth() + 1);
      let day = myDate.getDate();
      if (month <= 9) {
        month = '0' + month;
      }
      if (day <= 9) {
        day = '0' + day;
      }
      dateTemp = myDate.getFullYear() + "-" + month + "-" + day;
      dateArray.push(dateTemp);
      myDate.setDate(myDate.getDate() + flag);
    }
    return { startTime: dateArray[0], endTime: dateArray.pop() }
  },
  getNewId() {
    let id = '';
    for (var i = 0; i < 8; i++) {
      id += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return id;
  },
  // 昨日
  yesterday() {
    var day1 = new Date();
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
    var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
    return s1;
  },
  //返回val的字节长度
  getByteLen(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
      if (val[i].match(/[^\x00-\xff]/ig) != null) //全角
        // len += 2;
        len += 4; // utf-8
      else
        len += 1;
    }
    return len;
  },
  //返回val在规定字节长度max内的值
  getByteVal(val, max) {
    var returnValue = '';
    var byteValLen = 0;
    for (var i = 0; i < val.length; i++) {
      if (val[i].match(/[^\x00-\xff]/ig) != null)
        // byteValLen += 2;
        byteValLen += 4; // utf-8
      else
        byteValLen += 1;
      if (byteValLen > max)
        break;
      returnValue += val[i];
    }
    return returnValue;
  },


  /**
   * 获取当前日期的前后推移｛N｝的日期
   * @param {number} n 
   */
  dateInterval(day) {
    var now = new Date;
    now.setDate(now.getDate() - day);
    var array = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    if (array[1] <= 9) {
      array[1] = '0' + array[1]
    }
    if (array[2] <= 9) {
      array[2] = '0' + array[2]
    }
    return array.join('-');
  },
  /**
   * 获取周数
   * @param {String} dateString  日期
   * 格式 yyy-mm-dd
   */
  getYearWeek(dateString) {
    var da = dateString;
    //当前日期 y m d
    var date1 = new Date(da.substring(0, 4), parseInt(da.substring(5, 7)) - 1, da.substring(8, 10));
    //1月1号 
    var date2 = new Date(da.substring(0, 4), 0, 1);
    //获取1月1号星期（以周一为第一天，0周一~6周日）
    var dateWeekNum = date2.getDay() - 1;
    if (dateWeekNum < 0) {
      dateWeekNum = 6;
    }
    if (dateWeekNum < 4) {
      //前移日期
      date2.setDate(date2.getDate() - dateWeekNum);
    } else {
      //后移日期
      date2.setDate(date2.getDate() + 7 - dateWeekNum);
    }
    var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if (d < 0) {
      var date3 = (date1.getFullYear() - 1) + "-12-31";
      return this.getYearWeek(date3);
    } else {
      //得到年数周数
      var year = date1.getFullYear();
      var week = Math.ceil((d + 1) / 7);
      // return year + "年第" + week + "周";
      return week;
    }
  },

  // 时间比较（yyyy-MM-dd HH:mm:ss） startTime <= endTime ? true : false
  compareTime (startTime, endTime) {
    var startTimes = startTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');
    startTime = startTimes[1] + '-' + startTimes[2] + '-' + startTimes[0] + ' ' + startTime.substring(10, 19);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
    var thisResult = (Date.parse(endTime) - Date.parse(startTime)) / 3600 / 1000;
    if (thisResult < 0) {
      // alert("endTime小于startTime！");
      return false
    } else if (thisResult > 0) {
      // alert("endTime大于startTime！");
      return true
    } else if (thisResult == 0) {
      // alert("endTime等于tartTime！");
      return true
    } else {
      // return '异常';
      alert('时间格式异常')
    }
  },
};

/*
 * ---------------------------------SHA-1----------------------------------
 */
(function () { var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; var d = window.Crypto = {}; var a = d.util = { rotl: function (h, g) { return (h << g) | (h >>> (32 - g)) }, rotr: function (h, g) { return (h << (32 - g)) | (h >>> g) }, endian: function (h) { if (h.constructor == Number) { return a.rotl(h, 8) & 16711935 | a.rotl(h, 24) & 4278255360 } for (var g = 0; g < h.length; g++) { h[g] = a.endian(h[g]) } return h }, randomBytes: function (h) { for (var g = []; h > 0; h--) { g.push(Math.floor(Math.random() * 256)) } return g }, bytesToWords: function (h) { for (var k = [], j = 0, g = 0; j < h.length; j++ , g += 8) { k[g >>> 5] |= h[j] << (24 - g % 32) } return k }, wordsToBytes: function (i) { for (var h = [], g = 0; g < i.length * 32; g += 8) { h.push((i[g >>> 5] >>> (24 - g % 32)) & 255) } return h }, bytesToHex: function (g) { for (var j = [], h = 0; h < g.length; h++) { j.push((g[h] >>> 4).toString(16)); j.push((g[h] & 15).toString(16)) } return j.join("") }, hexToBytes: function (h) { for (var g = [], i = 0; i < h.length; i += 2) { g.push(parseInt(h.substr(i, 2), 16)) } return g }, bytesToBase64: function (h) { if (typeof btoa == "function") { return btoa(e.bytesToString(h)) } for (var g = [], l = 0; l < h.length; l += 3) { var m = (h[l] << 16) | (h[l + 1] << 8) | h[l + 2]; for (var k = 0; k < 4; k++) { if (l * 8 + k * 6 <= h.length * 8) { g.push(c.charAt((m >>> 6 * (3 - k)) & 63)) } else { g.push("=") } } } return g.join("") }, base64ToBytes: function (h) { if (typeof atob == "function") { return e.stringToBytes(atob(h)) } h = h.replace(/[^A-Z0-9+\/]/ig, ""); for (var g = [], j = 0, k = 0; j < h.length; k = ++j % 4) { if (k == 0) { continue } g.push(((c.indexOf(h.charAt(j - 1)) & (Math.pow(2, -2 * k + 8) - 1)) << (k * 2)) | (c.indexOf(h.charAt(j)) >>> (6 - k * 2))) } return g } }; d.mode = {}; var b = d.charenc = {}; var f = b.UTF8 = { stringToBytes: function (g) { return e.stringToBytes(unescape(encodeURIComponent(g))) }, bytesToString: function (g) { return decodeURIComponent(escape(e.bytesToString(g))) } }; var e = b.Binary = { stringToBytes: function (j) { for (var g = [], h = 0; h < j.length; h++) { g.push(j.charCodeAt(h)) } return g }, bytesToString: function (g) { for (var j = [], h = 0; h < g.length; h++) { j.push(String.fromCharCode(g[h])) } return j.join("") } } })(); (function () { var f = Crypto, a = f.util, b = f.charenc, e = b.UTF8, d = b.Binary; var c = f.SHA1 = function (i, g) { var h = a.wordsToBytes(c._sha1(i)); return g && g.asBytes ? h : g && g.asString ? d.bytesToString(h) : a.bytesToHex(h) }; c._sha1 = function (o) { if (o.constructor == String) { o = e.stringToBytes(o) } var v = a.bytesToWords(o), x = o.length * 8, p = [], r = 1732584193, q = -271733879, k = -1732584194, h = 271733878, g = -1009589776; v[x >> 5] |= 128 << (24 - x % 32); v[((x + 64 >>> 9) << 4) + 15] = x; for (var z = 0; z < v.length; z += 16) { var E = r, D = q, C = k, B = h, A = g; for (var y = 0; y < 80; y++) { if (y < 16) { p[y] = v[z + y] } else { var u = p[y - 3] ^ p[y - 8] ^ p[y - 14] ^ p[y - 16]; p[y] = (u << 1) | (u >>> 31) } var s = ((r << 5) | (r >>> 27)) + g + (p[y] >>> 0) + (y < 20 ? (q & k | ~q & h) + 1518500249 : y < 40 ? (q ^ k ^ h) + 1859775393 : y < 60 ? (q & k | q & h | k & h) - 1894007588 : (q ^ k ^ h) - 899497514); g = h; h = k; k = (q << 30) | (q >>> 2); q = r; r = s } r += E; q += D; k += C; h += B; g += A } return [r, q, k, h, g] }; c._blocksize = 16 })();

export default Utils
