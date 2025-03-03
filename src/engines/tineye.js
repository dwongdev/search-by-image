import {findNode, runOnce} from 'utils/common';
import {setFileInputData, initSearch, sendReceipt} from 'utils/engines';

const engine = 'tineye';

async function search({session, search, image, storageIds}) {
  const inputSelector = 'input#upload-box';
  const input = await findNode(inputSelector);

  await setFileInputData(inputSelector, input, image);

  await sendReceipt(storageIds);

  input.dispatchEvent(new Event('change'));
}

function init() {
  initSearch(search, engine, taskId);
}

if (runOnce('search')) {
  init();
}
