import {validateUrl, getContentXHR} from 'utils/app';
import {makeDocumentVisible, runOnce} from 'utils/common';
import {
  initSearch,
  prepareImageForUpload,
  sendReceipt,
  getValidHostname,
  uploadCallback
} from 'utils/engines';

const engine = 'yandex';

function showResults(xhr) {
  if (xhr.status === 413) {
    largeImageNotify(engine, '8');
    return;
  }

  const params = JSON.parse(xhr.responseText).blocks[0].params.url;
  const tabUrl = `https://${getValidHostname()}/images/search?${params}`;

  if (validateUrl(tabUrl)) {
    window.location.replace(tabUrl);
  }
}

async function searchApi({image, storageIds} = {}) {
  const hostname = getValidHostname();
  const url =
    `https://${hostname}/images/touch/search?rpt=imageview&format=json` +
    `&request={"blocks":[{"block":"cbir-uploader__get-cbir-id"}]}`;

  const data = new FormData();
  data.append('upfile', image.imageBlob);

  const xhr = getContentXHR();
  xhr.addEventListener('load', function () {
    sendReceipt(storageIds);

    uploadCallback(this, showResults, engine);
  });
  xhr.open('POST', url);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader(
    'Accept',
    'application/json, text/javascript, */*; q=0.01'
  );
  xhr.send(data);
}

async function search({session, search, image, storageIds}) {
  image = await prepareImageForUpload({
    image,
    engine,
    target: 'api'
  });

  await searchApi({image, storageIds});
}

function init() {
  makeDocumentVisible();
  if (!window.location.pathname.startsWith('/showcaptcha')) {
    initSearch(search, engine, taskId);
  }
}

if (runOnce('search')) {
  init();
}
