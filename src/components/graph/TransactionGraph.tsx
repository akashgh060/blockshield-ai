import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ArrowRight,
  Shield,
  Info,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { BitcoinTransaction } from '../../types/bitcoin';
import { PrivacyAnalysis } from '../../types/privacy';

interface TransactionGraphProps {
  transaction: BitcoinTransaction;
  analysis?: PrivacyAnalysis;
}

interface GraphNode {
  id: string;
  type: 'address' | 'transaction';
  label: string;
  fullId: string;
  x: number;
  y: number;
  value?: number;
  role: 'input_address' | 'tx_hub' | 'output_address';
  scriptType?: string;
  isReused?: boolean;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  type: 'INPUT' | 'OUTPUT';
  value: number;
}

export const TransactionGraph: React.FC<TransactionGraphProps> = ({ transaction, analysis }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate layout nodes and edges
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const inputs = transaction.vin || [];
  const outputs = transaction.vout || [];

  // Hub node for the transaction
  const txNode: GraphNode = {
    id: `tx-${transaction.txid}`,
    type: 'transaction',
    label: `TX ${transaction.txid.slice(0, 6)}...`,
    fullId: transaction.txid,
    x: 450,
    y: 200,
    role: 'tx_hub',
  };
  nodes.push(txNode);

  // Input address nodes (left column)
  const inputSpacing = inputs.length > 1 ? 300 / (inputs.length - 1) : 0;
  inputs.forEach((inp, idx) => {
    const addr = inp.prevout?.scriptpubkey_address || `Unknown Input #${idx}`;
    const nodeId = `in-${idx}-${addr.slice(0, 8)}`;
    const yPos = inputs.length === 1 ? 200 : 80 + idx * Math.min(inputSpacing, 70);

    const isReused = analysis?.metrics.addressReuseCount
      ? outputs.some((o) => o.scriptpubkey_address === addr)
      : false;

    nodes.push({
      id: nodeId,
      type: 'address',
      label: addr.length > 14 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr,
      fullId: addr,
      x: 120,
      y: yPos,
      value: inp.prevout?.value,
      role: 'input_address',
      scriptType: inp.prevout?.scriptpubkey_type || 'p2wpkh',
      isReused,
    });

    edges.push({
      id: `edge-in-${idx}`,
      from: nodeId,
      to: txNode.id,
      type: 'INPUT',
      value: inp.prevout?.value || 0,
    });
  });

  // Output address nodes (right column)
  const outputSpacing = outputs.length > 1 ? 300 / (outputs.length - 1) : 0;
  outputs.forEach((out, idx) => {
    const addr = out.scriptpubkey_address || `OP_RETURN / Unparsed #${idx}`;
    const nodeId = `out-${idx}-${addr.slice(0, 8)}`;
    const yPos = outputs.length === 1 ? 200 : 80 + idx * Math.min(outputSpacing, 70);

    const isReused = inputs.some((i) => i.prevout?.scriptpubkey_address === addr);

    nodes.push({
      id: nodeId,
      type: 'address',
      label: addr.length > 14 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr,
      fullId: addr,
      x: 780,
      y: yPos,
      value: out.value,
      role: 'output_address',
      scriptType: out.scriptpubkey_type || 'p2wpkh',
      isReused,
    });

    edges.push({
      id: `edge-out-${idx}`,
      from: txNode.id,
      to: nodeId,
      type: 'OUTPUT',
      value: out.value,
    });
  });

  // Pan and drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetTransform = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="transaction-graph-container"
      className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col relative"
    >
      {/* Top Controls Toolbar */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">Interactive Payment Flow Graph</span>
          <span className="text-slate-500 hidden sm:inline">| Drag to Pan, Scroll to Zoom</span>
        </div>

        {/* Legend & Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3 mr-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Inputs
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Transaction
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Outputs
            </span>
          </div>

          <button
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetTransform}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300"
            aria-label="Reset zoom and position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-96 bg-slate-950 cursor-grab active:cursor-grabbing overflow-hidden relative select-none"
      >
        {/* Subtle grid pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#graph-grid)" />
        </svg>

        {/* Dynamic Zoom/Pan World */}
        <svg
          className="w-full h-full"
          viewBox="0 0 900 400"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.from);
              const targetNode = nodes.find((n) => n.id === edge.to);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted =
                selectedNode && (selectedNode.id === sourceNode.id || selectedNode.id === targetNode.id);

              const strokeColor = isHighlighted
                ? '#22d3ee'
                : edge.type === 'INPUT'
                ? '#3b82f6'
                : '#10b981';

              const midX = (sourceNode.x + targetNode.x) / 2;
              const midY = (sourceNode.y + targetNode.y) / 2;

              return (
                <g key={edge.id}>
                  {/* Curvature Line */}
                  <path
                    d={`M ${sourceNode.x} ${sourceNode.y} C ${midX} ${sourceNode.y}, ${midX} ${targetNode.y}, ${targetNode.x} ${targetNode.y}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={isHighlighted ? 'none' : '4 2'}
                    opacity={isHighlighted ? 1 : 0.65}
                  />

                  {/* Flow label */}
                  {edge.value > 0 && (
                    <text
                      x={midX}
                      y={midY - 6}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {(edge.value / 1e8).toFixed(4)} BTC
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isTx = node.type === 'transaction';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Outer halo */}
                  <circle
                    r={isTx ? 34 : 26}
                    fill={isTx ? '#0891b2' : node.role === 'input_address' ? '#2563eb' : '#059669'}
                    fillOpacity={isSelected ? 0.4 : 0.15}
                    stroke={isSelected ? '#38bdf8' : node.isReused ? '#f59e0b' : '#475569'}
                    strokeWidth={isSelected ? 2.5 : node.isReused ? 2 : 1}
                    className="transition-all duration-200"
                  />

                  {/* Core shape */}
                  {isTx ? (
                    <rect
                      x="-14"
                      y="-14"
                      width="28"
                      height="28"
                      rx="6"
                      fill="#0e7490"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                    />
                  ) : (
                    <circle
                      r="14"
                      fill={node.role === 'input_address' ? '#1d4ed8' : '#047857'}
                      stroke={node.isReused ? '#fbbf24' : '#94a3b8'}
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Inner icon / indicator */}
                  <text
                    x="0"
                    y="4"
                    fill="#ffffff"
                    fontSize={isTx ? '10' : '9'}
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {isTx ? 'TX' : node.role === 'input_address' ? 'IN' : 'OUT'}
                  </text>

                  {/* Node Label Below */}
                  <text
                    x="0"
                    y={isTx ? 42 : 36}
                    fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="pointer-events-none select-none group-hover:fill-cyan-300 font-medium"
                  >
                    {node.label}
                  </text>

                  {/* Node Value if address */}
                  {node.value !== undefined && (
                    <text
                      x="0"
                      y={isTx ? 54 : 48}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                    >
                      {(node.value / 1e8).toFixed(4)} BTC
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Empty selection prompt / Overlay hint */}
        {!selectedNode && (
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5 font-sans pointer-events-none">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click any node to inspect on-chain details and privacy observations</span>
          </div>
        )}

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div
            id="node-inspector-drawer"
            className="absolute top-3 right-3 w-80 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 shadow-2xl text-xs space-y-3 font-sans animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold uppercase text-slate-200 text-xs">
                  {selectedNode.type === 'transaction' ? 'Transaction Hub' : 'Address Endpoint'}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
                aria-label="Close node inspector"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Public Identifier */}
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Public Identifier</span>
              <div className="flex items-center gap-1.5 mt-0.5 bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px] text-slate-200 break-all">
                <span className="flex-1">{selectedNode.fullId}</span>
                <button
                  onClick={() => copyToClipboard(selectedNode.fullId)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy identifier"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Role</span>
                <span className="text-slate-200 font-semibold uppercase">{selectedNode.role.replace('_', ' ')}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Observed Value</span>
                <span className="text-cyan-400 font-bold">
                  {selectedNode.value !== undefined
                    ? `${(selectedNode.value / 1e8).toFixed(4)} BTC`
                    : `${(transaction.totalOutputValue / 1e8).toFixed(4)} BTC`}
                </span>
              </div>
            </div>

            {/* Privacy Observations */}
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold block">
                Privacy Observation
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {selectedNode.type === 'transaction'
                  ? `Evaluated under ${analysis?.riskLevel ?? 'MODERATE'} risk rating. Inputs and outputs reflect publicly observable ledger routing.`
                  : selectedNode.isReused
                  ? 'Address reuse detected: This address appears across both sending inputs and receiving outputs.'
                  : `Address standard: ${selectedNode.scriptType?.toUpperCase() || 'P2WPKH'}. No identity claim made.`}
              </p>
            </div>

            {/* Cypherpunk Principle */}
            <div className="text-[10px] text-slate-400 italic">
              Defensive note: Public Bitcoin addresses are cryptographic public key hashes, not verified personal identities.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
