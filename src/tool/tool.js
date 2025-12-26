function walk(obj_opt,key_set,val_set){
  Object.keys(obj_opt).forEach(key => {
    if(typeof obj_opt[key] == 'object'){
      obj_opt[key][key_set] = val_set
      walk(obj_opt[key],key_set,val_set)
    }
  })
}
export default {
  debounce: function (fn, wait) {
    var timeout = null;
    return function () {
      if (timeout !== null) clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
    }
  },
  addKeyValue:function(obj_opt,key_set,val_set){
    obj_opt[key_set] = val_set
    walk(obj_opt,key_set,val_set)
    return obj_opt
  }
}
