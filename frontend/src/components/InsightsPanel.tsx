import type { KnowledgeBaseInsight } from '../types'

interface InsightsPanelProps {
  insights: KnowledgeBaseInsight[]
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  if (insights.length === 0) {
    return (
      <div className="insights-panel">
        <h3>Knowledge Base Insights</h3>
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Select a service offering to see relevant insights and benchmarks
        </div>
      </div>
    )
  }

  return (
    <div className="insights-panel">
      <h3>Knowledge Base Insights</h3>
      {insights.map((insight, index) => (
        <div key={index} className="insight-item">
          <div className="insight-title">{insight.title}</div>
          <div className="insight-content">{insight.content}</div>
          {insight.details && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
              {Object.entries(insight.details).map(([key, value]) => {
                if (Array.isArray(value)) {
                  return (
                    <div key={key} style={{ marginTop: '0.25rem' }}>
                      <strong>{key}:</strong>
                      <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                        {value.slice(0, 3).map((item, i) => (
                          <li key={i}>{String(item)}</li>
                        ))}
                      </ul>
                    </div>
                  )
                }
                return (
                  <div key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
