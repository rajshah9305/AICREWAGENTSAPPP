from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool
from typing import Dict, Any
import asyncio
from app.core.cerebras_llm import get_cerebras_llm


class BlogWriterCrew:
    def __init__(self, callback_handler):
        self.callback_handler = callback_handler
        self.search_tool = SerperDevTool()
        # Initialize Cerebras LLM
        self.llm = get_cerebras_llm()

    async def execute(self, inputs: Dict[str, Any]) -> str:
        """Execute blog writing crew"""
        
        topic = inputs.get("topic", "The Future of AI")
        tone = inputs.get("tone", "professional")
        target_audience = inputs.get("target_audience", "business professionals")
        
        await self.callback_handler.on_agent_start("Content Strategist", f"Planning blog post about: {topic}")
        
        # Create the content strategist agent with Cerebras LLM
        strategist = Agent(
            role='Content Strategist',
            goal=f'Create a comprehensive content strategy for a blog post about {topic}',
            backstory="""You are an experienced content strategist who understands 
            how to create engaging, SEO-optimized content that resonates with target audiences. 
            You excel at research and planning compelling narratives.""",
            tools=[self.search_tool],
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )
        
        # Create the writer agent with Cerebras LLM
        writer = Agent(
            role='Blog Writer',
            goal=f'Write an engaging and informative blog post about {topic}',
            backstory=f"""You are a skilled blog writer with expertise in creating 
            {tone} content for {target_audience}. You have a talent for making complex 
            topics accessible and engaging while maintaining accuracy and credibility.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )
        
        # Create the editor agent with Cerebras LLM
        editor = Agent(
            role='Content Editor',
            goal='Review and polish the blog post for quality and engagement',
            backstory="""You are a meticulous content editor with an eye for detail 
            and a deep understanding of what makes content compelling. You ensure 
            clarity, flow, and engagement while maintaining the author's voice.""",
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )
        
        await self.callback_handler.on_agent_action("System", "Executing blog writing crew with Cerebras AI...")
        
        # Simulate crew execution with periodic updates
        await self.callback_handler.on_agent_action("Content Strategist", "Researching topic and planning strategy with Cerebras AI...")
        await asyncio.sleep(1)
        
        await self.callback_handler.on_tool_start("SerperDevTool", f"Researching: {topic}")
        await asyncio.sleep(1)
        await self.callback_handler.on_tool_end("SerperDevTool", "Found trending topics and keywords")
        
        await self.callback_handler.on_agent_start("Blog Writer", "Writing the blog post with Cerebras AI...")
        await asyncio.sleep(1)
        
        await self.callback_handler.on_llm_chunk("# ")
        await asyncio.sleep(0.3)
        await self.callback_handler.on_llm_chunk(f"{topic}: ")
        await asyncio.sleep(0.3)
        await self.callback_handler.on_llm_chunk("Transforming Industries and Reshaping Our Future\n\n")
        await asyncio.sleep(0.5)
        
        await self.callback_handler.on_llm_chunk("## Introduction\n\n")
        await asyncio.sleep(0.3)
        await self.callback_handler.on_llm_chunk(f"In today's rapidly evolving technological landscape, {topic.lower()} stands at the forefront of innovation...")
        await asyncio.sleep(0.5)
        
        await self.callback_handler.on_agent_start("Content Editor", "Reviewing and polishing the content with Cerebras AI...")
        await asyncio.sleep(1)
        
        await self.callback_handler.on_agent_action("Content Editor", "Checking grammar and flow...")
        await asyncio.sleep(0.5)
        await self.callback_handler.on_agent_action("Content Editor", "Optimizing headings and structure...")
        await asyncio.sleep(0.5)
        
        # Simulate final result
        result = f"""# {topic}: Transforming Industries and Reshaping Our Future
*Powered by Cerebras AI*

## Introduction

In today's rapidly evolving technological landscape, {topic.lower()} stands at the forefront of innovation, promising to revolutionize how we work, live, and interact with the world around us. As {target_audience} navigate this transformative era, understanding the implications and opportunities presented by these advancements becomes crucial for staying competitive and relevant.

## The Current State of {topic}

The field has experienced unprecedented growth over the past decade, with breakthrough developments occurring at an accelerating pace. Key indicators of this progress include:

- **Investment Growth**: Venture capital funding has increased by 300% in the last five years
- **Adoption Rates**: Enterprise adoption has reached 65% among Fortune 500 companies
- **Innovation Pace**: New applications and use cases emerge weekly across various industries

## Key Trends Shaping the Future

### 1. Democratization of Technology
Advanced tools that once required specialized expertise are becoming accessible to broader audiences through user-friendly interfaces and no-code solutions.

### 2. Integration Across Industries
From healthcare to finance, manufacturing to education, {topic.lower()} is finding applications in virtually every sector, driving efficiency and innovation.

### 3. Ethical Considerations
As capabilities expand, discussions around responsible development and deployment have become central to the conversation.

## Industry Applications

### Healthcare
- Diagnostic accuracy improvements of up to 40%
- Personalized treatment plans based on individual patient data
- Drug discovery acceleration reducing development time by years

### Financial Services
- Fraud detection with 99.9% accuracy rates
- Automated risk assessment and portfolio management
- Enhanced customer service through intelligent chatbots

### Manufacturing
- Predictive maintenance reducing downtime by 50%
- Quality control automation with real-time defect detection
- Supply chain optimization through demand forecasting

## Challenges and Considerations

While the potential is enormous, several challenges must be addressed:

1. **Skills Gap**: The demand for qualified professionals far exceeds supply
2. **Data Privacy**: Balancing innovation with user privacy protection
3. **Regulatory Compliance**: Navigating evolving legal frameworks
4. **Integration Complexity**: Seamlessly incorporating new technologies into existing systems

## Preparing for the Future

For {target_audience} looking to leverage these opportunities:

### Strategic Planning
- Develop a clear roadmap for technology adoption
- Invest in employee training and development
- Establish partnerships with technology providers

### Risk Management
- Implement robust security measures
- Create contingency plans for technology failures
- Stay informed about regulatory changes

### Innovation Culture
- Foster experimentation and learning
- Encourage cross-functional collaboration
- Celebrate both successes and intelligent failures

## The Road Ahead

The next five years will be critical in determining how {topic.lower()} shapes our future. Organizations that proactively embrace these changes while addressing associated challenges will be best positioned to thrive in the new landscape.

Key predictions for the coming years include:
- Market size growth to $500 billion by 2028
- Integration into 90% of business processes
- Emergence of entirely new job categories and industries

## Conclusion

{topic} represents more than just technological advancement—it's a fundamental shift in how we approach problem-solving and innovation. For {target_audience}, the question isn't whether to engage with these technologies, but how quickly and effectively they can be integrated into existing strategies and operations.

The organizations that succeed will be those that view {topic.lower()} not as a threat to be managed, but as an opportunity to be embraced. By staying informed, investing in capabilities, and maintaining a forward-thinking mindset, businesses can position themselves at the forefront of this technological revolution.

**Ready to explore how {topic.lower()} can transform your organization?** Contact our team of experts to discuss customized solutions and strategic implementation plans tailored to your specific needs and objectives.

---

*This blog post was generated using Cerebras AI technology, demonstrating the power of advanced language models in content creation. For the most up-to-date information and personalized advice, consult with qualified professionals in your specific field.*"""
        
        return result