"""
AI Operations Platform - Workflow Templates
==========================================

Six production-ready workflow patterns as pluggable modules:

1. Sequential Pipeline - Linear A→B→C execution
2. Parallel Specialist Crew - Fan-out/fan-in for independent tasks
3. Hierarchical Supervisor - Manager delegates to workers
4. Event-Driven Reactive - Triggered by events/webhooks
5. Adaptive ReAct - LLM chooses path dynamically with loops
6. Handoff/Magentic - Agents transfer control based on capability

Each template is self-contained and can be

 loaded via the registry.
"""

from typing import Dict, Any
from datetime import datetime
import uuid


# Import from orchestrator engine
# from workflow_orchestrator import (
#     WorkflowTemplate, WorkflowGraph, WorkflowNode, WorkflowEdge,
#     NodeType, WorkflowState
# )


# ============================================================================
# TEMPLATE 1: SEQUENTIAL PIPELINE
# ============================================================================

class SequentialPipelineTemplate:
    """
    Linear workflow: Task 1 → Task 2 → Task 3 → Done
    
    Best for:
    - Simple scripts and automations
    - Document processing pipelines
    - Step-by-step data transformations
    - Clear dependency chains
    
    Characteristics:
    - Predictable execution order
    - Easy to debug and understand
    - Lower complexity
    - No parallelism (slower for independent tasks)
    """
    
    @property
    def template_id(self) -> str:
        return "sequential_pipeline"
    
    @property
    def template_name(self) -> str:
        return "Sequential Pipeline"
    
    @property
    def description(self) -> str:
        return "Linear step-by-step execution. Each agent completes before next starts."
    
    def build_graph(self, config: Dict[str, Any]):
        """
        Config expects:
        {
            "agents": ["research", "data", "backend"],  # In execution order
            "project_id": "proj_123"
        }
        """
        workflow_id = f"workflow_{uuid.uuid4().hex[:8]}"
        graph = WorkflowGraph(workflow_id, self.template_id)
        
        agents = config.get("agents", [])
        
        # Create nodes for each agent
        previous_node = None
        for i, agent_id in enumerate(agents):
            node = WorkflowNode(
                id=f"agent_{agent_id}",
                name=f"Execute {agent_id.title()} Agent",
                type=NodeType.AGENT,
                handler=self._create_agent_handler(agent_id),
                metadata={"agent_id": agent_id, "sequence": i}
            )
            graph.add_node(node)
            
            # Set entry point
            if i == 0:
                graph.set_entry_point(node.id)
            
            # Add edge from previous node
            if previous_node:
                graph.add_edge(WorkflowEdge(
                    from_node=previous_node.id,
                    to_node=node.id
                ))
            
            previous_node = node
        
        return graph
    
    def _create_agent_handler(self, agent_id: str):
        """Create handler function for an agent"""
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            # This would call actual agent via API
            # Simulated for now
            return {
                "agent_outputs": {
                    agent_id: f"Result from {agent_id} agent"
                },
                "completed_tasks": agent_id
            }
        return handler


# ============================================================================
# TEMPLATE 2: PARALLEL SPECIALIST CREW
# ============================================================================

class ParallelSpecialistTemplate:
    """
    Fan-out/fan-in pattern: Multiple agents work in parallel, results merged.
    
         ┌─→ Agent A ─┐
    Start ├─→ Agent B ─┤→ Merge → Done
         └─→ Agent C ─┘
    
    Best for:
    - Independent research tasks
    - Multi-document analysis
    - Comparative analysis
    - Code review from multiple perspectives
    
    Characteristics:
    - Maximum speed through parallelism
    - Requires task independence
    - Merge/synthesis step at end
    - Higher token usage (all agents run)
    """
    
    @property
    def template_id(self) -> str:
        return "parallel_specialist"
    
    @property
    def template_name(self) -> str:
        return "Parallel Specialist Crew"
    
    @property
    def description(self) -> str:
        return "Multiple agents work in parallel, results synthesized at end."
    
    def build_graph(self, config: Dict[str, Any]):
        """
        Config expects:
        {
            "agents": ["research", "data", "legal"],  # Run in parallel
            "synthesizer": "leader",  # Agent to merge results
            "project_id": "proj_123"
        }
        """
        workflow_id = f"workflow_{uuid.uuid4().hex[:8]}"
        graph = WorkflowGraph(workflow_id, self.template_id)
        
        agents = config.get("agents", [])
        synthesizer = config.get("synthesizer", "leader")
        
        # Create fan-out node (dispatcher)
        fanout_node = WorkflowNode(
            id="fanout",
            name="Dispatch to Parallel Agents",
            type=NodeType.PARALLEL,
            handler=self._fanout_handler,
            metadata={"agents": agents}
        )
        graph.add_node(fanout_node)
        graph.set_entry_point(fanout_node.id)
        
        # Create agent nodes
        agent_nodes = []
        for agent_id in agents:
            node = WorkflowNode(
                id=f"agent_{agent_id}",
                name=f"{agent_id.title()} Agent",
                type=NodeType.AGENT,
                handler=self._create_agent_handler(agent_id),
                metadata={"agent_id": agent_id}
            )
            graph.add_node(node)
            agent_nodes.append(node)
            
            # Connect fanout to agent
            graph.add_edge(WorkflowEdge(
                from_node=fanout_node.id,
                to_node=node.id
            ))
        
        # Create merge node
        merge_node = WorkflowNode(
            id="merge",
            name="Synthesize Results",
            type=NodeType.MERGE,
            handler=self._create_merge_handler(synthesizer),
            metadata={"synthesizer": synthesizer, "expected_agents": agents}
        )
        graph.add_node(merge_node)
        
        # Connect all agents to merge
        for node in agent_nodes:
            graph.add_edge(WorkflowEdge(
                from_node=node.id,
                to_node=merge_node.id
            ))
        
        return graph
    
    async def _fanout_handler(self, state: WorkflowState) -> Dict[str, Any]:
        """Prepare for parallel execution"""
        return {
            "next_action": "parallel_execute",
            "should_continue": True
        }
    
    def _create_agent_handler(self, agent_id: str):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            # Execute agent
            return {
                "agent_outputs": {
                    agent_id: f"Parallel result from {agent_id}"
                }
            }
        return handler
    
    def _create_merge_handler(self, synthesizer: str):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            # Synthesize all parallel results
            outputs = state.get("agent_outputs", {})
            return {
                "results": {
                    "synthesis": f"Merged {len(outputs)} agent outputs",
                    "synthesizer": synthesizer
                },
                "should_continue": False  # Workflow complete
            }
        return handler


# ============================================================================
# TEMPLATE 3: HIERARCHICAL SUPERVISOR
# ============================================================================

class HierarchicalSupervisorTemplate:
    """
    Manager-worker pattern: Leader plans and delegates to specialists.
    
    Leader (Plan) → Worker A → Report to Leader
                  → Worker B → Report to Leader
                  → Worker C → Report to Leader
                             → Leader (Review & Iterate/Complete)
    
    Best for:
    - Complex full-stack projects
    - Multi-phase implementations
    - Projects requiring oversight
    - Iterative refinement
    
    Characteristics:
    - Central coordination
    - Quality control at each step
    - Can iterate if needed
    - Leader maintains context
    """
    
    @property
    def template_id(self) -> str:
        return "hierarchical_supervisor"
    
    @property
    def template_name(self) -> str:
        return "Hierarchical Supervisor"
    
    @property
    def description(self) -> str:
        return "Leader agent plans and delegates to specialist workers with oversight."
    
    def build_graph(self, config: Dict[str, Any]):
        """
        Config expects:
        {
            "leader": "leader",
            "workers": ["research", "backend", "frontend", "devops"],
            "max_iterations": 3
        }
        """
        workflow_id = f"workflow_{uuid.uuid4().hex[:8]}"
        graph = WorkflowGraph(workflow_id, self.template_id)
        
        leader = config.get("leader", "leader")
        workers = config.get("workers", [])
        max_iterations = config.get("max_iterations", 3)
        
        # Leader planning node
        plan_node = WorkflowNode(
            id="leader_plan",
            name="Leader: Plan & Delegate",
            type=NodeType.AGENT,
            handler=self._create_leader_planner(leader, workers),
            metadata={"role": "planner", "agent": leader}
        )
        graph.add_node(plan_node)
        graph.set_entry_point(plan_node.id)
        
        # Worker assignment router
        router_node = WorkflowNode(
            id="router",
            name="Route to Next Worker",
            type=NodeType.CONDITION,
            handler=self._router_handler,
            condition_fn=self._route_to_worker,
            metadata={"workers": workers}
        )
        graph.add_node(router_node)
        graph.add_edge(WorkflowEdge(
            from_node=plan_node.id,
            to_node=router_node.id
        ))
        
        # Create worker nodes
        for worker_id in workers:
            worker_node = WorkflowNode(
                id=f"worker_{worker_id}",
                name=f"{worker_id.title()} Worker",
                type=NodeType.AGENT,
                handler=self._create_worker_handler(worker_id),
                metadata={"agent_id": worker_id}
            )
            graph.add_node(worker_node)
            
            # Connect router to worker
            graph.add_edge(WorkflowEdge(
                from_node=router_node.id,
                to_node=worker_node.id,
                condition=worker_id
            ))
            
            # Worker reports back to leader
            graph.add_edge(WorkflowEdge(
                from_node=worker_node.id,
                to_node="leader_review"
            ))
        
        # Leader review node
        review_node = WorkflowNode(
            id="leader_review",
            name="Leader: Review & Decide",
            type=NodeType.CONDITION,
            handler=self._create_leader_reviewer(leader),
            condition_fn=self._review_decision,
            metadata={"role": "reviewer", "max_iterations": max_iterations}
        )
        graph.add_node(review_node)
        
        # Loop back to router or complete
        graph.add_edge(WorkflowEdge(
            from_node=review_node.id,
            to_node=router_node.id,
            condition="continue"
        ))
        
        # Completion node
        complete_node = WorkflowNode(
            id="complete",
            name="Workflow Complete",
            type=NodeType.TRANSFORM,
            handler=self._completion_handler,
            metadata={}
        )
        graph.add_node(complete_node)
        graph.add_edge(WorkflowEdge(
            from_node=review_node.id,
            to_node=complete_node.id,
            condition="complete"
        ))
        
        return graph
    
    def _create_leader_planner(self, leader: str, workers: List[str]):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            # Leader breaks down project into tasks
            return {
                "tasks": [{"id": f"task_{i}", "agent": w} for i, w in enumerate(workers)],
                "next_action": "delegate"
            }
        return handler
    
    def _router_handler(self, state: WorkflowState) -> Dict[str, Any]:
        # Route to next pending task
        return {"routing": True}
    
    def _route_to_worker(self, state: WorkflowState) -> str:
        # Determine which worker should execute next
        tasks = state.get("tasks", [])
        completed = state.get("completed_tasks", [])
        
        for task in tasks:
            if task["id"] not in completed:
                return task["agent"]
        
        return "complete"
    
    def _create_worker_handler(self, worker_id: str):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            return {
                "agent_outputs": {worker_id: f"Work done by {worker_id}"},
                "completed_tasks": worker_id
            }
        return handler
    
    def _create_leader_reviewer(self, leader: str):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            # Leader reviews all work
            completed = state.get("completed_tasks", [])
            tasks = state.get("tasks", [])
            
            if len(completed) >= len(tasks):
                return {"next_action": "complete"}
            else:
                return {"next_action": "continue"}
        return handler
    
    def _review_decision(self, state: WorkflowState) -> str:
        return state.get("next_action", "continue")
    
    async def _completion_handler(self, state: WorkflowState) -> Dict[str, Any]:
        return {"should_continue": False, "status": "completed"}


# ============================================================================
# TEMPLATE 4: EVENT-DRIVEN REACTIVE
# ============================================================================

class EventDrivenReactiveTemplate:
    """
    Event-triggered workflow: Listens for events and reacts.
    
    Event Sources → Event Router → Handler Agents → Actions
    
    Best for:
    - Monitoring and alerting
    - Integration workflows (n8n/IFTTT-style)
    - Automated responses to file changes
    - CI/CD triggers
    
    Characteristics:
    - Always running (or scheduled checks)
    - Event-driven activation
    - Lightweight when idle
    - Scalable to many event types
    """
    
    @property
    def template_id(self) -> str:
        return "event_driven_reactive"
    
    @property
    def template_name(self) -> str:
        return "Event-Driven Reactive"
    
    @property
    def description(self) -> str:
        return "Triggered by events (files, webhooks, schedules). Reacts accordingly."
    
    def build_graph(self, config: Dict[str, Any]):
        """
        Config expects:
        {
            "event_types": ["file_created", "email_received", "webhook"],
            "handlers": {
                "file_created": "workspace",
                "email_received": "research",
                "webhook": "backend"
            }
        }
        """
        workflow_id = f"workflow_{uuid.uuid4().hex[:8]}"
        graph = WorkflowGraph(workflow_id, self.template_id)
        
        event_types = config.get("event_types", [])
        handlers = config.get("handlers", {})
        
        # Event listener node
        listener_node = WorkflowNode(
            id="event_listener",
            name="Event Listener",
            type=NodeType.CONDITION,
            handler=self._event_listener_handler,
            condition_fn=self._route_by_event_type,
            metadata={"event_types": event_types}
        )
        graph.add_node(listener_node)
        graph.set_entry_point(listener_node.id)
        
        # Create handler nodes for each event type
        for event_type, agent_id in handlers.items():
            handler_node = WorkflowNode(
                id=f"handle_{event_type}",
                name=f"Handle {event_type}",
                type=NodeType.AGENT,
                handler=self._create_event_handler(event_type, agent_id),
                metadata={"event_type": event_type, "agent": agent_id}
            )
            graph.add_node(handler_node)
            
            # Connect listener to handler
            graph.add_edge(WorkflowEdge(
                from_node=listener_node.id,
                to_node=handler_node.id,
                condition=event_type
            ))
        
        return graph
    
    async def _event_listener_handler(self, state: WorkflowState) -> Dict[str, Any]:
        # In production, this would poll event queue or webhook endpoint
        event_type = state.get("user_context", {}).get("event_type", "unknown")
        return {"detected_event": event_type}
    
    def _route_by_event_type(self, state: WorkflowState) -> str:
        return state.get("detected_event", "unknown")
    
    def _create_event_handler(self, event_type: str, agent_id: str):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            return {
                "results": {
                    "event": event_type,
                    "handler": agent_id,
                    "action_taken": f"Processed {event_type} via {agent_id}"
                },
                "should_continue": False
            }
        return handler


# ============================================================================
# TEMPLATE 5: ADAPTIVE REACT (Reasoning + Acting Loop)
# ============================================================================

class AdaptiveReActTemplate:
    """
    ReAct pattern: LLM reasons about next action, executes, observes, repeats.
    
    Think → Act → Observe → Think → Act → ... → Final Answer
    
    Best for:
    - Exploratory research
    - Complex debugging
    - Open-ended problems
    - Unknown solution paths
    
    Characteristics:
    - High autonomy
    - Can adapt to discoveries
    - Unpredictable path
    - May use more tokens (multiple LLM calls)
    """
    
    @property
    def template_id(self) -> str:
        return "adaptive_react"
    
    @property
    def template_name(self) -> str:
        return "Adaptive ReAct Loop"
    
    @property
    def description(self) -> str:
        return "LLM reasons, acts, observes in loop. Adapts based on results."
    
    def build_graph(self, config: Dict[str, Any]):
        """
        Config expects:
        {
            "reasoning_agent": "leader",
            "available_agents": ["research", "data", "backend"],
            "max_iterations": 10
        }
        """
        workflow_id = f"workflow_{uuid.uuid4().hex[:8]}"
        graph = WorkflowGraph(workflow_id, self.template_id)
        
        reasoning_agent = config.get("reasoning_agent", "leader")
        available_agents = config.get("available_agents", [])
        max_iterations = config.get("max_iterations", 10)
        
        # Reasoning node (Think)
        think_node = WorkflowNode(
            id="think",
            name="Reason About Next Action",
            type=NodeType.AGENT,
            handler=self._create_reasoning_handler(reasoning_agent, available_agents),
            metadata={"role": "reasoner", "max_iterations": max_iterations}
        )
        graph.add_node(think_node)
        graph.set_entry_point(think_node.id)
        
        # Action router
        act_router = WorkflowNode(
            id="act_router",
            name="Execute Action",
            type=NodeType.CONDITION,
            handler=self._act_router_handler,
            condition_fn=self._choose_action,
            metadata={"available_agents": available_agents}
        )
        graph.add_node(act_router)
        graph.add_edge(WorkflowEdge(from_node=think_node.id, to_node=act_router.id))
        
        # Create action nodes for each agent/tool
        for agent_id in available_agents:
            action_node = WorkflowNode(
                id=f"act_{agent_id}",
                name=f"Execute {agent_id}",
                type=NodeType.AGENT,
                handler=self._create_action_handler(agent_id),
                metadata={"agent_id": agent_id}
            )
            graph.add_node(action_node)
            
            graph.add_edge(WorkflowEdge(
                from_node=act_router.id,
                to_node=action_node.id,
                condition=agent_id
            ))
            
            # Loop back to think
            graph.add_edge(WorkflowEdge(
                from_node=action_node.id,
                to_node=think_node.id
            ))
        
        # Final answer node
        final_node = WorkflowNode(
            id="final_answer",
            name="Finalize Result",
            type=NodeType.TRANSFORM,
            handler=self._finalize_handler,
            metadata={}
        )
        graph.add_node(final_node)
        graph.add_edge(WorkflowEdge(
            from_node=act_router.id,
            to_node=final_node.id,
            condition="complete"
        ))
        
        return graph
    
    def _create_reasoning_handler(self, agent: str, available: List[str]):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            # LLM decides next action
            iteration = state.get("retry_count", 0)
            
            # Simple logic: cycle through agents, then complete
            if iteration < len(available):
                return {
                    "next_action": available[iteration],
                    "retry_count": iteration + 1,
                    "reasoning": f"Executing {available[iteration]} next"
                }
            else:
                return {
                    "next_action": "complete",
                    "reasoning": "All agents executed, finalizing"
                }
        return handler
    
    async def _act_router_handler(self, state: WorkflowState) -> Dict[str, Any]:
        return {}
    
    def _choose_action(self, state: WorkflowState) -> str:
        return state.get("next_action", "complete")
    
    def _create_action_handler(self, agent_id: str):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            return {
                "agent_outputs": {
                    agent_id: f"Action result from {agent_id}"
                },
                "results": f"Observation: {agent_id} completed"
            }
        return handler
    
    async def _finalize_handler(self, state: WorkflowState) -> Dict[str, Any]:
        return {
            "should_continue": False,
            "final_answer": "ReAct loop complete"
        }


# ============================================================================
# TEMPLATE 6: HANDOFF/MAGENTIC
# ============================================================================

class HandoffMagenticTemplate:
    """
    Agent handoff pattern: Agents transfer control based on capability.
    
    Triage Agent → Identifies problem
                 → Hands off to Technical Agent → Solves or escalates
                 → Hands off to Specialist → Completes
    
    Best for:
    - Customer support workflows
    - Multi-expertise problems
    - Escalation chains
    - Collaborative problem-solving
    
    Characteristics:
    - Dynamic routing
    - Each agent decides next agent
    - Can escalate to human
    - Flexible, agent-driven flow
    """
    
    @property
    def template_id(self) -> str:
        return "handoff_magentic"
    
    @property
    def template_name(self) -> str:
        return "Handoff/Magentic"
    
    @property
    def description(self) -> str:
        return "Agents hand off control to others based on capability and context."
    
    def build_graph(self, config: Dict[str, Any]):
        """
        Config expects:
        {
            "triage_agent": "leader",
            "specialists": {
                "research": ["research", "data"],
                "technical": ["backend", "frontend", "devops"],
                "documentation": ["workspace", "legal"]
            },
            "allow_human_escalation": true
        }
        """
        workflow_id = f"workflow_{uuid.uuid4().hex[:8]}"
        graph = WorkflowGraph(workflow_id, self.template_id)
        
        triage_agent = config.get("triage_agent", "leader")
        specialists = config.get("specialists", {})
        allow_human = config.get("allow_human_escalation", True)
        
        # Triage node
        triage_node = WorkflowNode(
            id="triage",
            name="Triage & Route",
            type=NodeType.CONDITION,
            handler=self._create_triage_handler(triage_agent),
            condition_fn=self._triage_routing,
            metadata={"agent": triage_agent, "specialists": specialists}
        )
        graph.add_node(triage_node)
        graph.set_entry_point(triage_node.id)
        
        # Create specialist nodes
        all_agents = set()
        for category, agents in specialists.items():
            all_agents.update(agents)
        
        for agent_id in all_agents:
            specialist_node = WorkflowNode(
                id=f"specialist_{agent_id}",
                name=f"{agent_id.title()} Specialist",
                type=NodeType.CONDITION,
                handler=self._create_specialist_handler(agent_id),
                condition_fn=self._specialist_decision,
                metadata={"agent_id": agent_id, "can_handoff": True}
            )
            graph.add_node(specialist_node)
            
            # Triage can route to any specialist
            graph.add_edge(WorkflowEdge(
                from_node=triage_node.id,
                to_node=specialist_node.id,
                condition=agent_id
            ))
            
            # Specialist can hand off to another specialist
            for other_agent in all_agents:
                if other_agent != agent_id:
                    graph.add_edge(WorkflowEdge(
                        from_node=specialist_node.id,
                        to_node=f"specialist_{other_agent}",
                        condition=other_agent
                    ))
            
            # Specialist can complete
            graph.add_edge(WorkflowEdge(
                from_node=specialist_node.id,
                to_node="complete",
                condition="complete"
            ))
            
            # Specialist can escalate to human
            if allow_human:
                graph.add_edge(WorkflowEdge(
                    from_node=specialist_node.id,
                    to_node="human_review",
                    condition="escalate"
                ))
        
        # Human review node (if enabled)
        if allow_human:
            human_node = WorkflowNode(
                id="human_review",
                name="Human Review",
                type=NodeType.HUMAN,
                handler=self._human_review_handler,
                metadata={"requires_human": True}
            )
            graph.add_node(human_node)
            graph.add_edge(WorkflowEdge(
                from_node=human_node.id,
                to_node="complete"
            ))
        
        # Completion node
        complete_node = WorkflowNode(
            id="complete",
            name="Workflow Complete",
            type=NodeType.TRANSFORM,
            handler=self._completion_handler,
            metadata={}
        )
        graph.add_node(complete_node)
        
        return graph
    
    def _create_triage_handler(self, agent: str):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            # Triage agent determines which specialist needed
            # In production, LLM would analyze request
            request = state.get("user_request", "")
            
            # Simple keyword matching for demo
            if "data" in request.lower() or "database" in request.lower():
                return {"handoff_to": "data", "reason": "Data-related request"}
            elif "code" in request.lower() or "bug" in request.lower():
                return {"handoff_to": "backend", "reason": "Technical request"}
            else:
                return {"handoff_to": "research", "reason": "General request"}
        return handler
    
    def _triage_routing(self, state: WorkflowState) -> str:
        return state.get("handoff_to", "research")
    
    def _create_specialist_handler(self, agent_id: str):
        async def handler(state: WorkflowState) -> Dict[str, Any]:
            # Specialist decides: complete, hand off, or escalate
            # Simple logic: complete after one execution
            return {
                "agent_outputs": {agent_id: f"Handled by {agent_id}"},
                "handoff_decision": "complete",
                "completed_by": agent_id
            }
        return handler
    
    def _specialist_decision(self, state: WorkflowState) -> str:
        return state.get("handoff_decision", "complete")
    
    async def _human_review_handler(self, state: WorkflowState) -> Dict[str, Any]:
        # In production, this would pause and wait for human input
        return {
            "human_reviewed": True,
            "handoff_decision": "complete"
        }
    
    async def _completion_handler(self, state: WorkflowState) -> Dict[str, Any]:
        return {"should_continue": False, "status": "completed"}


# ============================================================================
# REGISTRY INITIALIZATION
# ============================================================================

def initialize_workflow_registry():
    """Create and populate the workflow registry with all templates"""
    from workflow_orchestrator import WorkflowRegistry
    
    registry = WorkflowRegistry()
    
    # Register all templates
    registry.register(SequentialPipelineTemplate())
    registry.register(ParallelSpecialistTemplate())
    registry.register(HierarchicalSupervisorTemplate())
    registry.register(EventDrivenReactiveTemplate())
    registry.register(AdaptiveReActTemplate())
    registry.register(HandoffMagenticTemplate())
    
    return registry


# ============================================================================
# USAGE EXAMPLE
# ============================================================================

if __name__ == "__main__":
    registry = initialize_workflow_registry()
    
    print("🎯 Workflow Templates Loaded")
    print("=" * 60)
    
    for template_info in registry.list_templates():
        print(f"\n📋 {template_info['name']}")
        print(f"   ID: {template_info['id']}")
        print(f"   {template_info['description']}")
    
    print("\n" + "=" * 60)
    print("✅ All 6 workflow patterns ready for orchestration")
    print("\nEach template is modular and can be:")
    print("  • Loaded dynamically by Leader AI")
    print("  • Configured per-project")
    print("  • Extended with new patterns")
    print("  • Visualized in the UI")
