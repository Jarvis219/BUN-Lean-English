/**
 * Get the router and params from the url
 * @param {string} url - The url
 * @param {string} routerDefine - The router define
 * @returns {object} The router and params
 * @example
 * getRouter("/categories/1", "/categories/:id")
 * => { router: "/categories/:id", params: {id: 1}, routerMatch: "/categories/1", paramsResultObject: {id: 1}
 * getRouter("/categories/1/2", "/categories/:categoryId/:productId", { categoryId: 1, productId: 2 })
 * => { router: "/categories/:categoryId/:productId", params: {categoryId: 1, productId: 2}, routerMatch: "/categories/1/2", paramsResultObject: {categoryId: 1, productId: 2}
 */
export const getRouter = (
  url: string,
  routerDefine: string
): {
  routerMatch: string;
  router: string;
  params: string | string[];
  paramsResultObject: any;
} => {
  const urlSplit = url.split("/");
  const routerDefineSplit = routerDefine.split("/");

  const paramsResult = [];
  const routerResult = [];

  let isMatchAll = true;
  let paramsResultObject = {};

  for (let i = 0; i < urlSplit.length; i++) {
    const urlSplitItem = urlSplit[i];
    const routerDefineSplitItem = routerDefineSplit[i];

    if (urlSplitItem === routerDefineSplitItem) {
      routerResult.push(urlSplitItem);
    } else if (routerDefineSplitItem?.startsWith(":")) {
      paramsResult.push(urlSplitItem);
      routerResult.push(routerDefineSplitItem);
      paramsResultObject = {
        ...paramsResultObject,
        [routerDefineSplitItem.replace(":", "")]: urlSplitItem,
      };
    } else {
      isMatchAll = false;
      break;
    }
  }

  if (isMatchAll) {
    return {
      routerMatch: isMatchAll ? url : "",
      router: routerResult.join("/"),
      params: paramsResult.length === 1 ? paramsResult[0] : paramsResult,
      paramsResultObject,
    };
  }

  return {
    routerMatch: "",
    router: "",
    params: "",
    paramsResultObject: {},
  };
};
