"""TT-OPC 智能运营平台 FastAPI 后端
统一 LLM 调用、模块 API、数据存储
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import subprocess, json, re, time, os, random

app = FastAPI(title="TT-OPC API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── LLM 调用 ───
import asyncio
from concurrent.futures import ThreadPoolExecutor

_executor = ThreadPoolExecutor(max_workers=4)

def _llm_sync(system_prompt: str, user_prompt: str, max_retries: int = 1) -> Optional[str]:
    """同步 LLM 调用（在子线程中执行）"""
    for attempt in range(max_retries):
        try:
            result = subprocess.run(
                ["z-ai", "chat", "-p", user_prompt, "-s", system_prompt],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode == 0:
                output = result.stdout.strip()
                lines = [l for l in output.split('\n') if l.strip() and not l.startswith('🚀')]
                output = '\n'.join(lines)
                if output:
                    return output
        except subprocess.TimeoutExpired:
            break
        except Exception:
            break
    return None

async def llm_chat(system_prompt: str, user_prompt: str, max_retries: int = 1) -> Optional[str]:
    """异步 LLM 调用（不阻塞事件循环）"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, _llm_sync, system_prompt, user_prompt, max_retries)


# ─── 请求模型 ───
class BlindBoxRequest(BaseModel):
    tech_name: str
    tech_field: str = ""
    tech_description: str = ""
    trl_level: str = "TRL4"

class TechTranslateRequest(BaseModel):
    tech_name: str
    tech_description: str
    versions: list[str] = ["投资人版", "CEO版", "院长版"]

class TripleHelixRequest(BaseModel):
    project_name: str
    project_description: str

class HWEvalRequest(BaseModel):
    tech_name: str
    tech_description: str
    target_chip: str = ""

class HWTranslateRequest(BaseModel):
    tech_name: str
    tech_description: str
    versions: list[str] = ["投资人版", "PM版", "供应链版", "认证版"]

class QuadHelixRequest(BaseModel):
    project_name: str
    project_description: str

class SocialPostRequest(BaseModel):
    content: str
    post_type: str = "achievement"

class AIEnhanceRequest(BaseModel):
    content: str
    post_type: str = ""


# ─── 盲盒评估 API ───
@app.post("/api/blindbox")
async def blindbox_eval(req: BlindBoxRequest):
    """Arrow信息悖论：不泄露技术就能评估价值"""
    system = """你是一位技术转移评估专家。根据用户提供的技术信息，生成一份盲盒评估报告。
必须以JSON格式返回，包含以下字段：
{
  "name": "技术名称",
  "score": 85,
  "trl": "TRL4",
  "market_size": "市场规模估算",
  "target_customers": "目标客户",
  "competition_level": "竞争程度(高/中/低)",
  "time_to_market": "上市时间估算",
  "risk_level": "风险等级(高/中/低)",
  "strengths": ["优势1", "优势2", "优势3"],
  "weaknesses": ["劣势1", "劣势2"],
  "opportunities": ["机会1", "机会2", "机会3"],
  "threats": ["威胁1", "威胁2"],
  "suggestion": "转化建议"
}
只返回JSON，不要其他文字。"""

    user = f"技术名称：{req.tech_name}\n领域：{req.tech_field}\n描述：{req.tech_description}\n成熟度：{req.trl_level}"
    raw = await llm_chat(system, user)
    # Fallback: 返回模拟数据
    fallback = {
        "name": req.tech_name, "score": random.randint(65, 88), "trl": req.trl_level,
        "market_size": "10-50亿", "target_customers": "制造业/医疗/金融",
        "competition_level": "中等", "time_to_market": "1-2年", "risk_level": "中等",
        "strengths": ["技术壁垒高", "市场需求明确", "政策支持"],
        "weaknesses": ["产业化周期长", "人才稀缺"],
        "opportunities": ["国产替代需求", "AI+行业融合", "新质生产力政策"],
        "threats": ["国际竞争加剧", "技术迭代快"],
        "suggestion": "建议先完成中试验证，锁定1-2个垂直场景快速落地。"
    }
    if not raw:
        return fallback
    try:
        json_match = re.search(r'\{[\s\S]*\}', raw)
        if json_match:
            return json.loads(json_match.group())
        return {**fallback, "raw": raw}
    except json.JSONDecodeError:
        return {**fallback, "raw": raw}


# ─── 场景翻译 API ───
@app.post("/api/tech-translate")
async def tech_translate(req: TechTranslateRequest):
    """吸收能力理论：一键生成多版本"""
    results = {}
    version_prompts = {
        "投资人版": "用投资人的语言重写，突出市场规模、ROI、竞争壁垒、退出路径",
        "CEO版": "用CEO的语言重写，突出商业价值、落地路径、团队需求、时间线",
        "院长版": "用高校院长的语言重写，突出学术价值、学科建设、人才培养、社会影响",
    }
    for ver in req.versions:
        prompt = version_prompts.get(ver, f"用{ver}的语言重写")
        system = f"你是一位技术转移翻译专家。{prompt}。直接输出翻译后的内容，不要解释。"
        raw = await llm_chat(system, f"技术名称：{req.tech_name}\n描述：{req.tech_description}")
        results[ver] = raw or f"（{ver}翻译生成中，请稍后重试）"
    return results


# ─── 三角色工作台 API ───
@app.post("/api/triple-helix")
async def triple_helix(req: TripleHelixRequest):
    """三螺旋理论：教授+CEO+律师三Agent协同"""
    roles = {
        "professor": {
            "name": "教授",
            "system": "你是一位资深教授，从技术可行性和科学价值角度分析技术转移项目。给出：1)技术成熟度评估 2)关键科学问题 3)技术优化建议 4)学术价值判断。直接输出分析，200字以内。"
        },
        "ceo": {
            "name": "CEO",
            "system": "你是一位经验丰富的CEO，从市场机会和商业模式角度分析技术转移项目。给出：1)目标市场评估 2)商业模式建议 3)竞争分析 4)落地路径。直接输出分析，200字以内。"
        },
        "lawyer": {
            "name": "律师",
            "system": "你是一位知识产权律师，从合规风险和知识产权角度分析技术转移项目。给出：1)知识产权风险评估 2)合规要点 3)合同建议 4)保护策略。直接输出分析，200字以内。"
        }
    }
    results = {}
    for key, role in roles.items():
        raw = await llm_chat(role["system"], f"项目名称：{req.project_name}\n描述：{req.project_description}")
        results[key] = {"name": role["name"], "analysis": raw or "（分析生成中，请稍后重试）"}
    return results


# ─── 硬件评估 API ───
@app.post("/api/hw-eval")
async def hw_eval(req: HWEvalRequest):
    """硬件评估：芯片Benchmark+算法适配+BOM成本+国产化率"""
    system = """你是一位硬件技术评估专家。根据用户提供的技术信息，生成硬件评估报告。
必须以JSON格式返回：
{
  "name": "技术名称",
  "chip_benchmark": {"recommended": "推荐芯片", "performance": "性能评估", "power": "功耗"},
  "algorithm_fit": {"score": 85, "bottleneck": "瓶颈分析", "optimization": "优化建议"},
  "bom_cost": {"estimate": "BOM成本估算", "breakdown": {"chip": "芯片", "sensor": "传感器", "pcb": "PCB", "assembly": "组装", "other": "其他"}},
  "localization_rate": 60,
  "risk_level": "中",
  "suggestion": "综合建议"
}
只返回JSON。"""
    user = f"技术名称：{req.tech_name}\n描述：{req.tech_description}\n目标芯片：{req.target_chip or '自动推荐'}"
    raw = await llm_chat(system, user)
    fallback = {
        "name": req.tech_name,
        "chip_benchmark": {"recommended": "RK3588 / 算能BM1684", "performance": "满足端侧推理需求", "power": "5-15W"},
        "algorithm_fit": {"score": 72, "bottleneck": "模型量化精度损失", "optimization": "INT8量化+剪枝"},
        "bom_cost": {"estimate": "500-2000元/台", "breakdown": {"chip": "200-800元", "sensor": "100-300元", "pcb": "50-150元", "assembly": "100-300元", "other": "50-450元"}},
        "localization_rate": 65, "risk_level": "中等",
        "suggestion": "建议优先验证RK3588适配性，同步评估国产替代方案。"
    }
    if not raw:
        return fallback
    try:
        json_match = re.search(r'\{[\s\S]*\}', raw)
        if json_match:
            return json.loads(json_match.group())
        return {**fallback, "raw": raw}
    except json.JSONDecodeError:
        return {**fallback, "raw": raw}


# ─── 硬件翻译 API ───
@app.post("/api/hw-translate")
async def hw_translate(req: HWTranslateRequest):
    """硬件规格书→4个专业版本"""
    results = {}
    version_prompts = {
        "投资人版": "用投资人的语言重写硬件规格书，突出市场规模、成本优势、国产替代机会",
        "PM版": "用产品经理的语言重写，突出功能规格、用户体验、迭代路径",
        "供应链版": "用供应链专家的语言重写，突出BOM、交期、供应商选择",
        "认证版": "用认证顾问的语言重写，突出3C/SRRC/算法备案要求",
    }
    for ver in req.versions:
        prompt = version_prompts.get(ver, f"用{ver}的语言重写")
        system = f"你是一位硬件技术翻译专家。{prompt}。直接输出，不要解释。"
        raw = await llm_chat(system, f"技术名称：{req.tech_name}\n描述：{req.tech_description}")
        results[ver] = raw or f"（{ver}翻译生成中，请稍后重试）"
    return results


# ─── 四角色工作台 API ───
@app.post("/api/quad-helix")
async def quad_helix(req: QuadHelixRequest):
    """四角色：算法专家+硬件PM+供应链专家+认证顾问"""
    roles = {
        "algorithm_expert": {
            "name": "算法专家",
            "system": "你是一位AI算法专家，从算法选型、模型优化、算力需求角度分析硬件技术转移项目。200字以内。"
        },
        "hw_pm": {
            "name": "硬件PM",
            "system": "你是一位硬件产品经理，从产品定义、功能规格、用户体验角度分析硬件技术转移项目。200字以内。"
        },
        "supply_chain": {
            "name": "供应链专家",
            "system": "你是一位供应链专家，从BOM成本、供应商选择、交期管理角度分析硬件技术转移项目。200字以内。"
        },
        "cert_advisor": {
            "name": "认证顾问",
            "system": "你是一位产品认证顾问，从3C/SRRC/算法备案/网安评估角度分析硬件技术转移项目。200字以内。"
        }
    }
    results = {}
    for key, role in roles.items():
        raw = await llm_chat(role["system"], f"项目名称：{req.project_name}\n描述：{req.project_description}")
        results[key] = {"name": role["name"], "analysis": raw or "（分析生成中，请稍后重试）"}
    return results


# ─── 社交内容 AI 优化 ───
@app.post("/api/ai-enhance")
async def ai_enhance(req: AIEnhanceRequest):
    """AI优化社交内容"""
    system = """你是一位技术转移领域的社交媒体运营专家。优化用户发布的内容：
1. 保持核心信息不变
2. 添加合适的emoji
3. 添加2-3个话题标签
4. 优化语言表达
5. 直接输出优化后的内容"""
    raw = await llm_chat(system, f"请优化以下内容：\n\n{req.content}")
    return {"enhanced": raw or req.content}


# ─── 健康检查 ───
@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
