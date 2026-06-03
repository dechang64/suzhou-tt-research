"""TT-OPC 智能运营平台 FastAPI 后端 v3
策略：fallback 数据即时返回，LLM 通过独立端点可选调用
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import subprocess, json, re, time, os, random, asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI(title="TT-OPC API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_executor = ThreadPoolExecutor(max_workers=2)

def _llm_sync(system_prompt: str, user_prompt: str) -> Optional[str]:
    try:
        result = subprocess.run(
            ["z-ai", "chat", "-p", user_prompt, "-s", system_prompt],
            capture_output=True, text=True, timeout=45
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

# ─── 健康检查 ───
@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "3.0.0"}

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
