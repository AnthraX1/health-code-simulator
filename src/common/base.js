const root_path = "";
const time_update_list = [];
let time_updater_init = false;

function updateTime() {
  const d = new Date(new Date().getTime() + 8 * 3600 * 1000).toISOString().replace("T", " ");
  for (const item of time_update_list) {
    for (const element of document.querySelectorAll(item.selector)) {
      element.innerHTML = item.filter(d.slice(item.start, item.end));
    }
  }
};

let time_interval = 1000;

function setDynamicTime(selector, start = 0, end = 19, filter = (x) => x) {
  time_update_list.push({
    selector: selector,
    start: start,
    end: end,
    filter: filter,
  });
  updateTime();
  if (!time_updater_init) {
    time_updater_init = true;
    window.setInterval(() => {
      updateTime();
    }, time_interval);
  }
}

function setUpdateInterval(interval = 1000) {
  time_interval = interval;
}

// 2022-01-01 00:00:00.000Z
// 012345678901234567890123
function setStaticTime(selector, start = 0, end = 19, traceback_hours = 0, traceback_range = 0, filter = (x) => x) {
  for (const element of document.querySelectorAll(selector)) {
    if (element.attributes["data-traceback-hours"])
      traceback_hours = parseInt(element.attributes["data-traceback-hours"].value);
    if (element.attributes["data-traceback-range"])
      traceback_range = parseInt(element.attributes["data-traceback-range"].value);
    const hours = traceback_hours + (Math.random() - 0.5) * traceback_range;
    const d = new Date(new Date().getTime() + 8 * 3600 * 1000 - hours * 3600 * 1000).toISOString().replace("T", " ");
    element.innerHTML = filter(d.slice(start, end));
  }
}

const presetFilters = {
  name: (x) => x.length == 2 ? x[0] + "*" : x[0] + "*".repeat(x.length - 2) + x.slice(-1),
  name_preferlastname: (x) => x.length == 2 ? x[0] + "*" : x[0] + "*".repeat(x.length - 2) + x.slice(-1),
  name_preferfirstname: (x) => x.length == 2 ? "*" + x[1] : x[0] + "*".repeat(x.length - 2) + x.slice(-1),
  lastnameonly: (x) => x[0] + "*".repeat(x.length - 1),
  firstnameonly: (x) => "*" + x.slice(1),
  lastcharonly: (x) => "*".repeat(x.length - 1) + x.slice(-1),
  idcard: (start = 2, end = 2, mask = 18 - start - end) => (x) => x.slice(0, start) + "*".repeat(mask) + x.slice(-end),
  phone: (start = 3, end = 4, mask = 11 - start - end) => (x) => x.slice(0, start) + "*".repeat(mask) + x.slice(-end),
};

const fields = {};

function addStorageField(id, selector, name, placeholder, filter = (x) => x, callback = () => {}) {
  const elements = document.querySelectorAll(selector);
  const item = {
    selector: selector,
    placeholder: placeholder,
    filter: filter,
  };
  if (id in fields) {
    fields[id].push(item);
  } else {
    fields[id] = [item];
  }
  const init_value = localStorage.getItem(id) || placeholder;
  for (const element of elements) {
    element.innerHTML = filter(init_value);
    element.addEventListener("click", () => {
      let res = window.prompt("修改" + name + "：", localStorage.getItem(id) || placeholder);
      if (res == "" || res == null) {
        localStorage.removeItem(id);
      } else {
        localStorage.setItem(id, res);
      }
      callback(res || placeholder);
      for (const _item of fields[id]) {
        const _elements = document.querySelectorAll(_item.selector);
        for (const _element of _elements) {
          _element.innerHTML = _item.filter(res || _item.placeholder);
        }
      }
    });
  }
  callback(init_value);
}

function initServiceWorker(app) {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(root_path + '/service-worker.js', {
        scope: root_path + "/"
      }).then((e) => {
        if (app) {
          if (typeof(app) == "string") app = [app];
          let sw_timer = window.setInterval(() => {
            if (navigator.serviceWorker.controller) {
              window.clearInterval(sw_timer);
              navigator.serviceWorker.controller.postMessage({
                type: "download",
                content: ["root", "common", "trip-card"].concat(app)
              });
            }
          }, 300);
        }
        resolve();
      }).catch((e) => {
        reject();
      })
    } else {
      reject();
    }
  });
}

function navigateHome() {
  window.location.href = root_path + "/index.html";
}

function navigateToTripCard() {
  window.location.href = root_path + "/trip-card/index.html";
}