import { createSunoNudgeClient } from '../lib/suno-nudge';
import { claimPendingJob, markJobSucceeded, markJobFailed, saveAudioNudge, refundCredit } from '../lib/db-service';
import { eq } from 'drizzle-orm';

async function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function processJob(job: any) {
  const suno = createSunoNudgeClient();
  const jobId = job.id;
  let payload: any;
  try {
    payload = JSON.parse(job.payload);
  } catch (e) {
    await markJobFailed(jobId, 'Invalid job payload');
    return;
  }

  try {
    if (job.type === 'daily') {
      const { userId, mood, message, motivationText, dayNumber, checkInId } = payload;
      const result = await suno.generateDailyNudge({ userStory: message, mood, motivationText, dayNumber });
      const saved = await saveAudioNudge(userId, message, dayNumber || 1, result.audioUrl, motivationText || '', 1);
      // Update check-in with audio URL: do a raw update to daily_check_ins
      try {
        const { db } = await import('../server/db');
        const { dailyCheckIns } = await import('../src/db/schema');
        await db.update(dailyCheckIns).set({ motivationAudioUrl: result.audioUrl }).where(eq((dailyCheckIns as any).id, checkInId));
      } catch (e) {
        console.warn('Failed to attach audio url to check-in:', e);
      }

      await markJobSucceeded(jobId, result.audioUrl);
    } else {
      await markJobFailed(jobId, `Unsupported job type: ${job.type}`);
    }
  } catch (err: any) {
    console.error('Job processing failed:', err?.message || err);
    // Attempt a refund if credits were reserved for this job
    try {
      if (payload?.reservedCredit) {
        await refundCredit(payload.userId, 1);
      }
    } catch (e) {
      console.warn('Failed to refund credit on job failure:', e);
    }
    await markJobFailed(jobId, err?.message || 'Unknown error');
  }
}

async function runWorker() {
  console.log('Audio worker started');
  while (true) {
    try {
      const job = await claimPendingJob();
      if (!job) {
        await sleep(2000);
        continue;
      }
      console.log('Claimed job', job.id, job.type);
      await processJob(job);
    } catch (e) {
      console.error('Worker loop error:', e);
      await sleep(3000);
    }
  }
}

if (require.main === module) {
  runWorker().catch(err => {
    console.error('Worker crashed:', err);
    process.exit(1);
  });
}

export default runWorker;
