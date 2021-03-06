export default function(win,px) {
  var remCalc = {};
  var docEl = win.document.documentElement,
    tid;

  function refreshRem() {
    // 获取当前窗口的宽度
    var width = docEl.getBoundingClientRect().width;
    // 大于1242px 按1242算
    if (width > px) {
      width = px;
    }
    // var rem = (width / px) * 100; // cms 只要把这行改成  var rem = width /1242 * 100
    var rem = width / 1242 * 100;
    docEl.style.fontSize = rem + "px";
    remCalc.rem = rem;
    //误差、兼容性处理
    var actualSize = parseFloat(
      window.getComputedStyle(document.documentElement)["font-size"]
    );
    if (
      actualSize !== rem &&
      actualSize > 0 &&
      Math.abs(actualSize - rem) > 1
    ) {
      var remScaled = (rem * rem) / actualSize;
      docEl.style.fontSize = remScaled + "px";
    }
  }

  //函数节流，避免频繁更新
  function dbcRefresh() {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 100);
  }

  //窗口更新动态改变font-size
  win.addEventListener(
    "resize",
    function() {
      dbcRefresh();
    },
    false
  );

  //页面显示的时候再计算一次   难道切换窗口之后再切换来窗口大小会变?....
  win.addEventListener(
    "pageshow",
    function(e) {
      if (e.persisted) {
        dbcRefresh();
      }
    },
    false
  );
  refreshRem();
  remCalc.refreshRem = refreshRem;
  remCalc.rem2px = function(d) {
    var val = parseFloat(d) * this.rem;
    if (typeof d === "string" && d.match(/rem$/)) {
      val += "px";
    }
    return val;
  };
  remCalc.px2rem = function(d) {
    var val = parseFloat(d) / this.rem;
    if (typeof d === "string" && d.match(/px$/)) {
      val += "rem";
    }
    return val;
  };
  win.remCalc = remCalc;
}
