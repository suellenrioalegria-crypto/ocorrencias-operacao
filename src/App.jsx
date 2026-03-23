// v2
import { useState, useEffect } from “react”;

const SUPABASE_URL = “https://todgsejcpjqucqaqfuiq.supabase.co”;
const SUPABASE_KEY = “sb_publishable_sbromroHxLUmPj2OOGIC8Q_4OIzdX5h”;

const headers = {
“Content-Type”: “application/json”,
“apikey”: SUPABASE_KEY,
“Authorization”: Bearer ${SUPABASE_KEY},
“Prefer”: “return=representation”,
};

async function dbBuscar(filtros = {}) {
let url = ${SUPABASE_URL}/rest/v1/ocorrencias?order=criado_em.desc;
if (filtros.destino) url += &destino=eq.${encodeURIComponent(filtros.destino)};
if (filtros.status) url += &status=eq.${encodeURIComponent(filtros.status)};
if (filtros.tipo) url += &tipo=eq.${encodeURIComponent(filtros.tipo)};
const res = await fetch(url, { headers });
if (!res.ok) throw new Error(“Erro ao buscar”);
return res.json();
}

async function dbInserir(dados) {
const res = await fetch(${SUPABASE_URL}/rest/v1/ocorrencias, {
method: “POST”, headers, body: JSON.stringify(dados),
});
if (!res.ok) throw new Error(“Erro ao salvar”);
return res.json();
}

async function dbAtualizar(id, dados) {
const res = await fetch(${SUPABASE_URL}/rest/v1/ocorrencias?id=eq.${id}, {
method: “PATCH”, headers, body: JSON.stringify(dados),
});
if (!res.ok) throw new Error(“Erro ao atualizar”);
return res.json();
}

async function dbExcluir(id) {
const res = await fetch(${SUPABASE_URL}/rest/v1/ocorrencias?id=eq.${id}, {
method: “DELETE”, headers,
});
if (!res.ok) throw new Error(“Erro ao excluir”);
}

const DESTINOS = [“Arraial do Cabo”, “Angra dos Reis”, “Ilha Grande”, “Paraty”, “Outro”];
const TIPOS = [“Atraso de guia”, “Problema no ônibus”, “Problema no barco”, “Problema com hospedagem”, “Reclamação de passageiro”, “Acidente/Incidente”, “Problema climático”, “Outro”];
const STATUS = [“Em aberto”, “Resolvido”, “Sem solução”];

const STATUS_STYLE = {
“Em aberto”:   { bg: “#2D2200”, text: “#FFB800”, border: “#5C4400” },
“Resolvido”:   { bg: “#0D2D1A”, text: “#4ADE80”, border: “#1A5C34” },
“Sem solução”: { bg: “#2D0D0D”, text: “#FF6B6B”, border: “#5C1A1A” },
};

const TIPO_ICONE = {
“Atraso de guia”: “⏰”, “Problema no ônibus”: “🚌”, “Problema no barco”: “⛵”,
“Problema com hospedagem”: “🏨”, “Reclamação de passageiro”: “😤”,
“Acidente/Incidente”: “⚠️”, “Problema climático”: “🌧️”, “Outro”: “📋”,
};

function dataHoje() { return new Date().toISOString().split(“T”)[0]; }
function formatarData(iso) {
if (!iso) return “-”;
const [y, m, d] = iso.split(”-”);
return ${d}/${m}/${y};
}
function formVazio() {
return { data: dataHoje(), destino: “”, tipo: “”, guia: “”, descricao: “”, status: “Em aberto”, solucao: “”, tem_reclamacao: false, reclamacoes: [] };
}

const S = {
app: { fontFamily: “‘DM Sans’, sans-serif”, minHeight: “100vh”, background: “#080A0F”, color: “#E2E8F0” },
header: {
background: “rgba(10,13,20,0.97)”, backdropFilter: “blur(12px)”,
borderBottom: “1px solid #1E2535”, padding: “0 20px”,
display: “flex”, alignItems: “center”, justifyContent: “space-between”,
height: 60, position: “sticky”, top: 0, zIndex: 100,
},
logo: { display: “flex”, alignItems: “center”, gap: 10 },
logoMark: {
width: 34, height: 34, borderRadius: 9,
background: “linear-gradient(135deg, #F97316 0%, #EF4444 100%)”,
display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 17,
},
logoText: { fontSize: 15, fontWeight: 700, letterSpacing: “-0.3px”, color: “#F1F5F9” },
nav: { display: “flex”, gap: 4, alignItems: “center” },
navBtn: (a) => ({
padding: “6px 12px”, borderRadius: 7, border: “none”, cursor: “pointer”,
fontSize: 12, fontWeight: 600, transition: “all 0.15s”,
background: a ? “rgba(249,115,22,0.15)” : “transparent”,
color: a ? “#F97316” : “#64748B”,
}),
main: { maxWidth: 860, margin: “0 auto”, padding: “20px 14px” },
card: {
background: “#0D1117”, border: “1px solid #1E2535”, borderRadius: 12,
padding: “16px 18px”, marginBottom: 10, cursor: “pointer”,
transition: “border-color 0.15s, transform 0.15s”,
},
infoCard: { background: “#0D1117”, border: “1px solid #1E2535”, borderRadius: 12, padding: “18px 20px”, marginBottom: 12 },
badge: (s) => ({
display: “inline-flex”, alignItems: “center”, padding: “3px 9px”,
borderRadius: 20, fontSize: 11, fontWeight: 700,
background: STATUS_STYLE[s]?.bg || “#1E2535”,
color: STATUS_STYLE[s]?.text || “#94A3B8”,
border: 1px solid ${STATUS_STYLE[s]?.border || "#2A3547"},
}),
input: {
width: “100%”, background: “#080A0F”, border: “1px solid #1E2535”,
borderRadius: 8, padding: “9px 12px”, color: “#E2E8F0”, fontSize: 14,
outline: “none”, boxSizing: “border-box”,
},
label: { fontSize: 11, fontWeight: 700, color: “#475569”, marginBottom: 5, display: “block”, textTransform: “uppercase”, letterSpacing: “0.6px” },
btnPrimary: { background: “linear-gradient(135deg, #F97316, #EF4444)”, color: “#FFF”, border: “none”, borderRadius: 8, padding: “10px 20px”, fontSize: 13, fontWeight: 700, cursor: “pointer” },
btnSecondary: { background: “#1E2535”, color: “#94A3B8”, border: “none”, borderRadius: 8, padding: “10px 20px”, fontSize: 13, fontWeight: 600, cursor: “pointer” },
btnDanger: { background: “#2D0D0D”, color: “#FF6B6B”, border: “1px solid #5C1A1A”, borderRadius: 8, padding: “10px 20px”, fontSize: 13, fontWeight: 600, cursor: “pointer” },
grid2: { display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 12 },
divider: { border: “none”, borderTop: “1px solid #1E2535”, margin: “16px 0” },
toast: {
position: “fixed”, bottom: 24, left: “50%”, transform: “translateX(-50%)”,
background: “#1E2535”, color: “#E2E8F0”, padding: “10px 20px”,
borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 999,
border: “1px solid #2A3547”, boxShadow: “0 8px 30px rgba(0,0,0,0.5)”, whiteSpace: “nowrap”,
},
};

export default function App() {
const [ocs, setOcs] = useState([]);
const [loading, setLoading] = useState(true);
const [tela, setTela] = useState(“lista”);
const [selecionada, setSelecionada] = useState(null);
const [filtros, setFiltros] = useState({ destino: “”, status: “”, tipo: “” });
const [busca, setBusca] = useState(””);
const [form, setForm] = useState(formVazio());
const [salvando, setSalvando] = useState(false);
const [reclamacaoTexto, setReclamacaoTexto] = useState(””);
const [statusEdit, setStatusEdit] = useState(””);
const [solucaoEdit, setSolucaoEdit] = useState(””);
const [toast, setToast] = useState(null);
const [erroConexao, setErroConexao] = useState(false);

function mostrarToast(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }

async function carregar() {
setLoading(true); setErroConexao(false);
try { setOcs(await dbBuscar(filtros)); }
catch { setErroConexao(true); }
finally { setLoading(false); }
}

useEffect(() => { carregar(); }, [filtros]);

async function salvarNova() {
if (!form.destino || !form.tipo || !form.descricao.trim()) { mostrarToast(“⚠️ Preencha destino, tipo e descrição”); return; }
setSalvando(true);
try {
await dbInserir({ …form, reclamacoes: JSON.stringify(form.reclamacoes) });
mostrarToast(“✅ Ocorrência registrada!”); setForm(formVazio()); setTela(“lista”); carregar();
} catch { mostrarToast(“❌ Erro ao salvar.”); }
finally { setSalvando(false); }
}

async function salvarAtualizacao() {
setSalvando(true);
try { await dbAtualizar(selecionada, { status: statusEdit, solucao: solucaoEdit }); mostrarToast(“✅ Atualizado!”); carregar(); setTela(“lista”); }
catch { mostrarToast(“❌ Erro ao atualizar.”); }
finally { setSalvando(false); }
}

async function adicionarReclamacao() {
if (!reclamacaoTexto.trim()) return;
const oc = ocs.find(o => o.id === selecionada);
const lista = Array.isArray(oc.reclamacoes) ? oc.reclamacoes : JSON.parse(oc.reclamacoes || “[]”);
const novas = […lista, { texto: reclamacaoTexto.trim(), data: new Date().toISOString() }];
try {
await dbAtualizar(selecionada, { tem_reclamacao: true, reclamacoes: JSON.stringify(novas) });
setReclamacaoTexto(””); mostrarToast(“🚨 Reclamação registrada!”); carregar();
} catch { mostrarToast(“❌ Erro ao registrar.”); }
}

async function excluir(id) {
if (!confirm(“Excluir esta ocorrência?”)) return;
try { await dbExcluir(id); mostrarToast(“🗑️ Excluída.”); setTela(“lista”); carregar(); }
catch { mostrarToast(“❌ Erro ao excluir.”); }
}

const ocFiltradas = ocs.filter(o => !busca || ${o.descricao} ${o.guia} ${o.destino} ${o.tipo}.toLowerCase().includes(busca.toLowerCase()));
const agora = new Date();
const totalMes = ocs.filter(o => { const d = new Date(o.data); return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear(); }).length;
const comReclamacao = ocs.filter(o => o.tem_reclamacao).length;
const semSolucao = ocs.filter(o => o.status === “Sem solução”).length;
const emAberto = ocs.filter(o => o.status === “Em aberto”).length;
const porTipo = TIPOS.map(t => ({ tipo: t, qt: ocs.filter(o => o.tipo === t).length })).filter(x => x.qt > 0).sort((a, b) => b.qt - a.qt);
const porDestino = DESTINOS.map(d => ({ dest: d, qt: ocs.filter(o => o.destino === d).length })).filter(x => x.qt > 0);

// NOVA
if (tela === “nova”) return (
<div style={S.app}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
{toast && <div style={S.toast}>{toast}</div>}
<div style={S.header}>
<div style={S.logo}><div style={S.logoMark}>⚡</div><span style={S.logoText}>Nova Ocorrência</span></div>
<button style={S.btnSecondary} onClick={() => { setForm(formVazio()); setTela(“lista”); }}>← Voltar</button>
</div>
<div style={S.main}>
<div style={S.infoCard}>
<div style={S.grid2}>
<div><label style={S.label}>Data *</label><input type=“date” style={S.input} value={form.data} onChange={e => setForm(f => ({ …f, data: e.target.value }))} /></div>
<div><label style={S.label}>Destino *</label>
<select style={S.input} value={form.destino} onChange={e => setForm(f => ({ …f, destino: e.target.value }))}>
<option value="">Selecione…</option>{DESTINOS.map(d => <option key={d}>{d}</option>)}
</select>
</div>
<div><label style={S.label}>Tipo *</label>
<select style={S.input} value={form.tipo} onChange={e => setForm(f => ({ …f, tipo: e.target.value }))}>
<option value="">Selecione…</option>{TIPOS.map(t => <option key={t}>{TIPO_ICONE[t]} {t}</option>)}
</select>
</div>
<div><label style={S.label}>Guia Responsável</label><input style={S.input} placeholder=“Nome do guia” value={form.guia} onChange={e => setForm(f => ({ …f, guia: e.target.value }))} /></div>
</div>
<div style={{ marginTop: 12 }}>
<label style={S.label}>Descrição *</label>
<textarea style={{ …S.input, minHeight: 90, resize: “vertical” }} placeholder=“O que aconteceu? Descreva com detalhes…” value={form.descricao} onChange={e => setForm(f => ({ …f, descricao: e.target.value }))} />
</div>
<div style={{ marginTop: 12 }}>
<label style={S.label}>Status</label>
<div style={{ display: “flex”, gap: 8, flexWrap: “wrap” }}>
{STATUS.map(s => <button key={s} onClick={() => setForm(f => ({ …f, status: s }))} style={{ …(form.status === s ? S.btnPrimary : S.btnSecondary), padding: “7px 14px”, fontSize: 12 }}>{s}</button>)}
</div>
</div>
{form.status !== “Em aberto” && (
<div style={{ marginTop: 12 }}>
<label style={S.label}>Solução / Justificativa</label>
<textarea style={{ …S.input, minHeight: 60, resize: “vertical” }} placeholder=“Como foi resolvido ou por que sem solução…” value={form.solucao} onChange={e => setForm(f => ({ …f, solucao: e.target.value }))} />
</div>
)}
<div style={{ marginTop: 12, background: “#080A0F”, borderRadius: 8, padding: “12px 14px”, display: “flex”, alignItems: “center”, gap: 10 }}>
<input type=“checkbox” id=“rec” checked={form.tem_reclamacao} onChange={e => setForm(f => ({ …f, tem_reclamacao: e.target.checked }))} style={{ width: 15, height: 15, accentColor: “#EF4444” }} />
<label htmlFor=“rec” style={{ cursor: “pointer”, fontSize: 13, color: “#94A3B8” }}>Já houve reclamação de passageiro relacionada</label>
</div>
</div>
<div style={{ display: “flex”, gap: 10 }}>
<button style={{ …S.btnPrimary, opacity: salvando ? 0.6 : 1 }} onClick={salvarNova} disabled={salvando}>{salvando ? “Salvando…” : “💾 Salvar Ocorrência”}</button>
<button style={S.btnSecondary} onClick={() => { setForm(formVazio()); setTela(“lista”); }}>Cancelar</button>
</div>
</div>
</div>
);

// DETALHE
if (tela === “detalhe” && selecionada) {
const oc = ocs.find(o => o.id === selecionada);
if (!oc) { setTela(“lista”); return null; }
const reclamacoes = Array.isArray(oc.reclamacoes) ? oc.reclamacoes : JSON.parse(oc.reclamacoes || “[]”);
return (
<div style={S.app}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
{toast && <div style={S.toast}>{toast}</div>}
<div style={S.header}>
<div style={S.logo}><div style={S.logoMark}>⚡</div><span style={S.logoText}>Detalhe</span></div>
<button style={S.btnSecondary} onClick={() => setTela(“lista”)}>← Voltar</button>
</div>
<div style={S.main}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start”, marginBottom: 16 }}>
<div>
<div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{TIPO_ICONE[oc.tipo]} {oc.tipo}</div>
<div style={{ display: “flex”, gap: 8, flexWrap: “wrap” }}>
<span style={S.badge(oc.status)}>{oc.status}</span>
{oc.tem_reclamacao && <span style={{ fontSize: 11, fontWeight: 700, background: “#2D0D1A”, color: “#FF8080”, border: “1px solid #5C1A2A”, padding: “3px 9px”, borderRadius: 20 }}>🚨 Com Reclamação</span>}
</div>
</div>
<button style={S.btnDanger} onClick={() => excluir(oc.id)}>🗑️ Excluir</button>
</div>
<div style={S.infoCard}>
<div style={S.grid2}>
<div><label style={S.label}>Data</label><div style={{ fontWeight: 600 }}>{formatarData(oc.data)}</div></div>
<div><label style={S.label}>Destino</label><div style={{ fontWeight: 600 }}>📍 {oc.destino}</div></div>
<div><label style={S.label}>Guia</label><div style={{ fontWeight: 600 }}>{oc.guia || “—”}</div></div>
<div><label style={S.label}>Registrado em</label><div style={{ fontSize: 12, color: “#475569” }}>{new Date(oc.criado_em).toLocaleString(“pt-BR”)}</div></div>
</div>
<hr style={S.divider} />
<label style={S.label}>Descrição</label>
<div style={{ lineHeight: 1.7, color: “#CBD5E1”, fontSize: 14 }}>{oc.descricao}</div>
{oc.solucao && <><hr style={S.divider} /><label style={S.label}>Solução</label><div style={{ lineHeight: 1.7, color: “#CBD5E1”, fontSize: 14 }}>{oc.solucao}</div></>}
</div>
<div style={S.infoCard}>
<label style={S.label}>Atualizar Status</label>
<div style={{ display: “flex”, gap: 8, marginBottom: 12, flexWrap: “wrap” }}>
{STATUS.map(s => <button key={s} onClick={() => setStatusEdit(s)} style={{ …(statusEdit === s ? S.btnPrimary : S.btnSecondary), padding: “7px 14px”, fontSize: 12 }}>{s}</button>)}
</div>
<textarea style={{ …S.input, minHeight: 60, resize: “vertical”, marginBottom: 10 }} placeholder=“Solução ou justificativa…” value={solucaoEdit} onChange={e => setSolucaoEdit(e.target.value)} />
<button style={{ …S.btnPrimary, opacity: salvando ? 0.6 : 1 }} disabled={salvando} onClick={salvarAtualizacao}>{salvando ? “Salvando…” : “💾 Salvar”}</button>
</div>
<div style={S.infoCard}>
<label style={S.label}>🚨 Reclamações de Passageiros ({reclamacoes.length})</label>
{reclamacoes.length === 0 && <div style={{ color: “#475569”, fontSize: 13, marginBottom: 12 }}>Nenhuma reclamação vinculada ainda.</div>}
{reclamacoes.map((r, i) => (
<div key={i} style={{ background: “#080A0F”, borderRadius: 8, padding: “10px 12px”, marginBottom: 8, borderLeft: “3px solid #EF4444” }}>
<div style={{ fontSize: 11, color: “#475569”, marginBottom: 4 }}>{new Date(r.data).toLocaleString(“pt-BR”)}</div>
<div style={{ fontSize: 13, color: “#E2E8F0” }}>{r.texto}</div>
</div>
))}
<div style={{ display: “flex”, gap: 8, marginTop: 10 }}>
<input style={{ …S.input, flex: 1 }} placeholder=“Descreva a reclamação…” value={reclamacaoTexto} onChange={e => setReclamacaoTexto(e.target.value)} onKeyDown={e => e.key === “Enter” && adicionarReclamacao()} />
<button style={{ …S.btnPrimary, padding: “9px 14px” }} onClick={adicionarReclamacao}>+ Registrar</button>
</div>
</div>
</div>
</div>
);
}

// DASHBOARD
if (tela === “dashboard”) return (
<div style={S.app}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
<div style={S.header}>
<div style={S.logo}><div style={S.logoMark}>⚡</div><span style={S.logoText}>Dashboard</span></div>
<div style={S.nav}>
<button style={S.navBtn(false)} onClick={() => setTela(“lista”)}>📋 Ocorrências</button>
<button style={S.navBtn(true)}>📊 Dashboard</button>
</div>
</div>
<div style={S.main}>
<h2 style={{ margin: “0 0 16px”, fontSize: 20, fontWeight: 700 }}>Visão Geral da Operação</h2>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(4,1fr)”, gap: 10, marginBottom: 16 }}>
{[{ label: “Total”, valor: ocs.length, cor: “#F97316”, icon: “📋” }, { label: “Este mês”, valor: totalMes, cor: “#818CF8”, icon: “📅” }, { label: “Em aberto”, valor: emAberto, cor: “#FBBF24”, icon: “🔓” }, { label: “Sem solução”, valor: semSolucao, cor: “#EF4444”, icon: “⚠️” }].map(s => (
<div key={s.label} style={{ background: “#0D1117”, border: 1px solid ${s.cor}33, borderRadius: 12, padding: “16px 18px” }}>
<div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
<div style={{ fontSize: 26, fontWeight: 800, color: s.cor, lineHeight: 1 }}>{s.valor}</div>
<div style={{ fontSize: 11, color: “#475569”, fontWeight: 700, marginTop: 4 }}>{s.label.toUpperCase()}</div>
</div>
))}
</div>
<div style={S.grid2}>
<div style={S.infoCard}>
<label style={S.label}>Por Tipo</label>
{porTipo.length === 0 ? <div style={{ color: “#475569”, fontSize: 13 }}>Nenhuma ocorrência</div> : porTipo.map(({ tipo, qt }) => (
<div key={tipo} style={{ marginBottom: 10 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, fontSize: 12, marginBottom: 4 }}><span>{TIPO_ICONE[tipo]} {tipo}</span><span style={{ fontWeight: 700, color: “#F97316” }}>{qt}</span></div>
<div style={{ height: 4, background: “#1E2535”, borderRadius: 2 }}><div style={{ height: “100%”, width: ${(qt / ocs.length) * 100}%, background: “linear-gradient(90deg,#F97316,#EF4444)”, borderRadius: 2 }} /></div>
</div>
))}
</div>
<div style={S.infoCard}>
<label style={S.label}>Por Destino</label>
{porDestino.length === 0 ? <div style={{ color: “#475569”, fontSize: 13 }}>Nenhuma ocorrência</div> : porDestino.map(({ dest, qt }) => (
<div key={dest} style={{ marginBottom: 10 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, fontSize: 12, marginBottom: 4 }}><span>📍 {dest}</span><span style={{ fontWeight: 700, color: “#818CF8” }}>{qt}</span></div>
<div style={{ height: 4, background: “#1E2535”, borderRadius: 2 }}><div style={{ height: “100%”, width: ${(qt / ocs.length) * 100}%, background: “linear-gradient(90deg,#818CF8,#EF4444)”, borderRadius: 2 }} /></div>
</div>
))}
</div>
</div>
<div style={S.infoCard}>
<label style={S.label}>⚠️ Pendências</label>
{ocs.filter(o => o.status !== “Resolvido”).length === 0
? <div style={{ color: “#4ADE80”, fontSize: 13 }}>✅ Tudo resolvido!</div>
: ocs.filter(o => o.status !== “Resolvido”).slice(0, 6).map(oc => (
<div key={oc.id} style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, padding: “10px 0”, borderBottom: “1px solid #1E2535” }}>
<div>
<div style={{ fontSize: 13, fontWeight: 600 }}>{TIPO_ICONE[oc.tipo]} {oc.tipo} — {oc.destino}</div>
<div style={{ fontSize: 11, color: “#475569” }}>{formatarData(oc.data)}{oc.guia ? ` · ${oc.guia}` : “”}</div>
</div>
<div style={{ display: “flex”, gap: 8, alignItems: “center” }}>
<span style={S.badge(oc.status)}>{oc.status}</span>
<button style={{ …S.btnSecondary, padding: “5px 10px”, fontSize: 11 }} onClick={() => { setSelecionada(oc.id); setStatusEdit(oc.status); setSolucaoEdit(oc.solucao || “”); setTela(“detalhe”); }}>Ver</button>
</div>
</div>
))}
</div>
</div>
</div>
);

// LISTA
return (
<div style={S.app}>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
{toast && <div style={S.toast}>{toast}</div>}
<div style={S.header}>
<div style={S.logo}><div style={S.logoMark}>⚡</div><span style={S.logoText}>Controle de Ocorrências</span></div>
<div style={S.nav}>
<button style={S.navBtn(true)}>📋 Ocorrências</button>
<button style={S.navBtn(false)} onClick={() => setTela(“dashboard”)}>📊 Dashboard</button>
<button style={{ …S.btnPrimary, fontSize: 12, padding: “6px 14px”, marginLeft: 8 }} onClick={() => setTela(“nova”)}>+ Nova</button>
</div>
</div>
<div style={S.main}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 14 }}>
<div>
<h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Registro de Ocorrências</h2>
<div style={{ fontSize: 12, color: “#475569”, marginTop: 2 }}>{ocFiltradas.length} registro{ocFiltradas.length !== 1 ? “s” : “”} · {comReclamacao} com reclamação</div>
</div>
<button style={{ …S.btnSecondary, padding: “7px 12px”, fontSize: 12 }} onClick={carregar}>🔄 Atualizar</button>
</div>
<div style={{ …S.infoCard, padding: “12px 14px”, marginBottom: 14 }}>
<div style={{ display: “grid”, gridTemplateColumns: “2fr 1fr 1fr 1fr”, gap: 8 }}>
<input style={S.input} placeholder=“🔍 Buscar por descrição, guia, destino…” value={busca} onChange={e => setBusca(e.target.value)} />
<select style={S.input} value={filtros.destino} onChange={e => setFiltros(f => ({ …f, destino: e.target.value }))}><option value="">Todos destinos</option>{DESTINOS.map(d => <option key={d}>{d}</option>)}</select>
<select style={S.input} value={filtros.status} onChange={e => setFiltros(f => ({ …f, status: e.target.value }))}><option value="">Todos status</option>{STATUS.map(s => <option key={s}>{s}</option>)}</select>
<select style={S.input} value={filtros.tipo} onChange={e => setFiltros(f => ({ …f, tipo: e.target.value }))}><option value="">Todos tipos</option>{TIPOS.map(t => <option key={t}>{t}</option>)}</select>
</div>
</div>
{erroConexao && (
<div style={{ background: “#2D0D0D”, border: “1px solid #5C1A1A”, borderRadius: 10, padding: “14px 18px”, marginBottom: 14, color: “#FF8080”, fontSize: 13, display: “flex”, alignItems: “center”, gap: 12 }}>
❌ Não foi possível conectar ao banco. Verifique sua conexão.
<button style={{ …S.btnDanger, padding: “5px 12px”, fontSize: 12 }} onClick={carregar}>Tentar novamente</button>
</div>
)}
{loading && <div style={{ textAlign: “center”, padding: “50px”, color: “#475569” }}>⏳ Carregando…</div>}
{!loading && !erroConexao && ocFiltradas.length === 0 && (
<div style={{ textAlign: “center”, padding: “50px 20px”, color: “#475569” }}>
<div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
<div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: “#64748B” }}>Nenhuma ocorrência encontrada</div>
<div style={{ fontSize: 13, marginBottom: 18 }}>Registre a primeira ocorrência do dia</div>
<button style={S.btnPrimary} onClick={() => setTela(“nova”)}>+ Registrar Ocorrência</button>
</div>
)}
{!loading && ocFiltradas.map(oc => (
<div key={oc.id} style={S.card}
onClick={() => { setSelecionada(oc.id); setStatusEdit(oc.status); setSolucaoEdit(oc.solucao || “”); setTela(“detalhe”); }}
onMouseEnter={e => { e.currentTarget.style.borderColor = “#F97316”; e.currentTarget.style.transform = “translateY(-1px)”; }}
onMouseLeave={e => { e.currentTarget.style.borderColor = “#1E2535”; e.currentTarget.style.transform = “none”; }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start” }}>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 8, marginBottom: 6, flexWrap: “wrap” }}>
<span style={{ fontSize: 14, fontWeight: 700 }}>{TIPO_ICONE[oc.tipo]} {oc.tipo}</span>
<span style={S.badge(oc.status)}>{oc.status}</span>
{oc.tem_reclamacao && <span style={{ fontSize: 10, color: “#FF8080”, fontWeight: 700, background: “#2D0D0D”, padding: “2px 7px”, borderRadius: 10, border: “1px solid #5C1A1A” }}>🚨 Reclamação</span>}
</div>
<div style={{ fontSize: 12, color: “#475569”, marginBottom: 5 }}>📅 {formatarData(oc.data)}  ·  📍 {oc.destino}{oc.guia ? ` · 👤 ${oc.guia}` : “”}</div>
<div style={{ fontSize: 13, color: “#94A3B8”, overflow: “hidden”, textOverflow: “ellipsis”, whiteSpace: “nowrap”, maxWidth: 520 }}>{oc.descricao}</div>
</div>
<div style={{ color: “#334155”, fontSize: 18, marginLeft: 10, flexShrink: 0 }}>›</div>
</div>
</div>
))}
</div>
</div>
);
}
