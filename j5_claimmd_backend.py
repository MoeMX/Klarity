import os, httpx, xml.etree.ElementTree as ET
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
app = FastAPI(title="J5 Therapy Claim.MD Proxy")
ALLOWED = os.getenv("ALLOWED_ORIGINS","*").split(",")
app.add_middleware(CORSMiddleware,allow_origins=ALLOWED,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
CLAIMMD="https://svc.claim.md"
def get_key():
    k=os.getenv("CLAIMMD_ACCOUNT_KEY","")
    if not k: raise HTTPException(500,"Key not set")
    return k
def xml2d(s):
    try:
        r=ET.fromstring(s)
        def p(e): return {c.tag:p(c) if len(c) else c.text for c in e} or e.text
        return {r.tag:p(r)}
    except: return {"raw":s}
async def cmd(path,data):
    data["AccountKey"]=get_key()
    async with httpx.AsyncClient(timeout=30) as c:
        r=await c.post(f"{CLAIMMD}{path}",data=data)
        if "xml" in r.headers.get("content-type","") or r.text.strip().startswith("<"):
            return xml2d(r.text)
        try: return r.json()
        except: return {"response":r.text}
@app.get("/api/health")
async def health():
    k=os.getenv("CLAIMMD_ACCOUNT_KEY","")
    ok=False
    if k:
        try:
            async with httpx.AsyncClient(timeout=5) as c:
                r=await c.post(f"{CLAIMMD}/services/payerlist/",data={"AccountKey":k})
                ok=r.status_code<500
        except: pass
    return {"status":"ok","claimmd_connected":ok,"key_configured":bool(k)}
@app.post("/api/eligibility")
async def elig(req:Request): return await cmd("/services/eligdata/",dict(await req.form()))
@app.post("/api/claims/upload")
async def upload(req:Request): return await cmd("/services/upload/",dict(await req.form()))
@app.post("/api/claims/status")
async def status(req:Request): return await cmd("/services/response/",dict(await req.form()))
@app.get("/api/claims/payers")
async def payers(): return await cmd("/services/payerlist/",{})
@app.post("/api/era/list")
async def era(req:Request): return await cmd("/services/era/",dict(await req.form()))
@app.post("/api/era/details")
async def erad(req:Request): return await cmd("/services/eradata/",dict(await req.form()))
@app.post("/api/era/pdf")
async def erapdf(req:Request):
    d=dict(await req.form()); d["AccountKey"]=get_key()
    async with httpx.AsyncClient(timeout=30) as c:
        r=await c.post(f"{CLAIMMD}/services/erapdf/",data=d)
    return Response(content=r.content,media_type="application/pdf")

@app.post("/api/eligibility")
async def eligibility(req: Request):
    data = dict(await req.form())
    data["AccountKey"] = get_key()
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(
            f"{CLAIMMD}/services/eligdata/",
            data=data,
            headers={"Accept": "application/json"}
        )
    try:
        return JSONResponse({"result": r.json()})
    except Exception:
        return JSONResponse({"result": xml2d(r.text)})

@app.post("/api/enroll")
async def enroll(req:Request): return await cmd("/services/enroll/",dict(await req.form()))
@app.post("/api/appeal")
async def appeal(req:Request): return await cmd("/services/appeal/",dict(await req.form()))
@app.post("/api/claims/notes")
async def notes(req:Request): return await cmd("/services/notes/",dict(await req.form()))
