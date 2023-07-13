export class Helper {
  static isEmpty(val) {
    return !(val !== undefined && val != null && val.length > 0);
  }
}


export class C {
static getVar(key, Collection, defaultVal = '') {
    if (Array.isArray(Collection)) {
      return C.getValue(key, Collection, defaultVal);
    }
    if (typeof Collection === 'object' && Collection !== null) {
      return C.getValue(key, { ...Collection }, defaultVal);
    }
    if (typeof Collection === 'string') {
      switch (C.toLowerCase()) {
        case 'get':
          return C.getValue(key, { ...this.getParams }, defaultVal);
        case 'post':
          return C.getValue(key, { ...this.postParams }, defaultVal);
        case 'request':
          return C.getValue(key, { ...this.requestParams }, defaultVal);
        case 'server':
          return C.getValue(key, { ...this.serverParams }, defaultVal);
        case 'cookie':
          return C.getValue(key, { ...this.cookieParams }, defaultVal);
        default:
          return C.getValue(key, { ...this.getParams }, defaultVal);
      }
    }
    return defaultVal;
  }
  
  static getValue(key, Collection, defaultVal = '') {
    const keys = key.split('.');
    let data = { ...Collection };
    for (const k of keys) {
      if (typeof data !== 'object' || data === null || !data.hasOwnProperty(k)) {
        return defaultVal;
      }
      data = data[k];
    }
    return data;
  }

  static _(key, Collection, defaultVal = '') {
    return C.getVar(key, Collection, defaultVal);
  }
}
