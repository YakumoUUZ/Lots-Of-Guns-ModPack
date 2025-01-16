//#region 反射,摘自mcmod教程 https://www.mcmod.cn/post/4678.html
// 此函数是为了将kjs包装过的类转为java反射的野生类
global.toRawClass = cls => {
    let clsName = RegExp(/[\w.]+(?=\]?$)/).exec(String(cls))[0];
    return global.loadRawClass(clsName);
};

global.loadRawClass = clsName => Java.class.forName(clsName);

// field操作
global.getDeclaredField = (obj, name, isStatic, superCount) => {
    superCount = superCount || 0; // 超类层数默认为0
    let cls;
    if (!isStatic) cls = obj.getClass();
    else cls = global.toRawClass(obj);
    for (let i = 0; i < superCount; i++) cls = cls.getSuperclass(); // 循环向上取超类
    let field = cls.getDeclaredField(name);
    field.setAccessible(true);
    return field;
};

global.getField = (obj, name, isStatic, superCount) => {
    // 实际操作中获取静态变量此处直接传入类对象自身似乎也没啥问题_(:з」∠)_
    return global.getDeclaredField(obj, name, isStatic, superCount).get(obj);
};

global.setField = (obj, name, value, isStatic, superCount) => {
    return global.getDeclaredField(obj, name, isStatic, superCount).set(obj, value);
};
//#endregion
