/**
 * Daily Cron — runs at 9am ET every day via Vercel Cron
 * Triggers the full automation pipeline
 */

import { NextRequest, NextResponse } from 'next/server'
import { runDailyPipeline } from '@/lib/agents/orchestrator'

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await runDailyPipeline()
  return NextResponse.json({ ok: true, result })
}
