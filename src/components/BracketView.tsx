import { useRef, useMemo, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { BracketNode } from "../types";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  bracketTree: BracketNode;
  scrollRef: React.RefObject<HTMLDivElement | null>;
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
}

const ROUND_LABELS: Record<number, string> = {
  0: "Final",
  1: "Semi-finals",
  2: "Quarter-finals",
  3: "Round of 16",
};

const NODE_W = 220;
const NODE_H = 72;
const COL_GAP = 60;
const LEAF_SPACING = 88;
const PAD_X = 40;
const PAD_TOP = 80;

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
    const y = leafIdx.current * LEAF_SPACING + PAD_TOP + NODE_H / 2;
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

  return (
    <div
      className={`w-full h-full rounded-lg border transition-all duration-300 flex flex-col justify-center ${
        isTBD
          ? "bg-slate-800/20 border-slate-700/30"
          : isWinner
          ? "bg-slate-800/90 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
          : isDraw
          ? "bg-slate-800/70 border-slate-500/50"
          : "bg-slate-800/70 border-slate-700/50"
      }`}
    >
      {isTBD ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-[11px] font-semibold text-slate-500 tracking-widest uppercase">TBD</span>
        </div>
      ) : (
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] leading-tight truncate max-w-[120px] ${
                node.winner === node.home_team ? "text-emerald-400 font-semibold" : "text-slate-300"
              }`}
            >
              {node.home_team}
            </span>
            <span
              className={`text-sm font-bold ml-1 ${
                node.winner === node.home_team ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {node.home_score}
            </span>
          </div>
          <div className="border-t border-slate-700/30 my-1" />
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] leading-tight truncate max-w-[120px] ${
                node.winner === node.away_team ? "text-emerald-400 font-semibold" : "text-slate-300"
              }`}
            >
              {node.away_team}
            </span>
            <span
              className={`text-sm font-bold ml-1 ${
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

export default function BracketView({ bracketTree, scrollRef }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [containerHeight, setContainerHeight] = useState(800);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerWidth(el.clientWidth);
      setContainerHeight(el.clientHeight);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    setContainerHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

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
    const height = Math.max(leafIdx.current * LEAF_SPACING + PAD_TOP + NODE_H, 500);

    return { positionedNodes: nodes, connections: conns, totalWidth: width, totalHeight: height };
  }, [bracketTree, maxDepth]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const scroller = scrollRef.current;
    if (!scroller) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "left 85%",
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
            scroller,
            start: "left 80%",
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
            scroller,
            start: "left 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const scale = Math.min(1, (containerWidth - 64) / totalWidth, (containerHeight - 64) / totalHeight);

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-slate-700/50"
      style={{ height: totalHeight * scale + 32 }}
    >
      <div
        className="absolute top-4 left-4"
        style={{ width: totalWidth, height: totalHeight, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        <svg width={totalWidth} height={totalHeight} className="block">
          {Array.from({ length: maxDepth + 1 }).map((_, d) => {
            const label = ROUND_LABELS[d] ?? `Round ${d}`;
            const xPos = (maxDepth - d) * (NODE_W + COL_GAP) + PAD_X + NODE_W / 2;
            return (
              <text
                key={d}
                x={xPos}
                y={28}
                textAnchor="middle"
                className="fill-slate-500 text-[10px] font-semibold uppercase tracking-widest"
              >
                {label}
              </text>
            );
          })}

          {connections.map((conn, i) => (
            <path
              key={i}
              d={`M ${conn.x1} ${conn.y1} L ${conn.xMid} ${conn.y1} L ${conn.xMid} ${conn.y2} L ${conn.x2} ${conn.y2}`}
              fill="none"
              stroke="#334155"
              strokeWidth="1.5"
              className="bracket-path"
            />
          ))}

          {positionedNodes.map((pn) => (
            <g
              key={pn.node.node_id}
              className="bracket-node"
            >
              <foreignObject x={pn.x} y={pn.y - NODE_H / 2} width={NODE_W} height={NODE_H}>
                <MatchCard node={pn.node} />
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
