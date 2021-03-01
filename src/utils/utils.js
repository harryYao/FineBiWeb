export function jsonToTree(jsonData, id, pid) {
  const result = [];
  const temp = {};
  for (let i = 0; i < jsonData.length; i++) {
    temp[jsonData[i][id]] = jsonData[i]; // 以id作为索引存储元素，可以无需遍历直接定位元素
  }
  for (let j = 0; j < jsonData.length; j++) {
    const currentElement = jsonData[j];
    const tempCurrentElementParent = temp[currentElement[pid]]; // 临时变量里面的当前元素的父元素
    if (tempCurrentElementParent) {
      // 如果存在父元素
      if (!tempCurrentElementParent.children) {
        // 如果父元素没有chindren键
        tempCurrentElementParent.children = []; // 设上父元素的children键
      }
      tempCurrentElementParent.children.push(currentElement); // 给父元素加上当前元素作为子元素
    } else {
      // 不存在父元素，意味着当前元素是一级元素
      result.push(currentElement);
    }
  }
  return result;
}

/**
 * 将全量的json目录和节点数据，解析为树状结构数据。
 * @param 源数据 jsonData
 * @param 索引字段名 id
 * @param 父节点字段名 pid
 * @param 需要筛选的目录名称列表（排除无用目录） menulist
 * @param 筛选出的结果 gamenodes
 */
export function jsonToTree2(jsonData, id, pid, menulist, gamenodes, includeMobile = true) {
  const result = [];
  const temp = {};
  for (let i = 0; i < jsonData.length; i++) {
    temp[jsonData[i][id]] = jsonData[i]; // 以id作为索引存储元素，可以无需遍历直接定位元素
  }
  for (let j = 0; j < jsonData.length; j++) {
    const currentElement = jsonData[j];
    if (currentElement.deviceType !== 6 || includeMobile) { // 排除只在移动端显示的目录和报表
      const tempCurrentElementParent = temp[currentElement[pid]]; // 临时变量里面的当前元素的父元素
      if (menulist.includes(currentElement.text)) {
        gamenodes[currentElement.id] = currentElement;
      }
      // if (currentElement.deviceType == 6) {
      //   console.log(currentElement.text)
      // }
      if (tempCurrentElementParent) {
        // 如果存在父元素
        if (!tempCurrentElementParent.children) {
          // 如果父元素没有chindren键
          tempCurrentElementParent.children = []; // 设上父元素的children键
        }
        tempCurrentElementParent.children.push(currentElement); // 给父元素加上当前元素作为子元素
      } else {
        // 不存在父元素，意味着当前元素是一级元素
        result.push(currentElement);
      }
    }
  }
  return result;
}


/** 清除简单对象的空值属性 */
export function CleanObj(source) {
  const obj = { ...source };
  Object.keys(source).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  });
  return obj;
}

export function DeepClone(obj) {
  const obj2 = JSON.stringify(obj);
  const objClone = JSON.parse(obj2);
  return objClone;
}
