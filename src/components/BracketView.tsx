import { useRef, useMemo, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { BracketNode } from "../types";
import { getFlagUrl } from "../countryCodes";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  bracketTree: BracketNode;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  horizontalTween?: gsap.core.Tween | null;
}

interface PositionedNode {
  node: BracketNode;
  depth: number;
  x: number;
  y: number;
  index: number;
}

interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  xMid: number;
  completed: boolean;
}

const ROUND_INFO: Record<number, { label: string; date: string }> = {
  0: { label: "Final", date: "Jul 19" },
  1: { label: "Semi-finals", date: "Jul 14-15" },
  2: { label: "Quarter-finals", date: "Jul 9-11" },
  3: { label: "Round of 16", date: "Jul 4-7" },
};

const NODE_W = 220;
const NODE_H = 80;
const COL_GAP = 60;
const LEAF_SPACING = 92;
const PAD_X = 40;
const PAD_TOP = 80;
const LABEL_H = 28;

function getDepth(node: BracketNode): number {
  if (!node.children?.length) return 0;
  return 1 + Math.max(...node.children.map(getDepth));
}

function layoutNodes(
  node: BracketNode,
  depth: number,
  maxDepth: number,
  leafIdx: { current: number },
  roundCounts: Map<number, number>,
  positions: PositionedNode[],
): number {
  if (!node.children?.length) {
    const y = leafIdx.current * LEAF_SPACING + PAD_TOP + NODE_H / 2 + LABEL_H + 12;
    const x = (maxDepth - depth) * (NODE_W + COL_GAP) + PAD_X;
    const idx = roundCounts.get(depth) ?? 0;
    roundCounts.set(depth, idx + 1);
    positions.push({ node, depth, x, y, index: idx });
    leafIdx.current++;
    return y;
  }

  const childY = node.children.map((c) =>
    layoutNodes(c, depth + 1, maxDepth, leafIdx, roundCounts, positions),
  );
  const y = (childY[0] + childY[1]) / 2;
  const x = (maxDepth - depth) * (NODE_W + COL_GAP) + PAD_X;
  const idx = roundCounts.get(depth) ?? 0;
  roundCounts.set(depth, idx + 1);
  positions.push({ node, depth, x, y, index: idx });

  return y;
}

function getConnections(node: BracketNode, posMap: Map<string, PositionedNode>): Connection[] {
  const conns: Connection[] = [];
  const parent = posMap.get(node.node_id);
  if (!node.children?.length || !parent) return conns;

  node.children.forEach((child) => {
    const childPos = posMap.get(child.node_id);
    if (!childPos) return;
    const midX = (childPos.x + NODE_W + parent.x) / 2;
    conns.push({
      x1: childPos.x + NODE_W,
      y1: childPos.y,
      x2: parent.x,
      y2: parent.y,
      xMid: midX,
      completed: !!child.winner,
    });
    conns.push(...getConnections(child, posMap));
  });

  return conns;
}

function MatchCard({ node }: { node: BracketNode }) {
  const isTBD =
    !node.home_team || node.home_team.startsWith("Winner") || node.away_team.startsWith("Winner");
  const isWinner = !!node.winner;
  const isDraw =
    !isTBD && node.home_score === node.away_score && (node.home_score > 0 || node.away_score > 0);

  const accentGradient = isTBD
    ? "from-slate-700/50 to-slate-700/20"
    : isWinner
    ? "from-emerald-500/80 to-emerald-500/20"
    : "from-slate-500/80 to-slate-500/20";

  return (
    <div
      className={`w-full h-full rounded-lg border transition-all duration-300 overflow-hidden relative ${
        isTBD
          ? "bg-slate-800/20 border-slate-700/20"
          : isWinner
          ? "bg-slate-800/90 border-emerald-500/30 shadow-sm shadow-emerald-500/10"
          : isDraw
          ? "bg-slate-800/70 border-slate-500/40"
          : "bg-slate-800/70 border-slate-700/50"
      }`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-[2.5px] bg-gradient-to-b ${accentGradient}`} />
      {isTBD ? (
        <div className="flex flex-col items-center justify-center h-full pl-3">
          <span className="text-[10px] font-semibold text-slate-600 tracking-widest uppercase">TBD</span>
          <button
            onClick={() => alert("Notifications coming soon")}
            className="text-[9px] text-emerald-500/70 hover:text-emerald-400 mt-0.5 transition-colors"
          >
            alert me
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center h-full pl-3 pr-2 py-1.5">
          <div className="flex items-center gap-1 min-w-0">
            <span
              className={`text-[10px] leading-tight truncate flex-1 ${
                node.winner === node.home_team ? "text-emerald-400 font-semibold" : "text-slate-300"
              }`}
            >
              {node.home_team}
            </span>
            {getFlagUrl(node.home_team) && (
              <img src={getFlagUrl(node.home_team)} alt="" className="w-4 h-3 rounded-sm object-cover flex-shrink-0" loading="lazy" />
            )}
            <span
              className={`text-xs font-bold ml-0.5 ${
                node.winner === node.home_team ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {node.home_score}
            </span>
          </div>
          <div className="border-t border-slate-700/20 my-0.5" />
          <div className="flex items-center gap-1 min-w-0">
            <span
              className={`text-[10px] leading-tight truncate flex-1 ${
                node.winner === node.away_team ? "text-emerald-400 font-semibold" : "text-slate-300"
              }`}
            >
              {node.away_team}
            </span>
            {getFlagUrl(node.away_team) && (
              <img src={getFlagUrl(node.away_team)} alt="" className="w-4 h-3 rounded-sm object-cover flex-shrink-0" loading="lazy" />
            )}
            <span
              className={`text-xs font-bold ml-0.5 ${
                node.winner === node.away_team ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {node.away_score}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BracketView({ bracketTree, scrollRef, horizontalTween }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const maxDepth = useMemo(() => getDepth(bracketTree), [bracketTree]);

  const { positionedNodes, connections, totalWidth, totalHeight } = useMemo(() => {
    const leafIdx = { current: 0 };
    const roundCounts = new Map<number, number>();
    const nodes: PositionedNode[] = [];
    layoutNodes(bracketTree, 0, maxDepth, leafIdx, roundCounts, nodes);

    const posMap = new Map<string, PositionedNode>();
    nodes.forEach((p) => posMap.set(p.node.node_id, p));
    const conns = getConnections(bracketTree, posMap);

    const width = (maxDepth + 1) * (NODE_W + COL_GAP) + PAD_X * 2;
    const height = Math.max(leafIdx.current * LEAF_SPACING + PAD_TOP + NODE_H + LABEL_H + 12, 500);

    return { positionedNodes: nodes, connections: conns, totalWidth: width, totalHeight: height };
  }, [bracketTree, maxDepth]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const scroller = scrollRef.current;
    if (!scroller) return;

    const ctx = gsap.context(() => {
      const scrollConfig = horizontalTween
        ? { containerAnimation: horizontalTween, start: "left 85%" }
        : { scroller, start: "left 85%" };

      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            ...scrollConfig,
            toggleActions: "play none none none",
          },
        },
      );

      const paths = el.querySelectorAll(".bracket-path");
      paths.forEach((path, i) => {
        const length = (path as SVGPathElement).getTotalLength?.() ?? 800;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.inOut",
          delay: i * 0.02,
          scrollTrigger: {
            trigger: el,
            ...(horizontalTween
              ? { containerAnimation: horizontalTween, start: "left 80%" }
              : { scroller, start: "left 80%" }),
            toggleActions: "play none none none",
          },
        });
      });

      const nodes = el.querySelectorAll(".bracket-node");
      gsap.fromTo(
        nodes,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.4)",
          stagger: 0.06,
          scrollTrigger: {
            trigger: el,
            ...(horizontalTween
              ? { containerAnimation: horizontalTween, start: "left 80%" }
              : { scroller, start: "left 80%" }),
            toggleActions: "play none none none",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [horizontalTween]);

  return (
    <div className="scroll-panel-wide">
      <div className="flex flex-col h-full px-8">
        <div className="shrink-0 py-4">
          <h2 className="text-2xl font-bold text-white mb-1">Tournament Bracket</h2>
          <p className="text-sm text-slate-500">Knockout tree visualization</p>
        </div>

        <div
          ref={sectionRef}
          className="flex-1 rounded-xl bg-slate-900/50 border border-slate-700/50 overflow-auto cursor-crosshair"
        >
          <svg width={totalWidth} height={totalHeight} className="block">
            <defs>
              <pattern id="dotGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="rgba(51,65,85,0.4)" />
              </pattern>
              <radialGradient id="bracketGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0.06)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            <rect width={totalWidth} height={totalHeight} fill="url(#dotGrid)" />
            <rect width={totalWidth} height={totalHeight} fill="url(#bracketGlow)" />

            {connections.filter((c) => c.completed).map((conn, i) => (
              <path
                key={`glow-${i}`}
                d={`M ${conn.x1} ${conn.y1} L ${conn.xMid} ${conn.y1} L ${conn.xMid} ${conn.y2} L ${conn.x2} ${conn.y2}`}
                fill="none"
                stroke="rgba(16, 185, 129, 0.2)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {connections.map((conn, i) => (
              <path
                key={i}
                d={`M ${conn.x1} ${conn.y1} L ${conn.xMid} ${conn.y1} L ${conn.xMid} ${conn.y2} L ${conn.x2} ${conn.y2}`}
                fill="none"
                stroke={conn.completed ? "#34d399" : "#334155"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bracket-path"
                style={conn.completed ? { filter: "drop-shadow(0 0 3px rgba(16, 185, 129, 0.3))" } : undefined}
              />
            ))}

            {Array.from({ length: maxDepth + 1 }).map((_, d) => {
              const info = ROUND_INFO[d] ?? { label: `Round ${d}`, date: "" };
              const xPos = (maxDepth - d) * (NODE_W + COL_GAP) + PAD_X + NODE_W / 2;
              return (
                <g key={d}>
                  <foreignObject
                    x={xPos - NODE_W / 2}
                    y={6}
                    width={NODE_W}
                    height={LABEL_H}
                  >
                    <div className="flex items-center justify-center h-full">
                      <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/50 rounded-full px-3 py-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider whitespace-nowrap">
                          {info.label}
                        </span>
                        {info.date && (
                          <span className="text-[9px] text-slate-500 whitespace-nowrap">
                            {info.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {positionedNodes.map((pn) => (
              <g key={pn.node.node_id} className="bracket-node">
                <foreignObject x={pn.x} y={pn.y - NODE_H / 2} width={NODE_W} height={NODE_H}>
                  <MatchCard node={pn.node} />
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
