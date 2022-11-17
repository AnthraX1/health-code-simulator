const version = "17a2381b"
const cache_name = "hcsim-cache-" + version;
let assets = {};

async function cleanResponse(response) {
  const cloned_response = response.clone();
  if (cloned_response.redirected == false)
    return cloned_response;

  const bodyPromise = "body" in cloned_response ?
    Promise.resolve(cloned_response.body) :
    cloned_response.blob();

  return bodyPromise.then((body) => {
    return new Response(body, {
      headers: cloned_response.headers,
      status: cloned_response.status,
      statusText: cloned_response.statusText,
    });
  });
}

async function cacheAsset(request) {
  console.log(`[Service Worker] Searching for resource: ${request.url || request}`);
  const r = await caches.match(request);
  if (r) { return r; }
  const response = await fetch(request);
  const cache = await caches.open(cache_name);
  console.log(`[Service Worker] Caching new resource: ${request.url || request}`);
  const cloned_response = await cleanResponse(response);
  await cache.put(request, cloned_response);
  return response;
}

self.addEventListener("install", (e) => {
  console.log(`[Service Worker] Install`);
  e.waitUntil(self.skipWaiting());
});

self.addEventListener("fetch", (e) => {
  e.respondWith(cacheAsset(e.request));
});

let cached_apps = [];

self.addEventListener("activate", (e) => {
  console.log(`[Service Worker] Activate`);
  e.waitUntil((async () => {
    cached_apps = [];
    const keys = await caches.keys();
    for (const key of keys)
      if (key !== cache_name)
        await caches.delete(key);
    await self.clients.claim();
  })());
});

async function broadcastMessage(mes) {
  const client_list = await self.clients.matchAll();
  if (client_list)
    for (const client of client_list)
      await client.postMessage(mes);
}

async function checkCachedApps() {
  const cache = await caches.open(cache_name);
  for (const [app_name, app_assets] of Object.entries(assets)) {
    if (cached_apps.includes(app_name)) continue;
    let completed = false;
    for (const asset of app_assets) {
      if (!await caches.match(asset)) {
        break;
      }
      completed = true;
    }
    if (completed)
      cached_apps.push(app_name);
  }
  await broadcastMessage({
    type: "complete",
    content: {
      cached: cached_apps,
      version: version,
    }
  });
}

function getAssetsList(asset_name) {
  if (!asset_name in assets) return [];
  if (asset_name == "ykm")
    return assets["ykm"].concat(assets["gwongzau-hc"]);
  else if (asset_name == "shandong-hc")
    return assets["shandong-hc"].concat(assets["weihai-hc"]);
  else
    return assets[asset_name];
}

self.addEventListener("message", (e) => {
  if (!e.data) return;
  if (e.data.type == "download") {
    (async () => {
      await checkCachedApps();
      let app_assets = [];
      if (typeof(e.data.content) == "string") {
        if (cached_apps.includes(e.data.content))
          return;
        app_assets = getAssetsList(e.data.content);
      } else {
        for (const item of e.data.content) {
          if (cached_apps.includes(item))
            continue;
          app_assets = app_assets.concat(getAssetsList(item));
        }
      }
      if (!app_assets) return;
    
      const cache = await caches.open(cache_name);
      let count = 0;
      for (const asset of app_assets) {
        try {
          await cacheAsset(asset);
          // if (!await caches.match(asset)) {
          //   console.log(`[Service Worker] Downloading ${asset}`);
          //   await cache.add(asset);
          // }
          count++;
        } catch (e) {
          console.log(`[Service Worker] Failed to download ${asset}`);
        }
        
        // broadcastMessage({
        //   type: "progress",
        //   content: (count / app_assets.length).toFixed(2)
        // });
      }
      if (count == app_assets.length) {
        if ("string" == typeof(e.data.content))
          cached_apps.push(e.data.content);
        else
          cached_apps = cached_apps.concat(e.data.content);
      }
      broadcastMessage({
        type: "complete",
        content: {
          cached: cached_apps,
          version: version,
        }
      });
    })();
  } else if (e.data.type == "clear") {
    (async () => {
      cached_apps = [];
      const keys = await caches.keys();
      for (const key of keys)
        await caches.delete(key);
      const client_list = await self.clients.matchAll();
      for (const client of client_list) {
        client.postMessage({
          type: "reload",
        });
      }
    })();
  } else if (e.data.type == "check") {
    checkCachedApps();
  }
});

/* DO NOT REMOVE OR MODIFY */
/* BEGIN ASSETS */assets={"root":["./","./app.css","./app.js","./index.html","./manifest.json",],"ykm":["ykm/","./ykm/detail.css","./ykm/detail.html","./ykm/static/4508c60464ce3888449fc79e838e73cd.svg","./ykm/static/150f406201f0b0e674a6abe0d1ac292f.svg","./ykm/static/4f474259427737a36d6c292a3c2f7553.svg","./ykm/static/b4455fa4d4a6cd9227fe4703238eeb51.svg","./ykm/static/e5cebec2f715d6d4f4c4e19b5856f836.svg","./ykm/static/44e817161a84279f6440d4a52d117900.svg","./ykm/static/029ff54f704e01717fb30acf1c95ad75.svg","./ykm/static/afe4df7c15bffd8eaef1fe02a4af8474.svg","./ykm/static/eb043b4b54f68bcc19242a706636561d.png","./ykm/static/2aee70d3d005c220bc9e4c64ad8c7485.png","./ykm/static/yss.jpeg","./ykm/static/d88e60f10d7b8da943b5e9ebac2fee7f.svg","./ykm/static/fd5c377f998d7e9484c862b9cb98ceb5.svg","./ykm/static/19bdc888e99ae0d767dcc137ba1464cf.png","./ykm/static/c9652a23beac030ca4899831aa87ff62.svg","./ykm/static/456533e61ba93e1af44a2d3a5c2fd032.gif","./ykm/static/reload.e5cebec2f715d6d4f4c4e19b5856f836.svg","./ykm/static/88caf508845af9f014f0df2e2e687061.png","./ykm/static/27597bf024b2ecbf42295c976b1eca16.svg","./ykm/static/80401c2e955ec7aa3f126ae90801efd1.png","./ykm/static/b80e47116a2514556e388a3639d93b7c.png","./ykm/static/f00f1d0fbb5c9f1863cf882cbd6f1933.svg","./ykm/static/0619260a7addd8f89093cd21356e0b80.png","./ykm/static/b739d24b3e9cf335c3d74126ce8e2b98.png","./ykm/static/dfa1c9f48ba289110ab1d9f61c5fc749.jpg","./ykm/static/mm.svg","./ykm/static/c8cd86abb92bbc77b0db2b2d7f390090.png","./ykm/static/eb0bdecffb0b41192f65fbaee7cb5d39.png","./ykm/static/dd22fed45003c852735958d99a0443e7.png","./ykm/static/2c258b7b98bdfcb70a00c769d685e9bb.svg","./ykm/checkin.html","./ykm/index.html","./ykm/manifest.json",],"zhejiang-hc":["zhejiang-hc/","./zhejiang-hc/app.css","./zhejiang-hc/static/bg.png","./zhejiang-hc/static/b26f98d44882ea99faa72eff4c4a2bff.png","./zhejiang-hc/static/logo.ico","./zhejiang-hc/index.html","./zhejiang-hc/manifest.json",],"weihai-hc":["weihai-hc/","./weihai-hc/app.css","./weihai-hc/static/xcm_lt.jpg","./weihai-hc/static/hstag1.png","./weihai-hc/static/new_bgt.png","./weihai-hc/static/eye1.png","./weihai-hc/static/new_btn2.png","./weihai-hc/static/new_tu1.png","./weihai-hc/static/new_te2.jpg","./weihai-hc/static/audio1.png","./weihai-hc/static/eye2.png","./weihai-hc/static/new_btn1.png","./weihai-hc/static/new_te3.jpg","./weihai-hc/static/new_btn3.png","./weihai-hc/index.html","./weihai-hc/manifest.json",],"gwongzau-hc":["gwongzau-hc/","./gwongzau-hc/static/icon-Travel-card.png","./gwongzau-hc/static/health-code2.gif","./gwongzau-hc/static/logo.png","./gwongzau-hc/static/icon-health-nucleic-acid.png","./gwongzau-hc/static/travel-card.png","./gwongzau-hc/static/goBackArrow.png","./gwongzau-hc/static/topScorll.png","./gwongzau-hc/common/cell.css","./gwongzau-hc/common/base.css","./gwongzau-hc/checkin.html","./gwongzau-hc/manifest.json",],"shandong-hc":["shandong-hc/","./shandong-hc/app.css","./shandong-hc/static/sy.png","./shandong-hc/static/cleye.png","./shandong-hc/static/logo.png","./shandong-hc/static/shield1.png","./shandong-hc/static/bg1.gif","./shandong-hc/static/newdp.gif","./shandong-hc/static/opeye.png","./shandong-hc/static/right.png","./shandong-hc/index.html","./shandong-hc/manifest.json",],"trip-card":["trip-card/","./trip-card/app.css","./trip-card/static/yidong0.png","./trip-card/static/gif_green.gif","./trip-card/static/img_arrow@2x.png","./trip-card/static/liant0.png","./trip-card/static/xty0.png","./trip-card/static/guangdian0.png","./trip-card/static/g2.png","./trip-card/static/withtext@2x.png","./trip-card/static/dianxin0.png","./trip-card/static/ucload.png","./trip-card/index.html","./trip-card/manifest.json",],"ssm":["ssm/","./ssm/app.css","./ssm/static/ssbapp-logo.png","./ssm/static/suishenma_bg.png","./ssm/static/suishenma_people.png","./ssm/static/hesuanma.png","./ssm/static/eysOpen.png","./ssm/static/back.png","./ssm/static/logo.png","./ssm/static/nucleic_acid_vaccine.png","./ssm/static/icon-txz.png","./ssm/static/icon_xingcheng.png","./ssm/static/newhscyd.png","./ssm/static/icon_medical.png","./ssm/static/icon_bus.png","./ssm/static/authentication.png","./ssm/static/suishenma_logo.png","./ssm/static/eyeClose.png","./ssm/static/kangyuan.png","./ssm/static/suishenma_title.png","./ssm/checkin.html","./ssm/index.html","./ssm/manifest.json",],"tfjkt":["tfjkt/","./tfjkt/app.css","./tfjkt/static/bg8.png","./tfjkt/static/consulting@2x.png","./tfjkt/static/bg6.png","./tfjkt/static/gou.png","./tfjkt/static/bg5.png","./tfjkt/static/vaccinationSuccess@2x.png","./tfjkt/static/antibody_result_query@2x.png","./tfjkt/static/txxck_server.png","./tfjkt/static/bg4.png","./tfjkt/static/bg3.png","./tfjkt/static/bg10.png","./tfjkt/static/bg1.png","./tfjkt/static/code-refresh.svg","./tfjkt/static/medical_institution_query@2x.png","./tfjkt/static/bg7.png","./tfjkt/static/bg9.png","./tfjkt/static/test.png","./tfjkt/static/sqbb2.png","./tfjkt/static/bg11.png","./tfjkt/static/scan.png","./tfjkt/static/bg12.png","./tfjkt/static/other_server.png","./tfjkt/static/familyCode.png","./tfjkt/static/bg2.png","./tfjkt/static/scan@2x.png","./tfjkt/static/userInfo.png","./tfjkt/static/message-icon.png","./tfjkt/checkin.html","./tfjkt/index.html","./tfjkt/manifest.json",],"shaanxi-hc":["shaanxi-hc/","./shaanxi-hc/static/index/sx01.png","./shaanxi-hc/static/index/qinwuyuan.png","./shaanxi-hc/static/index/siteCodeBlue.png","./shaanxi-hc/static/index/lfsytb.png","./shaanxi-hc/static/index/banner.png","./shaanxi-hc/static/index/kyjc.png","./shaanxi-hc/static/index/siteCodeGreen.png","./shaanxi-hc/static/index/sm01.png","./shaanxi-hc/static/index/xzqsm.png","./shaanxi-hc/static/index/indexBgImg.png","./shaanxi-hc/static/index/sx-yellow.svg","./shaanxi-hc/static/index/hsjccx.png","./shaanxi-hc/static/index/ymjzcx.png","./shaanxi-hc/static/index/fxdqcx.png","./shaanxi-hc/static/index/rjry.png","./shaanxi-hc/static/index/hscydcx.png","./shaanxi-hc/static/index/share.png","./shaanxi-hc/static/index/csmsq.png","./shaanxi-hc/static/index/sx-red.svg","./shaanxi-hc/static/index/wh01.png","./shaanxi-hc/static/index/txxck.png","./shaanxi-hc/static/index/sjf01.png","./shaanxi-hc/static/myCode/close.png","./shaanxi-hc/static/myCode/greyLogo.png","./shaanxi-hc/static/myCode/update.png","./shaanxi-hc/static/myCode/crimsonLogo.png","./shaanxi-hc/static/myCode/weijianchu.png","./shaanxi-hc/static/myCode/warn.png","./shaanxi-hc/static/myCode/check-circle.png","./shaanxi-hc/static/myCode/shuaxin.png","./shaanxi-hc/static/myCode/greenLogo.png","./shaanxi-hc/static/myCode/yellowLogo.png","./shaanxi-hc/static/myCode/error.png","./shaanxi-hc/static/myCode/yinxing.png","./shaanxi-hc/static/myCode/yisaoma.png","./shaanxi-hc/static/myCode/hui.png","./shaanxi-hc/static/myCode/yangxing.png","./shaanxi-hc/static/css/index.css","./shaanxi-hc/static/css/u-image.css","./shaanxi-hc/static/css/app.css","./shaanxi-hc/static/css/BrightCode.css","./shaanxi-hc/static/css/qrcode.css","./shaanxi-hc/static/css/main-menu.css","./shaanxi-hc/checkin.html","./shaanxi-hc/index.html","./shaanxi-hc/manifest.json",],"hubei-hc":["hubei-hc/","./hubei-hc/app.css","./hubei-hc/static/icon_white.png","./hubei-hc/static/dun.png","./hubei-hc/static/card.png","./hubei-hc/static/bian.png","./hubei-hc/static/icon_right.png","./hubei-hc/static/24.png","./hubei-hc/static/logo.png","./hubei-hc/static/icon_success_white.png","./hubei-hc/static/phone.png","./hubei-hc/static/bgc.png","./hubei-hc/static/icon_success.png","./hubei-hc/static/right.png","./hubei-hc/index.html","./hubei-hc/manifest.json",],"fujian-hc":["fujian-hc/","./fujian-hc/app.css","./fujian-hc/static/TAB_UP_OFF.svg","./fujian-hc/static/menu-yw.png","./fujian-hc/static/menu-hsjcdt.png","./fujian-hc/static/close.png","./fujian-hc/static/nucleic-24h.png","./fujian-hc/static/success.png","./fujian-hc/static/bg2@2x.png","./fujian-hc/static/menu-ymjzdt.png","./fujian-hc/static/datetime.png","./fujian-hc/static/menu-grxxsz.png","./fujian-hc/static/jkm_logo.png","./fujian-hc/static/travel-card@2x.png","./fujian-hc/static/index.html.1","./fujian-hc/static/vaccination-done.png","./fujian-hc/static/menu-phone.png","./fujian-hc/static/family_health_code@2x.png","./fujian-hc/static/icon-arrow-right@2x.png","./fujian-hc/static/menu-slztm.png","./fujian-hc/static/place_address.png","./fujian-hc/static/menu-bcjkm2.png","./fujian-hc/static/menu-gljtcyjkm.png","./fujian-hc/static/index.html","./fujian-hc/static/QR_ON.svg","./fujian-hc/static/family-btn@2x.png","./fujian-hc/static/menu-yldzpz.png","./fujian-hc/static/TAB_DOWN_ON.svg","./fujian-hc/static/menu-grjkxxbb.png","./fujian-hc/static/logo21@2x.png","./fujian-hc/static/CAM_OFF.svg","./fujian-hc/static/menu-ymjzyy.png","./fujian-hc/static/icon_00.png","./fujian-hc/static/open.png","./fujian-hc/checkin.html","./fujian-hc/index.html","./fujian-hc/manifest.json",],"tianjin-hc":["tianjin-hc/","./tianjin-hc/static/js/chunk-4bad5866.f4231835.js","./tianjin-hc/static/js/chunk-60ef386e.1f86de1c.js","./tianjin-hc/static/js/chunk-81baaa6e.6f2d5070.js","./tianjin-hc/static/js/chunk-2d0e93c0.e5590f8d.js","./tianjin-hc/static/js/chunk-5870a64c.7449e3ed.js","./tianjin-hc/static/js/runtime~app.2ae274cd.js","./tianjin-hc/static/js/chunk-258b3eb3.d9403a56.js","./tianjin-hc/static/js/chunk-15920e85.6eec9ac6.js","./tianjin-hc/static/js/chunk-79557ba2.01fd515f.js","./tianjin-hc/static/js/chunk-743435bd.8ba2534d.js","./tianjin-hc/static/js/chunk-138c822c.ba9b8f0d.js","./tianjin-hc/static/js/app.1faafef1.js","./tianjin-hc/static/js/chunk-2d0aba8a.97b14652.js","./tianjin-hc/static/js/chunk-e58f8fbe.251b9f78.js","./tianjin-hc/static/js/chunk-2d0e6128.22197f0b.js","./tianjin-hc/static/css/chunk-60ef386e.a3cf78e6.css","./tianjin-hc/static/css/app.75f3ec59.css","./tianjin-hc/static/css/chunk-81baaa6e.9e9ecaa4.css","./tianjin-hc/static/css/chunk-138c822c.e042f172.css","./tianjin-hc/static/css/chunk-258b3eb3.efb43758.css","./tianjin-hc/static/css/chunk-e58f8fbe.c61d4756.css","./tianjin-hc/static/css/chunk-4bad5866.2b261d97.css","./tianjin-hc/static/css/chunk-79557ba2.7642c8d5.css","./tianjin-hc/static/css/chunk-743435bd.83093c21.css","./tianjin-hc/static/img/vaccine-ok.de2bb0c7.png","./tianjin-hc/static/img/bg_icon_describe.f59ddbec.png","./tianjin-hc/static/img/bg_nucleic_acid.f1330aba.png","./tianjin-hc/static/img/tong-active.46c8dd0a.png","./tianjin-hc/static/img/shai-3.d240e6b1.png","./tianjin-hc/static/img/map.d23401fa.png","./tianjin-hc/static/img/ic_me_head_woman.59cbfa7f.png","./tianjin-hc/static/img/clear-core.fa3aa2de.png","./tianjin-hc/static/img/config-0.221fb95a.png","./tianjin-hc/static/img/bg_health.cf16faaa.png","./tianjin-hc/static/img/logo.png","./tianjin-hc/static/img/masked-core.49840efb.png","./tianjin-hc/static/img/ic_nucleicacid_title.aa40abf8.png","./tianjin-hc/static/img/shai-qr.8d86f4f3.png","./tianjin-hc/static/img/pcr-days.198aba75.png","./tianjin-hc/static/img/tong-inactive.f98be18f.png","./tianjin-hc/static/img/ic_nucleicacid_save2.a7f9ae61.png","./tianjin-hc/static/img/xck-0.bb8938e2.png","./tianjin-hc/static/img/report-bg.74e16362.png","./tianjin-hc/static/img/ic_me_head_man.b48dfba2.png","./tianjin-hc/static/img/shai-1.8f15bc1c.png","./tianjin-hc/static/img/goto-xck.01a77940.png","./tianjin-hc/static/img/ic_get_report_gray.50a14653.png","./tianjin-hc/qrcode_found.wav","./tianjin-hc/index.html","./tianjin-hc/manifest.json",],"skm":["skm/","./skm/src/member.png","./skm/src/fill.png","./skm/src/turn-right2.png","./skm/src/gj.png","./skm/src/banner-bg1.1b63d234.png","./skm/src/yimiao.png","./skm/src/hs-detail.png","./skm/src/fxbb.png","./skm/src/kangti.png","./skm/src/icon4.png","./skm/src/jszwfw.png","./skm/src/xxgx.png","./skm/src/turn-left2.png","./skm/src/shape.png","./skm/src/img3.png","./skm/src/hsym-back.png","./skm/src/hours.dc948a63.png","./skm/src/xingcheng.png","./skm/detail.html","./skm/plug/bootstrap-4.3.1/js/bootstrap.min.js","./skm/plug/bootstrap-4.3.1/css/bootstrap.min.css","./skm/plug/layer/layer.js","./skm/plug/layer/skin/default/loading-1.gif","./skm/plug/layer/skin/default/loading-2.gif","./skm/plug/layer/skin/layer.css","./skm/plug/mobileSelect/mobileSelect.css","./skm/plug/mobileSelect/mobileSelect.js","./skm/plug/jquery/jquery.min.js","./skm/plug/jquery.qrcode.min.js","./skm/plug/aes.js","./skm/css/chunk-vendors.e42493a3.css","./skm/css/app.5e428cca.css","./skm/css/index20220509.css","./skm/static/all1651809278.min.js","./skm/favicon.ico","./skm/dist/skm1665467361.min.js","./skm/index.html","./skm/manifest.json",],"common":["common/","./common/icons/arrow_forward.svg","./common/icons/help.svg","./common/icons/vaccines.svg","./common/icons/place.svg","./common/icons/qr_code_scanner.svg","./common/icons/qr_code.svg","./common/icons/info.svg","./common/icons/map.svg","./common/icons/add_box.svg","./common/icons/push_pin.svg","./common/icons/download_done.svg","./common/nav.css","./common/logo.jpg","./common/base.js","./common/codeberg-logo.svg","./common/github-logo.png","./common/telegram-logo.svg","./common/g-icon.css",],"henan-hc":["henan-hc/","./henan-hc/checkin.css","./henan-hc/static/font.ttf","./henan-hc/static/code.fdf7167f.css","./henan-hc/static/A-2NeSKm-QgsAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/AoNGFRZnWseQAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/Ae4rkQItFlVsAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/A5SeORrczUVUAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/AkqtASpyxcVEAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/AkKxZTZcbcC4AAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/A5dkJQJC1ie4AAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/APpLHR6uoJVYAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/logo.png","./henan-hc/static/antdesigns.7b8287b9.chunk.css","./henan-hc/static/A7OCDT5H8ZDAAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/Apbe5QbKkU14AAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/AAE0_Q5LBeuoAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/AJd-0Sb3G_ikAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/A2S3dTIou2YsAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/hsjc.13715733.svg","./henan-hc/static/Ao83ZRZGfQNMAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/A_K4HToyDDUUAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/AvuV2SpriSJ4AAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/default.umi.f3d7f435.chunk.css","./henan-hc/static/AetxPR4FIEr0AAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/common.deed9a9a.css","./henan-hc/static/p__sceneuserfillin__result.41f58106.chunk.css","./henan-hc/static/Acb_AQbrUPVAAAAAAAAAAAAAAARQnAQ.png","./henan-hc/static/A1k4zRovE_bUAAAAAAAAAAAAAARQnAQ.png","./henan-hc/checkin.html","./henan-hc/index.html","./henan-hc/manifest.json",],"hunan-hc":["hunan-hc/","./hunan-hc/checkin.css","./hunan-hc/app.css","./hunan-hc/static/logo-b18dcf7bf55c412ec04989061d0512ad.png","./hunan-hc/static/dun.f20ea1e5.gif","./hunan-hc/static/code-red-3c12d9761b32ffbdc3e8e8ce553e8449.png","./hunan-hc/static/note-4c1d024ad82becb246a75d136a8e944f.png","./hunan-hc/static/code-green-64c9b5ddb9932f9f3cea748c3db25990.png","./hunan-hc/static/goldenbakBG.ceebf26d.png","./hunan-hc/static/code-yellow-164dd85a5a378007a8130efa1db6cb81.png","./hunan-hc/checkin.html","./hunan-hc/index.html","./hunan-hc/manifest.json",],"jkb":["jkb/","./jkb/scan.html","./jkb/static/004.gif","./jkb/static/4f474259427737a36d6c292a3c2f7553.svg","./jkb/static/newtongqinbiaozhi.png","./jkb/static/62badacba1c82.gif","./jkb/static/weijianyichang.png","./jkb/static/1.wav","./jkb/static/sxicon.svg","./jkb/static/logo_jiankangbao1@2x.png","./jkb/static/ymicon.svg","./jkb/static/hsicon.svg","./jkb/static/wodebj.png","./jkb/static/pic_yimiao_blue@2x.png","./jkb/static/xiaolvma.png","./jkb/static/logo.png","./jkb/static/ic_help_grey@2x.png","./jkb/static/pic_hesuan_blue@2x.png","./jkb/static/mark_tongqin@2x.png","./jkb/static/ic_QRcode@2x.png","./jkb/static/GreenCode.png","./jkb/static/blue_btn_refresh_grey.png","./jkb/static/ic_help_white@2x.png","./jkb/static/layout@2x.png","./jkb/static/whicon-s.svg","./jkb/static/lvicon.svg","./jkb/static/erweima.png","./jkb/static/yuanzhu.png","./jkb/static/panel@2x.png","./jkb/checkin.html","./jkb/index.html","./jkb/manifest.json",],"wuhan-hc":["wuhan-hc/","./wuhan-hc/app.css","./wuhan-hc/static/arrow-left.png","./wuhan-hc/static/kyzc.png","./wuhan-hc/static/bolan3.png","./wuhan-hc/static/edit.png","./wuhan-hc/static/health-logo2.png","./wuhan-hc/static/health-border2.png","./wuhan-hc/static/jkmymjz.png","./wuhan-hc/static/xczc0302.png","./wuhan-hc/static/healthReport.png","./wuhan-hc/static/declare.png","./wuhan-hc/static/phone.png","./wuhan-hc/static/jkmlfhxxsb.png","./wuhan-hc/static/QRlogo.png","./wuhan-hc/static/lmyjjjkzc.png","./wuhan-hc/static/health-code-management.png","./wuhan-hc/static/customerService.png","./wuhan-hc/static/jkmxck.png","./wuhan-hc/static/jkmright02.png","./wuhan-hc/static/jkm48.png","./wuhan-hc/index.html","./wuhan-hc/manifest.json",],};