// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import './index.css';

import { TestUtil } from "./test_util";

// import { Document } from "@gene/core";
// import { app } from '@gene/platform';
// import { CreateBoxRequest } from "./test_core/create_box_request";

// import { Document } from "@gene/core";
// import { CreateBoxRequest } from "./test_core/create_box_request";

// createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//         <App />
//     </StrictMode>,
// );



// 测试1===================== Transaction、Doc、Undo、Redo
// const doc = new Document('test-doc');

// const transaction = new Transaction(doc,'1');
// const box = doc.create(BoxElement);
// transaction.commit();

// const transaction2 = new Transaction(doc,'2');
// box.x = 30;
// transaction2.commit();

// 测试2===================== Transaction、Doc、Undo、Redo
// const doc = new Document('test-doc');
// app.start(doc);
// app.requestMgr.startSession(doc);
// const req = new CreateBoxRequest(doc);
// app.requestMgr.commitRequest(req);
// app.requestMgr.commitSession();

// console.log(doc);

// doc.requestMgr.startSession(doc);

// doc.requestMgr.commitRequest(req);
// doc.requestMgr.commitSession();

// console.log(doc);

// window.doc = doc;

TestUtil.run();