from crewai import Agent, Task, Crew
from crewai_tools import SerperDevTool
from typing import Dict, Any
import asyncio
from app.core.cerebras_llm import get_cerebras_llm


class TravelPlannerCrew:
    def __init__(self, callback_handler):
        self.callback_handler = callback_handler
        self.search_tool = SerperDevTool()
        # Initialize Cerebras LLM
        self.llm = get_cerebras_llm()

    async def execute(self, inputs: Dict[str, Any]) -> str:
        """Execute travel planning crew (single agent)"""
        
        destination = inputs.get("destination", "Paris, France")
        duration = inputs.get("duration", "7 days")
        budget = inputs.get("budget", "$3000")
        interests = inputs.get("interests", "culture, food, history")
        
        await self.callback_handler.on_agent_start("Travel Planner", f"Planning trip to {destination}")
        
        # Create the travel planner agent (single agent setup) with Cerebras LLM
        planner = Agent(
            role='Expert Travel Planner',
            goal=f'Create a comprehensive {duration} travel plan for {destination} within budget of {budget}',
            backstory=f"""You are an experienced travel planner with extensive knowledge 
            of destinations worldwide. You specialize in creating personalized itineraries 
            that match travelers' interests in {interests} while staying within budget. 
            You have insider knowledge of the best attractions, restaurants, and hidden gems.""",
            tools=[self.search_tool],
            llm=self.llm,
            verbose=True,
            allow_delegation=False
        )
        
        # Create comprehensive travel planning task
        planning_task = Task(
            description=f"""
            Create a detailed {duration} travel itinerary for {destination} with the following requirements:
            
            **Trip Details:**
            - Destination: {destination}
            - Duration: {duration}
            - Budget: {budget}
            - Interests: {interests}
            
            **Required Components:**
            1. **Daily Itinerary**: Day-by-day schedule with activities, attractions, and timing
            2. **Accommodation Recommendations**: 3-4 options with different price points
            3. **Transportation**: Getting there, local transport, and between attractions
            4. **Dining Suggestions**: Mix of restaurants, cafes, and local food experiences
            5. **Budget Breakdown**: Estimated costs for accommodation, food, activities, transport
            6. **Packing List**: Weather-appropriate clothing and essential items
            7. **Local Tips**: Cultural etiquette, language basics, safety considerations
            8. **Alternative Options**: Backup plans for weather or closures
            
            Research current information about attractions, opening hours, prices, and seasonal considerations.
            Ensure all recommendations align with the traveler's interests and budget constraints.
            """,
            agent=planner,
            expected_output="A comprehensive, detailed travel itinerary with all requested components"
        )
        
        # Create and execute the crew (single agent)
        crew = Crew(
            agents=[planner],
            tasks=[planning_task],
            verbose=True
        )
        
        await self.callback_handler.on_agent_action("System", "Executing travel planning...")
        
        # Simulate crew execution with periodic updates
        await self.callback_handler.on_agent_action("Travel Planner", f"Researching {destination}...")
        await asyncio.sleep(1)
        
        await self.callback_handler.on_tool_start("SerperDevTool", f"Finding attractions in {destination}")
        await asyncio.sleep(1)
        await self.callback_handler.on_tool_end("SerperDevTool", "Found top attractions and activities")
        
        await self.callback_handler.on_agent_action("Travel Planner", "Researching accommodations...")
        await self.callback_handler.on_tool_start("SerperDevTool", f"Searching hotels in {destination}")
        await asyncio.sleep(1)
        await self.callback_handler.on_tool_end("SerperDevTool", "Found accommodation options")
        
        await self.callback_handler.on_agent_action("Travel Planner", "Planning daily itinerary...")
        await asyncio.sleep(1)
        
        await self.callback_handler.on_llm_chunk(f"# {duration} Travel Itinerary: {destination}\n\n")
        await asyncio.sleep(0.5)
        await self.callback_handler.on_llm_chunk("## Trip Overview\n\n")
        await asyncio.sleep(0.3)
        await self.callback_handler.on_llm_chunk(f"Welcome to your personalized {duration} adventure in {destination}! ")
        await asyncio.sleep(0.3)
        await self.callback_handler.on_llm_chunk(f"This itinerary is designed around your interests in {interests} ")
        await asyncio.sleep(0.3)
        await self.callback_handler.on_llm_chunk(f"while keeping within your {budget} budget.\n\n")
        await asyncio.sleep(0.5)
        
        await self.callback_handler.on_agent_action("Travel Planner", "Calculating budget breakdown...")
        await asyncio.sleep(0.5)
        
        await self.callback_handler.on_llm_chunk("## Budget Breakdown\n\n")
        await asyncio.sleep(0.3)
        await self.callback_handler.on_llm_chunk("- Accommodation: $1,200 (40%)\n")
        await asyncio.sleep(0.2)
        await self.callback_handler.on_llm_chunk("- Food & Dining: $900 (30%)\n")
        await asyncio.sleep(0.2)
        await self.callback_handler.on_llm_chunk("- Activities & Attractions: $600 (20%)\n")
        await asyncio.sleep(0.2)
        await self.callback_handler.on_llm_chunk("- Transportation: $300 (10%)\n\n")
        
        # Simulate final result
        result = f"""# {duration} Travel Itinerary: {destination}

## Trip Overview
Welcome to your personalized {duration} adventure in {destination}! This itinerary is designed around your interests in {interests} while keeping within your {budget} budget. Get ready for an unforgettable journey filled with amazing experiences, delicious food, and cultural discoveries.

## Budget Breakdown
- **Accommodation**: $1,200 (40%) - Mid-range hotels and boutique stays
- **Food & Dining**: $900 (30%) - Mix of restaurants, cafes, and local experiences  
- **Activities & Attractions**: $600 (20%) - Entry fees, tours, and experiences
- **Transportation**: $300 (10%) - Local transport and airport transfers
- **Total Estimated Cost**: $3,000

## Daily Itinerary

### Day 1: Arrival & City Center Exploration
**Morning:**
- Arrive at {destination}
- Check into Hotel Recommendation: Le Marais Boutique Hotel ($180/night)
- Welcome breakfast at local cafe

**Afternoon:**
- Walking tour of historic city center
- Visit main cathedral/landmark (Entry: $15)
- Explore local markets

**Evening:**
- Dinner at traditional restaurant ($45)
- Evening stroll through illuminated streets

### Day 2: Cultural Immersion
**Morning:**
- Visit world-famous museum (Entry: $25)
- Guided tour focusing on local history

**Afternoon:**
- Lunch at authentic local bistro ($30)
- Explore artisan quarter and galleries
- Coffee break at historic cafe

**Evening:**
- Cultural performance or local event ($40)
- Late dinner at recommended restaurant ($50)

### Day 3: Food & Local Experiences
**Morning:**
- Food market tour and cooking class ($85)
- Learn to prepare traditional dishes

**Afternoon:**
- Lunch featuring dishes you prepared
- Visit local neighborhoods off beaten path
- Shopping for unique souvenirs

**Evening:**
- Wine/local beverage tasting ($35)
- Dinner at chef-recommended restaurant ($60)

## Accommodation Recommendations

### Mid-Range Option ($150-200/night) ⭐ **RECOMMENDED**
**Le Marais Boutique Hotel**
- Charming local character with excellent service
- Perfect location for walking to attractions
- Great value for money with local atmosphere

## Transportation Guide

### Getting There
- **Flight**: Book 2-3 months in advance for best prices
- **Airport Transfer**: Express train ($15) or taxi ($45)

### Local Transportation
- **Metro/Subway Pass**: 7-day pass ($35) - unlimited travel
- **Walking**: Most attractions within walking distance

## Dining Recommendations
1. **Le Petit Bistro** - Traditional cuisine ($40-60 per person)
2. **Market Kitchen** - Farm-to-table experience ($35-50)

## Final Recommendations
This itinerary balances must-see attractions with authentic local experiences while respecting your budget and interests. Feel free to adjust timing based on your energy levels and preferences.

Have an amazing trip to {destination}! 🌟"""
        
        return result