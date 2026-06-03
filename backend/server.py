"""TT-OPC 智能运营平台 FastAPI 后端 v4
策略：fallback 即时返回 + LLM SSE 流式增强 + SQLite 持久化 + JWT 认证
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import subprocess, json, re, time, os, random, asyncio, sqlite3, hashlib, hmac
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager

app = FastAPI(title="TT-OPC API", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_executor = ThreadPoolExecutor(max_workers=4)

def _llm_sync(system_prompt: str, user_prompt: str) -> Optional[str]:
    try:
        result = subprocess.run(
            ["z-ai", "chat", "-p", user_prompt, "-s", system_prompt],
            capture_output=True, text=True, timeout=60
        )
        if result.returncode == 0:
            output = result.stdout.strip()
            lines = [l for l in output.split("\n") if l.strip() and not l.startswith("\U0001f680")]
            return "\n".join(lines) or None
    except:
        pass
    return None

async def llm_chat(system_prompt: str, user_prompt: str) -> Optional[str]:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, _llm_sync, system_prompt, user_prompt)

def _extract_json(raw: str) -> Optional[dict]:
    if not raw: return None
    try:
        m = re.search(r'\{[\s\S]*\}', raw)
        if m: return json.loads(m.group())
    except: pass
    return None

def sse(data: dict, event: str = "data") -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


# ─── 请求模型 ───
class BlindBoxRequest(BaseModel):
    tech_name: str; tech_field: str = ""; tech_description: str = ""; trl_level: str = "TRL4"
class TechTranslateRequest(BaseModel):
    tech_name: str; tech_description: str; versions: List[str] = ["投资人版", "CEO版", "院长版"]
class TripleHelixRequest(BaseModel):
    project_name: str; project_description: str
class HWEvalRequest(BaseModel):
    tech_name: str; tech_description: str; target_chip: str = ""
class HWTranslateRequest(BaseModel):
    tech_name: str; tech_description: str; versions: List[str] = ["投资人版", "PM版", "供应链版", "认证版"]
class QuadHelixRequest(BaseModel):
    project_name: str; project_description: str
class AIEnhanceRequest(BaseModel):
    content: str


# ─── 盲盒评估 ───
@app.post("/api/blindbox")
async def blindbox(req: BlindBoxRequest):
    return {
        "name": req.tech_name, "score": random.randint(65, 88), "trl": req.trl_level,
        "market_size": "10-50亿", "target_customers": "制造业/医疗/金融",
        "competition_level": "中等", "time_to_market": "1-2年", "risk_level": "中等",
        "strengths": ["技术壁垒高", "市场需求明确", "政策支持"],
        "weaknesses": ["产业化周期长", "人才稀缺"],
        "opportunities": ["国产替代需求", "AI+行业融合", "新质生产力政策"],
        "threats": ["国际竞争加剧", "技术迭代快"],
        "suggestion": "建议先完成中试验证，锁定1-2个垂直场景快速落地。",
        "source": "fallback"
    }

# ─── 场景翻译 ───
@app.post("/api/tech-translate")
async def tech_translate(req: TechTranslateRequest):
    fallbacks = {
        "投资人版": f"【{req.tech_name}】市场规模超10亿，技术壁垒高，先发优势明显。预计ROI 3-5倍，建议A轮进入，3年内退出。核心风险：技术迭代速度。",
        "CEO版": f"【{req.tech_name}】落地路径清晰：6个月MVP→12个月标杆客户→18个月规模化。团队需补充商务负责人，预算500万启动。",
        "院长版": f"【{req.tech_name}】学术价值显著，可支撑2-3个国家级项目。建议联合产业界申报重点研发计划，培养交叉学科人才。",
    }
    return {ver: fallbacks.get(ver, f"（{ver}版本生成中）") for ver in req.versions}

# ─── 三角色工作台 ───
@app.post("/api/triple-helix")
async def triple_helix(req: TripleHelixRequest):
    return {
        "professor": {"name": "教授", "analysis": f"【{req.project_name}】技术可行性高，建议补充实验验证数据。核心创新点明确，可申报发明专利。TRL评估：4-5级，需6-12个月提升至TRL6。"},
        "ceo": {"name": "CEO", "analysis": f"【{req.project_name}】市场窗口期明确，建议锁定1-2个垂直场景快速验证。商业模式：技术授权+服务订阅。预计首年营收200-500万。"},
        "lawyer": {"name": "律师", "analysis": f"【{req.project_name}】知识产权归属需明确，建议先申请核心专利再启动转化。合同设计注意技术秘密保护条款，NDA模板已备。"},
    }

# ─── 硬件评估 ───
@app.post("/api/hw-eval")
async def hw_eval(req: HWEvalRequest):
    return {
        "name": req.tech_name,
        "chip_benchmark": {"recommended": "RK3588 / 算能BM1684", "performance": "满足端侧推理需求", "power": "5-15W"},
        "algorithm_fit": {"score": 72, "bottleneck": "模型量化精度损失", "optimization": "INT8量化+剪枝"},
        "bom_cost": {"estimate": "500-2000元/台", "breakdown": {"chip": "200-800元", "sensor": "100-300元", "pcb": "50-150元", "assembly": "100-300元", "other": "50-450元"}},
        "localization_rate": 65, "risk_level": "中等",
        "suggestion": "建议优先验证RK3588适配性，同步评估国产替代方案。",
        "source": "fallback"
    }

# ─── 硬件翻译 ───
@app.post("/api/hw-translate")
async def hw_translate(req: HWTranslateRequest):
    fallbacks = {
        "投资人版": f"【{req.tech_name}】硬件方案成熟，BOM成本可控，量产周期6-9个月。市场规模50亿+，国产替代空间大。",
        "PM版": f"【{req.tech_name}】产品定义：端侧AI推理设备，支持多模态输入。核心功能：实时推理<100ms，功耗<15W，尺寸<10x10cm。",
        "供应链版": f"【{req.tech_name}】BOM预估800-1500元，核心器件国产化率65%。交期：RK3588 8周，PCB 2周，组装1周。",
        "认证版": f"【{req.tech_name}】需3C认证（4-6个月）+ SRRC核准（2-3个月）+ 算法备案（1-2个月）。建议并行申请。",
    }
    return {ver: fallbacks.get(ver, f"（{ver}版本生成中）") for ver in req.versions}

# ─── 四角色工作台 ───
@app.post("/api/quad-helix")
async def quad_helix(req: QuadHelixRequest):
    return {
        "algorithm_expert": {"name": "算法专家", "analysis": f"【{req.project_name}】推荐ONNX Runtime + TensorRT部署方案，INT8量化后推理速度提升3倍。算力需求：6 TOPS以上。"},
        "hw_pm": {"name": "硬件PM", "analysis": f"【{req.project_name}】建议EVT阶段3个月验证核心功能，DVT 2个月优化设计，PVT 1个月量产验证。总周期6个月。"},
        "supply_chain": {"name": "供应链专家", "analysis": f"【{req.project_name}】核心器件2-3家备选供应商，BOM成本可优化15-20%。建议签订框架协议锁定价格。"},
        "cert_advisor": {"name": "认证顾问", "analysis": f"【{req.project_name}】3C认证+SRRC+算法备案三证并行，总周期4-6个月。费用预估8-15万。"},
    }

# ─── 社交内容 AI 优化 ───
@app.post("/api/ai-enhance")
async def ai_enhance(req: AIEnhanceRequest):
    return {"enhanced": req.content + " #技术转移 #OPC #AI赋能"}

# ═══════════════════════════════════════════════════════════════
# 1. LLM SSE 流式增强端点
# ═══════════════════════════════════════════════════════════════

@app.post("/api/llm/blindbox")
async def llm_blindbox(req: BlindBoxRequest):
    """LLM增强盲盒评估（SSE流式）"""
    async def gen():
        system = """你是技术转移评估专家。生成盲盒评估JSON：
{"name":"技术名称","score":85,"trl":"TRL4","market_size":"10-50亿","target_customers":"目标客户","competition_level":"中等","time_to_market":"1-2年","risk_level":"中等","strengths":["优势1","优势2","优势3"],"weaknesses":["劣势1","劣势2"],"opportunities":["机会1","机会2","机会3"],"threats":["威胁1","威胁2"],"suggestion":"转化建议"}
只返回JSON。"""
        raw = await llm_chat(system, f"技术名称：{req.tech_name}\n领域：{req.tech_field}\n描述：{req.tech_description}\n成熟度：{req.trl_level}")
        data = _extract_json(raw)
        if data:
            yield sse({**data, "source": "llm"}, "result")
        elif raw:
            yield sse({"raw": raw, "source": "llm"}, "result")
    return StreamingResponse(gen(), media_type="text/event-stream")

@app.post("/api/llm/tech-translate")
async def llm_tech_translate(req: TechTranslateRequest):
    """LLM增强场景翻译（SSE流式，逐版本推送）"""
    prompts = {
        "投资人版": "用投资人语言重写，突出市场规模、ROI、竞争壁垒",
        "CEO版": "用CEO语言重写，突出商业价值、落地路径、时间线",
        "院长版": "用院长语言重写，突出学术价值、学科建设、社会影响",
    }
    async def gen():
        for ver in req.versions:
            p = prompts.get(ver, f"用{ver}语言重写")
            raw = await llm_chat(f"你是技术转移翻译专家。{p}。直接输出，不要解释。",
                                 f"技术名称：{req.tech_name}\n描述：{req.tech_description}")
            yield sse({"version": ver, "content": raw or f"（{ver}LLM生成失败）", "source": "llm"}, "result")
    return StreamingResponse(gen(), media_type="text/event-stream")

@app.post("/api/llm/triple-helix")
async def llm_triple_helix(req: TripleHelixRequest):
    """LLM增强三角色工作台（SSE流式，逐角色推送）"""
    roles = {
        "professor": {"name": "教授", "system": "你是资深教授，从技术可行性和科学价值角度分析技术转移项目。200字以内。"},
        "ceo": {"name": "CEO", "system": "你是创业CEO，从市场机会和商业模式角度分析技术转移项目。200字以内。"},
        "lawyer": {"name": "律师", "system": "你是知识产权律师，从合规风险和知识产权角度分析技术转移项目。200字以内。"},
    }
    async def gen():
        for key, role in roles.items():
            raw = await llm_chat(role["system"], f"项目名称：{req.project_name}\n描述：{req.project_description}")
            yield sse({"role": key, "name": role["name"], "analysis": raw or "（LLM分析失败）", "source": "llm"}, "result")
    return StreamingResponse(gen(), media_type="text/event-stream")

@app.post("/api/llm/hw-eval")
async def llm_hw_eval(req: HWEvalRequest):
    """LLM增强硬件评估（SSE流式）"""
    async def gen():
        system = """你是硬件技术评估专家。生成硬件评估JSON：
{"name":"技术名称","chip_benchmark":{"recommended":"推荐芯片","performance":"性能","power":"功耗"},"algorithm_fit":{"score":85,"bottleneck":"瓶颈","optimization":"优化"},"bom_cost":{"estimate":"成本","breakdown":{"chip":"芯片","sensor":"传感器","pcb":"PCB","assembly":"组装","other":"其他"}},"localization_rate":60,"risk_level":"中","suggestion":"建议"}
只返回JSON。"""
        raw = await llm_chat(system, f"技术名称：{req.tech_name}\n描述：{req.tech_description}\n目标芯片：{req.target_chip or '自动推荐'}")
        data = _extract_json(raw)
        if data:
            yield sse({**data, "source": "llm"}, "result")
    return StreamingResponse(gen(), media_type="text/event-stream")

@app.post("/api/llm/hw-translate")
async def llm_hw_translate(req: HWTranslateRequest):
    """LLM增强硬件翻译（SSE流式）"""
    prompts = {
        "投资人版": "用投资人语言重写硬件规格书，突出市场规模、成本优势",
        "PM版": "用产品经理语言重写，突出功能规格、用户体验",
        "供应链版": "用供应链专家语言重写，突出BOM、交期",
        "认证版": "用认证顾问语言重写，突出3C/SRRC/算法备案",
    }
    async def gen():
        for ver in req.versions:
            p = prompts.get(ver, f"用{ver}语言重写")
            raw = await llm_chat(f"你是硬件技术翻译专家。{p}。直接输出，不要解释。",
                                 f"技术名称：{req.tech_name}\n描述：{req.tech_description}")
            yield sse({"version": ver, "content": raw or f"（{ver}LLM生成失败）", "source": "llm"}, "result")
    return StreamingResponse(gen(), media_type="text/event-stream")

@app.post("/api/llm/quad-helix")
async def llm_quad_helix(req: QuadHelixRequest):
    """LLM增强四角色工作台（SSE流式）"""
    roles = {
        "algorithm_expert": {"name": "算法专家", "system": "你是AI算法专家，从算法选型、算力需求角度分析硬件技术转移项目。200字以内。"},
        "hw_pm": {"name": "硬件PM", "system": "你是硬件产品经理，从产品定义、用户体验角度分析硬件技术转移项目。200字以内。"},
        "supply_chain": {"name": "供应链专家", "system": "你是供应链专家，从BOM成本、供应商选择角度分析硬件技术转移项目。200字以内。"},
        "cert_advisor": {"name": "认证顾问", "system": "你是产品认证顾问，从3C/SRRC/算法备案角度分析硬件技术转移项目。200字以内。"},
    }
    async def gen():
        for key, role in roles.items():
            raw = await llm_chat(role["system"], f"项目名称：{req.project_name}\n描述：{req.project_description}")
            yield sse({"role": key, "name": role["name"], "analysis": raw or "（LLM分析失败）", "source": "llm"}, "result")
    return StreamingResponse(gen(), media_type="text/event-stream")


# ═══════════════════════════════════════════════════════════════
# 2. 地图数据（技术转移区域分布）
# ═══════════════════════════════════════════════════════════════

@app.get("/api/map-data")
async def map_data():
    """中国各省技术转移热力图数据"""
    provinces = [
        {"name": "北京", "value": 92, "patents": 128000, "transfers": 4500, "institutes": 89, "coord": [116.4, 39.9]},
        {"name": "上海", "value": 88, "patents": 95000, "transfers": 3800, "institutes": 72, "coord": [121.5, 31.2]},
        {"name": "广东", "value": 85, "patents": 110000, "transfers": 4200, "institutes": 65, "coord": [113.3, 23.1]},
        {"name": "江苏", "value": 82, "patents": 88000, "transfers": 3600, "institutes": 68, "coord": [118.8, 32.1]},
        {"name": "浙江", "value": 78, "patents": 72000, "transfers": 2900, "institutes": 55, "coord": [120.2, 30.3]},
        {"name": "湖北", "value": 65, "patents": 45000, "transfers": 1800, "institutes": 42, "coord": [114.3, 30.6]},
        {"name": "四川", "value": 62, "patents": 42000, "transfers": 1600, "institutes": 38, "coord": [104.1, 30.7]},
        {"name": "陕西", "value": 60, "patents": 38000, "transfers": 1400, "institutes": 35, "coord": [108.9, 34.3]},
        {"name": "山东", "value": 58, "patents": 40000, "transfers": 1500, "institutes": 32, "coord": [117.0, 36.7]},
        {"name": "安徽", "value": 55, "patents": 35000, "transfers": 1300, "institutes": 28, "coord": [117.3, 31.8]},
        {"name": "湖南", "value": 52, "patents": 32000, "transfers": 1200, "institutes": 26, "coord": [112.9, 28.2]},
        {"name": "福建", "value": 50, "patents": 28000, "transfers": 1000, "institutes": 22, "coord": [119.3, 26.1]},
        {"name": "辽宁", "value": 48, "patents": 30000, "transfers": 900, "institutes": 24, "coord": [123.4, 41.8]},
        {"name": "天津", "value": 55, "patents": 33000, "transfers": 1200, "institutes": 25, "coord": [117.2, 39.1]},
        {"name": "重庆", "value": 50, "patents": 28000, "transfers": 950, "institutes": 20, "coord": [106.5, 29.6]},
        {"name": "河南", "value": 42, "patents": 25000, "transfers": 800, "institutes": 18, "coord": [113.7, 34.8]},
        {"name": "河北", "value": 38, "patents": 22000, "transfers": 700, "institutes": 16, "coord": [114.5, 38.0]},
        {"name": "江西", "value": 35, "patents": 18000, "transfers": 600, "institutes": 14, "coord": [115.9, 28.7]},
        {"name": "吉林", "value": 35, "patents": 18000, "transfers": 550, "institutes": 15, "coord": [125.3, 43.9]},
        {"name": "黑龙江", "value": 32, "patents": 16000, "transfers": 500, "institutes": 14, "coord": [126.6, 45.8]},
        {"name": "广西", "value": 30, "patents": 14000, "transfers": 450, "institutes": 12, "coord": [108.3, 22.8]},
        {"name": "云南", "value": 28, "patents": 12000, "transfers": 380, "institutes": 10, "coord": [102.7, 25.0]},
        {"name": "贵州", "value": 25, "patents": 10000, "transfers": 320, "institutes": 8, "coord": [106.7, 26.6]},
        {"name": "甘肃", "value": 22, "patents": 8000, "transfers": 250, "institutes": 7, "coord": [103.8, 36.1]},
        {"name": "海南", "value": 20, "patents": 6000, "transfers": 200, "institutes": 5, "coord": [110.3, 20.0]},
        {"name": "内蒙古", "value": 20, "patents": 7000, "transfers": 220, "institutes": 6, "coord": [111.7, 40.8]},
        {"name": "新疆", "value": 18, "patents": 5000, "transfers": 150, "institutes": 5, "coord": [87.6, 43.8]},
        {"name": "宁夏", "value": 15, "patents": 3000, "transfers": 100, "institutes": 3, "coord": [106.3, 38.5]},
        {"name": "青海", "value": 12, "patents": 2000, "transfers": 60, "institutes": 2, "coord": [101.8, 36.6]},
        {"name": "西藏", "value": 8, "patents": 800, "transfers": 20, "institutes": 1, "coord": [91.1, 29.7]},
        {"name": "山西", "value": 38, "patents": 22000, "transfers": 700, "institutes": 15, "coord": [112.5, 37.9]},
    ]
    return {"provinces": provinces, "updated": datetime.now().isoformat()}


# ═══════════════════════════════════════════════════════════════
# 3. SQLite 数据持久化
# ═══════════════════════════════════════════════════════════════

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "tt_opc.db")

def _get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def _init_db():
    conn = _get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS evaluations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT DEFAULT 'anonymous',
            type TEXT NOT NULL,
            input_json TEXT NOT NULL,
            result_json TEXT NOT NULL,
            source TEXT DEFAULT 'fallback',
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE INDEX IF NOT EXISTS idx_eval_type ON evaluations(type);
        CREATE INDEX IF NOT EXISTS idx_eval_user ON evaluations(user_id);
    """)
    conn.commit()
    conn.close()

_init_db()

class SaveEvalRequest(BaseModel):
    type: str; input_data: dict; result_data: dict; source: str = "fallback"; user_id: str = "anonymous"

@app.post("/api/evaluations")
async def save_evaluation(req: SaveEvalRequest):
    conn = _get_db()
    conn.execute("INSERT INTO evaluations (user_id, type, input_json, result_json, source) VALUES (?, ?, ?, ?, ?)",
                 (req.user_id, req.type, json.dumps(req.input_data, ensure_ascii=False), json.dumps(req.result_data, ensure_ascii=False), req.source))
    conn.commit()
    eid = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    conn.close()
    return {"id": eid, "status": "saved"}

@app.get("/api/evaluations")
async def list_evaluations(type: str = None, limit: int = 20, user_id: str = None):
    conn = _get_db()
    q = "SELECT * FROM evaluations WHERE 1=1"
    params = []
    if type: q += " AND type=?"; params.append(type)
    if user_id: q += " AND user_id=?"; params.append(user_id)
    q += " ORDER BY created_at DESC LIMIT ?"; params.append(limit)
    rows = conn.execute(q, params).fetchall()
    conn.close()
    return [{"id": r["id"], "type": r["type"], "input": json.loads(r["input_json"]),
             "result": json.loads(r["result_json"]), "source": r["source"], "created_at": r["created_at"]} for r in rows]

@app.delete("/api/evaluations/{eval_id}")
async def delete_evaluation(eval_id: int):
    conn = _get_db()
    conn.execute("DELETE FROM evaluations WHERE id=?", (eval_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}


# ═══════════════════════════════════════════════════════════════
# 4. JWT 用户认证
# ═══════════════════════════════════════════════════════════════

JWT_SECRET = os.environ.get("JWT_SECRET", "tt-opc-secret-change-in-production")
JWT_ALGO = "HS256"

def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def _create_token(username: str, role: str = "user") -> str:
    import base64
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    payload = base64.urlsafe_b64encode(json.dumps({"sub": username, "role": role, "exp": (datetime.now() + timedelta(days=7)).isoformat()}).encode()).decode().rstrip("=")
    sig = hmac.new(JWT_SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).hexdigest()
    return f"{header}.{payload}.{sig}"

def _verify_token(token: str) -> Optional[dict]:
    try:
        parts = token.split(".")
        if len(parts) != 3: return None
        sig = hmac.new(JWT_SECRET.encode(), f"{parts[0]}.{parts[1]}".encode(), hashlib.sha256).hexdigest()
        if sig != parts[2]: return None
        import base64
        padding = 4 - len(parts[1]) % 4
        payload = json.loads(base64.urlsafe_b64decode(parts[1] + "=" * padding))
        if datetime.fromisoformat(payload["exp"]) < datetime.now(): return None
        return payload
    except:
        return None

class LoginRequest(BaseModel):
    username: str; password: str

class RegisterRequest(BaseModel):
    username: str; password: str; role: str = "user"

@app.post("/api/auth/register")
async def register(req: RegisterRequest):
    conn = _get_db()
    try:
        conn.execute("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
                     (req.username, _hash_password(req.password), req.role))
        conn.commit()
        token = _create_token(req.username, req.role)
        conn.close()
        return {"token": token, "username": req.username, "role": req.role}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(400, "用户名已存在")

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    conn = _get_db()
    row = conn.execute("SELECT * FROM users WHERE username=?", (req.username,)).fetchone()
    conn.close()
    if not row or row["password_hash"] != _hash_password(req.password):
        raise HTTPException(401, "用户名或密码错误")
    token = _create_token(req.username, row["role"])
    return {"token": token, "username": req.username, "role": row["role"]}

@app.get("/api/auth/me")
async def me(token: str = ""):
    payload = _verify_token(token)
    if not payload: raise HTTPException(401, "无效或过期的token")
    return payload

# ─── 健康检查 ───
@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "4.0.0"}

# ─── 静态文件（生产模式） ───
# 必须放在所有 API 路由之后
DIST = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "dist"))

@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(DIST, "index.html"))

@app.get("/favicon.svg")
async def serve_favicon():
    return FileResponse(os.path.join(DIST, "favicon.svg"))

@app.get("/icons.svg")
async def serve_icons():
    return FileResponse(os.path.join(DIST, "icons.svg"))

# Mount assets last
if os.path.isdir(os.path.join(DIST, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST, "assets")), name="assets")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
