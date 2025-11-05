export const orderPK=(id:string)=>`ORDER#${id}`;
export const orderSKMeta=()=>"META";
export const userGSIPK=(u:string)=>`USER#${u}`;
export const statusMonthPK=(s:string,m:string)=>`STATUS#${s}#${m}`;
export const isoNow=()=>new Date().toISOString().replace(/\.\d{3}Z$/,'Z');
