// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import './index.css';

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
// doc.requestMgr.startSession();
// const req = new CreateBoxRequest(doc);
// doc.requestMgr.commitRequest(req);
// doc.requestMgr.commitSession();

// console.log(doc);

// window.doc = doc;


