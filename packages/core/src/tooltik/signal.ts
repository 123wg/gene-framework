import { I_SignalCallbackItem, I_SignalEvent, T_SignalCallbackFn } from "../type_define/type_define";

export class Signal<SubjectType, DataType> {
    public _callbacks:I_SignalCallbackItem<SubjectType,DataType>[] = [];

    constructor(public subject?:SubjectType){}

    public dispatch(data?:DataType) {
        const event:I_SignalEvent<SubjectType, DataType> = {
            data,
            subject:this.subject
        };

        for(const item of this._callbacks){
            try{
                if(item.listener){
                    item.fn.call(item.listener, event);
                }else {
                    item.fn(event);
                }
            }catch(e){
                console.error(e,'signal error');
            }
        }
    }

    public listen(fn:T_SignalCallbackFn<SubjectType,DataType>, listener?:unknown){
        const idx = this.getCallbackIndex(fn,listener);
        if(idx < 0) {
            this._callbacks.push({fn,listener});
        }
    }

    public unlisten(fn:T_SignalCallbackFn<SubjectType,DataType>,listener?:unknown) {
        const idx = this.getCallbackIndex(fn,listener);
        if(idx > 0){
            this._callbacks.splice(idx,1);
        }
    }

    public unlistenAll(){
        this._callbacks.length = 0;
    }

    public dispose(){
        this.unlistenAll();
        this.subject = undefined;
    }

    private getCallbackIndex(fn:T_SignalCallbackFn<SubjectType,DataType>,listener?:unknown) {
        return this._callbacks.findIndex(_=>{
            return _.fn === fn && _.listener === listener;
        });
    }
}
