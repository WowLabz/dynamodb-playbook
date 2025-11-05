from datetime import datetime

def order_pk(order_id:str)->str: return f"ORDER#{order_id}"

def order_sk_meta()->str: return "META"

def user_gsi_pk(user_id:str)->str: return f"USER#{user_id}"

def status_month_pk(status:str, yyyymm:str)->str: return f"STATUS#{status}#{yyyymm}"

def iso_now()->str: return datetime.utcnow().isoformat(timespec="seconds")+"Z"
