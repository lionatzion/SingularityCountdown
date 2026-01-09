import { storage } from "./storage";

interface DigestContent {
  latestPrediction: {
    predictedDate: string;
    confidenceScore: number;
    analysisHighlights: string[];
  } | null;
  topNews: Array<{
    title: string;
    summary: string;
    url: string;
    impact: string;
  }>;
  metricsSnapshot: {
    gpuPerformance: number;
    neuralCapacity: number;
    processingSpeed: number;
    aiBenchmarks: number;
  } | null;
  communityStats: {
    averageYear: number;
    averageMonth: number;
    totalPredictions: number;
  };
  topCommunityPrediction: {
    displayName: string;
    predictedYear: number;
    predictedMonth: number;
    upvotes: number;
  } | null;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export async function generateDigestContent(): Promise<DigestContent> {
  const [prediction, news, metrics, communityStats, communityPredictions] = await Promise.all([
    storage.getLatestPrediction(),
    storage.getLatestNews(5),
    storage.getLatestMetrics(),
    storage.getCommunityPredictionStats(),
    storage.getCommunityPredictions(1)
  ]);

  return {
    latestPrediction: prediction ? {
      predictedDate: new Date(prediction.predictedDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }),
      confidenceScore: prediction.confidenceScore,
      analysisHighlights: prediction.analysisFactors.slice(0, 3)
    } : null,
    topNews: news.map(article => ({
      title: article.title,
      summary: article.summary,
      url: article.url,
      impact: article.impact
    })),
    metricsSnapshot: metrics ? {
      gpuPerformance: metrics.gpuPerformance,
      neuralCapacity: metrics.neuralCapacity,
      processingSpeed: metrics.processingSpeed,
      aiBenchmarks: metrics.aiBenchmarks
    } : null,
    communityStats,
    topCommunityPrediction: communityPredictions[0] ? {
      displayName: communityPredictions[0].displayName,
      predictedYear: communityPredictions[0].predictedYear,
      predictedMonth: communityPredictions[0].predictedMonth,
      upvotes: communityPredictions[0].upvotes
    } : null
  };
}

export function generateDigestHtml(content: DigestContent, siteUrl: string): string {
  const formattedCommunityDate = content.communityStats.totalPredictions > 0 
    ? `${monthNames[content.communityStats.averageMonth - 1]} ${content.communityStats.averageYear}`
    : 'No predictions yet';

  const newsSection = content.topNews.length > 0 
    ? content.topNews.map(article => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #2a2a3e;">
          <a href="${article.url}" style="color: #00ff88; text-decoration: none; font-weight: 600;">${article.title}</a>
          <p style="color: #a0a0b0; margin: 8px 0 0 0; font-size: 14px;">${article.summary}</p>
          <span style="color: ${article.impact === 'high' ? '#ff6b9d' : article.impact === 'medium' ? '#ffd700' : '#00ff88'}; font-size: 12px; text-transform: uppercase;">${article.impact} impact</span>
        </td>
      </tr>
    `).join('')
    : '<tr><td style="padding: 12px 0; color: #a0a0b0;">No news this week</td></tr>';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Singularity Tracker Weekly Digest</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #12122a;">
    <!-- Header -->
    <tr>
      <td style="padding: 30px 20px; text-align: center; background: linear-gradient(135deg, #1a1a3e 0%, #2d1f5e 100%);">
        <div style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #ff6b9d); padding: 12px 16px; border-radius: 8px; margin-bottom: 16px;">
          <span style="color: white; font-size: 24px; font-weight: bold;">Ω</span>
        </div>
        <h1 style="color: white; margin: 0; font-size: 28px;">Singularity Tracker</h1>
        <p style="color: #a0a0b0; margin: 8px 0 0 0;">Weekly AI Progress Digest</p>
      </td>
    </tr>

    <!-- AI Prediction Section -->
    <tr>
      <td style="padding: 24px 20px;">
        <h2 style="color: #00ff88; margin: 0 0 16px 0; font-size: 20px;">🤖 Latest AI Prediction</h2>
        ${content.latestPrediction ? `
          <table role="presentation" width="100%" style="background: linear-gradient(135deg, #1a1a3e 0%, #2d2d4e 100%); border-radius: 12px; border: 1px solid #2a2a4e;">
            <tr>
              <td style="padding: 20px;">
                <div style="text-align: center;">
                  <p style="color: #8b5cf6; margin: 0; font-size: 14px; text-transform: uppercase;">Predicted Singularity Date</p>
                  <p style="color: white; margin: 8px 0; font-size: 28px; font-weight: bold;">${content.latestPrediction.predictedDate}</p>
                  <p style="color: #00ff88; margin: 0; font-size: 16px;">${content.latestPrediction.confidenceScore}% Confidence</p>
                </div>
                ${content.latestPrediction.analysisHighlights.length > 0 ? `
                  <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #2a2a4e;">
                    <p style="color: #a0a0b0; margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase;">Key Factors</p>
                    ${content.latestPrediction.analysisHighlights.map(h => `
                      <p style="color: #e0e0f0; margin: 4px 0; font-size: 14px;">• ${h}</p>
                    `).join('')}
                  </div>
                ` : ''}
              </td>
            </tr>
          </table>
        ` : `
          <p style="color: #a0a0b0;">No prediction available. Visit the tracker to generate one!</p>
        `}
      </td>
    </tr>

    <!-- Community Consensus -->
    <tr>
      <td style="padding: 0 20px 24px;">
        <h2 style="color: #ff6b9d; margin: 0 0 16px 0; font-size: 20px;">👥 Community Consensus</h2>
        <table role="presentation" width="100%" style="background: linear-gradient(135deg, #2d1f5e 0%, #1a1a3e 100%); border-radius: 12px; border: 1px solid #3d2d6e;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <p style="color: #a0a0b0; margin: 0; font-size: 14px;">${content.communityStats.totalPredictions} predictions from the community</p>
              <p style="color: white; margin: 12px 0; font-size: 24px; font-weight: bold;">${formattedCommunityDate}</p>
              ${content.topCommunityPrediction ? `
                <p style="color: #ff6b9d; margin: 0; font-size: 13px;">
                  Top prediction by ${content.topCommunityPrediction.displayName} (${content.topCommunityPrediction.upvotes} upvotes)
                </p>
              ` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Metrics Snapshot -->
    ${content.metricsSnapshot ? `
    <tr>
      <td style="padding: 0 20px 24px;">
        <h2 style="color: #8b5cf6; margin: 0 0 16px 0; font-size: 20px;">📊 This Week's Metrics</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="8">
          <tr>
            <td style="width: 50%; background: #1a1a3e; border-radius: 8px; padding: 16px; text-align: center;">
              <p style="color: #a0a0b0; margin: 0; font-size: 12px;">GPU Performance</p>
              <p style="color: #00ff88; margin: 8px 0 0 0; font-size: 20px; font-weight: bold;">${content.metricsSnapshot.gpuPerformance.toLocaleString()}</p>
            </td>
            <td style="width: 50%; background: #1a1a3e; border-radius: 8px; padding: 16px; text-align: center;">
              <p style="color: #a0a0b0; margin: 0; font-size: 12px;">Neural Capacity</p>
              <p style="color: #8b5cf6; margin: 8px 0 0 0; font-size: 20px; font-weight: bold;">${content.metricsSnapshot.neuralCapacity.toLocaleString()}</p>
            </td>
          </tr>
          <tr>
            <td style="width: 50%; background: #1a1a3e; border-radius: 8px; padding: 16px; text-align: center;">
              <p style="color: #a0a0b0; margin: 0; font-size: 12px;">Processing Speed</p>
              <p style="color: #ff6b9d; margin: 8px 0 0 0; font-size: 20px; font-weight: bold;">${content.metricsSnapshot.processingSpeed.toLocaleString()}</p>
            </td>
            <td style="width: 50%; background: #1a1a3e; border-radius: 8px; padding: 16px; text-align: center;">
              <p style="color: #a0a0b0; margin: 0; font-size: 12px;">AI Benchmarks</p>
              <p style="color: #ffd700; margin: 8px 0 0 0; font-size: 20px; font-weight: bold;">${content.metricsSnapshot.aiBenchmarks.toLocaleString()}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ` : ''}

    <!-- Top News -->
    <tr>
      <td style="padding: 0 20px 24px;">
        <h2 style="color: #ffd700; margin: 0 0 16px 0; font-size: 20px;">📰 Top AI News</h2>
        <table role="presentation" width="100%" style="background: #1a1a3e; border-radius: 12px; border: 1px solid #2a2a4e;">
          ${newsSection}
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding: 0 20px 30px; text-align: center;">
        <a href="${siteUrl}" style="display: inline-block; background: linear-gradient(135deg, #00ff88, #00cc6a); color: #0a0a1a; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          View Full Tracker →
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px; text-align: center; background: #0a0a1a; border-top: 1px solid #2a2a4e;">
        <p style="color: #606080; margin: 0; font-size: 12px;">
          You're receiving this because you subscribed to Singularity Tracker updates.
        </p>
        <p style="color: #606080; margin: 8px 0 0 0; font-size: 12px;">
          <a href="${siteUrl}/unsubscribe" style="color: #8b5cf6; text-decoration: none;">Unsubscribe</a> | 
          <a href="${siteUrl}" style="color: #8b5cf6; text-decoration: none;">Visit Tracker</a>
        </p>
        <p style="color: #404060; margin: 16px 0 0 0; font-size: 11px;">
          © ${new Date().getFullYear()} Singularity Tracker. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateDigestPlainText(content: DigestContent, siteUrl: string): string {
  const formattedCommunityDate = content.communityStats.totalPredictions > 0 
    ? `${monthNames[content.communityStats.averageMonth - 1]} ${content.communityStats.averageYear}`
    : 'No predictions yet';

  let text = `
SINGULARITY TRACKER - Weekly Digest
====================================

`;

  if (content.latestPrediction) {
    text += `🤖 LATEST AI PREDICTION
-----------------------
Predicted Date: ${content.latestPrediction.predictedDate}
Confidence: ${content.latestPrediction.confidenceScore}%

Key Factors:
${content.latestPrediction.analysisHighlights.map(h => `• ${h}`).join('\n')}

`;
  }

  text += `👥 COMMUNITY CONSENSUS
----------------------
${content.communityStats.totalPredictions} predictions
Average: ${formattedCommunityDate}
${content.topCommunityPrediction ? `Top prediction by ${content.topCommunityPrediction.displayName}` : ''}

`;

  if (content.metricsSnapshot) {
    text += `📊 METRICS SNAPSHOT
-------------------
GPU Performance: ${content.metricsSnapshot.gpuPerformance.toLocaleString()}
Neural Capacity: ${content.metricsSnapshot.neuralCapacity.toLocaleString()}
Processing Speed: ${content.metricsSnapshot.processingSpeed.toLocaleString()}
AI Benchmarks: ${content.metricsSnapshot.aiBenchmarks.toLocaleString()}

`;
  }

  if (content.topNews.length > 0) {
    text += `📰 TOP NEWS
-----------
${content.topNews.map(article => `
• ${article.title}
  ${article.summary}
  Impact: ${article.impact}
  ${article.url}
`).join('')}
`;
  }

  text += `
------------------------------------
Visit the tracker: ${siteUrl}

To unsubscribe, visit: ${siteUrl}/unsubscribe
`;

  return text.trim();
}

export async function sendDigestToSubscribers(siteUrl: string): Promise<{ 
  success: boolean; 
  emailsSent: number; 
  errors: string[];
}> {
  const errors: string[] = [];
  let emailsSent = 0;

  try {
    const subscribers = await storage.getNewsletterSubscriptions();
    
    if (subscribers.length === 0) {
      return { success: true, emailsSent: 0, errors: [] };
    }

    const content = await generateDigestContent();
    const htmlContent = generateDigestHtml(content, siteUrl);
    const textContent = generateDigestPlainText(content, siteUrl);

    for (const subscriber of subscribers) {
      try {
        console.log(`[Email Digest] Would send to: ${subscriber.email}`);
        console.log(`[Email Digest] Subject: Singularity Tracker Weekly Digest`);
        emailsSent++;
      } catch (error) {
        const errorMessage = `Failed to send to ${subscriber.email}: ${error}`;
        console.error(`[Email Digest] ${errorMessage}`);
        errors.push(errorMessage);
      }
    }

    return { success: errors.length === 0, emailsSent, errors };
  } catch (error) {
    return { 
      success: false, 
      emailsSent, 
      errors: [`Digest generation failed: ${error}`] 
    };
  }
}
