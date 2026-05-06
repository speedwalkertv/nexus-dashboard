"use client";

import { motion } from "framer-motion";
import { Activity, TrendingUp, Users, DollarSign } from "lucide-react";

const stats = [
  { label: "Receita", value: "R$ 124.5k", delta: "+12.4%", icon: DollarSign },
  { label: "Usuários ativos", value: "8,329", delta: "+5.1%", icon: Users },
  { label: "Conversão", value: "3.84%", delta: "+0.9%", icon: TrendingUp },
  { label: "Sessões", value: "42.1k", delta: "+18.2%", icon: Activity },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 120, damping: 18 } },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        <motion.header variants={item} className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            Nexus Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Analytics em tempo real</p>
        </motion.header>

        <motion.section
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}
              className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-cyan-400/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm">{s.label}</span>
                <s.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-semibold">{s.value}</div>
              <div className="text-emerald-400 text-sm mt-1">{s.delta}</div>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          variants={item}
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8"
        >
          <h2 className="text-xl font-semibold mb-6">Atividade nos últimos 30 dias</h2>
          <div className="h-64 flex items-end gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 80}%` }}
                transition={{ delay: i * 0.02, type: "spring", stiffness: 100 }}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-fuchsia-500 rounded-t-md opacity-80 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
