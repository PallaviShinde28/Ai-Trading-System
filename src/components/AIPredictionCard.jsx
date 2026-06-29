import React from "react"

function AIPredictionCard({ data }) {

if (!data) return null

return (

<div className="ai-card">

<h2>{data.symbol}</h2>

<h3>Price: ${data.currentPrice}</h3>

<p><b>AI Signal:</b> {data.signalStrength}</p>

<p><b>Confidence:</b> {data.confidence}%</p>

<p><b>Trade Score:</b> {data.tradeScore}/10</p>

<p><b>Market Regime:</b> {data.marketRegime}</p>

<hr/>

<h4>Probability</h4>

<p>Bullish: {data.bullProbability}%</p>
<p>Bearish: {data.bearProbability}%</p>

<hr/>

<h4>Risk Management</h4>

<p>Stop Loss: {data.stopLoss}</p>
<p>Take Profit: {data.takeProfit}</p>
<p>Risk Reward: {data.riskReward}</p>

<hr/>

<h4>Volatility</h4>

<p>{data.volatilityLevel}</p>

<hr/>

<h4>AI Analysis</h4>

<ul>
{data.analysis?.map((item,i)=>(
<li key={i}>{item}</li>
))}
</ul>

</div>

)

}

export default AIPredictionCard