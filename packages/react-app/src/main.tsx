import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

class Testaa {
    private a: string = '1';
    protected b: string = '2';

    private _c: string = '3';

    public get c() {
        return this._c;
    }

    public ownKeys() {
        return Reflect.ownKeys(this);
    }
}

const s = new Testaa();
console.log(s.ownKeys());


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
