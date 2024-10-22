// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import './index.css';

import { Document, Transaction } from "@gene/core";
import { BoxElement } from "./test_core/boxElement";

// createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//         <App />
//     </StrictMode>,
// );



// TEST-FRAMEWORK Transaction、Doc、Undo、Redo
const doc = new Document('test-doc');

// const transGroup = new TransactionGroup(doc,'test-gro');

const transaction = new Transaction(doc,'1');
const box = doc.create(BoxElement);
transaction.commit();

const transaction2 = new Transaction(doc,'2');
box.x = 30;
transaction2.commit();


// transGroup.assimilate();

console.log(doc);

window.doc = doc;


