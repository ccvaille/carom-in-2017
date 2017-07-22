function isContinuaty(value) {
  let count = 1;
  for (let i = 0; i < value.length - 1; i++) {
    if (value.charCodeAt(i) + 1 === value.charCodeAt(i + 1)) {
      count += 1;
    }
  }

  if (count === value.length) {
    return true;
  }

  return false;
}

function isBackContiuaty(value) {
  // 比如 654321
  let count = 1;
  for (let i = value.length - 1; i > 0; i--) {
    if (value.charCodeAt(i) + 1 === value.charCodeAt(i - 1)) {
      count += 1;
    }
  }

  if (count === value.length) {
    return true;
  }

  return false;
}

export function transformPropsFitForm(obj) {
  const objCopy = { ...obj };
  const keys = Object.keys(obj);

  keys.forEach((k) => {
    objCopy[k] = {
      value: obj[k],
    };
  });
  return objCopy;
}

export function isManagePasswordValid(value) {
  const isNum = /^\d{6}$/.test(value);

  // const isNotRepeat = !/^(\d)\1+$/.test(value);
  // const isNotContinue = !isContinuaty(value) && !isBackContiuaty(value);

  return isNum;
}
