'use client';
import { useEffect, useState, useMemo } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { IncidentAlert } from '@/hooks/useSocket';
import dagre from 'dagre';
import { Server, Database, User, ShieldAlert, Globe } from 'lucide-react';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
    return newNode;
  });

  return { nodes: newNodes, edges };
};

// Custom Node Component
const AssetNode = ({ data }: { data: any }) => {
  let Icon = Server;
  if (data.type === 'Database') Icon = Database;
  if (data.type === 'User') Icon = User;
  if (data.type === 'Internet') Icon = Globe;

  return (
    <div className={`px-4 py-3 shadow-lg rounded-xl border bg-[#18181b] flex items-center gap-3 w-[220px] ${data.isCritical ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10'}`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-zinc-500" />
      <div className={`p-2 rounded-lg ${data.isCritical ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-300'}`}>
        <Icon size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-white truncate w-32">{data.label}</span>
        <span className="text-[10px] text-zinc-500">{data.type}</span>
      </div>
      {data.isCritical && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 animate-pulse">
           <ShieldAlert size={12} />
        </div>
      )}
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-zinc-500" />
    </div>
  );
};

const nodeTypes = {
  assetNode: AssetNode,
};

export default function AttackGraph({ alerts }: { alerts: IncidentAlert[] }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    // Determine which assets have critical alerts
    const criticalAssets = new Set(alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').map(a => a.asset));
    const uniqueAssets = Array.from(new Set(alerts.map(a => a.asset)));
    
    const initialNodes: Node[] = [
      {
        id: 'internet',
        position: { x: 0, y: 0 },
        type: 'assetNode',
        data: { label: 'External / Internet', type: 'Internet', isCritical: true },
      }
    ];

    const initialEdges: Edge[] = [];

    uniqueAssets.forEach((asset, index) => {
      let type = 'Server';
      if (asset.toLowerCase().includes('db') || asset.toLowerCase().includes('database')) type = 'Database';
      if (asset.toLowerCase().includes('laptop') || asset.toLowerCase().includes('workstation')) type = 'User';

      initialNodes.push({
        id: asset,
        position: { x: 0, y: 0 },
        type: 'assetNode',
        data: { label: asset, type, isCritical: criticalAssets.has(asset) },
      });

      // Chain logic for mock graph
      if (index === 0) {
        initialEdges.push({ id: `e-int-${asset}`, source: 'internet', target: asset, animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } });
      } else {
        const sourceAsset = uniqueAssets[Math.floor(Math.random() * index)]; // Random previous node to make it tree-like
        initialEdges.push({ id: `e-${sourceAsset}-${asset}`, source: sourceAsset, target: asset, animated: true, style: { stroke: criticalAssets.has(asset) ? '#ef4444' : '#3b82f6', strokeWidth: 1.5, opacity: 0.6 } });
      }
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, 'LR');
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [alerts]);

  return (
    <div className="w-full h-full relative group">
      {nodes.length === 0 && (
         <div className="absolute inset-0 flex items-center justify-center text-zinc-500 z-10 pointer-events-none">
           Awaiting topology data...
         </div>
      )}
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="#27272a" gap={16} size={1} />
        <Controls showInteractive={false} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </ReactFlow>
    </div>
  );
}
